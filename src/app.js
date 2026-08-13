const express = require('express');
const { Blockchain } = require('./blockchain.js');
const { validateTransaction } = require('./validation.js');

function createApp() {
  const app = express();
  const blockchain = new Blockchain();

  app.locals.blockchain = blockchain;
  app.use(express.json());

  app.get('/blockchain', (req, res) => {
    res.status(200).json(blockchain.chain);
  });

  app.post('/transactions', validateTransaction, (req, res) => {
    blockchain.addTransaction(req.body);
    res.status(201).json(req.body);
  });

  app.post('/mine', (req, res) => {
    const block = blockchain.mineBlock();
    res.status(201).json(block);
  });

  return app;
}

module.exports = { createApp };
