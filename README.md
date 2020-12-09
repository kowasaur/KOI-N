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
- Make option to not include receives in value and profit

### Add Transaction
- Make the currency box in addTransaction.html searchable and only allow specific coins (using select2 or selectize)
    - sort by market cap and last input
- Make button to hide `Transaction Added Successfully` (little x)
- Have question marks you can hover over that explain stuff
    - This could be for other parts of the app too
- Make placeholder text lighter so that it is more distinguisable
- Maybe make drop down with things user has put before 
    - e.g. in exchange it has binance as an option if they've put it there before
- Add support for payments (sending)
- Might have to make `addTransaction.js` make empty values NULL instead of ''
- Make clear button that removes all input values
- Maybe make `check()` wait for `typeChange()` to run so that it's accurate
- Fiat value not required if date input
- For deposits/withdrawls, make fiat value the same as amount

### Transactions
- Ability to export transactions and portfolio as sheets? (csv?)
- Ability to look at individual accounts like Binance, Coinspot, 0x52385023853, etc
    - Group ethereum wallets optional as well

### New Features
- Add custom coins
    - ERC20 tokens. (Have token address)
- Make a thing that figures out your taxes
- Make it so you can change currency (not just AUD)
- Import exchange transactions
- Backup button that download or opens the folder to database.sqlite

### Miscellaneous
- Make `database.sqlite` in AppData or something and create the file if it doesn't exist
    - also maybe allow for importing of database files
    - make it so in the portable version, the database is in the same folder as everything else
- Remove all console.logs() when I finish
- Make SQL queries not raw and actually use knex like you're supposed to
- Change the default menu bar
- Maybe have query results stored in a variable somewhere so it doesn't have to reload everything every time you click home.

### Readme / About
- Add support thing (addresses to donate to) in readme and about (like this https://github.com/SpiralDevelopment/CryptoTracker#support)
- Put somewhere where I got my tax info from
- Have Powered by CoinGecko (https://www.coingecko.com/en/branding) in Electron > About KOI-N as well as readme
- Put thing in readme (maybe elsewhere) on what this has been tested on
- Make doc with database column name equivalent of what the user sees
- If I'm gonna have multiple .md files, move this and the others to docs/
- Have somewhere the importance of backing up since this is stored locally

## Sources
Starting from when this was committed (7/12/2020), I put anything that helped me here ~~that I remember~~. (I might move this to it's own doc later on)
- https://stackoverflow.com/questions/32621988/electron-jquery-is-not-defined/37480521#37480521
- https://developer.mozilla.org/en-US/docs/Archive/Mozilla/XUL/Attribute/readonly
- https://stackoverflow.com/questions/195951/how-can-i-change-an-elements-class-with-javascript
- https://stackoverflow.com/questions/22754315/for-loop-for-htmlcollection-elements
- https://www.freecodecamp.org/news/manipulating-arrays-in-javascript/
- https://stackoverflow.com/questions/44813732/how-do-i-check-if-all-elements-of-an-array-are-null