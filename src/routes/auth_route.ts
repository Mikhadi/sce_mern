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
*/

router.get('/logout', auth.logout)

export = router
