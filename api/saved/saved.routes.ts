import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { toggleSave, checkSave, savedList } from "./saved.controller";

const router = Router();
router.post("/:planId/toggle", authenticate, toggleSave);
router.get("/:planId/check", authenticate, checkSave);
router.get("/", authenticate, savedList);

export default router;