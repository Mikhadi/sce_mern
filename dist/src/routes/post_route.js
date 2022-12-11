"use strict";
/**
* @swagger
* tags:
*   name: Post
*   description: The Post API
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
/**
* @swagger
* components:
*   schemas:
*       Post:
*           type: object
*           required:
*               - message
*               - sender
*           properties:
*               message:
*                   type: string
*                   description: The post text
*               sender:
*                   type: string
*                   description: The sender name
*           example:
*               message: 'This is new post'
*               sender: '12345'
*/
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const post_1 = __importDefault(require("../controllers/post"));
const auth_1 = __importDefault(require("../controllers/auth"));
/**
* @swagger
* /post:
*   get:
*       summary: Get post by id
*       tags: [Post]
*       security:
*           - bearerAuth: []
*       parameters:
*         - in: query
*           name: sender
*           schema:
*               type: string
*               description: Filter posts by sender
*       responses:
*           200:
*               description: Requested post
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/Post'
*/
//All posts page route
router.get('/', auth_1.default.authenticateMiddleware, post_1.default.getAllPosts);
/**
* @swagger
* /post/{id}:
*   get:
*       summary: Get post by id
*       tags: [Post]
*       security:
*           - bearerAuth: []
*       parameters:
*         - in: path
*           name: id
*           required: true
*           schema:
*               type: string
*               description: Filter posts by sender
*       responses:
*           200:
*               description: The new user
*               content:
*                   application/json:
*                       schema:
*                           type: array
*                           items:
*                               $ref: '#/components/schemas/Post'
*/
//Post by id
router.get('/:id', post_1.default.getPostById);
//New post page route
router.post('/', post_1.default.addNewPost);
//Update post route
router.put('/:id', post_1.default.updatePost);
module.exports = router;
//# sourceMappingURL=post_route.js.map