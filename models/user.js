const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  linkedInData: {
    token: { type: String },
    expiresIn: { type: Date },
    id: { type: String },
  },
  facebookData: {
    token: { type: String },
    expiresIn: { type: Date },
    id: { type: String },
    pageId: { type: String },
    pageToken: { type: String },
    instagramId: { type: String },
  },
});

module.exports = mongoose.model("User", userSchema);
