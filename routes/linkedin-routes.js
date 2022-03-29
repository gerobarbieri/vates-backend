const express = require("express");
const router = express.Router();

const { checkAuth } = require("../middleware/check-auth");
const linkedInControllers = require("../controllers/linkedin-controllers");

router.post("/auth", checkAuth, linkedInControllers.getLinkedInAccessToken);

module.exports = router;
