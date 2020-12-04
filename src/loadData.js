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
    console.log(data.data);
}
coingecko();

document.addEventListener("DOMContentLoaded",  () => {
    ipc.send("mainWindowLoaded");
    // ipc.on("resultSent", (evt, result) => {
    //     let resultEl = document.getElementById("result");
    //     console.log(result);
    //     for (let i = 0; i < result.length; i++) {
    //         resultEl.innerHTML += "Ticker: " + result[i].ticker.toString() + "<br>";
    //     }
    // });
    ipc.on("portfolioGenerated", (evt, portfolio) => {
        console.log(portfolio);
        table = document.querySelector('tbody')
        for (let i = 0; i < portfolio.length; i++) {
            const row = document.createElement("tr");
            table.appendChild(row);
            const currency = portfolio[i];
            const keys = Object.keys(currency);
            keys.forEach((key) => {
                if (key !== 'coin') {
                    cell = document.createElement("td");
                    if (key === 'image') {
                        cell.innerHTML = `<img height=30 src="${currency[key]}"">${currency.coin}`
                    } else {
                        cell.innerHTML = currency[key];
                    }
                    row.appendChild(cell)
                }
                console.log(`${key}: ${currency[key]}`);
            })
            // row.appendChild(document.createElement("td"))
        }
    })
});