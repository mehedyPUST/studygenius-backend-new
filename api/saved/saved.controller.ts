import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth";
import { toggleSavePlan, getSavedPlans, isPlanSaved } from "./saved.service";

export async function toggleSave(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const { planId } = req.params;
        const saved = await toggleSavePlan(req.user!.userId, planId);
        res.json({ saved });
    } catch (err) {
        next(err);
    }
}

export async function checkSave(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const { planId } = req.params;
        const saved = await isPlanSaved(req.user!.userId, planId);
        res.json({ saved });
    } catch (err) {
        next(err);
    }
}

export async function savedList(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const plans = await getSavedPlans(req.user!.userId);
        res.json(plans);
    } catch (err) {
        next(err);
    }
}