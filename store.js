/**
 * In-memory data store — no MongoDB required.
 * All demo data is pre-loaded at startup. Changes made via the API
 * live in memory for the session and reset on server restart.
 */
import bcrypt from "bcryptjs";

// Pre-hash the shared demo password once at startup (cost 8 = fast)
const PASS = bcrypt.hashSync("Password@123", 8);

// ─── Reference objects (used as embedded "populated" refs) ────────────────────
const ROLES = {
  SUPER_ADMIN: {
    _id: "r1", name: "SUPER_ADMIN", displayName: "Super Admin",
    permissions: ["*"], description: "Full platform ownership"
  },
  SECURITY_ADMIN: {
    _id: "r2", name: "SECURITY_ADMIN", displayName: "Security Administrator",
    permissions: ["VIEW_DASHBOARD","MANAGE_POLICIES","VIEW_LOGS","VIEW_REPORTS","MANAGE_PROVIDERS","MANAGE_ACCESS_REQUESTS"],
    description: "Manages risk, policy and compliance"
  },
  IT_ADMIN: {
    _id: "r3", name: "IT_ADMIN", displayName: "IT Administrator",
    permissions: ["VIEW_DASHBOARD","MANAGE_USERS","MANAGE_PROVIDERS","VIEW_LOGS","VIEW_REPORTS"],
    description: "Manages identity lifecycle and operations"
  },
  EMPLOYEE: {
    _id: "r4", name: "EMPLOYEE", displayName: "Employee / End User",
    permissions: ["VIEW_DASHBOARD","REQUEST_ACCESS","VIEW_PROFILE"],
    description: "Consumes enterprise applications securely"
  },
  AUDITOR: {
    _id: "r5", name: "AUDITOR", displayName: "Auditor",
    permissions: ["VIEW_DASHBOARD","VIEW_LOGS","VIEW_REPORTS","VIEW_AUDIT_TRAIL"],
    description: "Reviews compliance posture and control evidence"
  }
};

const DEPTS = {
  SECOPS: { _id: "d1", name: "Security Operations", code: "SECOPS" },
  ITINF:  { _id: "d2", name: "IT Infrastructure",   code: "ITINF"  },
  FIN:    { _id: "d3", name: "Finance",              code: "FIN"    },
  HR:     { _id: "d4", name: "Human Resources",      code: "HR"     },
  ENG:    { _id: "d5", name: "Engineering",          code: "ENG"    }
};

