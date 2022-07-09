const {db} = require("../config/db");

const registerNewUSer = (email, password) => {
    return new Promise ((resolve, reject) => {
        const created_at = new Date();
        const updated_at = new Date();
        const sqlQuery = "INSERT INTO public.users (email, password, created_at, updated_at) VALUES($1, $2, $3, $4) returning id;";
        const values = [email, password, created_at, updated_at];
        db.query(sqlQuery, values)
        .then(({rows}) => {
            const response ={
                id: rows[0].id,
                message: "Account Created"
            };
            resolve(response);
        })
        .catch((error) => {
            reject({
                status: 500,
                error
            });
        });
    });
};

const activateAccount = (id) => {
    return new Promise((resolve, reject) => {
        const activated_at = new Date();
        let sqlQuery = "UPDATE public.users set activated_at = $1 WHERE id = $2 returning id, email, created_at, updated_at, activated_at";
        db.query(sqlQuery, [activated_at, id])
        .then(({rows}) => {
            if(rows.length === 0){
                return reject({
                    error: "Id Not Found!",
                    status: 400
                });
            }
            const response = {
                message: "Account activated",
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

const getEmail = (email) => {
    return new Promise((resolve, reject) => {
        const sqlQuery = "SELECT email, id, activated_at from public.users where email = $1";
        db.query(sqlQuery, [email])
        .then((result) => {
            resolve(result);
        })
        .catch((err) => {
            reject({status:500, err});
        });
    });
    
};

const getPassword = (email) => {
    return new Promise ((resolve, reject) => {
        const sqlQuery = "select password, id, role_id, activated_at from public.users where email = $1";
        db.query(sqlQuery, [email])
        .then((result) => {
            if(result.rowCount === 0){
                return reject({status: 400, err: {msg: "Email or password is incorrect"}});
            }
            return resolve(result.rows[0]);
        })
        .catch((err) => {
            reject({status: 500, err});
        });
    });
};

const updatePassword = (id, password) => {
    return new Promise ((resolve, reject) => {
        const updated_at = new Date();
        const sqlQuery = "UPDATE public.users SET password=$1, updated_at=$2 WHERE id=$3"
        const values = [ password, updated_at, id];
        db.query(sqlQuery, values)
        .then(() => {
            const response ={
                message: "Password has been updated"
            };
            resolve(response);
        })
        .catch((error) => {
            reject({
                status: 500,
                error
            });
        });
    });
}

module.exports = {
    registerNewUSer,
    getEmail,
    getPassword,
    updatePassword,
    activateAccount
};
