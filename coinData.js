// This file is to turn all the coingecko coins/list into a table
// This will not be used in the final product

const path = require('path');

const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();

// Database
var knex = require("knex")({
    client: "sqlite3",
    connection: { filename: path.join(__dirname,"database.sqlite") },
    useNullAsDefault: true
  });

knex.schema.dropTableIfExists('coins').then()
knex.schema.createTable('coins', (table) => {
    table.text('id');
    table.text('symbol')
    table.text('name');
  }).then(async () => {
    let coinsList = await CoinGeckoClient.coins.list();
    coinsList = coinsList.data
    coinsList.push({
      id: "aud",
      symbol: "aud",
      name: "Australian Dollars"
    })
    coinsList.push({
      id: "usd",
      symbol: "usd",
      name: "United States Dollars"
    })

    for (let i = 0; i < coinsList.length; i++) {
        knex('coins').insert(coinsList[i]).then();
    }
    console.log('done');
})