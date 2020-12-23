const electron = require("electron");
const appendElement = require("./modules/loadTable.js");
const ipc = electron.ipcRenderer;

document.addEventListener("DOMContentLoaded",  () => ipc.send("mainWindowLoaded"));

ipc.on("totalGenerated", (evt, total) => {
    const ul = document.querySelector('ul');
    appendElement("li", ul, `Value: ${total.value}`);
    appendElement("li", ul, `Invested: ${total.invested}`);
    appendElement("li", ul, `$ Profit: ${total.$profit}`);
    appendElement("li", ul, `% Profit: ${total.percent_profit}`);
})

ipc.on("portfolioGenerated", (evt, portfolio) => {
    const tbody = document.querySelector('tbody')
    for (let i = 0; i < portfolio.length; i++) {
        const row = appendElement("tr", tbody)
        const currency = portfolio[i];
        const keys = Object.keys(currency);
        keys.forEach((key) => {
            if (key !== 'coin') {
                let className = undefined
                switch (key) {
                    case 'image':
                        content = `<div><img width=30 src="${currency[key]}""><div>${currency.coin}</div></div>`
                        break;
                    case '$profit':
                    case 'percent_profit':
                        className = (Number(currency[key].replace(/[^\d.-]/g, '')) > 0) ? 'positive' : 'negative'
                    default:
                        content = currency[key];
                        break;
                }
                appendElement("td", row, content, className)
            }
        })
    }
})