const Router = require("express").Router();
const { createMovie, showMovieNow, showMovieUpcoming, showMovieDetail } = require("../controllers/movies");
const uploadFile = require("../middlewares/fileUpload");
const { checkToken } = require("../middlewares/tokenValidations");

Router.post("/", checkToken, uploadFile, createMovie);
Router.get("/", showMovieNow);
Router.get("/upcoming", showMovieUpcoming);
Router.get("/:id", showMovieDetail);

module.exports = Router;
