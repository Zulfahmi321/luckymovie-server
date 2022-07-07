const express = require("express");
const Router = express.Router();
const authController = require("../controllers/auth");
const authValidation = require("../middlewares/authValidations");
const tokenValidation = require("../middlewares/tokenValidations");
// const imageUpload = require("../middleware/fileUpload");
// const validate = require("../middleware/userValidation");

//Register
Router.post("/new", authValidation.checkRegisterForm, authValidation.checkRegistedEmail, authController.register);

// //Sign In
Router.post("/", authValidation.checkSigInForm, authController.signIn);

// //Sign Out
Router.delete("/signout",tokenValidation.checkToken, authController.signOut);

// Forgot Password
Router.post("/forgot", authValidation.checkForgotForm, authValidation.checkEmail, authController.forgotPassword);

// Reset Password
Router.patch("/reset/:token", authValidation.checkResetForm, tokenValidation.checkResetToken, authController.resetPassword);



module.exports = Router;
