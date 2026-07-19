"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setTopicCompleted = setTopicCompleted;
exports.getPlanProgress = getPlanProgress;
const db_1 = require("../db");
const helpers_1 = require("../utils/helpers");
async function setTopicCompleted(userId, planId, topic, completed) {
    const db = (0, db_1.getDB)();
    const existing = await db.collection("progress").findOne({ userId, planId, topic });
    if (existing) {
        await db.collection("progress").updateOne({ userId, planId, topic }, { $set: { completed, updatedAt: new Date() } });
        return { ...existing, completed, updatedAt: new Date() };
    }
    const entry = {
        _id: (0, helpers_1.generateId)(),
        userId,
        planId,
        topic,
        completed,
        updatedAt: new Date(),
    };
    await db.collection("progress").insertOne(entry);
    return entry;
}
async function getPlanProgress(userId, planId) {
    const db = (0, db_1.getDB)();
    const all = await db.collection("progress")
        .find({ userId, planId })
        .toArray();
    const completed = all.filter(t => t.completed).length;
    return {
        totalTopics: all.length,
        completedTopics: completed,
        topics: all,
    };
}
