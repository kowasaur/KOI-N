const electron = require("electron");
const ipc = electron.ipcRenderer;

function value(id) {
    return document.getElementById(id).value
}

// Makes sure the user doesn't leave stuff blank that they shouldn't
function checkFilled() {
    if (!!value("ticker") && !!value("amount") ) {
        document.querySelector('button').disabled = false
    } else {
        document.querySelector('button').disabled = true
    }
}

// Sends request to index.js to add the transaction
function addTransaction() {
    var transaction = {
        ticker: value("ticker").toUpperCase(),
        type: value("type"),
        amount: Number(value("amount"))
    };
    ipc.send("TransactionAdded", transaction)
}

ipc.on("TransactionAddedSuccess", () => {
    document.getElementById("success").style.display = "block";
    document.getElementById("amount").value = "";
    document.querySelector('button').disabled = true
})