# THIS IS NOT IN A WORKING STATE YET

## To Do
### Home
- When you click on a coin, it shows your transactions for that coins and profit, etc
    - Show average buy in and average sell out
- https://htmldom.dev/sort-a-table-by-clicking-its-headers/
- Make text green if profit and red if loss
- Maybe make both profits in the same box
- Make prices round like:
    - $25,512
    - $787.35
    - $17.612
    - $1,532.1
    - Or maybe don't but make sure it's right aligned
- Maybe make a refresh button (prices)
    - I think this may be unnecessary, depends how slow loading it every time is
- Make value and invested accurate

### Add Transaction
- Make the currency box in addTransaction.html searchable and only allow specific coins (using select2 or selectize)
    - sort by market cap and last input
- Make button to hide `Transaction Added Successfully` (little x)
- Have question marks you can hover over that explain stuff
    - This could be for other parts of the app too
- Make required boxes stand out (like have an asterisk or red border)
- Make placeholder text lighter so that it is more distinguisable
- Maybe make drop down with things user has put before 
    - e.g. in exchange it has binance as an option if they've put it there before
- Add support for payments (sending)
- Might have to make `addTransaction.js` make empty values NULL instead of ''
- Make clear button that removes all input values
- Make the currency for deposits and withdraws read only for AUD for now

### Transactions
- Ability to export transactions and portfolio as sheets? (csv?)
- Ability to look at individual accounts like Binance, Coinspot, 0x52385023853, etc
    - Group ethereum wallets optional as well

### New Features
- Add custom coins
    - ERC20 tokens. (Have token address)
- Make a thing that figures out your taxes
- Make it so you can change currency (not just AUD)

### Miscellaneous
- Make `database.sqlite` in AppData or something and create the file if it doesn't exist
    - also maybe allow for importing of database files
    - make it so in the portable version, the database is in the same folder as everything else
- Remove all console.logs() when I finish
- Make SQL queries not raw and actually use knex like your supposed to
- Change the default menu bar
- Maybe have query results stored in a variable somewhere so it doesn't have to reload everything every time you click home.

### Readme / About
- Add support thing (addresses to donate to) in readme and about (like this https://github.com/SpiralDevelopment/CryptoTracker#support)
- Put somewhere where I got my tax info from
- Have Powered by CoinGecko (https://www.coingecko.com/en/branding) in Electron > About KOI-N as well as readme
- Put thing in readme (maybe elsewhere) on what this has been tested on
- Make doc with database column name equivalent of what the user sees
- If I'm gonna have multiple .md files, move this and the others to docs/

## Sources
Starting from when this was committed (7/12/2020), I put anything that helped me here. (I might move this to it's own doc later on)
- https://stackoverflow.com/questions/32621988/electron-jquery-is-not-defined/37480521#37480521
- https://developer.mozilla.org/en-US/docs/Archive/Mozilla/XUL/Attribute/readonly