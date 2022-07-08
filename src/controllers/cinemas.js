const { getMovieCinema, getCinemaSeat } = require("../models/cinemas");

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

const showCinemaSeat = async (req, res) => {
  try {
    const { data } = await getCinemaSeat(req.query);
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

module.exports = { showMovieCinema, showCinemaSeat };
