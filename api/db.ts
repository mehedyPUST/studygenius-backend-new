import { MongoClient, Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI!;
const DB_NAME = process.env.DB_NAME || "studygenius";

let client: MongoClient;
let db: Db;

export async function connectToDB(): Promise<Db> {
    if (db) return db;
    if (!MONGODB_URI) throw new Error("MONGODB_URI not set");
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    console.log("Connected to MongoDB");
    return db;
}

export function getDB(): Db {
    if (!db) throw new Error("Database not connected");
    return db;
}