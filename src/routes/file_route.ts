/**
* @swagger
* tags:
*   name: File
*   description: File upload
*/

import express from 'express'
const router = express.Router()

import multer from "multer";

const base = process.env.BASE_URL
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + ".jpg");
  },
});
const upload = multer({ storage: storage });

/**
* @swagger
* /file:
*   get:
*       summary: Upload file
*       tags: [File]
*       requestBody:
*           required: true
*           content:
*               file:
*                 type: Object
*                 description: Image file
*       responses:
*           200:
*               description: File Url
*               content:
*                   Url:
*                     type: string
*                     description : Url to file on server
*           400:
*               description: Error
*               content:
*                   application/json:
*                       err:
*                           type: string
*                           description: error description
*/

router.post("/", upload.single("file"), function (req, res) {
  res.status(200).send({ url: base + req.file.path });
});

export = router
