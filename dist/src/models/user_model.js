"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    refresh_tokens: {
        type: [String]
    },
    avatar_url: {
        type: String,
        required: true,
    }
});
module.exports = mongoose_1.default.model('User', userSchema);
//# sourceMappingURL=user_model.js.map