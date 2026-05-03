//const express = require('express'); 
require('dotenv').config();//knohovna na řízení infomrací jako hesla externě.
const mysql = require('mysql2'); //knihovna na propojení s databází

//const app = express();
//app.use(express.json());

const db = mysql.createConnection({//vytvoří spojení s databází
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect((err) => {//Zahlásí problém při připojení.
    if (err) {
        console.error('Chyba při připojování k databázi: ' + err.stack);
        return;
    }
    console.log('Připojeno k databázi jako ID ' + db.threadId);
});
module.exports = db;

