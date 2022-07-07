const Router = require('express').Router()
const {createTransaction} = require('../controllers/transaction')


Router.post('/',createTransaction)

module.exports = Router