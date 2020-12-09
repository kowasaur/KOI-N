-- Make a database with this

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
	-- get it
	feeatValue NUMBER,
	link TEXT,
	wallet TEXT,
	note TEXT,
	dateOpened DATETIME,
	fiatValue NUMBER,
	fiatValue2 NUMBER,
	LPtokenId TEXT,
	LPtokenAmount NUMBER
);