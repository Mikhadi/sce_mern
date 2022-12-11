import { Server, Socket } from 'socket.io'
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import postController from '../controllers/post'

export = (io:any, socket:any) => {
    const getAllPosts = async () => {
        const res = await postController.getAllPostsEvent()
        socket.emit('post:get_all', res)
    }

    const getPostById = (payload) => {
        const res = postController.getAllPostsEvent()
        socket.emit('echo:echo', res)
    }

    const addNewPost = (payload) => {
        socket.emit('echo:echo', payload)
    }

    socket.on("post:get_all", getAllPosts);
    socket.on("post:get_by_id", getPostById);
    socket.on("post:add_new", addNewPost);
    }