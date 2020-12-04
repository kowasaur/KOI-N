-- Make a database with this

CREATE TABLE coins (
	ticker TEXT not null,
	id TEXT not null,
);

-- CREATE TABLE portfolio (

-- )

CREATE TABLE transactions  (
	ticker TEXT not null,
	type TEXT not null,
	amount NUMBER not null,
	location TEXT,
	time DATETIME,
	counterCurrency TEXT,
	counterCurrencyAmount NUMBER,
	feeAmount NUMBER,
	feeCurrency TEXT,
	link TEXT,
);