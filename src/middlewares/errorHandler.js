class ErrorHandler extends Error {
  constructor(data) {
    super(data);
    this.message = data.message;
    this.status = data.status;
  }
}

const errorHandling = (err, _req, res, _next) => {
  if (err) {
    const status = err.status ? err.status : 500;
    res.status(status).json({
      error: err.message,
    });
  }
};

module.exports = { ErrorHandler, errorHandling };
