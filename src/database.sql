-- Make a database with this

CREATE TABLE transactions  (
	id TEXT,
	type TEXT not null,
	amount NUMBER,
	otherParty TEXT,
	date DATETIME,
	counterCurrencyId TEXT,
	counterCurrencyAmount NUMBER,
	fiatValue NUMBER,
	feeAmount NUMBER,
	feeCurrencyId TEXT,
	-- get it
	feeatValue NUMBER,
	link TEXT,
	wallet TEXT,
	note TEXT,
	dateOpened DATETIME,
	fiatValue2 NUMBER,
	LPtokenId TEXT,
	LPtokenAmount NUMBER
);

CREATE TABLE keys (
	exchange TEXT,
	key TEXT,
	secret TEXT,
	oldTxs TEXT DEFAULT '[]',
	PRIMARY KEY(exchange)
);

CREATE TABLE exchangeInfo (
	exchange TEXT,
	name TEXT,
	imageUrl TEXT,
	PRIMARY KEY(exchange)
);

INSERT INTO exchangeInfo VALUES
('coinspot', 'CoinSpot', 'images/coinspot.png'),
('binance', 'Binance', 'images/binance.svf');