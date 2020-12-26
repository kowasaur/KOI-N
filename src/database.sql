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
	lpTokenId TEXT,
	lpTokenAmount NUMBER
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
('binance', 'Binance', 'images/binance.svg');

CREATE TABLE coins (
	id TEXT,
	symbol TEXT,
	name TEXT
);

CREATE TABLE customCurrencies (
	id TEXT,
	symbol TEXT,
	name TEXT,
	image TEXT,
	value TEXT,
	PRIMARY KEY(id)
);

INSERT INTO customCurrencies VALUES
('aud', 'aud', 'AU Dollars', 'images/aus-flag.png', 1),
('usd', 'usd', 'US Dollars', 'images/us-flag.png', 'currency-converter'),
('xau', 'aus', 'Gold', 'https://www.coinspot.com.au/public/img/night/coinmd/gold%20standard.png', 'currency-converter'),
('xag', 'ags', 'Silver', 'https://www.coinspot.com.au/public/img/night/coinmd/silver%20standard.png', 'currency-converter'),
('xdai', 'xdai', 'xDai', 'images/xdai.png', 'dai');