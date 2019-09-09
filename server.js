const express = require('express');

const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
  db.select('*')
    .from('accounts')
    .then(accounts => {
      res.status(200).json(accounts)
    }).catch(err => {
      res.json(err)
    })
})

module.exports = server;