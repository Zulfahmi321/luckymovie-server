const {errorResponse} = require("../helpers/response");
const {getEmail} = require("../models/auth");
const { body, validationResult } = require("express-validator");


const updateForm = [
    body("email")
        .optional({ checkFalsy: true })
        .isEmail()
        .withMessage("Email format must be youremail@email")
        .normalizeEmail(),
    body("phone_number")
        .optional({ checkFalsy: true })
        .isLength({ min: 10 })
        .withMessage("Please input a valid phone number")
        .isNumeric()
        .withMessage("Phone number must be a number"),
    body("username")
        .optional({ checkFalsy: true })
        .isLength({ max: 15 })
        .withMessage("Username cannot be more than 15 characters"),
    body("first_name")
        .optional({ checkFalsy: true })
        .matches(/^[A-Za-z\s]+$/)
        .withMessage('Name must be alphabetic.'),
    body("last_name")
        .optional({ checkFalsy: true })
        .matches(/^[A-Za-z\s]+$/)
        .withMessage('Name must be alphabetic.'),
];

const checkUpdateForm = [
    updateForm,
    (req, res, next) => {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return errorResponse(res, 400, {msg: error.array()})
      }
      next();
    },
];

const updatePasswordForm = [
    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters")
        .matches(/\d/)
        .withMessage("Password must contain a number")
];

const checkUpdatePasswordForm = [
    updatePasswordForm,
    (req, res, next) => {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return errorResponse(res, 400, {msg: error.array()})
      }
      next();
    },
];
module.exports = {
    checkUpdateForm,
    checkUpdatePasswordForm
};
