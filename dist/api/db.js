"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDB = connectToDB;
exports.getDB = getDB;
const mongodb_1 = require("mongodb");
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || "studygenius";
let client;
let db;
async function connectToDB() {
    if (db)
        return db;
    if (!MONGODB_URI)
        throw new Error("MONGODB_URI not set");
    client = new mongodb_1.MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    console.log("Connected to MongoDB");
    return db;
}
function getDB() {
    if (!db)
        throw new Error("Database not connected");
    return db;
}
