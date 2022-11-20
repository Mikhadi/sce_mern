import request from 'supertest'
import app from '../server'
import mongoose from 'mongoose'
import User from "../models/user_model"

const userEmail = "user1@gmail.com"
const userPassword = "12345"

beforeAll(async() => {
    await User.deleteMany()
})

afterAll(async () => {
    await mongoose.connection.close()
})

describe("Auth Tests", () => {
    test("Register test", async () => {
        const response = await request(app).post('/auth/register').send({
            "email" : userEmail,
            "password" : userPassword,
        })
        expect(response.statusCode).toEqual(200)
    })

    test("Login test", async () => {
        const response = await request(app).post('/auth/login').send({
            "email" : userEmail,
            "password" : userPassword,
        })
        expect(response.statusCode).toEqual(200)
        const token = response.body.accessToken
        expect(token).not.toBeNull()
    })

    test("Logout test", async () => {
        const response = await request(app).post('/auth/logout').send({
            "email" : userEmail,
            "password" : userPassword,
        })
        expect(response.statusCode).toEqual(200)
    })
})