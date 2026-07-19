import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { z } from "zod";
import {
    generate,
    recommendations,
    chat,
    profileInsight,
    quiz,
} from "./ai.controller";

const router = Router();

const generateSchema = z.object({
    topic: z.string().min(3),
    detailLevel: z.enum(["brief", "standard", "detailed"]).optional(),
});
const chatSchema = z.object({
    message: z.string().min(1),
    context: z.string().optional(),
});
const quizSchema = z.object({
    topics: z.array(z.string()),
});

router.post("/generate", authenticate, validate(generateSchema), generate);
router.get("/recommendations", authenticate, recommendations);
router.post("/chat", authenticate, validate(chatSchema), chat);
router.get("/profile-insight", authenticate, profileInsight);
router.post("/quiz", authenticate, validate(quizSchema), quiz);

export default router;