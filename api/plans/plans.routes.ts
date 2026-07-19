import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { z } from "zod";
import {
    create,
    getOne,
    update,
    remove,
    myPlans,
    explore,
    review,
    getPlanReviews,
} from "./plans.controller";

const router = Router();

const planSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    subject: z.string(),
    difficulty: z.enum(["beginner", "intermediate", "advanced"]),
    duration: z.number().positive(),
    topics: z.array(z.string()),
    imageUrl: z.string().url().optional(),
    isPublished: z.boolean().default(true),
});

const reviewSchema = z.object({
    rating: z.number().min(1).max(5),
    comment: z.string().min(3),
});

router.post("/", authenticate, validate(planSchema), create);
router.get("/explore", explore);
router.get("/mine", authenticate, myPlans);
router.get("/:id", getOne);
router.put("/:id", authenticate, validate(planSchema.partial()), update);
router.delete("/:id", authenticate, remove);
router.post("/:id/reviews", authenticate, validate(reviewSchema), review);
router.get("/:id/reviews", getPlanReviews);

export default router;