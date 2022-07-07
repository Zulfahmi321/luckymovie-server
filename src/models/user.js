const {db} = require("../config/db");

const getUser = (payload) => {
    return new Promise((resolve, reject) => {
        const {id} = payload;
        const sqlQuery = "SELECT id, email, first_name, last_name, phone_number, loyalty_points, created_at, updated_at, role_id FROM public.users where id = $1";
        db.query(sqlQuery, [id])
        .then((result) => {
            const data = result.rows[0];
            return resolve(data);
        })
        .catch((err) => {
            return reject({
                err,
                status: 500
            });
        });
    });
};


module.exports = {
    getUser
};