"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.findUserByEmail = findUserByEmail;
exports.findUserById = findUserById;
exports.createUserFromGoogle = createUserFromGoogle;
const db_1 = require("../db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const helpers_1 = require("../utils/helpers");
async function createUser(name, email, password) {
    const db = (0, db_1.getDB)();
    const users = db.collection("users");
    const existing = await users.findOne({ email });
    if (existing)
        throw new Error("Email already in use");
    const hashed = await bcryptjs_1.default.hash(password, 10);
    const user = {
        _id: (0, helpers_1.generateId)(),
        name,
        email,
        password: hashed,
        role: "user",
        createdAt: new Date(),
    };
    await users.insertOne(user);
    return user;
}
async function findUserByEmail(email) {
    const db = (0, db_1.getDB)();
    return db.collection("users").findOne({ email });
}
async function findUserById(id) {
    const db = (0, db_1.getDB)();
    return db.collection("users").findOne({ _id: id });
}
async function createUserFromGoogle(name, email, googleId) {
    const db = (0, db_1.getDB)();
    const users = db.collection("users");
    const user = {
        _id: (0, helpers_1.generateId)(),
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
