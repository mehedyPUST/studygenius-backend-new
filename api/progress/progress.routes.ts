import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { z } from "zod";
import { updateTopicProgress, getProgress } from "./progress.controller";

const router = Router();
const progressSchema = z.object({
    planId: z.string().min(1),
    topic: z.string().min(1),
    completed: z.boolean(),
});

router.post("/", authenticate, validate(progressSchema), updateTopicProgress);
router.get("/:planId", authenticate, getProgress);

export default router;