"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = generate;
exports.recommendations = recommendations;
exports.chat = chat;
exports.profileInsight = profileInsight;
exports.quiz = quiz;
const ai_service_1 = require("./ai.service");
async function generate(req, res, next) {
    try {
        const { topic, detailLevel = "standard" } = req.body;
        const content = await (0, ai_service_1.generateContent)(topic, detailLevel);
        res.json({ content });
    }
    catch (err) {
        next(err);
    }
}
async function recommendations(req, res, next) {
    try {
        const plans = await (0, ai_service_1.getRecommendations)(req.user.userId);
        res.json(plans);
    }
    catch (err) {
        next(err);
    }
}
async function chat(req, res, next) {
    try {
        const { message, context } = req.body;
        const reply = await (0, ai_service_1.chatInteraction)(req.user.userId, message, context);
        res.json({ reply });
    }
    catch (err) {
        next(err);
    }
}
async function profileInsight(req, res, next) {
    try {
        const insight = await (0, ai_service_1.generateProfileInsights)(req.user.userId);
        res.json({ insight });
    }
    catch (err) {
        next(err);
    }
}
async function quiz(req, res, next) {
    try {
        const { topics } = req.body;
        if (!topics || !Array.isArray(topics) || topics.length === 0) {
            return res.status(400).json({ message: "Topics required" });
        }
        const quizText = await (0, ai_service_1.generateQuiz)(topics);
        res.json({ quiz: quizText });
    }
    catch (err) {
        next(err);
    }
}
