import { Server, Socket } from 'socket.io'
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import Chat from "../models/chat_model"

export = (io:Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>, 
    socket:Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>) => {
    
        const sendMessage = async (payload) => {
            const message = new Chat({
                to: payload.to,
                message: payload.message,
                from: socket.data.user,
                time: Date.now()
            })

            await message.save()

            io.to(message.to).emit("chat:message", {'to': message.to, 'from': message.from, 'message': message.message})
        }

        const getMessages = async (payload) => {
            const messagesFrom = await Chat.find({"from": payload.id, "to": socket.data.user})
            const messagesTo = await Chat.find({"to": payload.id, "from": socket.data.user})
            const messages = messagesFrom.concat(messagesTo)

            socket.emit("chat:get_messages.response", messages)
        }

    socket.on("chat:send_message", sendMessage)
    socket.on("chat:get_messages", getMessages)
}