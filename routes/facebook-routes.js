const express = require("express");
const router = express.Router();

const facebookControllers = require("../controllers/facebook-controllers");
const { checkAuth } = require("../middleware/check-auth");

router.post("/auth", checkAuth, facebookControllers.getFacebookAccessToken);

module.exports = router;
