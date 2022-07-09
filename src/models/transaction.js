const { db } = require("../config/db");
const { snap } = require("../config/midtrans");
const { ErrorHandler } = require("../middlewares/errorHandler");

const postTransaction = async (body, userId) => {
  const { total_payment, payment_method, ticket_qty, cinema_id, movie_id, seats, date, time } = body;
  try {
    const screeningQuery = "INSERT INTO screening(movie_id,cinema_id) values($1,$2) returning id";
    const screening = await db.query(screeningQuery, [movie_id, cinema_id]);
    const screeningId = screening.rows[0].id;
    const orderQuery = "INSERT INTO transactions(user_id,payment_method,quantity,total_price,screening_id,date,time) values($1,$2,$3,$4,$5,$6,$7) returning id";
    const order = await db.query(orderQuery, [userId, payment_method, ticket_qty, total_payment, screeningId, date, time]);
    const orderId = order.rows[0].id;
    let ticketQuery = "INSERT INTO tickets(transaction_id,seat) VALUES";
    let tQueryParams = [];
    let tParams = [];
    seats.map((seat) => {
      tQueryParams.push(`($${tParams.length + 1},$${tParams.length + 2})`, ",");
      tParams.push(orderId, seat);
    });
    tQueryParams.pop();
    ticketQuery += tQueryParams.join("");
    ticketQuery += " RETURNING *";

    await db.query(ticketQuery, tParams);
    return {
      data: {
        total_payment,
        orderId,
      },
    };
  } catch (error) {
    const status = error.status || 500;
    throw new ErrorHandler({ status, message: error.message });
  }
};

const getUserTicket = async (userId, transaction_id) => {
  try {
    const sqlQuery =
      "select t.id as transaction_id , t2.seat as seat,title as movie,date as movie_date,time as movie_time,quantity as count, total_price,t2.id as ticket_id from transactions t join screening s on s.id = t.screening_id join movies m on s.movie_id=m.id join cinemas c on s.cinema_id=c.id join tickets t2 on t2.transaction_id =t.id where user_id = $1 and transaction_id = $2 and status = 'PAID'";
    const result = await db.query(sqlQuery, [userId, transaction_id]);
    return {
      data: result.rows,
    };
  } catch (error) {
    const status = error.status || 500;
    throw new ErrorHandler({ status, message: error.message });
  }
};

const getUserHistory = async (userId) => {
  try {
    const sqlQuery =
      "select t.id as transaction_id , c.name as cinema, t2.seat as seat,title as movie,date as movie_date,time as movie_time,quantity as count, total_price,t2.id as ticket_id,ticket_status from transactions t join screening s on s.id = t.screening_id join movies m on s.movie_id=m.id join cinemas c on s.cinema_id=c.id join tickets t2 on t2.transaction_id =t.id where user_id = $1 and payment_status = 'PAID'";
    const result = await db.query(sqlQuery, [userId]);
    return {
      data: result.rows,
    };
  } catch (error) {
    const status = error.status || 500;
    throw new ErrorHandler({ status, message: error.message });
  }
};

const getAllHistory = async () => {
  try {
    const sqlQuery =
      "select distinct on(t.id) t2.transaction_id,t.user_id as user_id, c.name as cinema, t2.seat as seat,title as movie,date as movie_date,time as movie_time,t.payment_status,payment_method,quantity as count, total_price,t2.id as ticket_id,ticket_status from transactions t join screening s on s.id = t.screening_id join movies m on s.movie_id=m.id join cinemas c on s.cinema_id=c.id join tickets t2 on t2.transaction_id =t.id ";
    const result = await db.query(sqlQuery);
    return {
      data: result.rows,
    };
  } catch (error) {
    const status = error.status || 500;
    throw new ErrorHandler({ status, message: error.message });
  }
};

const confirmPayment = async (response) => {
  try {
    const { body } = response;
    const statusResponse = await snap.transaction.notification(body);
    let orderId = statusResponse.order_id;
    let transactionStatus = statusResponse.transaction_status;
    let fraudStatus = statusResponse.fraud_status;

    // Sample transactionStatus handling logic

    if (transactionStatus == "capture") {
      // capture only applies to card transaction, which you need to check for the fraudStatus
      if (fraudStatus == "challenge") {
        // DO set transaction status on your databaase to 'challenge'
      } else if (fraudStatus == "accept") {
        const result = await db.query("UPDATE transactions set payment_status = 'PAID',ticket_status='active' WHERE id = $1 RETURNING *", [orderId]);
        console.log(result);
        const userId = result.rows[0].user_id;
        const update = await db.query("UPDATE users set loyalty_points = loyalty_points +10 where id = $1", [userId]);
        return {
          data: update.rows[0],
        };
      }
    } else if (transactionStatus == "settlement") {
      const result = await db.query("UPDATE transactions set payment_status = 'PAID',ticket_status='active' WHERE id = $1 RETURNING *", [orderId]);
      const userId = result.rows[0].user_id;
      const update = await db.query("UPDATE users set loyalty_points = loyalty_points +10 where id = $1", [userId]);
      return {
        data: update.rows[0],
      };
    } else if (transactionStatus == "deny") {
      // DO you can ignore 'deny', because most of the time it allows payment retries
      // and later can become success
    } else if (transactionStatus == "cancel" || transactionStatus == "expire") {
      // DO set transaction status on your databaase to 'failure'
    } else if (transactionStatus == "pending") {
      // DO set transaction status on your databaase to 'pending' / waiting payment
    }
  } catch (error) {
    const status = error.status || 500;
    throw new ErrorHandler({ status, message: error.message });
  }
};

module.exports = { postTransaction, getUserTicket, confirmPayment, getUserHistory, getAllHistory };
