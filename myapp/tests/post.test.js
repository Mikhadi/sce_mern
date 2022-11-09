const request = require('supertest')
const app = require('../server')
const mongoose = require('mongoose')
const Post = require("../models/post_models")

const newPostMessage1 = "This is first test post message"
const newPostSender1 = "999001"
let newPostId1 = ""

const newPostMessage2 = "This is second test post message"
const newPostSender2 = "999002"
let newPostId2 = ""

beforeAll(async() => {
    await Post.remove()
})

afterAll(async () => {
    await mongoose.connection.close()
})

describe("Post Tests", () => {
    test("Add new posts", async () => {
        const response1 = await request(app).post('/post').send({
            "message" : newPostMessage1,
            "sender" : newPostSender1,
        })
        expect(response1.statusCode).toEqual(200)
        expect(response1.body.message).toEqual(newPostMessage1)
        expect(response1.body.sender).toEqual(newPostSender1)
        newPostId1 = response1.body._id
        const response2 = await request(app).post('/post').send({
            "message" : newPostMessage2,
            "sender" : newPostSender2,
        })
        expect(response2.statusCode).toEqual(200)
        expect(response2.body.message).toEqual(newPostMessage2)
        expect(response2.body.sender).toEqual(newPostSender2)
        newPostId2 = response2.body._id
    })

    test("Get all posts", async () => {
        const response = await request(app).get('/post')
        expect(response.statusCode).toEqual(200)
        expect(response.body.length).toEqual(2)
    })

    test("Get post by id", async () => {
        const response = await request(app).get('/post/' + newPostId1)
        expect(response.statusCode).toEqual(200)
        expect(response.body.message).toEqual(newPostMessage1)
        expect(response.body.sender).toEqual(newPostSender1)
    })

    test("Get posts by sender", async () => {
        const response = await request(app).get('/post?sender=' + newPostSender1)
        expect(response.statusCode).toEqual(200)
        expect(response.body[0]._id).toEqual(newPostId1)
        expect(response.body[0].message).toEqual(newPostMessage1)
    })

    test("Update post", async () => {
        const response = await request(app).put('/post/' + newPostId1).send({
            "message": newPostMessage2
        })
        expect(response.statusCode).toEqual(200)
        expect(response.body.message).toEqual(newPostMessage2)
        expect(response.body.sender).toEqual(newPostSender1)
        expect(response.body._id).toEqual(newPostId1)
    })
})