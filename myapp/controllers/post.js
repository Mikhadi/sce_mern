const getAllPosts = async(req, res, next) => {
    res.send('Get all posts')
}

const addNewPost = async(req, res, next) => {
    res.send('Add new post')
}

module.exports = {getAllPosts, addNewPost}
