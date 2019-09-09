const express = require('express');

const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
  db.select('*')
    .from('accounts')
    .then(accounts => {
      res.status(200).json(accounts)
    })
    .catch(err => {
      res.json(err)
    })
})

server.get('/:id', (req, res) => {
  const { id } = req.params

  db.select('*')
    .from('accounts')
    .where({ id })
    .then(account => {
      res.status(200).json(account)
    })
    .catch(error => {
      res.status(500).json(error)
    })
})

module.exports = server;