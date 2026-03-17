export const ROLE_PERMISSIONS = {
  SUPER_ADMIN: ["*"],
  SECURITY_ADMIN: [
    "VIEW_DASHBOARD",
    "MANAGE_POLICIES",
    "VIEW_LOGS",
    "VIEW_REPORTS",
    "MANAGE_PROVIDERS",
    "MANAGE_ACCESS_REQUESTS"
  ],
  IT_ADMIN: [
    "VIEW_DASHBOARD",
    "MANAGE_USERS",
    "MANAGE_PROVIDERS",
    "VIEW_LOGS",
    "VIEW_REPORTS"
  ],
  EMPLOYEE: ["VIEW_DASHBOARD", "REQUEST_ACCESS", "VIEW_PROFILE"],
  AUDITOR: ["VIEW_DASHBOARD", "VIEW_LOGS", "VIEW_REPORTS", "VIEW_AUDIT_TRAIL"]
};

export const hasPermission = (roleName, permission) => {
  const permissions = ROLE_PERMISSIONS[roleName] || [];
  return permissions.includes("*") || permissions.includes(permission);
};

