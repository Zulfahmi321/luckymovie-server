const Router = require("express").Router();
const { createTransaction, showUserTicket, userHistory, allHistory } = require("../controllers/transaction");
const { checkToken } = require("../middlewares/tokenValidations");
const { confirmPayment } = require("../models/transaction");

Router.post("/", checkToken, createTransaction);
Router.get("/", checkToken, allHistory);
Router.get("/history", checkToken, userHistory);
Router.get("/ticket/:trans_id", checkToken, showUserTicket);
Router.post("/midtrans-notification", confirmPayment);

module.exports = Router;
