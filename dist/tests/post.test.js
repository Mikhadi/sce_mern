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
const post_models_1 = __importDefault(require("../models/post_models"));
const newPostMessage1 = "This is first test post message";
const newPostSender1 = "999001";
let newPostId1 = "";
const newPostMessage2 = "This is second test post message";
const newPostSender2 = "999002";
let newPostId2 = "";
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield post_models_1.default.remove();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
describe("Post Tests", () => {
    test("Add new posts", () => __awaiter(void 0, void 0, void 0, function* () {
        const response1 = yield (0, supertest_1.default)(server_1.default).post('/post').send({
            "message": newPostMessage1,
            "sender": newPostSender1,
        });
        expect(response1.statusCode).toEqual(200);
        expect(response1.body.message).toEqual(newPostMessage1);
        expect(response1.body.sender).toEqual(newPostSender1);
        newPostId1 = response1.body._id;
        const response2 = yield (0, supertest_1.default)(server_1.default).post('/post').send({
            "message": newPostMessage2,
            "sender": newPostSender2,
        });
        expect(response2.statusCode).toEqual(200);
        expect(response2.body.message).toEqual(newPostMessage2);
        expect(response2.body.sender).toEqual(newPostSender2);
        newPostId2 = response2.body._id;
    }));
    test("Get all posts", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get('/post');
        expect(response.statusCode).toEqual(200);
        expect(response.body.length).toEqual(2);
    }));
    test("Get post by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get('/post/' + newPostId1);
        expect(response.statusCode).toEqual(200);
        expect(response.body.message).toEqual(newPostMessage1);
        expect(response.body.sender).toEqual(newPostSender1);
    }));
    test("Get posts by sender", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get('/post?sender=' + newPostSender1);
        expect(response.statusCode).toEqual(200);
        expect(response.body[0]._id).toEqual(newPostId1);
        expect(response.body[0].message).toEqual(newPostMessage1);
    }));
    test("Update post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).put('/post/' + newPostId1).send({
            "message": newPostMessage2
        });
        expect(response.statusCode).toEqual(200);
        expect(response.body.message).toEqual(newPostMessage2);
        expect(response.body.sender).toEqual(newPostSender1);
        expect(response.body._id).toEqual(newPostId1);
    }));
});
//# sourceMappingURL=post.test.js.map