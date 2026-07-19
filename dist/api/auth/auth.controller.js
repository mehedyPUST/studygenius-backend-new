"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.googleAuth = googleAuth;
exports.demoLogin = demoLogin;
exports.refresh = refresh;
exports.logout = logout;
exports.me = me;
const auth_service_1 = require("./auth.service");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../utils/jwt");
const google_auth_library_1 = require("google-auth-library");
const googleClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
function setAuthCookies(res, accessToken, refreshToken) {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
}
async function register(req, res, next) {
    try {
        const { name, email, password } = req.body;
        const user = await (0, auth_service_1.createUser)(name, email, password);
        const payload = { userId: user._id, email: user.email };
        const accessToken = (0, jwt_1.signAccessToken)(payload);
        const refreshToken = (0, jwt_1.signRefreshToken)(payload);
        setAuthCookies(res, accessToken, refreshToken);
        res.status(201).json({
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        });
    }
    catch (err) {
        next(err);
    }
}
async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        const user = await (0, auth_service_1.findUserByEmail)(email);
        if (!user)
            return res.status(401).json({ message: "Invalid credentials" });
        const valid = await bcryptjs_1.default.compare(password, user.password);
        if (!valid)
            return res.status(401).json({ message: "Invalid credentials" });
        const payload = { userId: user._id, email: user.email };
        const accessToken = (0, jwt_1.signAccessToken)(payload);
        const refreshToken = (0, jwt_1.signRefreshToken)(payload);
        setAuthCookies(res, accessToken, refreshToken);
        res.json({
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        });
    }
    catch (err) {
        next(err);
    }
}
async function googleAuth(req, res, next) {
    try {
        const { credential } = req.body;
        if (!credential)
            return res.status(400).json({ message: "Missing credential" });
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email)
            return res.status(400).json({ message: "Invalid Google token" });
        const { email, name, sub: googleId } = payload;
        let user = await (0, auth_service_1.findUserByEmail)(email);
        if (!user) {
            user = await (0, auth_service_1.createUserFromGoogle)(name || email, email, googleId);
        }
        const tokenPayload = { userId: user._id, email: user.email };
        const accessToken = (0, jwt_1.signAccessToken)(tokenPayload);
        const refreshToken = (0, jwt_1.signRefreshToken)(tokenPayload);
        setAuthCookies(res, accessToken, refreshToken);
        res.json({
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        });
    }
    catch (err) {
        next(err);
    }
}
async function demoLogin(_req, res, next) {
    try {
        const email = "demo@studygenius.com";
        let user = await (0, auth_service_1.findUserByEmail)(email);
        if (!user) {
            user = await (0, auth_service_1.createUser)("Demo User", email, "demo1234");
        }
        const payload = { userId: user._id, email: user.email };
        const accessToken = (0, jwt_1.signAccessToken)(payload);
        const refreshToken = (0, jwt_1.signRefreshToken)(payload);
        setAuthCookies(res, accessToken, refreshToken);
        res.json({
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        });
    }
    catch (err) {
        next(err);
    }
}
async function refresh(req, res, next) {
    try {
        const token = req.cookies?.refreshToken;
        if (!token)
            return res.status(401).json({ message: "No refresh token" });
        const payload = (0, jwt_1.verifyRefreshToken)(token);
        const user = await (0, auth_service_1.findUserById)(payload.userId);
        if (!user)
            return res.status(401).json({ message: "User not found" });
        const newAccess = (0, jwt_1.signAccessToken)({ userId: user._id, email: user.email });
        const newRefresh = (0, jwt_1.signRefreshToken)({ userId: user._id, email: user.email });
        setAuthCookies(res, newAccess, newRefresh);
        res.json({ message: "Token refreshed" });
    }
    catch (err) {
        next(err);
    }
}
async function logout(_req, res, next) {
    try {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.json({ message: "Logged out" });
    }
    catch (err) {
        next(err);
    }
}
async function me(req, res, next) {
    try {
        const user = await (0, auth_service_1.findUserById)(req.user.userId);
        if (!user)
            return res.status(404).json({ message: "User not found" });
        res.json({
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        });
    }
    catch (err) {
        next(err);
    }
}
