const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");
exports.checkAuth = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new Error("Error al iniciar sesion.");
    }
    const decodedToken = jwt.verify(token, "supersecret_no_compartir");
    req.user = {
      userId: decodedToken.userId,
    };
    next();
  } catch (err) {
    return next(new HttpError("Error al iniciar sesion.", 403));
  }
};
