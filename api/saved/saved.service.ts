import { getDB } from "../db";
import { Plan } from "../plans/plans.service";

export async function toggleSavePlan(userId: string, planId: string): Promise<boolean> {
    const db = getDB();
    const existing = await db.collection("saves").findOne({ userId, planId });
    if (existing) {
        await db.collection("saves").deleteOne({ userId, planId });
        return false;
    } else {
        await db.collection("saves").insertOne({ userId, planId, savedAt: new Date() });
        return true;
    }
}

export async function isPlanSaved(userId: string, planId: string): Promise<boolean> {
    const db = getDB();
    const doc = await db.collection("saves").findOne({ userId, planId });
    return !!doc;
}

export async function getSavedPlans(userId: string): Promise<Plan[]> {
    const db = getDB();
    const saved = await db.collection("saves").find({ userId }).toArray();
    const planIds = saved.map(s => s.planId);
    if (planIds.length === 0) return [];
    return db.collection<Plan>("plans").find({ _id: { $in: planIds } }).toArray();
}