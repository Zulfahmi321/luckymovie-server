const { db } = require('../config/db')
const {ErrorHandler} = require('../middlewares/errorHandler')

const postTransaction = async (body, userId) => {
    const { total_payment, payment_method, ticket_qty, cinema_id, movie_id, seats } = body
    try {
        let orderQuery = 'INSERT INTO transaction(user_id,payment_method) values($1.$2) returning id'
        const order = await db.query(orderQuery, [userId, payment_method])
        const orderId = order.rows[0].id
        const ticketQuery = 'INSERT INTO transactions_tickets(transaction_id,movie_id,cinema_id,quantity,total_payment) values($1,$2,$3,$4,$5) returning id'
        const ticket = await db.query(ticketQuery, [orderId, movie_id, cinema_id, ticket_qty, total_payment])
        const ticketId = ticket.rows[0].id
        const seatQuery = 'INSERT INTO seat_reserved(seat,ticket_id,cinema_id) values($1,$2,$3) returning *'
        const result = await db.query(seatQuery,[seats,ticketId,cinema_id])
        return {
            data:result.rows[0]
        }

    } catch (error) {
        const status = error.status || 500
        throw new ErrorHandler({status,message:error.message})
    }
}

module.exports = {postTransaction}