"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleSave = toggleSave;
exports.checkSave = checkSave;
exports.savedList = savedList;
const saved_service_1 = require("./saved.service");
async function toggleSave(req, res, next) {
    try {
        const { planId } = req.params;
        const saved = await (0, saved_service_1.toggleSavePlan)(req.user.userId, planId);
        res.json({ saved });
    }
    catch (err) {
        next(err);
    }
}
async function checkSave(req, res, next) {
    try {
        const { planId } = req.params;
        const saved = await (0, saved_service_1.isPlanSaved)(req.user.userId, planId);
        res.json({ saved });
    }
    catch (err) {
        next(err);
    }
}
async function savedList(req, res, next) {
    try {
        const plans = await (0, saved_service_1.getSavedPlans)(req.user.userId);
        res.json(plans);
    }
    catch (err) {
        next(err);
    }
}
