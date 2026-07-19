import { getDB } from "../db";
import { generateId } from "../utils/helpers";

export interface TopicProgress {
    _id: string;
    userId: string;
    planId: string;
    topic: string;
    completed: boolean;
    updatedAt: Date;
}

export async function setTopicCompleted(
    userId: string,
    planId: string,
    topic: string,
    completed: boolean
): Promise<TopicProgress> {
    const db = getDB();
    const existing = await db.collection<TopicProgress>("progress").findOne({ userId, planId, topic });
    if (existing) {
        await db.collection<TopicProgress>("progress").updateOne(
            { userId, planId, topic },
            { $set: { completed, updatedAt: new Date() } }
        );
        return { ...existing, completed, updatedAt: new Date() };
    }
    const entry: TopicProgress = {
        _id: generateId(),
        userId,
        planId,
        topic,
        completed,
        updatedAt: new Date(),
    };
    await db.collection<TopicProgress>("progress").insertOne(entry);
    return entry;
}

export async function getPlanProgress(userId: string, planId: string): Promise<{
    totalTopics: number;
    completedTopics: number;
    topics: TopicProgress[];
}> {
    const db = getDB();
    const all = await db.collection<TopicProgress>("progress")
        .find({ userId, planId })
        .toArray();
    const completed = all.filter(t => t.completed).length;
    return {
        totalTopics: all.length,
        completedTopics: completed,
        topics: all,
    };
}