const electron = require("electron");
const ipc = electron.ipcRenderer;
const appendElement = require("./modules/loadTable.js");

const dialog = document.querySelector("dialog")
const exchanges = document.getElementById("exchanges")
const addButton = document.querySelector("button.exchange")

function addExchange() {
    dialog.showModal();
}

function bruh() {
    dialog.close()
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

dialog.addEventListener('close', () => {
    if (dialog.returnValue === 'yes') {
        const form = document.querySelector("form").elements;
        ipc.send("addExchange", {
            exchange: form.exchange.value,
            key: form.key.value,
            secret: form.secret.value
        })
    }
})

ipc.on("Alert", (evt, message) => {
    alert(message)
    location.reload()
})