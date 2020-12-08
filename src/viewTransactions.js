const electron = require("electron");
const appendElement = require("./modules/loadTable.js");
const ipc = electron.ipcRenderer;

document.addEventListener("DOMContentLoaded",  () => ipc.send("viewTransactionsLoaded"));

ipc.on("transactionsQueried", (evt, transactions) => {
    const tbody = document.querySelector('tbody')
    for (let i = 0; i < transactions.length; i++) {
        const row = appendElement("tr", tbody)
        const transaction = transactions[i]
        Object.keys(transaction).forEach((key) => appendElement("td", row, transaction[key]))
    }
})
