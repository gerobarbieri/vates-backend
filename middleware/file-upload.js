const multer = require("multer");
const uuid = require("uuid/v1");

const MIME_TYPE_MAP = {
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};
const fileUpload = multer({
  limits: { fileSize: 5000000 },
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/images");
    },
    filename: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, uuid() + "." + ext);
    },
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid
      ? null
      : new Error("La extension de la foto debe ser JPG o JPEG");
    cb(error, isValid);
  },
});

module.exports = fileUpload;
