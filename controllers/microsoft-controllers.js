const mongoose = require("mongoose");

const microsoft = require("../util/microsoft");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const User = require("../models/user");
const { validateAllUserTokens } = require("../util/user");

exports.auth = async (req, res, next) => {
  const code = req.body.code;
  let user;
  let token;
  let allTokensValids;
  try {
    const tokenResponse = await microsoft.getUserToken(code);
    const userData = await microsoft.getUserData(
      tokenResponse.data.access_token
    );
    user = await User.findOne({
      email: userData.data.userPrincipalName,
    });

    if (!user) {
      user = new User({
        email: userData.data.userPrincipalName,
        firstName: userData.data.givenName,
        lastName: userData.data.surname,
        linkedInData: {},
        facebookData: {},
      });

      const sess = await mongoose.startSession();
      sess.startTransaction();
      await user.save({ session: sess });
      await sess.commitTransaction();
    }
    token = jwt.sign({ userId: user.id }, "supersecret_no_compartir", {
      expiresIn: "1h",
    });
    allTokensValids = validateAllUserTokens([
      user.linkedInData.expiresIn,
      user.facebookData.expiresIn,
    ]);
  } catch (err) {
    return next(
      new HttpError(
        "Hubo un error inesperado. Intentelo de nuevo mas tarde.",
        500
      )
    );
  }
  return res.status(201).json({
    userId: user.id,
    userSocialNetworksTokens: {
      linkedInTokenExpirationDate: user.linkedInData.expiresIn,
      facebookTokenExpirationDate: user.facebookData.expiresIn,
      allTokensValids: allTokensValids,
    },
    token: token,
  });
};
