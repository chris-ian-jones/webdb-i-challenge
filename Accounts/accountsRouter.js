const express = require('express');

const db = require('./../data/dbConfig');

const router = express();

router.get('/', (req, res) => {
  let limit = req.query.limit
  let sortby = req.query.sortby
  let sortdir = req.query.sortdir

  if (limit && sortby && sortdir){
    db.select('*')
      .from('accounts')
      .limit(limit)
      .orderBy(sortby, sortdir)
      .then(accounts => {
        res.status(200).json(accounts)
      })
      .catch(err => {
        res.json(err)
      })
  } else if (sortby && sortdir){
    db.select('*')
      .from('accounts')
      .orderBy(sortby, sortdir)
      .then(accounts => {
        res.status(200).json(accounts)
      })
      .catch(err => {
        res.json(err)
      })
  } else if (limit) {
    db.select('*')
      .from('accounts')
      .limit(limit)
      .then(accounts => {
        res.status(200).json(accounts)
      })
      .catch(err => {
        res.json(err)
      })
  } else {
    db.select('*')
      .from('accounts')
      .then(accounts => {
        res.status(200).json(accounts)
      })
      .catch(err => {
        res.json(err)
      })
  }
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

router.post('/', validateAccountData, validateAccountNameIsUnique, validateBudgetIsNumeric, validateNameIsString, (req, res) => {
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

router.put('/:id', validateAccountData, validateAccountNameIsUnique, validateBudgetIsNumeric, validateNameIsString, (req, res) => {
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

// custom middleware to validate account
function validateAccountData(req, res, next) {
  if (!req.body.name) {
    res.status(400).json({
      message: 'Invalid Account data, need name'
    })
  } else  if (!req.body.budget) {
    res.status(400).json({
      message: 'Invalid Account data, need budget'
    })
  } else {
    next()
  }
}

// custom middleware to validate account name is unique
function validateAccountNameIsUnique(req, res, next) {
  db('accounts')
    .where('name', req.body.name)
    .first()
    .then(account => {
      if (account.name === req.body.name) {
        res.status(400).json({
          message: 'Account name must be unique'
        })
      } else {
        next()
      }
    })
    .catch(err => {
      next()
    })
}

// custom middleware to validate budget is numeric
function validateBudgetIsNumeric(req, res, next) {
  if (typeof(req.body.budget) !== 'number') {
    res.status(400).json({
      message: 'Invalid Account data, budget must be numeric'
    })
  } else {
    next()
  }
}

// custom middleware to validate name is a string
function validateNameIsString(req, res, next) {
  if (typeof(req.body.name) !== 'string') {
    res.status(400).json({
      message: 'Invalid Account data, name must be a string'
    })
  } else {
    next()
  }
}

module.exports = router;