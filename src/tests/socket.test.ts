import server from "../app"
import mongoose, { connect } from "mongoose"
import Client, { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

import request from 'supertest'
import Post from '../models/post_models'
import User from '../models/user_model'
import Chat from '../models/chat_model'

const userEmail = "user1@gmail.com"
const userEmail2 = "user2@gmail.com"
const userPassword = "12345"

const message = "This is test socket message"
const updatedMessage = "This is updated message"
let postId = null

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
        await Chat.deleteMany()
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

    test("postAdd", (done) => {
        client1.socket.once('post:add.response', (arg) => {
            expect(arg.message).toEqual(message)
            expect(arg.sender).toEqual(client1.id)
            postId = arg._id
            done();
        });
        client1.socket.emit('post:add', {'message':message})
    })

    test("Post get all test", (done) => {
        client1.socket.once("post:get.response", (arg) => {
            expect(arg[0].message).toEqual(message);
            done();
        });
        client1.socket.emit("post:get")
    });

    test("Post get by sender", (done) => {
        client2.socket.once("post:get:sender.response", (arg) => {
            expect(arg[0].message).toEqual(message);
            expect(arg[0].sender).toEqual(client1.id);
            done();
        });
        client2.socket.emit("post:get:sender", {'sender': client1.id})
    });

    test("Post get by ID", (done) => {
        client2.socket.once("post:get:id.response", (arg) => {
            expect(arg.message).toEqual(message);
            expect(arg.sender).toEqual(client1.id);
            done();
        });
        client2.socket.emit("post:get:id", {'id': postId})
    });

    test("Update post", (done) => {
        client1.socket.once("post:put.response", (arg) => {
            expect(arg.message).toEqual(updatedMessage);
            expect(arg.sender).toEqual(client1.id);
            done();
        });
        client1.socket.emit("post:put", {'id': postId, 'message': updatedMessage})
    });

    test("Test chat messages from 1 client", (done) => {
        const msg = "Hi.... Test123"
        client2.socket.once("chat:message", (args)=>{
            expect(args.to).toBe(client2.id)
            expect(args.message).toBe(msg)
            expect(args.from).toBe(client1.id)
            done()
        })
        client1.socket.emit("chat:send_message", {"to": client2.id, "message": msg})
    })

    test("Test chat messages from 2 client", (done) => {
        const msg = "Hi.... Test123"
        client1.socket.once("chat:message", (args)=>{
            expect(args.to).toBe(client1.id)
            expect(args.message).toBe(msg)
            expect(args.from).toBe(client2.id)
            done()
        })
        client2.socket.emit("chat:send_message", {"to": client1.id, "message": msg})
    })

    test("Test get messages", (done) => {
        client1.socket.once("chat:get_messages.response", (args)=>{
            expect(args.length).toBe(2)
            done()
        })
        client1.socket.emit("chat:get_messages", {"id": client2.id})
    })

});