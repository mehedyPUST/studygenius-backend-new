"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPlan = createPlan;
exports.getPlanById = getPlanById;
exports.updatePlan = updatePlan;
exports.deletePlan = deletePlan;
exports.getUserPlans = getUserPlans;
exports.explorePlans = explorePlans;
exports.addReview = addReview;
exports.getReviews = getReviews;
const db_1 = require("../db");
const helpers_1 = require("../utils/helpers");
async function createPlan(data) {
    const db = (0, db_1.getDB)();
    const plan = {
        _id: (0, helpers_1.generateId)(),
        ...data,
        rating: 0,
        reviewCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    await db.collection("plans").insertOne(plan);
    return plan;
}
async function getPlanById(id) {
    const db = (0, db_1.getDB)();
    return db.collection("plans").findOne({ _id: id });
}
async function updatePlan(id, userId, data) {
    const db = (0, db_1.getDB)();
    const result = await db
        .collection("plans")
        .findOneAndUpdate({ _id: id, userId }, { $set: { ...data, updatedAt: new Date() } }, { returnDocument: "after" });
    return result;
}
async function deletePlan(id, userId) {
    const db = (0, db_1.getDB)();
    const res = await db.collection("plans").deleteOne({ _id: id, userId });
    return res.deletedCount === 1;
}
async function getUserPlans(userId) {
    const db = (0, db_1.getDB)();
    return db
        .collection("plans")
        .find({ userId })
        .sort({ createdAt: -1 })
        .toArray();
}
async function explorePlans(filters) {
    const db = (0, db_1.getDB)();
    const { search, subject, difficulty, sort = "newest", page = 1, limit = 12 } = filters;
    const query = { isPublished: true };
    if (search)
        query.title = { $regex: search, $options: "i" };
    if (subject)
        query.subject = subject;
    if (difficulty)
        query.difficulty = difficulty;
    let sortOption = {};
    if (sort === "newest")
        sortOption = { createdAt: -1 };
    else if (sort === "rating")
        sortOption = { rating: -1 };
    else if (sort === "duration")
        sortOption = { duration: 1 };
    const total = await db.collection("plans").countDocuments(query);
    const plans = await db
        .collection("plans")
        .find(query)
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray();
    return { plans, total, page, totalPages: Math.ceil(total / limit) };
}
async function addReview(planId, userId, userName, rating, comment) {
    const db = (0, db_1.getDB)();
    const review = {
        _id: (0, helpers_1.generateId)(),
        planId,
        userId,
        userName,
        rating,
        comment,
        createdAt: new Date(),
    };
    await db.collection("reviews").insertOne(review);
    const reviews = await db.collection("reviews").find({ planId }).toArray();
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await db
        .collection("plans")
        .updateOne({ _id: planId }, { $set: { rating: Math.round(avgRating * 10) / 10, reviewCount: reviews.length } });
    return review;
}
async function getReviews(planId) {
    const db = (0, db_1.getDB)();
    return db
        .collection("reviews")
        .find({ planId })
        .sort({ createdAt: -1 })
        .toArray();
}
