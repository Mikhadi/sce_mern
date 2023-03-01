/**
* @swagger
* components:
*   securitySchemes:
*       bearerAuth:
*           type: http
*           scheme: bearer
*           bearerFormat: JWT
*/

/**
* @swagger
* tags:
*   name: Auth
*   description: The Authentication API
*/

import express from 'express'
const router = express.Router()
import auth from '../controllers/auth'

/**
* @swagger
* components:
*   schemas:
*       User:
*           type: object
*           required:
*               - email 
*               - password
*               - name
*               - username
*           parametrs:
*               - avatar_url
*           properties:
*               email:
*                   type: string
*                   description: The user email
*               password:
*                   type: string
*                   description: The user password
*               username:
*                   type: string
*                   description: The user username
*               name:
*                   type: string
*                   description: The user full name
*               avatar_url:
*                   type: string
*                   description: The url to user's avatar
*           example:
*               email: 'bob@gmail.com'
*               password: '123456'
*               username: 'bob'
*               name: 'Bob Bob'
*               avatar_url: 'localhost:3000/uploads/123.jpg'
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
*                       err:
*                           type: string
*                           description: error description
*/

router.post('/register', auth.register)

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
*                       username:
*                               type: string
*                               description: Username
*                       password:
*                               type: string
*                               description: User password
*                   example:
*                       username: 'user'
*                       password: '123456'
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
*                           id:
*                               type: string
*                               description: Connected user id
*                       example:
*                           accessToken: '123cd123x1xx1'
*                           refreshToken: '134r2134cr1x3c'
*                           id: '123456'
*           400:
*               description: Login failed
*               content:
*                   application/json:
*                       schema:
*                           err:
*                               type: string
*                               description: Error description
*                       example:
*                           err: 'Failed validating token'
*/

router.post('/login', auth.login)

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

router.get('/refresh', auth.refresh)

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
*           400:
*               description: Logout Failed
*/

router.get('/logout', auth.logout)

export = router
