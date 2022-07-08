const { getUser, updateUser } = require("../models/user");
const { updatePassword } = require("../models/auth");
const {errorResponse, successResponse, searchResponse} = require("../helpers/response");
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);

const getMyProfile = (req, res) => {
    getUser(req.userPayload)
    .then((result) => {
        successResponse(res, 202, result, null);
    })
    .catch(({err, status}) => {
        errorResponse(res, status, err);
    });
};

const updateMyProfile = (req, res) => {
    const {file = null} = req;
    let picture;
    if(file){
        picture = req.file;
    }
    updateUser(req.body, req.userPayload, picture)
    .then(({data, message}) => {
        successResponse(res, 200, {msg: message, data})
    })
    .catch(({error, status}) => {
        errorResponse(res, status, error)
    });
};

const updateMyPassword = (req, res) => {
    const {password} = req.body
    const {id, email} = req.userPayload
    updatePassword(id, password)
    .then(async({message}) =>{

        const transporter = nodemailer.createTransport({
            service : process.env.SERVICE,
            auth : {
                type: "OAuth2",
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
                clientId: process.env.OAUTH_CLIENTID,
                clientSecret: process.env.OAUTH_CLIENT_SECRET,
                refreshToken: process.env.OAUTH_REFRESH_TOKEN,
            }   
        })

        let html = await readFile('./src/controllers/templates/update.html', 'utf8');
        let template = handlebars.compile(html);
        let htmlToSend = template();

        await transporter.sendMail({
            from : process.env.USER,
            to : email,
            subject : `Lucky Movie - Successfully Update Password`,
            html: htmlToSend
        })

        successResponse(res, 200, {msg: message})
    })
    .catch(({status, error}) => {
        errorResponse(res, status, error)
    })
};
module.exports = {
    getMyProfile, updateMyProfile, updateMyPassword
};