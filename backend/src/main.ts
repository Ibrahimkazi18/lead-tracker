import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/routes";
import cron from "node-cron";

import redis from "./utils/redis";
import { archiveOldLeads } from "./utils/archiveOldLeads";
import prisma from "./utils/prisma";
import { sendEmail } from "./utils/send-email";

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: ["http://localhost:3000", "https://openleads.vercel.app", "https://openleads.in", "https://www.openleads.in"],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api", router);

cron.schedule("0 0 * * *", () => {
  archiveOldLeads()
});

cron.schedule("0 0 * * *", async () => {
  const now = new Date();

  const expiredSubscriptions = await prisma.agentSubscription.findMany({
    where: {
      expiresAt: { lte: now },
      isActive: true,
    },
    include: { agent: true }
  });

  for (const sub of expiredSubscriptions) {
    await prisma.agentSubscription.update({
      where: { id: sub.id },
      data: { isActive: false, status: "expired" },
    });

    const date = new Date(sub?.expiresAt || sub.agent.subscriptionEnd).toLocaleDateString();

    await sendEmail(sub.agent.email, "Your subscription has expired", "plan-expiry-mail", {name: sub.agent.name, date});
  }
});

redis.on("error", (err) => console.error("Redis error:", err));

// Server start
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
