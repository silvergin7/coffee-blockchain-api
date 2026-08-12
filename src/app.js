const express = require('express');
const { Blockchain } = require('./blockchain.js');

const app = express();
const blockchain = new Blockchain();

app.get('/blockchain', (req, res) => {
  res.status(200).json(blockchain.chain);
});

module.exports = app;
