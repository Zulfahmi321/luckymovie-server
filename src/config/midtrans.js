const midtransClient = require("midtrans-client");
// Create Snap API instance
let snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

const createPayment = async (orderId, amount) => {
  const parameter = {
    transaction_details: {
      order_id: orderId,
      gross_amount: amount,
    },
  };
  try {
    const result = await snap.createTransaction(parameter);
    return {
      url: result.redirect_url,
    };
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createPayment, snap };
