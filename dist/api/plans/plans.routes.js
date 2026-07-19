"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const zod_1 = require("zod");
const plans_controller_1 = require("./plans.controller");
const router = (0, express_1.Router)();
const planSchema = zod_1.z.object({
    title: zod_1.z.string().min(3),
    description: zod_1.z.string().min(10),
    subject: zod_1.z.string(),
    difficulty: zod_1.z.enum(["beginner", "intermediate", "advanced"]),
    duration: zod_1.z.number().positive(),
    topics: zod_1.z.array(zod_1.z.string()),
    imageUrl: zod_1.z.string().url().optional(),
    isPublished: zod_1.z.boolean().default(true),
});
const reviewSchema = zod_1.z.object({
    rating: zod_1.z.number().min(1).max(5),
    comment: zod_1.z.string().min(3),
});
router.post("/", auth_1.authenticate, (0, validate_1.validate)(planSchema), plans_controller_1.create);
router.get("/explore", plans_controller_1.explore);
router.get("/mine", auth_1.authenticate, plans_controller_1.myPlans);
router.get("/:id", plans_controller_1.getOne);
router.put("/:id", auth_1.authenticate, (0, validate_1.validate)(planSchema.partial()), plans_controller_1.update);
router.delete("/:id", auth_1.authenticate, plans_controller_1.remove);
router.post("/:id/reviews", auth_1.authenticate, (0, validate_1.validate)(reviewSchema), plans_controller_1.review);
router.get("/:id/reviews", plans_controller_1.getPlanReviews);
exports.default = router;
