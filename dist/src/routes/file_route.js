"use strict";
/**
* @swagger
* tags:
*   name: File
*   description: File upload
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const multer_1 = __importDefault(require("multer"));
const base = process.env.BASE_URL;
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + ".jpg");
    },
});
const upload = (0, multer_1.default)({ storage: storage });
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
module.exports = router;
//# sourceMappingURL=file_route.js.map