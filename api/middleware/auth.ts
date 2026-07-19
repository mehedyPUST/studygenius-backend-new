import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";

export interface AuthRequest extends Request {
    user?: { userId: string; email: string };
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
    const token = req.cookies?.accessToken;
    if (!token) return res.status(401).json({ message: "Authentication required" });
    try {
        const payload = verifyAccessToken(token);
        req.user = { userId: payload.userId, email: payload.email };
        next();
    } catch {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}