import server from "../app"
import mongoose, { connect } from "mongoose"
import Client, { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

import request from 'supertest'
import User from '../models/user_model'
import Chat from '../models/chat_model'

const userEmail1 = "user1@gmail.com"
const userEmail2 = "user2@gmail.com"
const userUsername1 = "user1"
const userUsername2 = "user12"
const userName = "User User"
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

const connectUser = async(userEmail, userPassword, userUsername, userName) => {
    const response1 = await request(server).post('/auth/register').send({
        "email" : userEmail,
        "password" : userPassword,
        "username" : userUsername,
        "name": userName,
        "avatar_url" : ""
    })
    const userId = response1.body._id
    const response = await request(server).post('/auth/login').send({
        "username": userUsername,
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
        client1 = await connectUser(userEmail1, userPassword, userUsername1, userName)
        client2 = await connectUser(userEmail2, userPassword, userUsername2, userName)
    });

    afterAll(async () => {
        await User.deleteOne({ "_id": client1.id })
        await User.deleteOne({ "_id": client2.id })
        await Chat.deleteOne({ "from": client1.id })
        await Chat.deleteOne({ "from": client2.id })
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

    test("Test chat messages from 1 client", (done) => {
        const msg = "Hi.... Test123"
        client2.socket.once("chat:message", (args)=>{
            expect(args.to).toBe('Global')
            expect(args.message).toBe(msg)
            expect(args.from).toBe(client1.id)
            done()
        })
        client1.socket.emit("chat:send_message", {"to": "Global", "message": msg})
    })

    test("Test get messages", (done) => {
        client1.socket.once("chat:get_messages.response", (args)=>{
            expect(args.length).not.toBe(0)
            done()
        })
        client1.socket.emit("chat:get_messages", {"to": "Global"})
    })

});