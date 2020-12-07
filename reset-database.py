# This deletes the database and recreates it using src/database.sql
# This will not be used in the final product

import sqlite3
import os

if input('Are you sure you want to reset the database? (Y/N): ').upper() in ['Y', 'YES']:
    os.remove("database.sqlite")
    connection = sqlite3.connect("database.sqlite")
    cursor = connection.cursor()

    with open("src/database.sql", "r") as sql:
        cursor.executescript(sql.read())