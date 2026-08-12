const express = require('express');
const { Blockchain } = require('./blockchain.js');

const app = express();
const blockchain = new Blockchain();

app.locals.blockchain = blockchain;
app.use(express.json());

app.get('/blockchain', (req, res) => {
  res.status(200).json(blockchain.chain);
});

app.post('/transactions', (req, res) => {
  blockchain.addTransaction(req.body);
  res.status(201).json(req.body);
});

module.exports = app;