// ─── Main store ───────────────────────────────────────────────────────────────
export const db = {

  roles: Object.values(ROLES),

  departments: Object.values(DEPTS),

  // Users have role/department already embedded (simulates Mongoose populate)
  users: [
    { _id: "u1", firstName: "Arjun",  lastName: "Mehta",  email: "superadmin@nimbus.com",     password: PASS, role: ROLES.SUPER_ADMIN,    department: DEPTS.SECOPS, groups: ["Leadership","ZeroTrustBoard"], provider: "AZURE_AD",         mfaEnabled: true,  status: "ACTIVE", lastLoginAt: null, createdAt: new Date() },
    { _id: "u2", firstName: "Sara",   lastName: "Khan",   email: "security.admin@nimbus.com", password: PASS, role: ROLES.SECURITY_ADMIN, department: DEPTS.SECOPS, groups: ["SecOps","BlueTeam"],          provider: "OKTA",             mfaEnabled: true,  status: "ACTIVE", lastLoginAt: null, createdAt: new Date() },
    { _id: "u3", firstName: "Rohit",  lastName: "Iyer",   email: "it.admin@nimbus.com",       password: PASS, role: ROLES.IT_ADMIN,       department: DEPTS.ITINF,  groups: ["IT-Global"],                  provider: "ACTIVE_DIRECTORY", mfaEnabled: true,  status: "ACTIVE", lastLoginAt: null, createdAt: new Date() },
    { _id: "u4", firstName: "Neha",   lastName: "Patel",  email: "employee@nimbus.com",       password: PASS, role: ROLES.EMPLOYEE,       department: DEPTS.ENG,    groups: ["Developers","AppTeam"],       provider: "AZURE_AD",         mfaEnabled: false, status: "ACTIVE", lastLoginAt: null, createdAt: new Date() },
    { _id: "u5", firstName: "David",  lastName: "Roy",    email: "auditor@nimbus.com",        password: PASS, role: ROLES.AUDITOR,        department: DEPTS.FIN,    groups: ["Compliance","Audit"],         provider: "OKTA",             mfaEnabled: true,  status: "ACTIVE", lastLoginAt: null, createdAt: new Date() }
  ],

  providers: [
    { _id: "p1", name: "AZURE_AD",         protocol: "OAUTH2", status: "CONNECTED", syncStatus: "SYNCED",  enabled: true, tenantId: "aad-tenant-001", clientId: "aad-client-201",  domain: "contoso.onmicrosoft.com", metadataUrl: "https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration", testConnectionResult: "Last test successful", groupRoleMappings: [{ groupName: "AAD-SecAdmins", mappedRole: "SECURITY_ADMIN" },{ groupName: "AAD-Employees", mappedRole: "EMPLOYEE" }], createdAt: new Date() },
    { _id: "p2", name: "OKTA",             protocol: "SAML",   status: "CONNECTED", syncStatus: "SYNCED",  enabled: true, tenantId: "okta-org-112",   clientId: "okta-client-556", domain: "nimbus.okta.com",         metadataUrl: "https://nimbus.okta.com/app/metadata",                                           testConnectionResult: "Last test successful", groupRoleMappings: [{ groupName: "OKTA-IT",    mappedRole: "IT_ADMIN"  },{ groupName: "OKTA-Audit", mappedRole: "AUDITOR"  }], createdAt: new Date() },
    { _id: "p3", name: "ACTIVE_DIRECTORY", protocol: "LDAP",   status: "DEGRADED",  syncStatus: "PENDING", enabled: true, tenantId: "ad-domain-22",   clientId: "ad-bind-service", domain: "corp.local",               metadataUrl: "ldap://dc01.corp.local",                                                         testConnectionResult: "Timeout on last test", groupRoleMappings: [{ groupName: "AD-Employees", mappedRole: "EMPLOYEE" },{ groupName: "AD-SuperAdmins", mappedRole: "SUPER_ADMIN" }], createdAt: new Date() }
  ],

  policies: [
    { _id: "pol1", name: "Privileged Admin Console Access",     category: "APP_ACCESS",     assignedRoles: ["SUPER_ADMIN","SECURITY_ADMIN"], assignedDepartments: ["Security Operations","IT Infrastructure"], conditionSummary: "MFA required + compliant device + corporate network",  action: "ALLOW", enabled: true, complianceScore: 98, createdAt: new Date() },
    { _id: "pol2", name: "Engineering Repository Segmentation", category: "SEGMENTATION",   assignedRoles: ["IT_ADMIN","EMPLOYEE"],          assignedDepartments: ["Engineering"],                            conditionSummary: "Allow only engineering group from managed devices",    action: "ALLOW", enabled: true, complianceScore: 91, createdAt: new Date() },
    { _id: "pol3", name: "Non-Compliant Device Restriction",    category: "DEVICE_POSTURE", assignedRoles: ["SUPER_ADMIN","SECURITY_ADMIN","IT_ADMIN","EMPLOYEE","AUDITOR"], assignedDepartments: ["Security Operations","IT Infrastructure","Finance","Human Resources","Engineering"], conditionSummary: "Block access if endpoint health check fails", action: "DENY", enabled: true, complianceScore: 95, createdAt: new Date() }
  ],

  accessLogs: [
    { _id: "al1", userId: "u1", applicationName: "Admin Policy Console",  result: "GRANTED", policyApplied: "Privileged Admin Console Access",     sourceIp: "10.10.1.21",  devicePosture: "COMPLIANT",     createdAt: new Date() },
    { _id: "al2", userId: "u4", applicationName: "Engineering Git Portal", result: "GRANTED", policyApplied: "Engineering Repository Segmentation", sourceIp: "10.10.9.44",  devicePosture: "COMPLIANT",     createdAt: new Date() },
    { _id: "al3", userId: "u4", applicationName: "Finance ERP",            result: "DENIED",  policyApplied: "Non-Compliant Device Restriction",    sourceIp: "172.16.5.80", devicePosture: "NON_COMPLIANT", createdAt: new Date() }
  ],

  authLogs: [
    { _id: "auth1", email: "employee@nimbus.com",       provider: "AZURE_AD",         status: "SUCCESS", reason: "SSO accepted",             createdAt: new Date() },
    { _id: "auth2", email: "unknown@nimbus.com",        provider: "OKTA",             status: "FAILED",  reason: "No user mapping",          createdAt: new Date() },
    { _id: "auth3", email: "security.admin@nimbus.com", provider: "OKTA",             status: "SUCCESS", reason: "SAML assertion valid",     createdAt: new Date() },
    { _id: "auth4", email: "it.admin@nimbus.com",       provider: "ACTIVE_DIRECTORY", status: "FAILED",  reason: "Invalid bind credentials", createdAt: new Date() }
  ],

  auditLogs: [
    { _id: "aud1", actorId: "u2", action: "Updated conditional access policy", entityType: "ZscalerPolicy",    details: "Set stricter posture check for privileged routes",  severity: "HIGH",   createdAt: new Date() },
    { _id: "aud2", actorId: "u3", action: "Tested Active Directory connector",  entityType: "IdentityProvider", details: "Connection degraded due to timeout on ldap://dc01", severity: "MEDIUM", createdAt: new Date() },
    { _id: "aud3", actorId: "u5", action: "Exported monthly access report",     entityType: "Report",           details: "Downloaded compliance snapshot in CSV",             severity: "LOW",    createdAt: new Date() }
  ],

  reports: [
    { _id: "rep1", title: "March Authentication Summary", type: "AUTH_SUMMARY",      generatedById: "u2", format: "PDF", status: "READY", summary: "95% authentication success rate across all IdPs",      createdAt: new Date() },
    { _id: "rep2", title: "Zscaler Access Compliance",    type: "POLICY_COMPLIANCE", generatedById: "u5", format: "CSV", status: "READY", summary: "3 policy violations detected in non-compliant devices", createdAt: new Date() }
  ],

  settings: {
    _id: "set1", organizationName: "Nimbus Enterprise", enforceMfa: true,
    sessionTimeoutMinutes: 30, emailNotifications: true, slackNotifications: true,
    defaultProvider: "AZURE_AD"
  }
};

// ─── Simple ID generator ──────────────────────────────────────────────────────
let _seq = 200;
export const newId = (prefix = "x") => `${prefix}-${++_seq}`;

