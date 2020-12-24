# ![KOI-N](../assets/logoS.png)
A cryptocurrency portfolio tracker. 

## To Do
### Home
- When you click on a coin, it shows your transactions for that coins and profit, etc
    - Show average buy in and average sell out
- https://htmldom.dev/sort-a-table-by-clicking-its-headers/
    - Make it sort by value by default
- Maybe make a refresh button (prices)
    - I think this may be unnecessary, depends how slow loading it every time is
- Make option to not include receives in value and profit
- Change how calculating "invested" works (from like an average to allowing the user to choose what specific transactions they are selling)
- Right now, if you have more than 100 coins, they won't show up on the dashboard because of the pagination (only shows 1 page rn)

### Add Transaction
- Improve currency boxes using selectize.js so it's sorted by market cap and has coin logo
    - sort by market cap and last input
- Make button to hide `Transaction Added Successfully` (little x)
- Have question marks you can hover over that explain stuff
    - This could be for other parts of the app too
- Maybe make drop down with things user has put before 
    - e.g. in exchange it has binance as an option if they've put it there before
- Add support for payments (sending)
- Make clear button that removes all input values
- Maybe make `check()` wait for `typeChange()` to run so that it's accurate

### Transactions
- Ability to export transactions and portfolio as sheets? (csv?)
- Ability to look at individual accounts like Binance, Coinspot, 0x52385023853, etc
    - Group ethereum wallets optional as well
- Edit transactions

### New Features
- Add custom coins
    - ERC20 tokens. (Have token address)
- Make a thing that figures out your taxes
- Make it so you can change currency (not just AUD)
- Backup button that download or opens the folder to database.sqlite
- Maybe make a dashboard thing that shows the performance of all your cryptos using https://www.coingecko.com/en/widgets/coin_price_chart_widget
- https://www.coingecko.com/en/widgets/
- Add Binance Support, although this will be [difficult](https://dev.binance.vision/t/fetch-all-account-orders/279/8)
- Make liquidity providing actually work

### Miscellaneous
- Make `database.sqlite` in AppData or something and create the file if it doesn't exist
    - also maybe allow for importing of database files
    - make it so in the portable version, the database is in the same folder as everything else
- Remove all console.logs() when I finish
- Make SQL queries not raw and actually use knex like you're supposed to
- Change the default menu bar
- Maybe have query results stored in a variable somewhere so it doesn't have to reload everything every time you click home.
- Create custom scroll bar https://www.w3schools.com/howto/howto_css_custom_scrollbar.asp
- You can disable refresh on submit for forms. Do it

### Readme / About
- Add support thing (addresses to donate to) in readme and about (like this https://github.com/SpiralDevelopment/CryptoTracker#support)
- Put somewhere where I got my tax info from
- Put thing in readme (maybe elsewhere) on what this has been tested on
- Make doc with database column name equivalent of what the user sees
- Have somewhere the importance of backing up since this is stored locally

## How It Works
(I'll finish this later)
Fees are included in the amount invested in a coin
### Invested
Say you put $500 into bitcoin. The price then doubles and you sell half of it. Your 'invested' is now $250.  
This amount is calculated on every sell with `o - so/b` where `o` is the old invested amount (AUD), `s` is the amount in crypto that is being sold, and `b` is the total balance of that crypto, prior to selling. 

## More Information
- [Sources](sources.md)
- [Miscellaneous](miscellaneous.md)