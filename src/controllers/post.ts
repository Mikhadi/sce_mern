import Post from '../models/post_models'
import { Request, Response } from 'express'

const getAllPostsEvent = async () => {
    console.log("")
    try{
        const posts = await Post.find()
        return {status : "OK", data: posts}
    }
    catch(err){
        return {status : "FAIL", data: ""}
    }
}

const getAllPosts = async(req: Request, res: Response) => {
    try{
        let posts = {}
        if (req.query.sender == null){
            posts = await Post.find()
        }else{
            posts = await Post.find({'sender': req.query.sender})
        }
        res.status(200).send(posts)
    }
    catch(err){
        res.status(400).send({'error':"failed to get posts from db"})
    }
}

const getPostById = async(req: Request, res: Response) => {
    try{
        const posts = await Post.findById(req.params.id)
        res.status(200).send(posts)
    }
    catch(err){
        res.status(400).send({'error':"failed to get posts from db"})
    }
}

const addNewPost = async(req: Request, res: Response) => {
    const post = new Post({
        message: req.body.message,
        sender: req.body.sender
    })
    
    try{
        const newPost = await post.save()
        console.log('Saved post in DB')
        res.status(200).send(newPost)
    }
    catch{
        console.log('Failed to save post in DB')
        res.status(400).send({'error': "error occured"})
    }    
}

const updatePost = async(req: Request, res: Response) => {
    try{
        const filter = { _id: req.params.id };
        const update = { message: req.body.message };

        const post = await Post.findOneAndUpdate(filter, update, {new: true});
        res.status(200).send(post)
    }
    catch(err){
        res.status(400).send({'error':"failed to update post in db"})
    }
}

export = {getAllPosts, addNewPost, getPostById, updatePost, getAllPostsEvent}
