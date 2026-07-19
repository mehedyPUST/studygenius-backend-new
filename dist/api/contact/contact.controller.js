"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitContact = submitContact;
const db_1 = require("../db");
const helpers_1 = require("../utils/helpers");
async function submitContact(req, res, next) {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message)
            return res.status(400).json({ message: "All fields required" });
        const db = (0, db_1.getDB)();
        await db.collection("contacts").insertOne({
            _id: (0, helpers_1.generateId)(),
            name,
            email,
            message,
            createdAt: new Date(),
        });
        res.status(201).json({ message: "Message received" });
    }
    catch (err) {
        next(err);
    }
}
