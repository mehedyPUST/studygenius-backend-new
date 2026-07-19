import { getDB } from "../db";
import bcrypt from "bcryptjs";
import { generateId } from "../utils/helpers";
import { User } from "../models/User";

export async function createUser(name: string, email: string, password: string): Promise<User> {
    const db = getDB();
    const users = db.collection<User>("users");
    const existing = await users.findOne({ email });
    if (existing) throw new Error("Email already in use");
    const hashed = await bcrypt.hash(password, 10);
    const user: User = {
        _id: generateId(),
        name,
        email,
        password: hashed,
        role: "user",
        createdAt: new Date(),
    };
    await users.insertOne(user);
    return user;
}

export async function findUserByEmail(email: string): Promise<User | null> {
    const db = getDB();
    return db.collection<User>("users").findOne({ email });
}

export async function findUserById(id: string): Promise<User | null> {
    const db = getDB();
    return db.collection<User>("users").findOne({ _id: id });
}

export async function createUserFromGoogle(
    name: string,
    email: string,
    googleId: string
): Promise<User> {
    const db = getDB();
    const users = db.collection<User>("users");
    const user: User = {
        _id: generateId(),
        name,
        email,
        password: "",
        role: "user",
        createdAt: new Date(),
        googleId,
    };
    await users.insertOne(user);
    return user;
}