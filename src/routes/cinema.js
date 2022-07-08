const { showMovieCinema, showCinemaSeat } = require("../controllers/cinemas");

const Router = require("express").Router();

Router.get("/", showMovieCinema);
Router.get("/seat", showCinemaSeat);

module.exports = Router;
