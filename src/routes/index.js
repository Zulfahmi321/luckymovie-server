const Router = require("express").Router();
const authRouter = require("./auth");
const movieRouter = require("./movies");
const userRouter = require("./user");
const transactionRouter = require("./transaction");
const cinemaRouter = require("../routes/cinema");

Router.get("/", (_req, res) => {
  res.json({
    message: "This is Lucky Movie API",
  });
});

Router.use("/auth", authRouter);

Router.use("/user", userRouter);

Router.use("/movies", movieRouter);

Router.use("/cinema", cinemaRouter);

Router.use("/transaction", transactionRouter);

Router.get("*", (_req, res) => {
  res.status(404).json({
    message: "Api Not Found",
  });
});

module.exports = Router;
