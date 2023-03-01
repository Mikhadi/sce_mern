"use strict";
/**
* @swagger
* tags:
*   name: User
*   description: The User API
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../controllers/auth"));
const router = express_1.default.Router();
const user_1 = __importDefault(require("../controllers/user"));
/**
* @swagger
* /user:
*   get:
*       summary: Get user
*       tags: [User]
*       security:
*           - bearerAuth: []
*       parameters:
*         - in: query
*           name: id
*           schema:
*               type: string
*               description: Get user by id
*       responses:
*           200:
*               description: User
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/User'
*           400:
*               description: Error
*               content:
*                   application/json:
*                       err:
*                           type: string
*                           description: error description
*/
router.get('/:id', auth_1.default.authenticateMiddleware, user_1.default.getUser);
/**
* @swagger
* /user:
*   put:
*       summary: Edit user
*       tags: [User]
*       security:
*           - bearerAuth: []
*       requestBody:
*           required: true
*           content:
*               application/json:
*                   schema:
*                       $ref: '#/components/schemas/User'
*       responses:
*           200:
*               description: Success
*           400:
*               description: Error
*               content:
*                   application/json:
*                       err:
*                           type: string
*                           description: error description
*/
router.put('/', auth_1.default.authenticateMiddleware, user_1.default.updateUser);
module.exports = router;
//# sourceMappingURL=user_route.js.map