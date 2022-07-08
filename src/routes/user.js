const express = require("express");
const Router = express.Router();
const userController = require("../controllers/user");
const tokenValidation = require("../middlewares/tokenValidations");
const uploadFile = require("../middlewares/fileUpload");
const validate = require("../middlewares/userValidation");

//Get Profile
Router.get("/", tokenValidation.checkToken, userController.getMyProfile);

//Update Profile
Router.patch("/update/profile", tokenValidation.checkToken, uploadFile, validate.checkUpdateForm, userController.updateMyProfile);

//Update Password
Router.patch("/update/password", tokenValidation.checkToken, validate.checkUpdatePasswordForm, userController.updateMyPassword);

module.exports = Router;
