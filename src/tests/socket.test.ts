import server from "../app"
import mongoose, { connect } from "mongoose"
import Client, { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

import request from 'supertest'
import Post from '../models/post_models'
import User from '../models/user_model'

const userEmail = "user1@gmail.com"
const userEmail2 = "user2@gmail.com"
const userPassword = "12345"

type Client = {
    'socket': Socket<DefaultEventsMap, DefaultEventsMap>, 
    'access_token': string,
    'id': string
}

let client1: Client
let client2: Client

function clientSocketConnect(clientSocket):Promise<string>{
    return new Promise((resolve)=>{
        clientSocket.on("connect", ()=>{
            resolve("1")
        });
    })
}

const connectUser = async(userEmail, userPassword) => {
    const response1 = await request(server).post('/auth/register').send({
        "email": userEmail,
        "password": userPassword 
    })
    const userId = response1.body._id
    const response = await request(server).post('/auth/login').send({
        "email": userEmail,
        "password": userPassword 
    })
    const token = response.body.accessToken
    const socket = Client('http://localhost:' + process.env.PORT, {
        auth: {
            token: 'barrer ' + token
        }
    })
    await clientSocketConnect(socket)
    const client = {"socket": socket, 'access_token': token, 'id':userId}
    return client
}

describe("my awesome project", () => {
    beforeAll(async () => {
        await Post.deleteMany()
        await User.deleteMany()
        client1 = await connectUser(userEmail, userPassword)
        client2 = await connectUser(userEmail2, userPassword)
    });

    afterAll(() => {
        server.close()
        client1.socket.close()
        client2.socket.close()
        mongoose.connection.close()
    });

    test("should work", (done) => {
        client1.socket.once("echo:echo_res", (arg) => {
            expect(arg.msg).toBe('hello');
            done();
        });
        client1.socket.emit("echo:echo", {'msg':'hello'})
    });

    test("Post get all test", (done) => {
        client1.socket.once("post:get_all", (arg) => {
            expect(arg.status).toBe('OK');
            done();
        });
        client1.socket.emit("post:get_all")
    });

    test("Test chat messages", (done) => {
        const msg = "Hi.... Test123"
        client2.socket.once("chat:message", (args)=>{
            expect(args.to).toBe(client2.id)
            expect(args.message).toBe(msg)
            expect(args.from).toBe(client1.id)
            done()
        })
        client1.socket.emit("chat:send_message", {"to": client2.id, "message": msg})

    })
});