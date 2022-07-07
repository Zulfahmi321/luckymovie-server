const { getUser } = require("../models/user");
const {errorResponse, successResponse, searchResponse} = require("../helpers/response");

const getMyProfile = (req, res) => {
    getUser(req.userPayload)
    .then((result) => {
        successResponse(res, 202, result, null);
    })
    .catch(({err, status}) => {
        errorResponse(res, status, err);
    });
};

module.exports = {
    getMyProfile
};