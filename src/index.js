const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const toDecimals  = require('round-to-decimal');

const CoinGecko = require('coingecko-api');
const { count } = require('console');
const CoinGeckoClient = new CoinGecko();

// Enable live reload for front end and back end
require('electron-reload')(__dirname, { electron: require(path.join(__dirname, '..', 'node_modules', 'electron')) });

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// Database
var knex = require("knex")({
  client: "sqlite3",
  connection: { filename: path.join(__dirname, ".." ,"database.sqlite") },
  useNullAsDefault: true
});

// Create number formatter
const formatter = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD'
});

// Converts yyyy-mm-dd to dd-mm-yyyy
function formatDate(inputDate) {
  var date = new Date(inputDate);
  // Months use 0 index.
  return date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
}

// Checks whether date is today
const isToday = (date) => {
  const someDate = new Date(date)
  const today = new Date()
  return someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
}

// Gets historical or current price
async function getFiatValue(date, id, amount) {
  const data = (!isToday(date)) ? await CoinGeckoClient.coins.fetchHistory(id, {
    date: formatDate(date),
    localization: false
  }) : await CoinGeckoClient.coins.fetch(id, {
    tickers: false,
    community_data: false,
    developer_data: false,
    localization: false
  });
  const price = (data.data.market_data || {current_price: {aud: 0}}).current_price.aud
  return price * amount
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 600,
    height: 700,
    
    webPreferences: {
      nodeIntegration: true,
      // tbh I have no clue what to do here
      // I just put it here so the warning would go away
      contextIsolation: false
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Hides the menu bar
  // mainWindow.setMenuBarVisibility(false)

  // Database stuff
  ipcMain.on("mainWindowLoaded", () => {  
    
    knex.select().from('transactions').orderBy('date')
    .then(async result => {
      txPortfolio = {};
      result.forEach(tx => {
        // for fees
        if (tx.id !== '') {
          let coin = txPortfolio[tx.id] || { amount: 0, invested: 0 }
          // Amount
          switch (tx.type) {
            case 'sell':
              tx.amount *= -1
              tx.counterCurrencyAmount *= -1
              tx.fiatValue *= -1
            case 'buy':
              var newAmount = coin.amount + tx.amount;

              let counterCoin = txPortfolio[tx.counterCurrencyId] || { amount: 0, invested: 0 }
              txPortfolio[tx.counterCurrencyId] = {
                amount: counterCoin.amount - tx.counterCurrencyAmount,
                invested: counterCoin.invested - tx.fiatValue *counterCoin.invested / counterCoin.amount // change this back if something's not working
              }
              break;
            case 'deposit':
            case 'receive':
              var newAmount = coin.amount + tx.amount;
              break;
            case 'withdraw':
              var newAmount = coin.amount - tx.amount
              break;
            default:
              var newAmount = coin.amount;
          }
          // Invested
          switch (tx.type) {
            case 'deposit':
            case 'buy':
              var newInvested = coin.invested + tx.fiatValue
              break;
            case 'sell':
              var newInvested = coin.invested - -tx.amount * coin.invested / coin.amount
              break;
            default:
              var newInvested = coin.invested;
          }
          txPortfolio[tx.id] = {
            amount: newAmount,
            invested: newInvested
          }
        }

        // Only executes if fee exists
        if (!!tx.feeCurrencyId) {
          let feeCoin = txPortfolio[tx.feeCurrencyId]
          switch (tx.type) {
            case 'buy':
              txPortfolio[tx.id] = {
                amount: txPortfolio[tx.id].amount,
                invested: txPortfolio[tx.id].invested + tx.feeatValue
              }
            case 'sell':
              newInvested = feeCoin.invested - tx.feeatValue
              break;
            default:
              newInvested = feeCoin.invested
          }

          // Might wanna make this idiot proof (allow fees even if funds dont exist)
          txPortfolio[tx.feeCurrencyId] = {
            amount: feeCoin.amount - tx.feeAmount,
            invested: newInvested
          }
        }

      })

      let marketData = await CoinGeckoClient.coins.markets({vs_currency: 'aud', ids: Object.keys(txPortfolio)})
      marketData  = marketData.data
      portfolio = []
      var totalValue = 0;
      for (let i = 0; i < marketData.length; i++) {
        const amount = txPortfolio[marketData[i].id].amount
        const value = marketData[i].current_price * amount
        const invested = txPortfolio[marketData[i].id].invested
        const $profit = value - invested
        portfolio.push({
          image: marketData[i].image,
          coin: marketData[i].name,
          amount: toDecimals(amount, 6).toString(),
          value: formatter.format(value),
          invested: formatter.format(invested),
          $profit: formatter.format($profit),
          percent_profit: `${($profit / invested * 100).toFixed(2)}%`
        });
        totalValue += value;
      }
      // AUD
      portfolio.push({
        image: "images/aus-flag.png",
        coin: "AU Dollars",
        amount: txPortfolio['aud'].amount,
        value: formatter.format(txPortfolio['aud'].amount),
        invested: 'n/a',
        $profit: 'n/a',
        percent_profit: 'n/a'
      })
      totalValue += txPortfolio['aud'].amount
      mainWindow.webContents.send("portfolioGenerated", portfolio)
      
      // Whole Portfolio
      knex.schema.raw("SELECT (SELECT ifnull(sum(amount), 0) FROM transactions WHERE type = 'deposit') - (SELECT ifnull(sum(amount),0)FROM transactions WHERE type='withdraw') as 'invested'").then((result)=>{
        const invested = result[0]['invested']
        const $profit = totalValue - invested
        let total = {
          value: formatter.format(totalValue),
          invested: formatter.format(invested),
          $profit: formatter.format($profit),
          percent_profit: `${($profit / invested * 100).toFixed(2)}%`
        }
        mainWindow.webContents.send("totalGenerated", total);
      })
    })

  });
  // When a user clicks Add Transaction, this is called
  ipcMain.on("TransactionAdded", async (evt, transaction) => {
    console.log(transaction);
    if (transaction.fiatValue === 0 && ['buy', 'sell', 'receive'].includes(transaction.type)) {
      switch (transaction.type) {
        case 'receive':
          var id = transaction.id
          var amount = transaction.amount
          break;
        default:
          var id = transaction.counterCurrencyId
          var amount = transaction.counterCurrencyAmount
      }
      transaction['fiatValue'] = await getFiatValue(transaction.date, id, amount)
    }
    if (transaction.feeatValue === 0 && transaction.feeAmount > 0) {
      transaction['feeatValue'] = await getFiatValue(transaction.date, transaction.feeCurrencyId, transaction.feeAmount)
    }
    knex('transactions').insert(transaction).then( () => {
      mainWindow.webContents.send("TransactionAddedSuccess");
    });
    
  });

  // When viewTransactions.html loaded
  ipcMain.on("viewTransactionsLoaded", () => {
    knex.select().table('transactions').orderBy('date').then((result) => {
      mainWindow.webContents.send("transactionsQueried", result);
    })
  })
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});