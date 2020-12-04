-- Make a database with this

-- Update this whenever they open the app
CREATE TABLE coins (
	ticker TEXT not null,
	id TEXT not null
);

-- CREATE TABLE portfolio (

-- )

CREATE TABLE transactions  (
	ticker TEXT not null,
	type TEXT not null,
	amount NUMBER not null,
	otherParty TEXT,
	date DATETIME,
	counterCurrency TEXT,
	counterCurrencyAmount NUMBER,
	feeAmount NUMBER,
	feeCurrency TEXT,
	link TEXT,
	fromWallet TEXT,
	note TEXT,
	-- maybe get rid of this
	fiatValue TEXT
);