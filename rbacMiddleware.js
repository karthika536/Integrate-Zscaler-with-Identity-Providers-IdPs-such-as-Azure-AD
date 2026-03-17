import { hasPermission } from "./utils_permissions1.js";

export const allowRoles = (...roles) => (req, res, next) => {
  if (!req.user || !req.user.role) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  if (!roles.includes(req.user.role.name)) {
    return res.status(403).json({ success: false, message: "Forbidden: role restriction" });
  }

  next();
};

export const requirePermission = (permission) => (req, res, next) => {
  if (!req.user || !req.user.role) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  if (!hasPermission(req.user.role.name, permission)) {
    return res.status(403).json({ success: false, message: "Forbidden: missing permission" });
  }

  next();
};

