"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const validate_1 = require("../middleware/validate");
const auth_1 = require("../middleware/auth");
const auth_controller_1 = require("./auth.controller");
const router = (0, express_1.Router)();
const registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
});
const googleSchema = zod_1.z.object({
    credential: zod_1.z.string().min(1),
});
router.post("/register", (0, validate_1.validate)(registerSchema), auth_controller_1.register);
router.post("/login", (0, validate_1.validate)(loginSchema), auth_controller_1.login);
router.post("/google", (0, validate_1.validate)(googleSchema), auth_controller_1.googleAuth);
router.post("/demo", auth_controller_1.demoLogin);
router.post("/refresh", auth_controller_1.refresh);
router.post("/logout", auth_controller_1.logout);
router.get("/me", auth_1.authenticate, auth_controller_1.me);
exports.default = router;
