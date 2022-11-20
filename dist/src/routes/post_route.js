"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const post_1 = __importDefault(require("../controllers/post"));
const auth_1 = __importDefault(require("../controllers/auth"));
//All posts page route
router.get('/', auth_1.default.authenticateMiddleware, post_1.default.getAllPosts);
//Post by id
router.get('/:id', post_1.default.getPostById);
//New post page route
router.post('/', post_1.default.addNewPost);
//Update post route
router.put('/:id', post_1.default.updatePost);
module.exports = router;
//# sourceMappingURL=post_route.js.map