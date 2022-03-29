const express = require("express");
const router = express.Router();

const microsoftControllers = require("../controllers/microsoft-controllers");

router.post("/auth", microsoftControllers.auth);

module.exports = router;
