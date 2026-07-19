"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const zod_1 = require("zod");
const progress_controller_1 = require("./progress.controller");
const router = (0, express_1.Router)();
const progressSchema = zod_1.z.object({
    planId: zod_1.z.string().min(1),
    topic: zod_1.z.string().min(1),
    completed: zod_1.z.boolean(),
});
router.post("/", auth_1.authenticate, (0, validate_1.validate)(progressSchema), progress_controller_1.updateTopicProgress);
router.get("/:planId", auth_1.authenticate, progress_controller_1.getProgress);
exports.default = router;
