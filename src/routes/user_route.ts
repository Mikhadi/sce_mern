/**
* @swagger
* tags:
*   name: User
*   description: The User API
*/

import express from 'express'
import auth from '../controllers/auth'
const router = express.Router()
import user from '../controllers/user'

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

router.get('/:id', auth.authenticateMiddleware ,user.getUser)

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

router.put('/', auth.authenticateMiddleware, user.updateUser)

export = router
