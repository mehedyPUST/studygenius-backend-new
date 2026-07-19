"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateContent = generateContent;
exports.getRecommendations = getRecommendations;
exports.chatInteraction = chatInteraction;
exports.generateProfileInsights = generateProfileInsights;
exports.generateQuiz = generateQuiz;
const db_1 = require("../db");
function mockGenerate(prompt, detailLevel) {
    const base = `Study Plan: Mastering ${prompt}\n\n`;
    if (detailLevel === "brief")
        return base + "1. Introduction\n2. Key Concepts\n3. Practice";
    const standard = base + "1. Introduction to " + prompt + "\n2. Core Principles\n3. Advanced Topics\n4. Practical Applications\n5. Summary";
    const detailed = standard + "\n6. Resources\n7. Exercises\n8. Self-Assessment";
    return detailLevel === "detailed" ? detailed : standard;
}
async function callGemini(prompt) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.log("No Gemini API key, using mock");
        return mockGenerate(prompt, "standard");
    }
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
            }),
        });
        const data = await response.json();
        if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
            return data.candidates[0].content.parts[0].text;
        }
        throw new Error("No text generated");
    }
    catch (err) {
        console.error("Gemini error:", err);
        return mockGenerate("AI topic", "standard");
    }
}
async function generateContent(topic, detailLevel) {
    const prompt = `Create a structured study plan for the topic: "${topic}" with detail level ${detailLevel}. Include title, description, topics (as JSON array), and suggested duration in hours. Format as plain text with sections.`;
    return callGemini(prompt);
}
async function getRecommendations(userId) {
    const db = (0, db_1.getDB)();
    const userPlans = await db.collection("plans").find({ userId }).toArray();
    const subjects = [...new Set(userPlans.map((p) => p.subject))];
    if (subjects.length === 0) {
        return db
            .collection("plans")
            .find({ isPublished: true })
            .sort({ rating: -1 })
            .limit(6)
            .toArray();
    }
    return db
        .collection("plans")
        .find({
        subject: { $in: subjects },
        isPublished: true,
        userId: { $ne: userId },
    })
        .sort({ rating: -1 })
        .limit(6)
        .toArray();
}
async function chatInteraction(userId, message, context) {
    const prompt = context
        ? `User: ${message}\nContext: ${context}\nAI:`
        : `User: ${message}\nAI:`;
    return callGemini(prompt);
}
async function generateProfileInsights(userId) {
    const db = (0, db_1.getDB)();
    const userPlans = await db.collection("plans").find({ userId }).toArray();
    const planCount = userPlans.length;
    const totalHours = userPlans.reduce((sum, p) => sum + p.duration, 0);
    const avgRating = planCount > 0
        ? userPlans.reduce((sum, p) => sum + (p.rating || 0), 0) / planCount
        : 0;
    return `You've created ${planCount} plan(s) totaling ${totalHours} hours. Average rating: ${avgRating.toFixed(1)}. Keep up the great work!`;
}
async function generateQuiz(topics) {
    const prompt = `Create a 5-question multiple-choice quiz on the following topics: ${topics.join(", ")}.
Format each question as:
Q: <question>
A) <option>
B) <option>
C) <option>
D) <option>
Correct Answer: <A/B/C/D>
Explanation: <explanation>
---
`;
    return callGemini(prompt);
}
