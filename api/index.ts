import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectToDB } from "./db";
import authRoutes from "./auth/auth.routes";
import planRoutes from "./plans/plans.routes";
import aiRoutes from "./ai/ai.routes";
import progressRoutes from "./progress/progress.routes";
import savedRoutes from "./saved/saved.routes";
import contactRoutes from "./contact/contact.routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(cors({
    origin: true,
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Connect to DB on every request (serverless‑safe)
app.use(async (req, _res, next) => {
    try {
        await connectToDB();
        next();
    } catch (err) {
        next(err);
    }
});

app.use("/api/auth", authRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/saved", savedRoutes);
app.use("/api/contact", contactRoutes);

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.use(errorHandler);

// ✅ Serverless function handler
export default function handler(req: any, res: any) {
    return app(req, res);
}