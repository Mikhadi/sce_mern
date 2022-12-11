/**
* @swagger
* tags:
*   name: Post
*   description: The Post API
*/

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


import express from 'express'
const router = express.Router()
import post from '../controllers/post'
import auth from '../controllers/auth'

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
router.get('/', auth.authenticateMiddleware, post.getAllPosts)

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
router.get('/:id', post.getPostById)

//New post page route
router.post('/', post.addNewPost)

//Update post route
router.put('/:id', post.updatePost)

export = router
