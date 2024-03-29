"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const chat_model_1 = __importDefault(require("../models/chat_model"));
module.exports = (io, socket) => {
    const sendMessage = (payload) => __awaiter(void 0, void 0, void 0, function* () {
        const time = Date.now();
        const message = new chat_model_1.default({
            to: payload.to,
            message: payload.message,
            from: socket.data.user,
            time: time
        });
        const msg = yield message.save();
        io.to(message.to).emit("chat:message", { 'to': message.to, 'from': message.from, 'message': message.message, 'time': msg.time, "_id": msg._id });
    });
    const getMessages = (payload) => __awaiter(void 0, void 0, void 0, function* () {
        const messages = yield chat_model_1.default.find({ "to": payload.to });
        socket.emit("chat:get_messages.response", messages);
    });
    socket.on("chat:send_message", sendMessage);
    socket.on("chat:get_messages", getMessages);
};
//# sourceMappingURL=chatHandler.js.map