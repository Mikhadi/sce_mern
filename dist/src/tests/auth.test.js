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
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../models/user_model"));
const userEmail = "user1@gmail.com";
const userPassword = "123456";
const userUsername = "user1234";
const userName = "User User";
let userId = "";
let accessToken = '';
let refreshToken = '';
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield user_model_1.default.deleteOne({ "_id": userId });
    yield mongoose_1.default.connection.close();
}));
describe("Auth Tests", () => {
    test("Not authorized attempt test", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get('/post');
        expect(response.statusCode).not.toEqual(200);
    }));
    test("Register test", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).post('/auth/register').send({
            "email": userEmail,
            "password": userPassword,
            "username": userUsername,
            "name": userName,
            "avatar_url": ""
        });
        console.log(response.body);
        userId = response.body._id;
        expect(response.statusCode).toEqual(200);
    }));
    test("Login test", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).post('/auth/login').send({
            "username": userUsername,
            "password": userPassword,
        });
        expect(response.statusCode).toEqual(200);
        accessToken = response.body.accessToken;
        expect(accessToken).not.toBeNull();
        refreshToken = response.body.refreshToken;
        expect(refreshToken).not.toBeNull();
    }));
    test("Test using valid access token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get('/post').set('Authorization', 'JWT ' + accessToken);
        expect(response.statusCode).toEqual(200);
    }));
    test("Test using invalid access token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get('/post').set('Authorization', 'JWT 1' + accessToken);
        expect(response.statusCode).not.toEqual(200);
    }));
    // jest.setTimeout(30000)
    // test("Test using expired access token", async () => {
    //     await new Promise(r => setTimeout(r, 10000))
    //     const response = await request(app).get('/post').set('Authorization', 'JWT ' + accessToken)
    //     expect(response.statusCode).not.toEqual(200)
    // })
    test("Test refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        let response = yield (0, supertest_1.default)(server_1.default).get('/auth/refresh').set('Authorization', 'JWT ' + refreshToken);
        expect(response.statusCode).toEqual(200);
        const newAccessToken = response.body.accessToken;
        expect(newAccessToken).not.toBeNull();
        const newRefreshToken = response.body.refreshToken;
        expect(newRefreshToken).not.toBeNull();
        response = yield (0, supertest_1.default)(server_1.default).get('/post').set('Authorization', 'JWT ' + newAccessToken);
        expect(response.statusCode).toEqual(200);
    }));
    test("Test get user", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get('/user/' + userId).set('Authorization', 'JWT ' + accessToken);
        expect(response.statusCode).toEqual(200);
        expect(response.body.username).toEqual(userUsername);
        expect(response.body.email).toEqual(userEmail);
        expect(response.body.name).toEqual(userName);
    }));
    test("Test update user", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).put('/user').set('Authorization', 'JWT ' + accessToken).send({
            "username": "newUsername",
            "password": "198273981739"
        });
        expect(response.statusCode).toEqual(200);
    }));
    test("Logout test", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get('/auth/logout').set('Authorization', 'JWT ' + refreshToken);
        expect(response.statusCode).toEqual(200);
    }));
});
//# sourceMappingURL=auth.test.js.map