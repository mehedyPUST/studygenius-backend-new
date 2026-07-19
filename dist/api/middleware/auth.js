"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const jwt_1 = require("../utils/jwt");
function authenticate(req, res, next) {
    const token = req.cookies?.accessToken;
    if (!token)
        return res.status(401).json({ message: "Authentication required" });
    try {
        const payload = (0, jwt_1.verifyAccessToken)(token);
        req.user = { userId: payload.userId, email: payload.email };
        next();
    }
    catch {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}
