const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
require("dotenv").config({ path: __dirname + "/.env" });
const app = require("https-localhost")();

const usersRoutes = require("./routes/users-routes");
const socialNetworksRoutes = require("./routes/socialNetworks-routes");
const linkedInRoutes = require("./routes/linkedin-routes");
const facebookRoutes = require("./routes/facebook-routes");
const microsoftRoutes = require("./routes/microsoft-routes");

const HttpError = require("./models/http-error");

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  next();
});

app.use("/api", usersRoutes);
app.use("/api/social-networks", socialNetworksRoutes);
app.use("/api/social-networks/linkedin", linkedInRoutes);
app.use("/api/social-networks/facebook", facebookRoutes);
app.use("/api/social-networks/microsoft", microsoftRoutes);

app.use((req, res, next) => {
  throw new HttpError("No se pudo encontrar esa ruta.", 404);
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "Error interno!" });
});

mongoose
  .connect(
    process.env.MONGO_DB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then((response) => {
    app.listen(5000);
  })
  .catch((error) => {
    console.log(error);
  });
