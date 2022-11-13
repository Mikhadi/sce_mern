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
const post_models_1 = __importDefault(require("../models/post_models"));
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let posts = {};
        if (req.query.sender == null) {
            posts = yield post_models_1.default.find();
        }
        else {
            posts = yield post_models_1.default.find({ 'sender': req.query.sender });
        }
        res.status(200).send(posts);
    }
    catch (err) {
        res.status(400).send({ 'error': "failed to get posts from db" });
    }
});
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield post_models_1.default.findById(req.params.id);
        res.status(200).send(posts);
    }
    catch (err) {
        res.status(400).send({ 'error': "failed to get posts from db" });
    }
});
const addNewPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = new post_models_1.default({
        message: req.body.message,
        sender: req.body.sender
    });
    try {
        const newPost = yield post.save();
        console.log('Saved post in DB');
        res.status(200).send(newPost);
    }
    catch (_a) {
        console.log('Failed to save post in DB');
        res.status(400).send({ 'error': "error occured" });
    }
});
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filter = { _id: req.params.id };
        const update = { message: req.body.message };
        const post = yield post_models_1.default.findOneAndUpdate(filter, update, { new: true });
        res.status(200).send(post);
    }
    catch (err) {
        res.status(400).send({ 'error': "failed to update post in db" });
    }
});
module.exports = { getAllPosts, addNewPost, getPostById, updatePost };
//# sourceMappingURL=post.js.map