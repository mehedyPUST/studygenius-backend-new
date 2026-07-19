"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTopicProgress = updateTopicProgress;
exports.getProgress = getProgress;
const progress_service_1 = require("./progress.service");
async function updateTopicProgress(req, res, next) {
    try {
        const { planId, topic, completed } = req.body;
        const result = await (0, progress_service_1.setTopicCompleted)(req.user.userId, planId, topic, completed);
        res.json(result);
    }
    catch (err) {
        next(err);
    }
}
async function getProgress(req, res, next) {
    try {
        const planId = req.params.planId;
        const data = await (0, progress_service_1.getPlanProgress)(req.user.userId, planId);
        res.json(data);
    }
    catch (err) {
        next(err);
    }
}
