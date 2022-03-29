const mongoose = require("mongoose");

const facebook = require("../util/facebook");
const { validateAllUserTokens } = require("../util/user");
const HttpError = require("../models/http-error");

const User = require("../models/user");

exports.getFacebookAccessToken = async (req, res, next) => {
  const code = req.body.code;
  let user;
  let tokenExpiresTime = new Date();
  let userIdResponse;
  let userTokenResponse;
  let facebookPageTokenResponse;
  let instagramIdResponse;
  let allTokensValids;
  try {
    user = await User.findById(req.user.userId);
    userTokenResponse = await facebook.getUserToken(code);
    userIdResponse = await facebook.getUserId(
      userTokenResponse.data.access_token
    );

    facebookPageTokenResponse = await facebook.getPageId(
      userTokenResponse.data.access_token,
      userIdResponse.data.data.user_id
    );
    instagramIdResponse = await facebook.getInstagramId(
      facebookPageTokenResponse.id,
      facebookPageTokenResponse.access_token
    );

    tokenExpiresTime.setSeconds(
      tokenExpiresTime.getSeconds() +
        userIdResponse.data.data.data_access_expires_at
    );
    allTokensValids = validateAllUserTokens([
      user.linkedInData.token,
      tokenExpiresTime,
    ]);

    const sess = await mongoose.startSession();
    sess.startTransaction();
    user.facebookData.token = userTokenResponse.data.access_token;
    user.facebookData.expiresIn = tokenExpiresTime;
    user.facebookData.id = userIdResponse.data.data.user_id;
    user.facebookData.pageId = facebookPageTokenResponse.id;
    user.facebookData.pageToken = facebookPageTokenResponse.access_token;
    user.facebookData.instagramId =
      instagramIdResponse.data.instagram_business_account.id;
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
    message: "Los permisos a Facebook e Instagram se otorgaron correctamente",
    tokenField: "facebookTokenExpirationDate",
    tokenExpirationDate: tokenExpiresTime,
    allTokensValids: allTokensValids,
  });
};
