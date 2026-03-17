export const rolePermissions = {
  SUPER_ADMIN: ["*"],
  SECURITY_ADMIN: ["VIEW_DASHBOARD", "MANAGE_POLICIES", "VIEW_LOGS", "VIEW_REPORTS", "MANAGE_PROVIDERS"],
  IT_ADMIN: ["VIEW_DASHBOARD", "MANAGE_USERS", "MANAGE_PROVIDERS", "VIEW_LOGS", "VIEW_REPORTS"],
  EMPLOYEE: ["VIEW_DASHBOARD", "VIEW_PROFILE"],
  AUDITOR: ["VIEW_DASHBOARD", "VIEW_LOGS", "VIEW_REPORTS"]
};

export const canAccess = (role, permission) => {
  const perms = rolePermissions[role] || [];
  return perms.includes("*") || perms.includes(permission);
};

