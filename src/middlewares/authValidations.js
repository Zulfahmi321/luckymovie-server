const {errorResponse} = require("../helpers/response");
const {getEmail} = require("../models/auth");
const { body, validationResult } = require("express-validator");

const checkRegistedEmail = (req, res, next) => {
    getEmail(req.body.email)
    .then((result) => {
        if(result.rowCount !== 0){
            return errorResponse(res, 400, {msg: "Email is already registered"});
        }
        next();
    })
    .catch((error) => {
        const {status, err} = error;
        errorResponse(res, status, err);
    });
};

const register = [
    body("email")
        .isEmail()
        .withMessage("Email format must be youremail@email")
        .normalizeEmail(),
    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters")
        .matches(/\d/)
        .withMessage("Password must contain a number")
];

const checkRegisterForm = [
    register,
    (req, res, next) => {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return errorResponse(res, 400, {msg: error.array()})
      }
      next();
    },
];

const signIn = [
    body("email")
        .isEmail()
        .withMessage("Please enter a valid email address")
        .normalizeEmail(),
    body("password")
        .isLength({ min: 8 })
        .withMessage("Please enter a valid password")
];

const checkSigInForm = [
    signIn,
    (req, res, next) => {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return errorResponse(res, 400, {msg: error.array()})
      }
      next();
    },
];

const forgot = [
    body("email")
        .isEmail()
        .withMessage("Please enter a valid email address")
        .normalizeEmail()
];

const checkForgotForm = [
    forgot,
    (req, res, next) => {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return errorResponse(res, 400, {msg: error.array()})
      }
      next();
    },
];

const checkEmail = (req, res, next) => {
    getEmail(req.body.email)
    .then((result) => {
        if(result.rowCount === 0){
            return errorResponse(res, 400, {msg: "Email is not registered"});
        }
        req.id = result.rows[0].id
        next();
    })
    .catch((error) => {
        const {status, err} = error;
        errorResponse(res, status, err);
    });
};


const reset = [
    body("newPassword")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters")
        .matches(/\d/)
        .withMessage("Password must contain a number")
];

const checkResetForm = [
    reset,
    (req, res, next) => {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return errorResponse(res, 400, {msg: error.array()})
      }
      next();
    },
];
 
module.exports = {
    checkRegistedEmail, checkRegisterForm, checkSigInForm, checkForgotForm, checkEmail, checkResetForm
};
