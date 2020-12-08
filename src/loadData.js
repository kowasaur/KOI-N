const electron = require("electron");
const ipc = electron.ipcRenderer;

function appendElement(element, parent, content) {
    element = document.createElement(element);
    element.innerHTML = content || '';
    parent.appendChild(element);
    return element;
}

document.addEventListener("DOMContentLoaded",  () => ipc.send("mainWindowLoaded"));

ipc.on("totalGenerated", (evt, total) => {
    const ul = document.querySelector('ul');
    appendElement("li", ul, `Value: ${total.value}`);
    appendElement("li", ul, `Invested: ${total.invested}`);
    appendElement("li", ul, `$ Profit: ${total.$profit}`);
    appendElement("li", ul, `% Profit: ${total.percent_profit}`);
})

ipc.on("portfolioGenerated", (evt, portfolio) => {
    const table = document.querySelector('tbody')
    for (let i = 0; i < portfolio.length; i++) {
        const row = appendElement("tr", table)
        const currency = portfolio[i];
        const keys = Object.keys(currency);
        keys.forEach((key) => {
            if (key !== 'coin') {
                if (key === 'image') {
                    content = `<img height=30 src="${currency[key]}"">${currency.coin}`
                } else {
                    content = currency[key];
                }
                appendElement("td", row, content)
            }
        })
    }
})