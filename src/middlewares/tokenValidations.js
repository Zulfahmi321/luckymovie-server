const {errorResponse} = require("../helpers/response");
const jwt = require("jsonwebtoken");
const { client } = require("../config/redis");

const checkResetToken = (req, res, next) => {
    const bearerToken = req.header("x-access-token");
    const token = bearerToken.split(" ")[1];
    
    if(!bearerToken){
        return errorResponse(res, 401, {msg: "Sign in needed"});
    }
    //Token Verification
    jwt.verify(token, process.env.JWT_KEY, {issuer: process.env.JWT_ISSUER}, (err, payload) => {
        if(err && err.name === "TokenExpiredError"){
            return errorResponse(res, 401, {msg: "The link has expired. Please make a new request."});
        }
        if(err){
            return errorResponse(res, 401, {msg: "Access denied"});
        }
        req.userPayload = payload;
        
        next();
    });
}; 

const checkToken = (req, res, next) => {
    const bearerToken = req.header("x-access-token");
    const token = bearerToken.split(" ")[1];
    
    if(!bearerToken){
        return errorResponse(res, 401, {msg: "Sign in needed"});
    }
    //Token Verification
    jwt.verify(token, process.env.JWT_KEY, {issuer: process.env.JWT_ISSUER}, async(err, payload) => {
        if(err && err.name === "TokenExpiredError"){
            return errorResponse(res, 401, {msg: "Please sign in again"});
        }
        if(err){
            return errorResponse(res, 401, {msg: "Access denied"});
        }
        try {
            const cachedToken = await client.get(`jwt${payload.id}`)
            if(!cachedToken){
                return errorResponse(res, 401, {msg: "Sign in needed"});
            }
            if(cachedToken !== token){
                return errorResponse(res, 401, {msg: "Access denied"});
            }
        } catch (error) {
            console.log('error', error.message)
        }
        req.userPayload = payload;
        
        next();
    });
};

module.exports = {
    checkResetToken, checkToken
};