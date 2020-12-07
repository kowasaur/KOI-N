# THIS IS NOT IN A WORKING STATE YET

## Notes
I think this is how it'll work:
- index.html uses loadData.js
- loadData.js sends a request for all the data
- index.js figures out everything and returns a list of objects with the data
- loadData.js puts this data into the page
Put CoinGecko stuff in index.js
Maybe have query results stored in a variable somewhere so it doesn't have to reload everything every time you click home.
- Also make a refresh button
https://stackoverflow.com/questions/32621988/electron-jquery-is-not-defined/37480521#37480521
https://developer.mozilla.org/en-US/docs/Archive/Mozilla/XUL/Attribute/readonly
    - For deposits and withdrawls (only fiat supported rn)

## To Do
- Make the currency box in addTransaction.html searchable and only allow specific coins (using select2 or selectize)
    - sort by market cap and last input
- Add custom coin
    - ERC20 tokens. (Have token address)
- Make button to hide `Transaction Added Successfully`
- Make a thing that figures out your taxes
- When you click on a coin, it shows your transactions for that coins and profit, etc
    - Show average buy in and average sell out
- https://htmldom.dev/sort-a-table-by-clicking-its-headers/
- Make text green if profit and red if loss
- Ability to export transactions and portfolio as sheets? (csv?)
- Have Powered by CoinGecko (https://www.coingecko.com/en/branding) in Electron > About KOI-N as well as readme
- Add support thing (addresses to donate to) in readme and about (like this https://github.com/SpiralDevelopment/CryptoTracker#support)
- Make `database.sqlite` in AppData or something and create the file if it doesn't exist
    - also maybe allow for importing of database files
    - make it so in the portable version, the database is in the same folder as everything else
- Have question marks you can hover over that explain stuff
- Put somewhere where I got my tax info from
- Make it so you can change currency (not just AUD)
- In Add Transaction, make required boxes stand out (like have an asterisk or red border)
- Maybe make both profits in the same box
- Change order in Add Transaction so it;s like deposit 500 btc
- Make placeholder text lighter so that it is more distinguisable
- Remove all console.logs() when I finish
- Make prices round like:
    - $25,512
    - $787.35
    - $17.612
    - $1,532.1
    - Or maybe don't but make sure it's right aligned
- Make SQL queries not raw and actually use knex like your supposed to
- Change the default menu bar
- Organise this readme (make sections for todo)
- Put thing in readme (maybe elsewhere) on what this has been tested on
- Maybe make drop down with things user has put before 
    - e.g. in exchange it has binance as an option if they've put it there before
- Add support for payments (sending)
- Maybe make a back up database folder (remember to gitignore)
- Make doc with database column name equivalent of what the user sees
- Ability to look at individual accounts like Binance, Coinspot, 0x52385023853, etc
    - Group Eth wallets optional as well
- Have AUD and USD
- Might have to make `addTransaction.js` make empty values NULL instead of ''
- Make clear button that removes all input values