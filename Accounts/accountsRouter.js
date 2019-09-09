const express = require('express');

const db = require('./../data/dbConfig');

const router = express();

router.get('/', (req, res) => {
  db.select('*')
    .from('accounts')
    .then(accounts => {
      res.status(200).json(accounts)
    })
    .catch(err => {
      res.json(err)
    })
})

router.get('/:id', (req, res) => {
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

router.post('/', (req, res) => {
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

router.put('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
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

module.exports = router;