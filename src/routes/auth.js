const express = require("express");
const Router = express.Router();
const authController = require("../controllers/auth");
const authValidation = require("../middlewares/authValidations");
const tokenValidation = require("../middlewares/tokenValidations");

//Register
Router.post("/new", authValidation.checkRegisterForm, authValidation.checkRegistedEmail, authController.register);

//Activate Account
Router.post("/activate/:token", tokenValidation.checkActivationToken, authController.activation);

//Resend activation email
Router.post("/resend", authValidation.checkResendForm, authValidation.checkActiveEmail, authController.resend);

// //Sign In
Router.post("/", authValidation.checkSigInForm, authController.signIn);

// //Sign Out
Router.delete("/signout",tokenValidation.checkToken, authController.signOut);

// Forgot Password
Router.post("/forgot", authValidation.checkForgotForm, authValidation.checkEmail, authController.forgotPassword);

// Reset Password
Router.patch("/reset/:token", authValidation.checkResetForm, tokenValidation.checkResetToken, authController.resetPassword);



module.exports = Router;
