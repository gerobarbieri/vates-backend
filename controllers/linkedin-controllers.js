const mongoose = require("mongoose");

const linkedIn = require("../util/linkedin");
const { validateAllUserTokens } = require("../util/user");
const HttpError = require("../models/http-error");

const User = require("../models/user");

exports.getLinkedInAccessToken = async (req, res, next) => {
  const code = req.body.code;
  let user;
  let tokenExpiresTime = new Date();
  let userIdResponse;
  let tokenResponse;
  let allTokensValids;
  try {
    user = await User.findById(req.user.userId);
    tokenResponse = await linkedIn.getToken(code);
    userIdResponse = await linkedIn.getUserId(tokenResponse.data.access_token);
    tokenExpiresTime.setSeconds(
      tokenExpiresTime.getSeconds() + tokenResponse.data.expires_in
    );
    allTokensValids = validateAllUserTokens([
      tokenExpiresTime,
      user.facebookData.token,
    ]);

    const sess = await mongoose.startSession();
    sess.startTransaction();
    user.linkedInData.token = tokenResponse.data.access_token;
    user.linkedInData.expiresIn = tokenExpiresTime;
    user.linkedInData.id = userIdResponse.data.id;
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    return next(
      new HttpError(
        "Hubo un error inesperado. Intentelo de nuevo mas tarde.",
        500
      )
    );
  }
  return res.status(200).json({
    message: "Los permisos a LinkedIn se otorgaron correctamente",
    tokenField: "linkedInTokenExpirationDate",
    tokenExpirationDate: tokenExpiresTime,
    allTokensValids: allTokensValids,
  });
};
