const { createPayment } = require("../config/midtrans");
const { postTransaction, getUserTicket, confirmPayment, getUserHistory, getAllHistory } = require("../models/transaction");
const axios = require("axios").default;

let order_id;
const createTransaction = async (req, res) => {
  try {
    const userId = req.userPayload.id;
    const { data } = await postTransaction(req.body, userId);
    const { url } = await createPayment(data.orderId, data.total_payment);
    order_id = data.orderId;
    res.status(200).json({
      id: data.orderId,
      url,
      message: "Trasaction sucessfully created,please make a payment",
    });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      error: error.message,
    });
  }
};

const showUserTicket = async (req, res) => {
  try {
    const { trans_id } = req.params;
    const { data } = await getUserTicket(req.userPayload.id, trans_id);
    res.status(200).json({
      data,
    });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      error: error.message,
    });
  }
};

const paymentConfirm = async (_req, res) => {
  try {
    const response = await axios.get(`https://api.sandbox.midtrans.com/v2/${order_id}/status`, { headers: { Authorization: `Basic ${process.env.MIDTRANS_AUTH_STRING}` } });

    if (response) {
      const { data } = await confirmPayment(response.body);
      res.status(200).status({
        data,
      });
    }
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      error: error.message,
    });
  }
};

const userHistory = async (req, res) => {
  try {
    const userId = req.userPayload.id;
    const { data } = await getUserHistory(userId);
    res.status(200).json({
      data,
    });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      error: error.message,
    });
  }
};

const allHistory = async (_req, res) => {
  try {
    const { data } = await getAllHistory();
    res.status(200).json({
      data,
    });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      error: error.message,
    });
  }
};

module.exports = { createTransaction, showUserTicket, paymentConfirm, userHistory, allHistory };
