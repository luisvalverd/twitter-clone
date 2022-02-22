import multer from "multer";
import path from "path";
import { v4 as uuid } from "uuid";

var storageAvatars = multer.diskStorage({
  destination: "uploads/avatars",
  filename: function (req, file, cb) {
    cb(null, uuid() + path.extname(file.originalname));
  },
});

var storagePhotos = multer.diskStorage({
  destination: "uploads/photos",
  filename: function (req, file, cb) {
    cb(null, uuid() + path.extname(file.originalname));
  },
});

var storageBackGrounds = multer.diskStorage({
  destination: "uploads/backgrounds",
  filename: function (req, file, cb) {
    cb(null, uuid() + path.extname(file.originalname));
  },
});

export var uploadsAvatars = multer({ storage: storageAvatars });
export var uploadsPhotos = multer({ storage: storagePhotos });
export var uploadsBackGrounds = multer({ storage: storageBackGrounds });
