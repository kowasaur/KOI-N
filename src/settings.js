const electron = require("electron");
const ipc = electron.ipcRenderer;
const appendElement = require("./modules/loadTable.js");

const dialog = document.querySelector("dialog")
const coinDialog = document.getElementById("addCoin")
const exchanges = document.getElementById("exchanges")
const customCurrencies = document.getElementById("customCurrencies")
const addButton = document.querySelector("button.exchange")
const coinButton = document.getElementById("coinButton")

function addExchange() {
    dialog.showModal();
}

function bruh() {
    dialog.close()
}

function addCoin() {
    coinDialog.showModal()
}

function closeCoin() {
    coinDialog.close()
}

document.addEventListener("DOMContentLoaded",  () => ipc.send("settingsLoaded"));

ipc.on("connections", (evt, connections) => {
    connections.forEach(connection => {
        const exchange = document.createElement("div")
        exchange.className = 'exchange'
        exchanges.insertBefore(exchange, addButton)

        const image = appendElement("img", exchange)
        image.src = connection.imageUrl
        image.height = 75

        const info = appendElement("div", exchange)
        appendElement("h3", info, connection.name)
        appendElement("h5", info, "API Key")
        appendElement("div", info, connection.key)

        const button = appendElement("button", exchange, "&times")
        button.className = 'x'
        button.onclick = () => {
            const doRemove = confirm('Are you sure you want to remove this exchange?')
            if (doRemove === true) {
                ipc.send("removeExchange", connection.exchange)
            }
        }
    });
})

ipc.on("customCurrencies", (evt, currencies) => {
    currencies.forEach(currency => {
        const coin = document.createElement("div")
        coin.className = 'exchange'
        customCurrencies.insertBefore(coin, coinButton)

        const image = appendElement("img", coin)
        image.src = currency.image
        image.height = 75

        const info = appendElement("div", coin)
        appendElement("h3", info, currency.name)
        appendElement("h5", info, currency.id)
        appendElement('div', info, currency.value)
    })
})

dialog.addEventListener('close', () => {
    if (dialog.returnValue === 'yes') {
        const form = document.querySelector("#add-exchange").elements;
        ipc.send("addExchange", {
            exchange: form.exchange.value,
            key: form.key.value,
            secret: form.secret.value
        })
    }
})

coinDialog.addEventListener('close', () => {
    if (coinDialog.returnValue === 'yes') {
        const form = document.getElementById("coinForm").elements
        ipc.send("addCoin", {
            id: form.id.value,
            symbol: form.symbol.value,
            name: form.name.value,
            image: form.image.value,
            value: form.value.value
        })
    }
})

ipc.on("Alert", (evt, message) => {
    alert(message)
    location.reload()
})