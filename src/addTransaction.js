const electron = require("electron");
const ipc = electron.ipcRenderer;

function value(id) {
    return document.getElementById(id).value
}

var type = document.getElementById("type")

required = ["type", "id", "amount", "fiatValue"]

// Whenever the type changes
function typeChange() {
    switch (type.value) {
        case "buy":
        case "sell":
            console.log("buy or sell");
            required = ["type", "id", "amount", "fiatValue"]
            break;
        case "move":
            console.log("move");
            required = ["type", "id", "amount"]
            break;
        default:
            console.log("Uh Oh Brokey");
    }
    // Removes required from everything that currently has it
    oldRequireds = Array.from(document.getElementsByClassName("required"))
    for (let i = 0; i < oldRequireds.length; i++) {
        oldRequireds[i].classList.remove("required");
    }
    // Makes required required
    for (let i = 0; i < required.length; i++) {
        document.getElementById(required[i]).classList.add("required")
    }
}

// Makes sure the user doesn't leave stuff blank that they shouldn't
function check() {
    if (required.map(id => value(id)).every(element => !!element)) {
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