const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

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

  // Databse stuff
  ipcMain.on("mainWindowLoaded", () => {
    knex('transactions').sum('amount as totalDeposited').where('type', 'deposit').then((result) => {
      var totalDeposited = result[0]['totalDeposited']
      knex('transactions').sum('amount as totalWithdrawn').where('type', 'withdraw').then((result)=>{
        var totalWithdrawn = result[0]['totalWithdrawn']
        let total = {
          value: "",
          invested: formatter.format(totalDeposited - totalWithdrawn),
          $profit: "",
          percent_profit: ""
        }
        mainWindow.webContents.send("totalGenerated", total);
      })
    })
    
    let portfolio = [
      {
        image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579",
        coin: "Bitcoin",
        amount: "0.77",
        value: "$20,000",
        invested: "$10,000",
        $profit: "$10,000",
        percent_profit: "100%"
      },
      {
        image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880",
        coin: "Ethereum",
        amount: "37",
        value: "$30,000",
        invested: "$5,000",
        $profit: "$25,000",
        percent_profit: "500%"
      },
      {
        image: "https://assets.coingecko.com/coins/images/2/large/litecoin.png?1547033580",
        coin: "Litecoin",
        amount: "8.3",
        value: "$1,000",
        invested: "$250",
        $profit: "$750",
        percent_profit: "300%"
      },
    ];
    mainWindow.webContents.send("portfolioGenerated", portfolio)
  });
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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.