const Router = require('express').Router()
const {createTransaction} = require('../controllers/transaction')
const {checkToken} = require('../middlewares/tokenValidations')

Router.post('/',checkToken,createTransaction)

module.exports = Router