const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();

// Enable live reload for front end and back end
require('electron-reload')(__dirname, { electron: require(path.join(__dirname, '..', 'node_modules', 'electron')) });

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// Databse
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

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Hides the menu bar
  // mainWindow.setMenuBarVisibility(false)

  // Database stuff
  ipcMain.on("mainWindowLoaded", () => {  
    
    knex.schema.raw("select id, sum(amount) as amount from (select id, sum(amount) as amount from transactions WHERE type = 'buy' GROUP BY id UNION select id, -sum(amount) as amount from transactions WHERE type = 'sell' GROUP BY id) GROUP  BY id").then(async (result) => {
      var coins = {};
      for (let i = 0; i < result.length; i++) {
        id = result[i]['id']
        amount = result[i]['amount']
        if (id !== 'aud') {
          // ids.push(id)
          coins[id] = amount
        }
      }

      let marketData = await CoinGeckoClient.coins.markets({vs_currency: 'aud', ids: Object.keys(coins)})
      marketData  = marketData.data
      portfolio = []
      var totalValue = 0;
      for (let i = 0; i < marketData.length; i++) {
        let value = marketData[i].current_price * coins[marketData[i].id]
        portfolio.push({
          image: marketData[i].image,
          coin: marketData[i].name,
          amount: coins[marketData[i].id],
          value: formatter.format(value),
          invested: "",
          $profit: "",
          percent_profit: ""
        });
        totalValue += value;
      }
      mainWindow.webContents.send("portfolioGenerated", portfolio)
      
      // Whole Portfolio
      knex.schema.raw("SELECT (SELECT ifnull(sum(amount), 0) FROM transactions WHERE type = 'deposit') - (SELECT ifnull(sum(amount),0)FROM transactions WHERE type='withdraw') as 'invested'").then((result)=>{
        const invested = result[0]['invested']
        let $profit = totalValue - invested
        let total = {
          value: formatter.format(totalValue),
          invested: formatter.format(invested),
          $profit: formatter.format($profit),
          percent_profit: `${($profit / invested * 100).toFixed(2)}%`
        }
        mainWindow.webContents.send("totalGenerated", total);
      })
    })
    // Whole Portfolio
    // .then()

  });
  // When a user clicks Add Transaction, this is called
  ipcMain.on("TransactionAdded", (evt, transaction) => {
    console.log(transaction);
    knex('transactions').insert(transaction).then( () => {
      mainWindow.webContents.send("TransactionAddedSuccess");
    });
    
  });
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