"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const zod_1 = require("zod");
const ai_controller_1 = require("./ai.controller");
const router = (0, express_1.Router)();
const generateSchema = zod_1.z.object({
    topic: zod_1.z.string().min(3),
    detailLevel: zod_1.z.enum(["brief", "standard", "detailed"]).optional(),
});
const chatSchema = zod_1.z.object({
    message: zod_1.z.string().min(1),
    context: zod_1.z.string().optional(),
});
const quizSchema = zod_1.z.object({
    topics: zod_1.z.array(zod_1.z.string()),
});
router.post("/generate", auth_1.authenticate, (0, validate_1.validate)(generateSchema), ai_controller_1.generate);
router.get("/recommendations", auth_1.authenticate, ai_controller_1.recommendations);
router.post("/chat", auth_1.authenticate, (0, validate_1.validate)(chatSchema), ai_controller_1.chat);
router.get("/profile-insight", auth_1.authenticate, ai_controller_1.profileInsight);
router.post("/quiz", auth_1.authenticate, (0, validate_1.validate)(quizSchema), ai_controller_1.quiz);
exports.default = router;
