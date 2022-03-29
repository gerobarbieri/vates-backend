const express = require("express");

const usersControllers = require("../controllers/users-controllers");
const router = express.Router();
const { checkAuth } = require("../middleware/check-auth");

router.get("/user/profile", checkAuth, usersControllers.getProfile);

module.exports = router;
