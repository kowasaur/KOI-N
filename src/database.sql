-- Make a database with this

CREATE TABLE coins (
	id TEXT not null,
	symbol TEXT not null,
	name TEXT
);

-- CREATE TABLE portfolio (

-- )

CREATE TABLE transactions  (
	id TEXT,
	type TEXT not null,
	amount NUMBER,
	otherParty TEXT,
	date DATETIME,
	counterCurrencyId TEXT,
	counterCurrencyAmount NUMBER,
	feeAmount NUMBER,
	feeCurrencyId TEXT,
	link TEXT,
	wallet TEXT,
	note TEXT,
	dateOpened DATETIME,
	fiatValue NUMBER,
	fiatValue2 NUMBER,
	LPtokenId TEXT,
	LPtokenAmount NUMBER
);