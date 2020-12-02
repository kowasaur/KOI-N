-- Make a database with this

CREATE TABLE coins (
	ticker TEXT not null,
	name TEXT,
	URL TEXT,
	PRIMARY KEY(ticker)
);

INSERT INTO coins VALUES
('BTC', 'Bitcoin', 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=aud&ids=bitcoin'),
('ETH', 'Ethereum', 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=aud&ids=ethereum');

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