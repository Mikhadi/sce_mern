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
*               - image
*               - sender
*           properties:
*               message:
*                   type: string
*                   description: The post text
*               sender:
*                   type: string
*                   description: The sender name
*               image:
*                   type: string
*                   description: Image url
*           example:
*               message: 'This is new post'
*               sender: '12345'
*               image: 'localhost:3000/uploads/image.jpg'
*/


import express from 'express'
const router = express.Router()
import post from '../controllers/post'
import auth from '../controllers/auth'
import NewRequest from '../common/Request'
import { Request, Response } from 'express'

/**
* @swagger
* /post:
*   get:
*       summary: Get posts by sender
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
router.get('/', auth.authenticateMiddleware, async (req: Request, res: Response) => {
    try{
        const response = await post.getAllPosts(NewRequest.fromRestRequest(req))
        response.sendRestResponse(res)
    } catch (err){
        res.status(400).send({
            'status': 'Fail',
            'message': err.message
        })
    }
})

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
router.get('/:id', auth.authenticateMiddleware, async(req:Request, res:Response) => {
    try{
        const response = await post.getPostById(NewRequest.fromRestRequest(req))
        response.sendRestResponse(res)
    } catch (err){
        res.status(400).send({
            'status': 'Fail',
            'message': err.message
        })
    }
})

/**
* @swagger
* /post/delete/:
*   get:
*       summary: Delete post by id
*       tags: [Post]
*       security:
*           - bearerAuth: []
*       parameters:
*         - in: path
*           name: id
*           required: true
*           schema:
*               type: string
*               description: DElete posts by id
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


//Delete post by id
router.post('/delete', auth.authenticateMiddleware, async(req:Request, res:Response) => {
    try{
        const response = await post.deletePostById(NewRequest.fromRestRequest(req))
        response.sendRestResponse(res)
    } catch (err){
        res.status(400).send({
            'status': 'Fail',
            'message': err.message
        })
    }
})

/**
* @swagger
* /post:
*   post:
*       summary: Add post
*       tags: [Post]
*       security:
*           - bearerAuth: []
*       requestBody:
*           required: true
*           content:
*               application/json:
*                   schema:
*                       $ref: '#/components/schemas/Post'
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

//New post page route
router.post('/', auth.authenticateMiddleware, async (req: Request, res: Response) => {
    try{
        const response = await post.addNewPost(NewRequest.fromRestRequest(req))
        response.sendRestResponse(res)
    } catch (err){
        res.status(400).send({
            'status': 'Fail',
            'message': err.message
        })
    }
})

/**
* @swagger
* /post:
*   put:
*       summary: Edit post
*       tags: [Post]
*       security:
*           - bearerAuth: []
*       requestBody:
*           required: true
*           content:
*               application/json:
*                   schema:
*                       $ref: '#/components/schemas/Post'
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

//Update post route
router.put('/:id', auth.authenticateMiddleware, async (req: Request, res: Response) => {
    try{
        const response = await post.updatePost(NewRequest.fromRestRequest(req))
        response.sendRestResponse(res)
    } catch (err){
        res.status(400).send({
            'status': 'Fail',
            'message': err.message
        })
    }
})

export = router
