const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const User = require("../models/user");

exports.getProfile = async (req, res, next) => {
  let user;
  try {
    user = await User.findById(req.user.userId);
  } catch (err) {
    console.log(err);
    return next(
      new HttpError("Fetching users failed,please try again later", 500)
    );
  }
  res.status(200).json({ user: user.toObject({ getters: true }) });
};
