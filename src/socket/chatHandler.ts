import { Server, Socket } from 'socket.io'
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import Chat from "../models/chat_model"

export = (io:Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>, 
    socket:Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>) => {
    
        const sendMessage = async (payload) => {
            const time = Date.now()
            const message = new Chat({
                to: payload.to,
                message: payload.message,
                from: socket.data.user,
                time: time
            })

            const msg = await message.save()

            io.to(message.to).emit("chat:message", {'to': message.to, 'from': message.from, 'message': message.message, 'time': msg.time, "_id": msg._id})
        }

        const getMessages = async (payload) => {
            const messages = await Chat.find({"to": payload.to})
            socket.emit("chat:get_messages.response", messages)
        }

    socket.on("chat:send_message", sendMessage)
    socket.on("chat:get_messages", getMessages)
}