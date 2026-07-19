"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleSavePlan = toggleSavePlan;
exports.isPlanSaved = isPlanSaved;
exports.getSavedPlans = getSavedPlans;
const db_1 = require("../db");
async function toggleSavePlan(userId, planId) {
    const db = (0, db_1.getDB)();
    const existing = await db.collection("saves").findOne({ userId, planId });
    if (existing) {
        await db.collection("saves").deleteOne({ userId, planId });
        return false;
    }
    else {
        await db.collection("saves").insertOne({ userId, planId, savedAt: new Date() });
        return true;
    }
}
async function isPlanSaved(userId, planId) {
    const db = (0, db_1.getDB)();
    const doc = await db.collection("saves").findOne({ userId, planId });
    return !!doc;
}
async function getSavedPlans(userId) {
    const db = (0, db_1.getDB)();
    const saved = await db.collection("saves").find({ userId }).toArray();
    const planIds = saved.map(s => s.planId);
    if (planIds.length === 0)
        return [];
    return db.collection("plans").find({ _id: { $in: planIds } }).toArray();
}
