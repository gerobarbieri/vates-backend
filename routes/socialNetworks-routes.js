const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

const socialNetworksControllers = require("../controllers/socialNetworks-controllers");
const fileUpload = require("../middleware/file-upload");
const { checkAuth } = require("../middleware/check-auth");

router.post(
  "/post",
  checkAuth,
  [check("text").notEmpty()],
  fileUpload.single("image"),
  socialNetworksControllers.uploadPost
);

module.exports = router;
