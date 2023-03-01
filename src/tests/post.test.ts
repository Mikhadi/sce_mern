import request from 'supertest'
import app from '../server'
import mongoose from 'mongoose'
import Post from '../models/post_models'
import User from '../models/user_model'
import { notify } from '../routes/post_route'

const newPostMessage = 'This is the new test post message'
const newPostImage = 'Url'
let newPostSender = ''
let newPostId = ''
const newPostMessageUpdated = 'This is the updated message'
const newPostImageUpdated = "newUrl"

const userEmail = "user1@gmail.com"
const userPassword = "123456"
const userUsername = "user1234"
const userName = "User User"
let accessToken = ''

beforeAll(async ()=>{
    const res = await request(app).post('/auth/register').send({
        "email" : userEmail,
        "password" : userPassword,
        "username" : userUsername,
        "name": userName,
        "avatar_url" : ""
    })
    newPostSender = res.body._id
})

async function loginUser() {
    const response = await request(app).post('/auth/login').send({
        "username" : userUsername,
        "password" : userPassword,
    })
    accessToken = response.body.accessToken
}

beforeEach(async ()=>{
    await loginUser()
})

afterAll(async ()=>{
    await User.deleteOne({ "_id": newPostSender })
    await Post.deleteOne({ "_id": newPostId })
    mongoose.connection.close()
})

describe("Posts Tests", ()=>{
    test("add new post",async ()=>{
        const response = await request(app).post('/post').set('Authorization', 'JWT ' + accessToken)
        .send({
            "message": newPostMessage,
            "sender": newPostSender,
            "image": newPostImage,
        })
        expect(response.statusCode).toEqual(200)
        expect(response.body.post.message).toEqual(newPostMessage)
        expect(response.body.post.sender).toEqual(newPostSender)
        expect(response.body.post.image).toEqual(newPostImage)
        newPostId = response.body.post._id
    })

    test("get all posts",async ()=>{
        const response = await request(app).get('/post').set('Authorization', 'JWT ' + accessToken)
        expect(response.statusCode).toEqual(200)
        expect(response.body.post.length).not.toEqual(0)
    })

    test("get post by id",async ()=>{
        const response = await request(app).get('/post/' + newPostId).set('Authorization', 'JWT ' + accessToken)
        expect(response.statusCode).toEqual(200)
        expect(response.body.post.message).toEqual(newPostMessage)
        expect(response.body.post.sender).toEqual(newPostSender)
        expect(response.body.post.image).toEqual(newPostImage)
    })

    test("get post by wrong id fails",async ()=>{
        const response = await request(app).get('/post/12345').set('Authorization', 'JWT ' + accessToken)
        expect(response.statusCode).toEqual(400)
    })

    test("get post by sender",async ()=>{
        const response = await request(app).get('/post?sender=' + newPostSender).set('Authorization', 'JWT ' + accessToken)
        expect(response.statusCode).toEqual(200)
        expect(response.body.post[0].message).toEqual(newPostMessage)
        expect(response.body.post[0].sender).toEqual(newPostSender)
        expect(response.body.post[0].image).toEqual(newPostImage)
    })

    test("update post by ID",async ()=>{
        let response = await request(app).put('/post/' + newPostId).set('Authorization', 'JWT ' + accessToken)
        .send({
            "message": newPostMessageUpdated,
            "sender": newPostSender,
            "image": newPostImageUpdated
        })
        expect(response.statusCode).toEqual(200)
        expect(response.body.post.message).toEqual(newPostMessageUpdated)
        expect(response.body.post.sender).toEqual(newPostSender)
        expect(response.body.post.image).toEqual(newPostImageUpdated)


        response = await request(app).get('/post/' + newPostId).set('Authorization', 'JWT ' + accessToken)
        expect(response.statusCode).toEqual(200)
        expect(response.body.post.message).toEqual(newPostMessageUpdated)
        expect(response.body.post.sender).toEqual(newPostSender)
        expect(response.body.post.image).toEqual(newPostImageUpdated)


        response = await request(app).put('/post/12345').set('Authorization', 'JWT ' + accessToken)
        .send({
            "message": newPostMessageUpdated,
            "sender": newPostSender,
            "image": newPostImage
        })
        expect(response.statusCode).toEqual(400)

        response = await request(app).put('/post/' + newPostId).set('Authorization', 'JWT ' + accessToken)
        .send({
            "message": newPostMessageUpdated,
        })
        expect(response.statusCode).toEqual(200)
        expect(response.body.post.message).toEqual(newPostMessageUpdated)
        expect(response.body.post.sender).toEqual(newPostSender)
    })
})