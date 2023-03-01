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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function sendError(res, error) {
    res.status(400).send({
        error: error,
    });
}
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    let avatar_url = req.body.avatar_url;
    if (avatar_url == "") {
        avatar_url = process.env.BASE_URL + "uploads/default_avatar.png";
    }
    try {
        let user = yield user_model_1.default.findOne({ email: email });
        if (user != null) {
            return sendError(res, "User already registered");
        }
        user = yield user_model_1.default.findOne({ username: username });
        if (user != null) {
            return sendError(res, "User already registered");
        }
    }
    catch (err) {
        return sendError(res, "Failed checking user");
    }
    try {
        const salt = yield bcrypt_1.default.genSalt(10);
        const encryptedPwd = yield bcrypt_1.default.hash(password, salt);
        let newUser = new user_model_1.default({
            email: email,
            password: encryptedPwd,
            username: username,
            name: name,
            avatar_url: avatar_url,
        });
        newUser = yield newUser.save();
        res.status(200).send(newUser);
    }
    catch (err) {
        return sendError(res, "Failed registration");
    }
});
function generateTokens(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const accessToken = jsonwebtoken_1.default.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.JWT_TOKEN_EXPIRATION });
        const refreshToken = jsonwebtoken_1.default.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET);
        return { accessToken: accessToken, refreshToken: refreshToken };
    });
}
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    if (username == null || password == null) {
        return sendError(res, "Please provide valid email and password");
    }
    try {
        const user = yield user_model_1.default.findOne({ username: username });
        if (user == null) {
            return sendError(res, "Incorrect user or password");
        }
        const match = yield bcrypt_1.default.compare(password, user.password);
        if (!match)
            return sendError(res, "Incorrect user or password");
        const tokens = yield generateTokens(user._id.toString());
        if (user.refresh_tokens == null)
            user.refresh_tokens = [tokens.refreshToken];
        else
            user.refresh_tokens.push(tokens.refreshToken);
        yield user.save();
        return res.status(200).send({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            id: user._id,
        });
    }
    catch (err) {
        return sendError(res, "Failed checking user");
    }
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = getTokenFromRequest(req);
    if (refreshToken == null)
        return sendError(res, "Authentication missing");
    try {
        const user = (yield jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET));
        const userObj = yield user_model_1.default.findById(user.id);
        if (userObj == null)
            return sendError(res, "Failed validating token");
        if (!userObj.refresh_tokens.includes(refreshToken)) {
            userObj.refresh_tokens = [];
            yield userObj.save();
            return sendError(res, "Failed validating token");
        }
        userObj.refresh_tokens.splice(userObj.refresh_tokens.indexOf(refreshToken), 1);
        yield userObj.save();
        res.status(200).send();
    }
    catch (err) {
        console.log("cathed error" + err);
        return sendError(res, "Failed validating token");
    }
});
function getTokenFromRequest(req) {
    const authHeaders = req.headers["authorization"];
    if (authHeaders == null)
        return null;
    return authHeaders.split(" ")[1];
}
const refresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = getTokenFromRequest(req);
    if (refreshToken == null)
        return sendError(res, "Authentication missing");
    try {
        const user = (yield jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET));
        const userObj = yield user_model_1.default.findById(user.id);
        if (userObj == null)
            return sendError(res, "Failed validating token");
        if (!userObj.refresh_tokens.includes(refreshToken)) {
            userObj.refresh_tokens = [];
            yield userObj.save();
            return sendError(res, "Failed validating token");
        }
        const newAccessToken = yield jsonwebtoken_1.default.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.JWT_TOKEN_EXPIRATION });
        const newRefreshToken = yield jsonwebtoken_1.default.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET);
        userObj.refresh_tokens[userObj.refresh_tokens.indexOf(refreshToken)];
        yield userObj.save();
        return res.status(200).send({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    }
    catch (err) {
        return sendError(res, "Failed validating token");
    }
});
const authenticateMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = getTokenFromRequest(req);
    if (token == null)
        return sendError(res, "Authentication missing");
    try {
        const user = (yield jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET));
        req.body.userId = user.id;
        next();
    }
    catch (err) {
        return sendError(res, "Access token expired");
    }
});
module.exports = { login, register, logout, authenticateMiddleware, refresh };
//# sourceMappingURL=auth.js.map