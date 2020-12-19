# THIS IS NOT IN A WORKING STATE YET

## To Do
### Home
- When you click on a coin, it shows your transactions for that coins and profit, etc
    - Show average buy in and average sell out
- https://htmldom.dev/sort-a-table-by-clicking-its-headers/
    - Make it sort by value by default
- Make text green if profit and red if loss
- Maybe make both profits in the same box
    - Or maybe don't but make sure it's right aligned
- Maybe make a refresh button (prices)
    - I think this may be unnecessary, depends how slow loading it every time is
- Make option to not include receives in value and profit
- Change how calculating "invested" works (from like an average to allowing the user to choose what specific transactions they are selling)

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
- Maybe make a dashboard thing that shows the performance of all your cryptos using https://www.coingecko.com/en/widgets/coin_price_chart_widget
- https://www.coingecko.com/en/widgets/
- Add settings / about page that has source for logo <a href="https://www.vecteezy.com/free-vector/abstract">Abstract Vectors by Vecteezy</a>

### Miscellaneous
- Make `database.sqlite` in AppData or something and create the file if it doesn't exist
    - also maybe allow for importing of database files
    - make it so in the portable version, the database is in the same folder as everything else
- Remove all console.logs() when I finish
- Make SQL queries not raw and actually use knex like you're supposed to
- Change the default menu bar
- Maybe have query results stored in a variable somewhere so it doesn't have to reload everything every time you click home.
- Create custom scroll bar https://www.w3schools.com/howto/howto_css_custom_scrollbar.asp

### Readme / About
- Add support thing (addresses to donate to) in readme and about (like this https://github.com/SpiralDevelopment/CryptoTracker#support)
- Put somewhere where I got my tax info from
- Have Powered by CoinGecko (https://www.coingecko.com/en/branding) in Electron > About KOI-N as well as readme
- Put thing in readme (maybe elsewhere) on what this has been tested on
- Make doc with database column name equivalent of what the user sees
- If I'm gonna have multiple .md files, move this and the others to docs/
- Have somewhere the importance of backing up since this is stored locally

## How It Works
(I'll finish this later)
Fees are included in the amount invested in a coin
### Invested
Say you put $500 into bitcoin. The price then doubles and you sell half of it. Your 'invested' is now $250.  
This amount is calculated on every sell with `o - so/b` where `o` is the old invested amount (AUD), `s` is the amount in crypto that is being sold, and `b` is the total balance of that crypto, prior to selling. 

## coinspotIds.json
**Note:** aud, ainslie-gold, and ainslie-silver are not on CoinGecko

## Sources
The `N` in the KOI-N logo is modified version of [Fish KOI logo and symbol animal vector](https://www.vecteezy.com/vector-art/595538-fish-koi-logo-and-symbol-animal-vector) which is apart of [Abstract Vectors by Vecteezy](https://www.vecteezy.com/free-vector/abstract). The font used is [Otsutome](https://www.freejapanesefont.com/otsutome-font-download/)
Starting from when this was committed (7/12/2020), I put anything that helped me here ~~that I remember~~. (I might move this to it's own doc later on)
- https://stackoverflow.com/questions/32621988/electron-jquery-is-not-defined/37480521#37480521
- https://developer.mozilla.org/en-US/docs/Archive/Mozilla/XUL/Attribute/readonly
- https://stackoverflow.com/questions/195951/how-can-i-change-an-elements-class-with-javascript
- https://stackoverflow.com/questions/22754315/for-loop-for-htmlcollection-elements
- https://www.freecodecamp.org/news/manipulating-arrays-in-javascript/
- https://stackoverflow.com/questions/44813732/how-do-i-check-if-all-elements-of-an-array-are-null
- Flag images
    - https://commons.wikimedia.org/wiki/File:Australia_flag_icon_round.svg
    - https://commons.wikimedia.org/wiki/File:United-states_flag_icon_round.svg
- https://stackoverflow.com/questions/28246788/convert-yyyy-mm-dd-to-mm-dd-yyyy-in-javascript/28246873
- https://www.w3schools.com/jsref/jsref_includes_array.asp
- https://flaviocopes.com/how-to-determine-date-is-today-javascript/
- https://stackoverflow.com/questions/57007749/date-getdate-is-not-a-function-typescript
- https://stackoverflow.com/questions/21509474/subtract-arrays-javascript
- https://stackoverflow.com/questions/18018928/issue-storing-arrays-in-sqlite-using-javascript
- https://stackoverflow.com/questions/10865025/merge-flatten-an-array-of-arrays
- https://stackoverflow.com/questions/1374126/how-to-extend-an-existing-javascript-array-with-another-array-without-creating