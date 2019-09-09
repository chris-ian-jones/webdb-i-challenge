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
    .first()
    .then(account => {
      res.status(200).json(account)
    })
    .catch(error => {
      res.status(500).json(error)
    })
})

server.post('/', (req, res) => {
  const accountData = req.body

  db('accounts')
    .insert(accountData, 'id')
    .then(([id]) => {
      db('accounts')
      .where({ id })
      .first()
      .then(account => {
        res.status(200).json(account)
      })
      .catch(err => {
        res.status(404).json(err)
      })
    }).catch(err => {
      res.json(err)
    })
})

server.put('/:id', (req, res) => {
  const { id } = req.params
  const changes = req.body

  db('accounts')
    .where('id', id)
    .update(changes)
    .then(count => {
      res.status(200).json({message: `updated ${count} records`})
    })
    .catch(err => {
      res.status(err)
    })
})

server.delete('/:id', (req, res) => {
  const { id } = req.params

  db('accounts')
    .where('id', id)
    .del()
    .then(count => {
      res.status(200).json({message: `deleted ${count} records`})
    })
    .catch(err => {
      res.status(err)
    })
})

module.exports = server;