const electron = require("electron");
const ipc = electron.ipcRenderer;

function value(id) {
    return document.getElementById(id).value
}

var id = document.getElementById("id")
var type = document.getElementById("type")

required = ["type", "id", "amount", "fiatValue", "counterCurrencyId", "counterCurrencyAmount"]

// Whenever the type changes
function typeChange() {
    id.disabled = false
    id.value = ""
    switch (type.value) {
        case "buy":
        case "sell":
            console.log("buy or sell");
            required = ["type", "id", "amount", "fiatValue", "counterCurrencyId", "counterCurrencyAmount"]
            break;
        case "receive":
            required = ["type", "id", "amount", "fiatValue"]
            break;
        case "move":
            console.log("move");
            required = ["type", "id", "amount"]
            break;
        case "fee":
            required = ["type", "feeCurrencyId", "feeAmount", "fiatValue"]
            break;
        case "deposit":
        case "withdraw":
            required = ["type", "id", "amount", "fiatValue"]
            id.value = "aud"
            id.disabled = true
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
        otherParty: value("otherParty").toLowerCase(),
        date: value("date"),
        counterCurrencyId: value("counterCurrencyId").toLowerCase(),
        counterCurrencyAmount: Number(value("counterCurrencyAmount")),
        feeCurrencyId: value("feeCurrencyId").toLowerCase(),
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