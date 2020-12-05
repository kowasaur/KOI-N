const electron = require("electron");
const ipc = electron.ipcRenderer;
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();

async function coingecko() {
    // let data = await CoinGeckoClient.coins.fetch('bitcoin', {tickers: false, community_data: false, developer_data: false, localization: false});
    // let data = await CoinGeckoClient.coins.markets({vs_currency: 'aud', ids: 'bitcoin, ethereum, stellar'})
    // console.log(data.data.market_data.current_price.aud);
    // console.log(data.data[0].current_price);
    let data = await CoinGeckoClient.coins.markets({vs_currency: 'aud', ids: 'bitcoin, ethereum, litecoin'})
    return data.data
}

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
    // console.log(portfolio);
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
            // console.log(`${key}: ${currency[key]}`);
        })
    }
})