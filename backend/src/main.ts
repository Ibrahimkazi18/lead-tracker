import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/routes";
import cron from "node-cron";

import redis from "./utils/redis";
import { archiveOldLeads } from "./utils/archiveOldLeads";

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api", router);

cron.schedule("0 0 * * *", () => {
  console.log("Cron job fired");
  archiveOldLeads()
});

redis.on("connect", () => console.log("Redis connected!"));
redis.on("error", (err) => console.error("Redis error:", err));

// Server start
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
