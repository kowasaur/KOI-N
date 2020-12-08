const electron = require("electron");
const ipc = electron.ipcRenderer;

function value(id) {
    return document.getElementById(id).value
}

// Makes sure the user doesn't leave stuff blank that they shouldn't
function check() {
    if (!!value("id") && !!value("amount") ) {
        document.querySelector('button').disabled = false
    } else {
        document.querySelector('button').disabled = true
    }
}

// Sends request to index.js to add the transaction
function addTransaction() {
    var transaction = {
        id: value("id").toLowerCase(),
        type: value("type"),
        amount: Number(value("amount")),
        otherParty: value("otherParty"),
        date: value("date"),
        counterCurrencyId: value("counterCurrencyId"),
        counterCurrencyAmount: Number(value("counterCurrencyAmount")),
        feeCurrencyId: value("feeCurrencyId"),
        feeAmount: Number(value("feeAmount")),
        link: value("link"),
        wallet: value("wallet"),
        note: value("link"),
        fiatValue: value("fiatValue")
    };
    ipc.send("TransactionAdded", transaction)
}

ipc.on("TransactionAddedSuccess", () => {
    document.getElementById("success").style.display = "block";
    document.getElementById("amount").value = "";
    document.querySelector('button').disabled = true
})