import request from 'supertest'
import app from '../server'
import mongoose from 'mongoose'
import User from "../models/user_model"

const userEmail = "user1@gmail.com"
const userPassword = "12345"
let accessToken = ''
let refreshToken = ''


beforeAll(async() => {
    await User.deleteMany()
})

afterAll(async () => {
    await User.deleteMany()
    await mongoose.connection.close()
})

describe("Auth Tests", () => {
    test("Not authorized attempt test", async () => {
        const response = await request(app).get('/post')
        expect(response.statusCode).not.toEqual(200)
    })

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
        accessToken = response.body.accessToken
        expect(accessToken).not.toBeNull()
        refreshToken = response.body.refreshToken
        expect(refreshToken).not.toBeNull()
    })

    test("Test using valid access token", async () => {
        const response = await request(app).get('/post').set('Authorization', 'JWT ' + accessToken)
        expect(response.statusCode).toEqual(200)
    })

    test("Test using invalid access token", async () => {
        const response = await request(app).get('/post').set('Authorization', 'JWT 1' + accessToken)
        expect(response.statusCode).not.toEqual(200)
    })

    jest.setTimeout(30000)
    test("Test using expired access token", async () => {
        await new Promise(r => setTimeout(r, 10000))
        const response = await request(app).get('/post').set('Authorization', 'JWT ' + accessToken)
        expect(response.statusCode).not.toEqual(200)
    })

    test("Test refresh token", async () => {
        let response = await request(app).get('/auth/refresh').set('Authorization', 'JWT ' + refreshToken)
        expect(response.statusCode).toEqual(200)

        const newAccessToken = response.body.accessToken
        expect(newAccessToken).not.toBeNull()
        const newRefreshToken = response.body.refreshToken
        expect(newRefreshToken).not.toBeNull()

        response = await request(app).get('/post').set('Authorization', 'JWT ' + newAccessToken)
        expect(response.statusCode).toEqual(200)
    })

    test("Logout test", async () => {
        const response = await request(app).get('/auth/logout').set('Authorization', 'JWT ' + refreshToken)
        expect(response.statusCode).toEqual(200)
    })
})