const express = require('express');
const axios = require('axios');
const mysql = require('mysql');
const path = require('path');

const app = express();
const port = 3000;
const hostname = '127.0.0.1';


app.use(express.static(path.join(__dirname, 'public')));

/******CURRENCY********/
async function getCurrency() {
    const fetched_data = [];
   await axios.all([
        axios.get('https://api.privatbank.ua/p24api/exchange_rates?json&date=03.07.2019'),
        axios.get('https://api.privatbank.ua/p24api/exchange_rates?json&date=04.07.2019'),
        axios.get('https://api.privatbank.ua/p24api/exchange_rates?json&date=05.07.2019'),
        axios.get('https://api.privatbank.ua/p24api/exchange_rates?json&date=06.07.2019')
    ]).then(axios.spread((...responses) => {
        responses.forEach(element => {
            fetched_data.push(element.data);
        });
    })).catch(error => {
        console.log(error);
    });
    return fetched_data;
};

app.get('/currency', async function (req, res) {
    const response = await getCurrency();
    res.send(response);
});
/**************/


/*******MYSQL********/
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "paradox",
    database: "test_node"
});

connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
  
    console.log('connected as id ' + connection.threadId);
  });

app.get('/database', function(req, res) {
    const id = 20;
    connection.query("SELECT * FROM `users` WHERE `id` >= ?", [id], function(err, results, fields) {
        if (err) return console.log(err);
        res.send(results);
    });
});
/***************/

app.use(function (req, res, next) {
    res.status(404).send("Can`t find that...")
});

app.listen(port, hostname, () => console.log(`Server running at http://${hostname}:${port}`));