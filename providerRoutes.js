import express from "express";
import {
  getProviders,
  createProvider,
  updateProvider,
  testProviderConnection
} from "./providerController.js";
import { protect } from "./authMiddleware.js";
import { requirePermission } from "./rbacMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", requirePermission("MANAGE_PROVIDERS"), getProviders);
router.post("/", requirePermission("MANAGE_PROVIDERS"), createProvider);
router.put("/:id", requirePermission("MANAGE_PROVIDERS"), updateProvider);
router.post("/:id/test", requirePermission("MANAGE_PROVIDERS"), testProviderConnection);

export default router;

