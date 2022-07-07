const { postMovie, getMovieNow, getMovieUpcoming, getMovieDetail, getMovieCinema } = require("../models/movies");

const createMovie = async (req, res) => {
  try {
    const { file } = req;
    let image = "";

    if (file) {
      image = file.path;
    }

    const { data, message } = await postMovie(req.body, image);
    res.status(200).json({
      data,
      message,
    });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      error: error.message,
    });
  }
};
const showMovieNow = async (_req, res) => {
  try {
    const { data } = await getMovieNow();
    res.status(200).json({
      data,
    });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      error: error.message,
    });
  }
};
const showMovieUpcoming = async (req, res) => {
  try {
    const { data } = await getMovieUpcoming(req.query);
    res.status(200).json({
      data,
    });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      error: error.message,
    });
  }
};
const showMovieDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = await getMovieDetail(id);
    res.status(200).json({
      data,
    });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      error: error.message,
    });
  }
};
const showMovieCinema = async (req, res) => {
  try {
    const { data } = await getMovieCinema(req.query);
    res.status(200).json({
      data,
    });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      error: error.message,
    });
  }
};

module.exports = { createMovie, showMovieNow, showMovieUpcoming, showMovieDetail, showMovieCinema };
