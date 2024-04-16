const userModel = require("../models/User.model");

const getAllUser = async (req, res, next) => {
    try {
        const response = await userModel.find();
        return res.status(200).json({
            "message": "Data getting successfully.",
            response
        })
    } catch (error) {
        next(error);
    }
}

module.exports = getAllUser;