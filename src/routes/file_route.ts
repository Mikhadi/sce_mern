import express from 'express'
const router = express.Router()

import multer from "multer";

const base = "http://192.168.43.164:3000/";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + ".jpg"); //Appending .jpg
  },
});
const upload = multer({ storage: storage });

router.post("/", upload.single("file"), function (req, res) {
  res.status(200).send({ url: base + req.file.path });
});

export = router
