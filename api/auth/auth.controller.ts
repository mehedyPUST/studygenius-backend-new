import { Request, Response, NextFunction } from "express";
import {
    createUser,
    findUserByEmail,
    findUserById,
    createUserFromGoogle,
} from "./auth.service";
import bcrypt from "bcryptjs";
import {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
} from "../utils/jwt";
import { AuthRequest } from "../middleware/auth";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
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

export async function register(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, email, password } = req.body;
        const user = await createUser(name, email, password);
        const payload = { userId: user._id, email: user.email };
        const accessToken = signAccessToken(payload);
        const refreshToken = signRefreshToken(payload);
        setAuthCookies(res, accessToken, refreshToken);
        res.status(201).json({
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        });
    } catch (err) {
        next(err);
    }
}

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.body;
        const user = await findUserByEmail(email);
        if (!user) return res.status(401).json({ message: "Invalid credentials" });
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ message: "Invalid credentials" });
        const payload = { userId: user._id, email: user.email };
        const accessToken = signAccessToken(payload);
        const refreshToken = signRefreshToken(payload);
        setAuthCookies(res, accessToken, refreshToken);
        res.json({
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        });
    } catch (err) {
        next(err);
    }
}

export async function googleAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const { credential } = req.body;
        if (!credential) return res.status(400).json({ message: "Missing credential" });
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email)
            return res.status(400).json({ message: "Invalid Google token" });
        const { email, name, sub: googleId } = payload;
        let user = await findUserByEmail(email);
        if (!user) {
            user = await createUserFromGoogle(name || email, email, googleId);
        }
        const tokenPayload = { userId: user._id, email: user.email };
        const accessToken = signAccessToken(tokenPayload);
        const refreshToken = signRefreshToken(tokenPayload);
        setAuthCookies(res, accessToken, refreshToken);
        res.json({
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        });
    } catch (err) {
        next(err);
    }
}

export async function demoLogin(_req: Request, res: Response, next: NextFunction) {
    try {
        const email = "demo@studygenius.com";
        let user = await findUserByEmail(email);
        if (!user) {
            user = await createUser("Demo User", email, "demo1234");
        }
        const payload = { userId: user._id, email: user.email };
        const accessToken = signAccessToken(payload);
        const refreshToken = signRefreshToken(payload);
        setAuthCookies(res, accessToken, refreshToken);
        res.json({
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        });
    } catch (err) {
        next(err);
    }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.cookies?.refreshToken;
        if (!token) return res.status(401).json({ message: "No refresh token" });
        const payload = verifyRefreshToken(token);
        const user = await findUserById(payload.userId);
        if (!user) return res.status(401).json({ message: "User not found" });
        const newAccess = signAccessToken({ userId: user._id, email: user.email });
        const newRefresh = signRefreshToken({ userId: user._id, email: user.email });
        setAuthCookies(res, newAccess, newRefresh);
        res.json({ message: "Token refreshed" });
    } catch (err) {
        next(err);
    }
}

export async function logout(_req: Request, res: Response, next: NextFunction) {
    try {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.json({ message: "Logged out" });
    } catch (err) {
        next(err);
    }
}

export async function me(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const user = await findUserById(req.user!.userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        });
    } catch (err) {
        next(err);
    }
}