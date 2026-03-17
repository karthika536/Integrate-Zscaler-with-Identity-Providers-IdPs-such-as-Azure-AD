import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import roleRoutes from "./roleRoutes.js";
import providerRoutes from "./providerRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";
import policyRoutes from "./policyRoutes.js";
import logRoutes from "./logRoutes.js";
import reportRoutes from "./reportRoutes.js";
import settingRoutes from "./settingRoutes.js";
import { notFound } from "./notFound.js";
import { errorHandler } from "./errorMiddleware.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "API is healthy" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/policies", policyRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/settings", settingRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;

