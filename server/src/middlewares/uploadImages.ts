import multer from "multer";
import path from "path";
import { v4 as uuid } from "uuid";

var storage = multer.diskStorage({
  destination: 'uploads/avatars',
  filename: function (req, file, cb) {
    cb(null,  uuid() + path.extname(file.originalname));
  },
});

export var uploadsAvatars = multer({ storage: storage });
