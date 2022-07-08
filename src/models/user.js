const {db} = require("../config/db");

const getUser = (payload) => {
    return new Promise((resolve, reject) => {
        const {id} = payload;
        const sqlQuery = "SELECT id, email, first_name, last_name, phone_number, loyalty_points, username, picture, created_at, updated_at, role_id FROM public.users where id = $1";
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

const updateUser = (body, payload, picture) => {
    return new Promise((resolve, reject) => {
        const {email, first_name, last_name, phone_number, username} = body;
        const {id} = payload;
        const updated_at = new Date();
        let sqlQuery = "UPDATE public.users set first_name = COALESCE ($1, first_name), last_name  = COALESCE ($2, last_name), username  = COALESCE ($3, username), email  = COALESCE ($4, email), phone_number = COALESCE ($5, phone_number), picture = coalesce ($6, picture), updated_at = $7 WHERE id = $8 returning id, email, first_name, last_name, phone_number, loyalty_points, username, picture, created_at, updated_at, role_id";
        db.query(sqlQuery, [first_name, last_name, username, email, phone_number, picture, updated_at, id])
        .then(({rows}) => {
            if(rows.length === 0){
                return reject({
                    error: "Id Not Found!",
                    status: 400
                });
            }
            const response = {
                message: "User Updated",
                data: rows
            };
            resolve(response);
        })
        .catch((error) => {
            reject({
                error,
                status: 500
            });
        });
        
    });
};

module.exports = {
    getUser,
    updateUser
};