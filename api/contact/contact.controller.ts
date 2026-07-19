import { Request, Response, NextFunction } from "express";
import { getDB } from "../db";
import { generateId } from "../utils/helpers";

interface ContactMessage {
    _id: string;
    name: string;
    email: string;
    message: string;
    createdAt: Date;
}

export async function submitContact(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) return res.status(400).json({ message: "All fields required" });
        const db = getDB();
        await db.collection<ContactMessage>("contacts").insertOne({
            _id: generateId(),
            name,
            email,
            message,
            createdAt: new Date(),
        });
        res.status(201).json({ message: "Message received" });
    } catch (err) {
        next(err);
    }
}