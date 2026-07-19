"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_1 = require("./db");
const auth_routes_1 = __importDefault(require("./auth/auth.routes"));
const plans_routes_1 = __importDefault(require("./plans/plans.routes"));
const ai_routes_1 = __importDefault(require("./ai/ai.routes"));
const progress_routes_1 = __importDefault(require("./progress/progress.routes"));
const saved_routes_1 = __importDefault(require("./saved/saved.routes"));
const contact_routes_1 = __importDefault(require("./contact/contact.routes"));
const errorHandler_1 = require("./middleware/errorHandler");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Connect to DB on each request (Vercel serverless)
app.use(async (req, _res, next) => {
    try {
        await (0, db_1.connectToDB)();
        next();
    }
    catch (err) {
        next(err);
    }
});
app.use("/api/auth", auth_routes_1.default);
app.use("/api/plans", plans_routes_1.default);
app.use("/api/ai", ai_routes_1.default);
app.use("/api/progress", progress_routes_1.default);
app.use("/api/saved", saved_routes_1.default);
app.use("/api/contact", contact_routes_1.default);
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use(errorHandler_1.errorHandler);
exports.default = app;
