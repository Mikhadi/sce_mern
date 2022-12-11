"use strict";
/**
* @swagger
* components:
*   securitySchemes:
*       bearerAuth:
*           type: http
*           scheme: bearer
*           bearerFormat: JWT
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
/**
* @swagger
* tags:
*   name: Auth
*   description: The Authentication API
*/
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_1 = __importDefault(require("../controllers/auth"));
/**
* @swagger
* components:
*   schemas:
*       User:
*           type: object
*           required:
*               - email
*               - password
*           properties:
*               email:
*                   type: string
*                   description: The user email
*               password:
*                   type: string
*                   description: The user password
*           example:
*               email: 'bob@gmail.com'
*               password: '123456'
*/
/**
* @swagger
* /auth/register:
*   post:
*       summary: Registers a new user
*       tags: [Auth]
*       requestBody:
*           required: true
*           content:
*               application/json:
*                   schema:
*                       $ref: '#/components/schemas/User'
*       responses:
*           200:
*               description: The new user
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/User'
*           400:
*               description: Registration error
*               content:
*                   application/json:
*                       schema:
*                           err:
*                               type: string
*                               description: error description
*/
router.post('/register', auth_1.default.register);
/**
* @swagger
* /auth/login:
*   post:
*       summary: Login
*       tags: [Auth]
*       requestBody:
*           required: true
*           content:
*               application/json:
*                   schema:
*                       $ref: '#/components/schemas/User'
*       responses:
*           200:
*               description: Login success
*               content:
*                   application/json:
*                       schema:
*                           accessToken:
*                               type: string
*                               description: The JWT access token
*                           refreshToken:
*                               type: string
*                               description: The JWT refresh token
*                       example:
*                           accessToken: '123cd123x1xx1'
*                           refreshToken: '134r2134cr1x3c'
*/
router.post('/login', auth_1.default.login);
/**
* @swagger
* /auth/refresh:
*   get:
*       summary: Refresh access token
*       tags: [Auth]
*       security:
*           - bearerAuth: []
*       responses:
*           200:
*               description: Refresh token success
*               content:
*                   application/json:
*                       schema:
*                           accessToken:
*                               type: string
*                               description: The JWT access token
*                           refreshToken:
*                               type: string
*                               description: The JWT refresh token
*                       example:
*                           accessToken: '123cd123x1xx1'
*                           refreshToken: '134r2134cr1x3c'
*/
router.get('/refresh', auth_1.default.refresh);
/**
* @swagger
* /auth/logout:
*   get:
*       summary: Logout
*       tags: [Auth]
*       security:
*           - bearerAuth: []
*       responses:
*           200:
*               description: Logout and invalidate access token
*/
router.get('/logout', auth_1.default.logout);
module.exports = router;
//# sourceMappingURL=auth_route.js.map