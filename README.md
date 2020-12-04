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

## To Do
- Make the ticker box in addTransaction.html searchable and only allow specific coins (using select2 or selectize)
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
- In Add Transaction, make required boxes stand out (like have an asterisk or something)
- Maybe make both profits in the same box
- Change order in Add Transaction so it;s like deposit 500 btc