import { Request, Response, NextFunction } from "express";
import {
    createPlan,
    getPlanById,
    updatePlan,
    deletePlan,
    getUserPlans,
    explorePlans,
    addReview,
    getReviews,
} from "./plans.service";
import { AuthRequest } from "../middleware/auth";

export async function create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const data = req.body;
        const plan = await createPlan({ ...data, userId: req.user!.userId });
        res.status(201).json(plan);
    } catch (err) {
        next(err);
    }
}

export async function getOne(req: Request, res: Response, next: NextFunction) {
    try {
        const plan = await getPlanById(req.params.id);
        if (!plan) return res.status(404).json({ message: "Plan not found" });
        res.json(plan);
    } catch (err) {
        next(err);
    }
}

export async function update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const plan = await updatePlan(req.params.id, req.user!.userId, req.body);
        if (!plan) return res.status(404).json({ message: "Plan not found or unauthorized" });
        res.json(plan);
    } catch (err) {
        next(err);
    }
}

export async function remove(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const success = await deletePlan(req.params.id, req.user!.userId);
        if (!success) return res.status(404).json({ message: "Plan not found or unauthorized" });
        res.json({ message: "Plan deleted" });
    } catch (err) {
        next(err);
    }
}

export async function myPlans(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const plans = await getUserPlans(req.user!.userId);
        res.json(plans);
    } catch (err) {
        next(err);
    }
}

export async function explore(req: Request, res: Response, next: NextFunction) {
    try {
        const filters = {
            search: req.query.search as string | undefined,
            subject: req.query.subject as string | undefined,
            difficulty: req.query.difficulty as string | undefined,
            sort: req.query.sort as any,
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 12,
        };
        const result = await explorePlans(filters);
        res.json(result);
    } catch (err) {
        next(err);
    }
}

export async function review(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const { rating, comment } = req.body;
        const rev = await addReview(
            req.params.id,
            req.user!.userId,
            req.user!.email,
            rating,
            comment
        );
        res.status(201).json(rev);
    } catch (err) {
        next(err);
    }
}

export async function getPlanReviews(req: Request, res: Response, next: NextFunction) {
    try {
        const reviews = await getReviews(req.params.id);
        res.json(reviews);
    } catch (err) {
        next(err);
    }
}