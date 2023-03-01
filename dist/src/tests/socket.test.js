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
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("../app"));
const mongoose_1 = __importDefault(require("mongoose"));
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const supertest_1 = __importDefault(require("supertest"));
const user_model_1 = __importDefault(require("../models/user_model"));
const chat_model_1 = __importDefault(require("../models/chat_model"));
const userEmail1 = "user1@gmail.com";
const userEmail2 = "user2@gmail.com";
const userUsername1 = "user1";
const userUsername2 = "user12";
const userName = "User User";
const userPassword = "12345";
let client1;
let client2;
function clientSocketConnect(clientSocket) {
    return new Promise((resolve) => {
        clientSocket.on("connect", () => {
            resolve("1");
        });
    });
}
const connectUser = (userEmail, userPassword, userUsername, userName) => __awaiter(void 0, void 0, void 0, function* () {
    const response1 = yield (0, supertest_1.default)(app_1.default).post('/auth/register').send({
        "email": userEmail,
        "password": userPassword,
        "username": userUsername,
        "name": userName,
        "avatar_url": ""
    });
    const userId = response1.body._id;
    const response = yield (0, supertest_1.default)(app_1.default).post('/auth/login').send({
        "username": userUsername,
        "password": userPassword
    });
    const token = response.body.accessToken;
    const socket = (0, socket_io_client_1.default)('http://localhost:' + process.env.PORT, {
        auth: {
            token: 'barrer ' + token
        }
    });
    yield clientSocketConnect(socket);
    const client = { "socket": socket, 'access_token': token, 'id': userId };
    return client;
});
describe("my awesome project", () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        client1 = yield connectUser(userEmail1, userPassword, userUsername1, userName);
        client2 = yield connectUser(userEmail2, userPassword, userUsername2, userName);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield user_model_1.default.deleteOne({ "_id": client1.id });
        yield user_model_1.default.deleteOne({ "_id": client2.id });
        yield chat_model_1.default.deleteOne({ "from": client1.id });
        yield chat_model_1.default.deleteOne({ "from": client2.id });
        app_1.default.close();
        client1.socket.close();
        client2.socket.close();
        mongoose_1.default.connection.close();
    }));
    test("should work", (done) => {
        client1.socket.once("echo:echo_res", (arg) => {
            expect(arg.msg).toBe('hello');
            done();
        });
        client1.socket.emit("echo:echo", { 'msg': 'hello' });
    });
    test("Test chat messages from 1 client", (done) => {
        const msg = "Hi.... Test123";
        client2.socket.once("chat:message", (args) => {
            expect(args.to).toBe('Global');
            expect(args.message).toBe(msg);
            expect(args.from).toBe(client1.id);
            done();
        });
        client1.socket.emit("chat:send_message", { "to": "Global", "message": msg });
    });
    test("Test get messages", (done) => {
        client1.socket.once("chat:get_messages.response", (args) => {
            expect(args.length).not.toBe(0);
            done();
        });
        client1.socket.emit("chat:get_messages", { "to": "Global" });
    });
});
//# sourceMappingURL=socket.test.js.map