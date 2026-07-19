import { getDB } from "../db";
import { generateId } from "../utils/helpers";

export interface Plan {
    _id: string;
    userId: string;
    title: string;
    description: string;
    subject: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    duration: number;
    topics: string[];
    imageUrl?: string;
    isPublished: boolean;
    rating?: number;
    reviewCount?: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Review {
    _id: string;
    planId: string;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt: Date;
}

export async function createPlan(
    data: Omit<Plan, "_id" | "createdAt" | "updatedAt" | "rating" | "reviewCount">
): Promise<Plan> {
    const db = getDB();
    const plan: Plan = {
        _id: generateId(),
        ...data,
        rating: 0,
        reviewCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    await db.collection<Plan>("plans").insertOne(plan);
    return plan;
}

export async function getPlanById(id: string): Promise<Plan | null> {
    const db = getDB();
    return db.collection<Plan>("plans").findOne({ _id: id });
}

export async function updatePlan(
    id: string,
    userId: string,
    data: Partial<Plan>
): Promise<Plan | null> {
    const db = getDB();
    const result = await db
        .collection<Plan>("plans")
        .findOneAndUpdate(
            { _id: id, userId },
            { $set: { ...data, updatedAt: new Date() } },
            { returnDocument: "after" }
        );
    return result;
}

export async function deletePlan(id: string, userId: string): Promise<boolean> {
    const db = getDB();
    const res = await db.collection<Plan>("plans").deleteOne({ _id: id, userId });
    return res.deletedCount === 1;
}

export async function getUserPlans(userId: string): Promise<Plan[]> {
    const db = getDB();
    return db
        .collection<Plan>("plans")
        .find({ userId })
        .sort({ createdAt: -1 })
        .toArray();
}

export interface ExploreFilters {
    search?: string;
    subject?: string;
    difficulty?: string;
    sort?: "newest" | "rating" | "duration";
    page?: number;
    limit?: number;
}

export async function explorePlans(filters: ExploreFilters) {
    const db = getDB();
    const { search, subject, difficulty, sort = "newest", page = 1, limit = 12 } = filters;
    const query: any = { isPublished: true };
    if (search) query.title = { $regex: search, $options: "i" };
    if (subject) query.subject = subject;
    if (difficulty) query.difficulty = difficulty;

    let sortOption: any = {};
    if (sort === "newest") sortOption = { createdAt: -1 };
    else if (sort === "rating") sortOption = { rating: -1 };
    else if (sort === "duration") sortOption = { duration: 1 };

    const total = await db.collection<Plan>("plans").countDocuments(query);
    const plans = await db
        .collection<Plan>("plans")
        .find(query)
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray();
    return { plans, total, page, totalPages: Math.ceil(total / limit) };
}

export async function addReview(
    planId: string,
    userId: string,
    userName: string,
    rating: number,
    comment: string
): Promise<Review> {
    const db = getDB();
    const review: Review = {
        _id: generateId(),
        planId,
        userId,
        userName,
        rating,
        comment,
        createdAt: new Date(),
    };
    await db.collection<Review>("reviews").insertOne(review);

    const reviews = await db.collection<Review>("reviews").find({ planId }).toArray();
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await db
        .collection<Plan>("plans")
        .updateOne(
            { _id: planId },
            { $set: { rating: Math.round(avgRating * 10) / 10, reviewCount: reviews.length } }
        );
    return review;
}

export async function getReviews(planId: string): Promise<Review[]> {
    const db = getDB();
    return db
        .collection<Review>("reviews")
        .find({ planId })
        .sort({ createdAt: -1 })
        .toArray();
}