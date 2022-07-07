const express = require("express");
const Router = express.Router();
const userController = require("../controllers/user");
// const userValidation = require("../middlewares/authValidations");
const tokenValidation = require("../middlewares/tokenValidations");
// const imageUpload = require("../middleware/fileUpload");
// const validate = require("../middleware/userValidation");

//Get Profile
Router.get("/", tokenValidation.checkToken, userController.getMyProfile);

//Update Profile

module.exports = Router;
