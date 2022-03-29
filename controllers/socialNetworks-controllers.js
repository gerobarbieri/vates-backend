const mongoose = require("mongoose");
const axios = require("axios");
const linkedIn = require("../util/linkedin");
const facebook = require("../util/facebook");
const HttpError = require("../models/http-error");
const fs = require("fs");
const AWS = require("aws-sdk");
const User = require("../models/user");

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: process.env.S3_REGION,
});

const bucketUrl = process.env.S3_BUCKET_URL;

exports.uploadPost = async (req, res, next) => {
  const { text } = req.body;
  let asset;
  let photoId;
  let imageForLinkedin = fs.readFileSync(req.file.path);
  let imageForFacebook = fs.createReadStream(req.file.path);
  let user;
  let url = bucketUrl + req.file.path;

  try {
    user = await User.findById(req.user.userId);
    await s3
      .upload({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: req.file.path,
        Body: imageForLinkedin,
        ACL: "public-read",
        ContentType: req.file.mimetype,
      })
      .promise();

    const instagramResponse = await facebook.instagramPhotoUpload(
      url,
      user.facebookData.pageToken,
      user.facebookData.instagramId,
      text
    );

    const assetRegisterResponse = await linkedIn.assetRegister(
      user.linkedInData.token,
      user.linkedInData.id
    );

    url =
      assetRegisterResponse.data.value.uploadMechanism[
        "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
      ].uploadUrl;
    asset = assetRegisterResponse.data.value.asset;

    await linkedIn.assetUpload(
      url,
      imageForLinkedin,
      user.linkedInData.token,
      req.file
    );

    const photoUploadResponse = await facebook.photoUpload(
      imageForFacebook,
      user.facebookData.pageToken
    );
    photoId = photoUploadResponse.data.id;

    await facebook.uploadPost(user.facebookData.pageToken, text, photoId);

    await linkedIn.uploadPost(
      user.linkedInData.token,
      user.linkedInData.id,
      text,
      asset
    );
    await facebook.uploadInstagramPost(
      user.facebookData.instagramId,
      user.facebookData.pageToken,
      instagramResponse.data.id
    );
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  } catch (error) {
    if (error.response) {
      return next(
        new HttpError(
          "No se pudo realizar el posteo, intentelo de nuevo mas tarde.",
          error.response.data.status
        )
      );
    }
    return next(
      new HttpError(
        "Hubo un error inesperado. Intentelo de nuevo mas tarde.",
        500
      )
    );
  }

  return res
    .status(200)
    .json({ message: "El posteo se realizo correctamente." });
};
