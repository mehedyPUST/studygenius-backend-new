import { Request, Response, NextFunction } from "express";
import {
    generateContent,
    getRecommendations,
    chatInteraction,
    generateProfileInsights,
    generateQuiz,
} from "./ai.service";
import { AuthRequest } from "../middleware/auth";

export async function generate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const { topic, detailLevel = "standard" } = req.body;
        const content = await generateContent(topic, detailLevel);
        res.json({ content });
    } catch (err) {
        next(err);
    }
}

export async function recommendations(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const plans = await getRecommendations(req.user!.userId);
        res.json(plans);
    } catch (err) {
        next(err);
    }
}

export async function chat(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const { message, context } = req.body;
        const reply = await chatInteraction(req.user!.userId, message, context);
        res.json({ reply });
    } catch (err) {
        next(err);
    }
}

export async function profileInsight(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const insight = await generateProfileInsights(req.user!.userId);
        res.json({ insight });
    } catch (err) {
        next(err);
    }
}

export async function quiz(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const { topics } = req.body;
        if (!topics || !Array.isArray(topics) || topics.length === 0) {
            return res.status(400).json({ message: "Topics required" });
        }
        const quizText = await generateQuiz(topics);
        res.json({ quiz: quizText });
    } catch (err) {
        next(err);
    }
}