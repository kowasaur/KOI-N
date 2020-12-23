const electron = require("electron");
const ipc = electron.ipcRenderer;
const appendElement = require("./modules/loadTable.js");

document.addEventListener("DOMContentLoaded",  () => ipc.send("addTransactionLoaded"));

function value(id) {
    return document.getElementById(id).value
}

const id = document.getElementById("id")
const type = document.getElementById("type")
const datalist = document.getElementById("id-list")

required = ["type", "id", "amount", "date", "counterCurrencyId", "counterCurrencyAmount"]
hide = []
names = {
    id: "Currency",
    otherParty: "Other Party",
    wallet: "Wallet"
}

// Whenever the type changes
function typeChange() {
    id.disabled = false
    id.value = ""
    switch (type.value) {
        case "buy":
        case "sell":
            required = ["type", "id", "amount", "date", "counterCurrencyId", "counterCurrencyAmount"]
            hide = []
            break;
        case "receive":
            required = ["type", "id", "amount", "date"]
            hide = ["counterCurrencyId", "counterCurrencyAmount"]
            break;
        case "move":
            required = ["type", "id", "amount", "date"]
            hide = ["counterCurrencyId", "counterCurrencyAmount", "fiatValue"]
            break;
        case "fee":
            required = ["type", "feeCurrencyId", "feeAmount", "date"]
            hide = ["id", "amount", "counterCurrencyId", "counterCurrencyAmount", "fiatValue", "otherParty"]
            break;
        case "deposit":
        case "withdraw":
            required = ["type", "id", "amount", "date"]
            hide = ["counterCurrencyId", "counterCurrencyAmount", "fiatValue", "wallet", "feeCurrencyId", "feeAmount", "feeatValue"]
            id.value = "aud"
            id.disabled = true
            break;
        case "close-position":
            required = ["type", "id", "amount", "date"]
            hide = ["counterCurrencyId", "counterCurrencyAmount", "wallet", "feeCurrencyId", "feeAmount", "feeatValue"]
            break;
        default:
            console.error("Uh Oh Brokey");
    }

    switch (type.value) {
        case 'move':
            names = {
                id: "Currency",
                otherParty: "To",
                wallet: "From"
            }
            break;
        case 'close-position':
            names = {
                id: "Profit Currency",
                otherParty: "Other Party",
                wallet: "Wallet"
            }
            break;
        default:
            names = {
                id: "Currency",
                otherParty: "Other Party",
                wallet: "Wallet"
            }
            break;
    }

    Object.keys(names).forEach(id => {
        document.querySelector(`[for="${id}"]`).innerText = names[id]
    })

    // Removes hide from everything that currently has it
    oldHidden = Array.from(document.getElementsByClassName("hide"))
    for (let i = 0; i < oldHidden.length; i++) {
        oldHidden[i].classList.remove("hide");
    }
    // Makes hide hidden
    for (let i = 0; i < hide.length; i++) {
        document.getElementById(hide[i]).classList.add("hide")
        document.querySelector(`[for="${hide[i]}"]`).classList.add("hide")
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
        feeatValue: Number(value("feeatValue")),
        link: value("link"),
        wallet: value("wallet"),
        note: value("note"),
        fiatValue: Number(value("fiatValue"))
    };
    document.querySelector('button').disabled = true
    document.getElementById("success").style.display = "none";
    ipc.send("TransactionAdded", transaction)
}

function resetForm() {
    document.querySelector("form").reset()
    typeChange()
}

ipc.on("TransactionAddedSuccess", () => {
    document.getElementById("success").style.display = "block";
    resetForm()
})

ipc.on("allCoins", (evt, allCoins)  => {
    allCoins.forEach(coin => {
        const option = appendElement("option", datalist, `${coin.name} (${coin.symbol.toUpperCase()})`)
        option.value = coin.id
    });
})