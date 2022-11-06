const request = require('supertest')
const app = require('../server')
const mongoose = require('mongoose')
const Post = require("../models/post_models")

const newPostMessage = "This is new test post message"
const newPostSender = "999000"

beforeAll(async() => {
    await Post.remove()
})

afterAll(async () => {
    await mongoose.connection.close()
})

describe("Post Tests", () => {
    test("Get all posts", async () => {
        const response = await request(app).get('/post')
        expect(response.statusCode).toEqual(200)
    })

    test("Add new post", async () => {
        const response = await request(app).post('/post').send({
            "message" : newPostMessage,
            "sender" : newPostSender
        })
        expect(response.statusCode).toEqual(200)
        expect(response.body.message).toEqual(newPostMessage)
        expect(response.body.sender).toEqual(newPostSender)
    })
})