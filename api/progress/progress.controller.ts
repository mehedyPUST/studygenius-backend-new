import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth";
import { setTopicCompleted, getPlanProgress } from "./progress.service";

export async function updateTopicProgress(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const { planId, topic, completed } = req.body;
        const result = await setTopicCompleted(req.user!.userId, planId, topic, completed);
        res.json(result);
    } catch (err) {
        next(err);
    }
}

export async function getProgress(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const planId = req.params.planId;
        const data = await getPlanProgress(req.user!.userId, planId);
        res.json(data);
    } catch (err) {
        next(err);
    }
}