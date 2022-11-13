const Post = require('../models/post_models')

const getAllPosts = async(req, res, next) => {
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

const getPostById = async(req, res, next) => {
    try{
        const posts = await Post.findById(req.params.id)
        res.status(200).send(posts)
    }
    catch(err){
        res.status(400).send({'error':"failed to get posts from db"})
    }
}

const addNewPost = async(req, res, next) => {
    const post = new Post({
        message: req.body.message,
        sender: req.body.sender
    })
    
    try{
        newPost = await post.save()
        console.log('Saved post in DB')
        res.status(200).send(newPost)
    }
    catch{
        console.log('Failed to save post in DB')
        res.status(400).send({'error': "error occured"})
    }    
}

const updatePost = async(req, res, next) => {
    try{
        const filter = { _id: req.params.id };
        const update = { message: req.body.message };

        let post = await Post.findOneAndUpdate(filter, update, {new: true});
        res.status(200).send(post)
    }
    catch(err){
        res.status(400).send({'error':"failed to get posts from db"})
    }
}

module.exports = {getAllPosts, addNewPost, getPostById, updatePost}
