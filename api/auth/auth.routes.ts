import { Router } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate";
import { authenticate } from "../middleware/auth";
import {
    register,
    login,
    googleAuth,
    demoLogin,
    refresh,
    logout,
    me,
} from "./auth.controller";

const router = Router();

const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
});
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});
const googleSchema = z.object({
    credential: z.string().min(1),
});

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/google", validate(googleSchema), googleAuth);
router.post("/demo", demoLogin);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", authenticate, me);

export default router;