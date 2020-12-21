const electron = require("electron");
const ipc = electron.ipcRenderer;

const dialog = document.querySelector("dialog")

function addExchange() {
    dialog.showModal();
}

function bruh() {
    dialog.close()
}

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