"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const http_1 = __importDefault(require("http"));
const server = http_1.default.createServer(app);
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const body_parser_1 = __importDefault(require("body-parser"));
app.use(body_parser_1.default.urlencoded({ extended: true, limit: '1mb' }));
app.use(body_parser_1.default.json());
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.connect(process.env.DATABASE_URL); //, { useNewUrlParser : true })
const db = mongoose_1.default.connection;
db.on('error', error => { console.error(error); });
db.once('open', () => { console.log('Conncected to MongoDB'); });
app.use('/public', express_1.default.static('public'));
app.use('/uploads', express_1.default.static('uploads'));
const post_route_1 = __importDefault(require("./routes/post_route"));
app.use('/post', post_route_1.default);
const auth_route_1 = __importDefault(require("./routes/auth_route"));
app.use('/auth', auth_route_1.default);
const user_route_1 = __importDefault(require("./routes/user_route"));
app.use('/user', user_route_1.default);
const file_route_1 = __importDefault(require("./routes/file_route"));
app.use('/file', file_route_1.default);
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
if (process.env.NODE_ENV == "development") {
    const options = {
        definition: {
            openapi: "3.0.0",
            info: {
                title: "Web Dev 2022 Rest API",
                version: "1.0.0",
                description: "Rest Server including authentication using JWT",
            },
            servers: [{ url: "http://localhost:3000", },],
        },
        apis: ["./src/routes/*.ts"],
    };
    const specs = (0, swagger_jsdoc_1.default)(options);
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
}
module.exports = server;
//# sourceMappingURL=server.js.map