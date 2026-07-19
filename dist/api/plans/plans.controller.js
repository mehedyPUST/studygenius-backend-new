"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = create;
exports.getOne = getOne;
exports.update = update;
exports.remove = remove;
exports.myPlans = myPlans;
exports.explore = explore;
exports.review = review;
exports.getPlanReviews = getPlanReviews;
const plans_service_1 = require("./plans.service");
async function create(req, res, next) {
    try {
        const data = req.body;
        const plan = await (0, plans_service_1.createPlan)({ ...data, userId: req.user.userId });
        res.status(201).json(plan);
    }
    catch (err) {
        next(err);
    }
}
async function getOne(req, res, next) {
    try {
        const plan = await (0, plans_service_1.getPlanById)(req.params.id);
        if (!plan)
            return res.status(404).json({ message: "Plan not found" });
        res.json(plan);
    }
    catch (err) {
        next(err);
    }
}
async function update(req, res, next) {
    try {
        const plan = await (0, plans_service_1.updatePlan)(req.params.id, req.user.userId, req.body);
        if (!plan)
            return res.status(404).json({ message: "Plan not found or unauthorized" });
        res.json(plan);
    }
    catch (err) {
        next(err);
    }
}
async function remove(req, res, next) {
    try {
        const success = await (0, plans_service_1.deletePlan)(req.params.id, req.user.userId);
        if (!success)
            return res.status(404).json({ message: "Plan not found or unauthorized" });
        res.json({ message: "Plan deleted" });
    }
    catch (err) {
        next(err);
    }
}
async function myPlans(req, res, next) {
    try {
        const plans = await (0, plans_service_1.getUserPlans)(req.user.userId);
        res.json(plans);
    }
    catch (err) {
        next(err);
    }
}
async function explore(req, res, next) {
    try {
        const filters = {
            search: req.query.search,
            subject: req.query.subject,
            difficulty: req.query.difficulty,
            sort: req.query.sort,
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 12,
        };
        const result = await (0, plans_service_1.explorePlans)(filters);
        res.json(result);
    }
    catch (err) {
        next(err);
    }
}
async function review(req, res, next) {
    try {
        const { rating, comment } = req.body;
        const rev = await (0, plans_service_1.addReview)(req.params.id, req.user.userId, req.user.email, rating, comment);
        res.status(201).json(rev);
    }
    catch (err) {
        next(err);
    }
}
async function getPlanReviews(req, res, next) {
    try {
        const reviews = await (0, plans_service_1.getReviews)(req.params.id);
        res.json(reviews);
    }
    catch (err) {
        next(err);
    }
}
