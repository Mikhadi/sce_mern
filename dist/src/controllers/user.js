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
const user_model_1 = __importDefault(require("../models/user_model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
function sendError(res, error) {
    res.status(400).send({
        'error': error
    });
}
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const user = yield user_model_1.default.findOne({ '_id': id });
        return res.status(200).send({
            "name": user.name,
            "email": user.email,
            "username": user.username,
            "avatar_url": user.avatar_url,
        });
    }
    catch (err) {
        return sendError(res, "Failed checking user");
    }
});
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.password) {
        try {
            const salt = yield bcrypt_1.default.genSalt(10);
            const encryptedPwd = yield bcrypt_1.default.hash(req.body.password, salt);
            req.body.password = encryptedPwd;
        }
        catch (err) {
            return sendError(res, "Password error");
        }
    }
    try {
        let user = yield user_model_1.default.findOne({ email: req.body.email });
        if (user != null && user._id != req.body.userId) {
            return sendError(res, "User already registered");
        }
        user = yield user_model_1.default.findOne({ username: req.body.username });
        if (user != null && user._id != req.body.userId) {
            return sendError(res, "User already registered");
        }
    }
    catch (err) {
        return sendError(res, "Failed checking user");
    }
    try {
        const filter = { _id: req.body.userId };
        const update = req.body;
        yield user_model_1.default.findOneAndUpdate(filter, update, { new: true });
        return res.status(200).send();
    }
    catch (err) {
        return sendError(res, "Failed updating user");
    }
});
module.exports = { getUser, updateUser };
//# sourceMappingURL=user.js.map