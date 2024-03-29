import { Server } from "socket.io"
import http from 'http';
import echoHandler from './socket/echoHandler'
import postHandler from './socket/postHandler'
import chatHandler from './socket/chatHandler'
import jwt from "jsonwebtoken"

export = (server: http.Server) => {
    const io = new Server(server);

    io.use(async (socket, next) => {
        let token = socket.handshake.auth.token;
        if(token == null) return next(new Error('Authentication error'))
        token = token.split(' ')[1]
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err){
                return next(new Error('Authentication error'));
            } else{
                socket.data.user = user.id
                return next()
            }
        })
    });

    io.on('connection', async (socket) => {
        console.log('User connected ' + socket.id);
        echoHandler(io, socket)
        postHandler(io, socket)
        chatHandler(io, socket)

        //const userId = socket.data.user
        await socket.join("Global")
        socket.on('disconnect', () => {
            socket.leave("Global")
        })
    });

    return io
}