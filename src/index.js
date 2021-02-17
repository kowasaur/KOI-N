const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const toDecimals  = require('round-to-decimal');

const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();

const CurrencyConverter = require('@y2nk4/currency-converter')
// I should probably make the user have to insert their own here
const fiatConverter = new CurrencyConverter('ede92e754aeaa3272a7d') 
const OUNCETOGRAMS = 31.1034768

/** Intended for use with CurrencyConverter */
function ounceConvert(ounceValue, id) {
  if (['XAU', 'XAG'].includes(id.toUpperCase())) {
    return ounceValue / OUNCETOGRAMS
  } else {
    return ounceValue
  }
}

// Enable live reload for front end and back end
require('electron-reload')(__dirname, { electron: require(path.join(__dirname, '..', 'node_modules', 'electron')) });

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const dataFolder = app.getPath('userData')

// Database
var knex = require("knex")({
  client: "sqlite3",
  connection: {filename: path.join(dataFolder, 'database.sqlite')},
  useNullAsDefault: true
});

// Create database if it doesn't exist
knex.schema.hasTable('transactions').then(async exists => {
  if (!exists) {
    const sql = fs.readFileSync(path.join(__dirname, 'database.sql')).toString().split(';')
    sql.forEach(async sql => await knex.schema.raw(sql));
  }
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
  if (id === 'aud') {
    return amount
  }
  if (['usd', 'xag', 'xau'].includes(id)) {
    const value = ounceConvert(await fiatConverter.convert(id.toUpperCase(), 'AUD', amount, false, date.substring(0, 10)), id)
    return value
  }
  if (id === 'xdai') {
    id = 'dai'
  }
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

/** Subtract arrays of objects */
function subtractObjectArrays(largerArray, smallerArray) {
  const hashObject = (object) => JSON.stringify(object);
  const hashSet = new Set(smallerArray.map(hashObject))
  return largerArray.filter(object => !hashSet.has(hashObject(object)))
}

async function asyncify(func, callback) {
  return new Promise((resolve) => {
    func(data => resolve(callback(data)))
  })
}

// Reset list of coins
knex('coins').del().then(async () => {
  let coinsList = await CoinGeckoClient.coins.list();
  coinsList = coinsList.data
  coinsList = coinsList.concat(await knex('customCurrencies').select('id','symbol','name'))
  knex.batchInsert('coins', coinsList, 300).then();
})

const coinspotIds = require('./modules/coinspotCoingeckoIds.json')
const Coinspot = require('coinspot-api');

// Auto Add Exchange Transactions
function loadExchangeData() {
  knex('keys').pluck('exchange').then(result => {
    if (result.includes('coinspot')) {
      
      knex('keys').first('key', 'secret', 'oldTxs').where('exchange', 'coinspot').then(async result => {
        const coinspotKey = result.key;
        const coinspotSecret = result.secret;
        const coinspotClient = new Coinspot(coinspotKey, coinspotSecret)
  
        let txs = await asyncify(coinspotClient.referral, data => {
          return data.payments.map(tx => tx = {
            type: 'receive',
            id: coinspotIds[tx.coin],
            amount: tx.amount,
            date: tx.timestamp,
            otherParty: 'coinspot',
            fiatValue: tx.audamount,
            note: 'referral payment'
          })
        });
        txs = txs.concat(await asyncify(coinspotClient.depositHistory, data => {
          return data.deposits.map(tx => tx = {
            type: 'deposit',
            date: tx.created,
            otherParty: 'coinspot',
            id: 'aud',
            amount: tx.amount
          })
        }));
        txs = txs.concat(await asyncify(coinspotClient.withdrawalHistory, data => {
          return data.withdrawals.map(tx => tx = {
            type: 'withdraw',
            date: tx.created,
            otherParty: 'coinspot',
            id: 'aud',
            amount: tx.amount
          })
        }));
        txs = txs.concat(await asyncify(coinspotClient.transactions, data => {
          let txs = data.buyorders.map(tx => tx = {
            type: 'buy',
            id: coinspotIds[tx.market.split('/')[0]],
            amount: tx.amount,
            counterCurrencyId: 'aud',
            counterCurrencyAmount: tx.audtotal,
            otherParty: 'coinspot',
            date: tx.created, // since you can order, this means the date is wrong for some
            fiatValue: tx.audtotal
          })
          return txs.concat(data.sellorders.map(tx => tx = {
            type: 'sell',
            id: coinspotIds[tx.market.split('/')[0]],
            amount: tx.amount,
            counterCurrencyId: coinspotIds[tx.market.split('/')[1]],
            counterCurrencyAmount: tx.total,
            otherParty: 'coinspot',
            date: tx.created, // same as buy
            fiatValue: tx.audtotal
          }));
        }));
        const coinspotTransactions = txs.flat(); 
        const oldTxs = JSON.parse(result.oldTxs)
        const newTxs = subtractObjectArrays(coinspotTransactions, oldTxs)
        if (newTxs.length > 0) {
          knex('transactions').insert(newTxs).then(() => 
            knex('keys').update('oldTxs', JSON.stringify(coinspotTransactions))).then()
        }
      })
    }
  })
}
loadExchangeData()

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 750,
    height: 800,
    icon: __dirname + '/images/icon.ico',
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
  mainWindow.setMenuBarVisibility(false)

  // Database stuff
  ipcMain.on("mainWindowLoaded", () => {  
    
    knex.select().from('transactions').orderBy('date')
    .then(async result => {
      txPortfolio = {};
      result.forEach(tx => {
        // for fees
        if (tx.id !== '') {
          let coin = txPortfolio[tx.id] || { amount: 0, invested: 0 }
          let counterCoin = txPortfolio[tx.counterCurrencyId] || { amount: 0, invested: 0 }
          // Amount
          switch (tx.type) {
            case 'withdraw-liquidity':
              tx.amount *= -1
            case 'sell':
              var newAmount = coin.amount - tx.amount;
              var newCounterAmount = counterCoin.amount + tx.counterCurrencyAmount
              break;
            case 'buy':
              var newCounterAmount = counterCoin.amount - tx.counterCurrencyAmount;
            case 'deposit':
            case 'receive':
            case 'close-position':
              var newAmount = coin.amount + tx.amount;
              break;
            case 'provide-liquidity':
              var newCounterAmount = counterCoin.amount - tx.counterCurrencyAmount;
            case 'withdraw':
              var newAmount = coin.amount - tx.amount
              break;
            case 'migrate':
              var newAmount = coin.amount + tx.amount
              var newCounterAmount = 0
              break;
            default:
              var newAmount = coin.amount;
          }
          // Invested
          switch (tx.type) {
            case 'buy':
              var newCounterInvested = counterCoin.invested - tx.counterCurrencyAmount * counterCoin.invested / counterCoin.amount 
              var newInvested = coin.invested + tx.fiatValue
              break;
            case 'deposit':
              var newInvested = coin.invested + tx.amount
              break;
            case 'withdraw':
            case 'sell':
              var newInvested = coin.invested - tx.amount * coin.invested / coin.amount
              var newCounterInvested = counterCoin.invested + tx.fiatValue
              break;
            case 'provide-liquidity':
              var newInvested = coin.invested - tx.amount * coin.invested / coin.amount
              var newCounterInvested = counterCoin.invested - tx.counterCurrencyAmount * counterCoin.invested / counterCoin.amount 
              break;
            case 'withdraw-liquidity':
              var newInvested = coin.invested + tx.fiatValue
              var newCounterInvested = counterCoin.invested + tx.fiatValue
              break;
            case 'migrate':
              var newInvested = counterCoin.invested
              var newCounterInvested = 0
              break;
            default:
              var newInvested = coin.invested;
          }
          txPortfolio[tx.id] = {
            amount: newAmount,
            invested: newInvested
          }
          if (!!tx.counterCurrencyId) {
            txPortfolio[tx.counterCurrencyId] = {
              amount: newCounterAmount,
              invested: newCounterInvested
            }
          }
          
          if (tx.type.includes('liquidity')) {
            let lpCoin = txPortfolio[tx.lpTokenId] || { amount: 0, invested: 0 }
            if (tx.type === 'provide-liquidity') {
              var newLpAmount = lpCoin.amount + tx.lpTokenAmount
              var newLpInvested = lpCoin.invested + (tx.fiatValue * 2)
            } else {
              var newLpAmount = lpCoin.amount - tx.lpTokenAmount
              var newLpInvested = lpCoin.invested - tx.lpTokenAmount * lpCoin.invested / lpCoin.amount
            }
            txPortfolio[tx.lpTokenId] = {
              amount: newLpAmount,
              invested: newLpInvested
            }
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
            case 'receive':
              txPortfolio[tx.id] = {
                amount: txPortfolio[tx.id].amount,
                invested: txPortfolio[tx.id].invested + tx.feeatValue
              }
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
        const rank = marketData[i].market_cap_rank
        portfolio.push({
          image: marketData[i].image,
          coin: marketData[i].name,
          amount: toDecimals(amount, 6).toString(),
          value: formatter.format(value),
          invested: formatter.format(invested),
          $profit: formatter.format($profit),
          percent_profit: `${(($profit / invested || 0) * 100).toFixed(2)}%`,
          coin_number: (rank == null) ? 69420 : rank,
          amount_number: amount,
          value_number: value,
          invested_number: invested,
          $profit_number: $profit,
          percent_profit_number: ($profit / invested || 0) * 100
        });
        totalValue += value;
      }

      const customCurrencies = await knex('customCurrencies')
      for (const currency of customCurrencies) {
        try {
          const amount = txPortfolio[currency.id].amount
          if (currency.value == 'currency-converter') {
            value = ounceConvert(await fiatConverter.convert(currency.id.toUpperCase(), 'AUD', amount), currency.id)
          } else if (currency.value * 0 == 0) {
            value = currency.value * amount
          } else {
            const data = await CoinGeckoClient.coins.fetch(currency.value, {
              tickers: false,
              community_data: false,
              developer_data: false,
              localization: false
            })
            value = data.data.market_data.current_price.aud
          }
          
          const invested = txPortfolio[currency.id].invested
          const $profit = value - invested
          portfolio.push({
            image: currency.image,
            coin: currency.name,
            amount: toDecimals(amount, 6).toString(),
            value: formatter.format(value),
            invested: formatter.format(invested),
            $profit: formatter.format($profit),
            percent_profit: `${(($profit / invested || 0) * 100).toFixed(2)}%`,
            coin_number: 69420,
            amount_number: amount,
            value_number: value,
            invested_number: invested,
            $profit_number: $profit,
            percent_profit_number: ($profit / invested || 0) * 100
          });
          totalValue += value;
        } catch {}
      }
      mainWindow.webContents.send("portfolioGenerated", portfolio)
      
      // Whole Portfolio
      knex.schema.raw("SELECT (SELECT ifnull(sum(amount), 0) FROM transactions WHERE type = 'deposit') - (SELECT ifnull(sum(amount),0)FROM transactions WHERE type='withdraw') as 'invested'").then((result)=>{
        const invested = result[0]['invested']
        const $profit = totalValue - invested
        let total = {
          value: formatter.format(totalValue),
          invested: formatter.format(invested),
          $profit: formatter.format($profit),
          percent_profit: `${($profit / invested * 100).toFixed(2)}%`,
          positive: totalValue > invested
        }
        mainWindow.webContents.send("totalGenerated", total);
      })
    }).catch(async () => {
      await mainWindow.loadFile(path.join(__dirname, 'addTransaction.html'));
      dialog.showErrorBox('Error: No Transactions', 'Add a transaction or connect an exchange.');
    })

  });
  // When a user clicks Add Transaction, this is called
  ipcMain.on("TransactionAdded", async (evt, transaction) => {
    if (transaction.fiatValue === 0 && ['buy', 'sell', 'receive', 'close-position', 'provide-liquidity', 'withdraw-liquidity'].includes(transaction.type)) {
      switch (transaction.type) {
        case 'receive':
        case 'close-position':
          var id = transaction.id
          var amount = transaction.amount
          break;
        default:
          var id = transaction.counterCurrencyId
          var amount = transaction.counterCurrencyAmount
      }
      transaction['fiatValue'] = await getFiatValue(transaction.date, id, amount)
    }
    if (transaction.type.includes('liquidity')) {
      transaction['lpTokenId'] = `${transaction.id}/${transaction.counterCurrencyId}`
      const symbol1 = await knex('coins').where('id', transaction.id).first().pluck('symbol')
      const symbol2 = await knex('coins').where('id', transaction.counterCurrencyId).first().pluck('symbol')
      const symbols = `${symbol1}/${symbol2}`
      const lpToken = {
        id: transaction.lpTokenId,
        symbol: symbols,
        name: `${symbols.toUpperCase()} LP`,
        image: 'images/lp.png',
        value: transaction.fiatValue * 2 / transaction.lpTokenAmount
      }
      await knex('customCurrencies').insert(lpToken).onConflict('id').merge()
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

  // When Settings is loaded
  ipcMain.on("settingsLoaded", () => {
    knex('keys').join('exchangeInfo', 'keys.exchange', 'exchangeInfo.exchange')
    .select('keys.exchange', 'key', 'name', 'imageUrl')
    .then(result => mainWindow.webContents.send("connections", result));

    knex('customCurrencies').then(result => mainWindow.webContents.send("customCurrencies", result))
  })

  ipcMain.on("addTransactionLoaded", () => knex('coins').select()
    .then(result => mainWindow.webContents.send("allCoins", result)))

  // When Add Exchange is clicked
  ipcMain.on("addExchange", (evt, exchange) => {
    knex('keys').insert(exchange).then( () => {
      loadExchangeData()
      mainWindow.webContents.send("Alert", "Exchange Connection Added Successfully");
    }).catch(() => {
      dialog.showErrorBox('Error: Duplicate Exchange', 'As of now, only one of each exchange is allowed');
    });
  })

  // When Exchange is removed
  ipcMain.on("removeExchange", (evt, exchange) => {
    knex('keys').where('exchange', exchange).del()
    .then(() => mainWindow.webContents.send("Alert", "Exchange Connection Removed Successfully"))
  })

  // When Add Coin is clicked
  ipcMain.on("addCoin", (evt, coin) => {
    knex('customCurrencies').insert(coin).then( () => {
      mainWindow.webContents.send("Alert", "Custom Coin Added Successfully");
    }).catch(() => {
      dialog.showErrorBox('Error: Duplicate Coin', '');
    });
  })

  // Open Database Folder
  ipcMain.on("openFolder", () => shell.openPath(dataFolder))
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