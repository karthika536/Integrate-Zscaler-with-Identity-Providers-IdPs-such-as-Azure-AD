import bcrypt from "bcryptjs";
import {
  connectDB, Department, Role, User, IdentityProvider,
  ZscalerPolicy, AccessLog, AuthLog, AuditLog, Report, Setting
} from "./database.js";

const departments = [
  { name: "Security Operations" },
  { name: "IT Infrastructure" },
  { name: "Engineering" },
  { name: "Finance" },
  { name: "HR" },
];

const roles = [
  { name: "SUPER_ADMIN",    label: "Super Admin",       permissions: ["MANAGE_USERS","MANAGE_ROLES","MANAGE_PROVIDERS","MANAGE_POLICIES","VIEW_LOGS","VIEW_REPORTS","MANAGE_SETTINGS"] },
  { name: "SECURITY_ADMIN", label: "Security Admin",    permissions: ["MANAGE_PROVIDERS","MANAGE_POLICIES","VIEW_LOGS","VIEW_REPORTS"] },
  { name: "IT_ADMIN",       label: "IT Admin",          permissions: ["MANAGE_USERS","MANAGE_PROVIDERS","VIEW_LOGS"] },
  { name: "EMPLOYEE",       label: "Employee",          permissions: [] },
  { name: "AUDITOR",        label: "Auditor",           permissions: ["VIEW_LOGS","VIEW_REPORTS"] },
];

const providers = [
  { name: "Azure AD",        type: "AZURE_AD",         status: "ACTIVE",   tenantId: "a1b2c3d4", clientId: "app-001", complianceScore: 97 },
  { name: "Okta",            type: "OKTA",             status: "ACTIVE",   domain: "nimbus.okta.com", complianceScore: 94 },
  { name: "Active Directory",type: "ACTIVE_DIRECTORY", status: "DEGRADED", domain: "dc01.nimbus.local", complianceScore: 78 },
];

const policies = [
  { name: "Zero Trust Admin Policy",     description: "Strict posture-based access for privileged routes",    action: "ALLOW", priority: 1, complianceScore: 99, status: "ACTIVE" },
  { name: "Developer Access Policy",     description: "Allow developers to access Git and CI/CD systems",     action: "ALLOW", priority: 2, complianceScore: 92, status: "ACTIVE" },
  { name: "Finance Isolation Policy",    description: "Block non-compliant devices from Finance ERP",         action: "DENY",  priority: 3, complianceScore: 88, status: "ACTIVE" },
  { name: "MFA Enforcement Policy",      description: "Require MFA for all admin accounts",                   action: "ALLOW", priority: 4, complianceScore: 95, status: "ACTIVE" },
];

export const runSeed = async () => {
  connectDB();

  // Clear
  await Department.deleteMany();
  await Role.deleteMany();
  await User.deleteMany();
  await IdentityProvider.deleteMany();
  await ZscalerPolicy.deleteMany();
  await AccessLog.deleteMany();
  await AuthLog.deleteMany();
  await AuditLog.deleteMany();
  await Report.deleteMany();
  await Setting.deleteMany();

  const createdDepartments = await Department.insertMany(departments);
  const createdRoles       = await Role.insertMany(roles);
  const createdProviders   = await IdentityProvider.insertMany(providers);
  const createdPolicies    = await ZscalerPolicy.insertMany(policies);

  const roleByName = Object.fromEntries(createdRoles.map((r) => [r.name, r]));
  const deptByName = Object.fromEntries(createdDepartments.map((d) => [d.name, d]));

  const pass = await bcrypt.hash("Password@123", 10);

  const users = await User.insertMany([
    { firstName: "Arjun",  lastName: "Mehta",  email: "superadmin@nimbus.com",      password: pass, role: roleByName.SUPER_ADMIN,    roleId: roleByName.SUPER_ADMIN._id,    department: deptByName["Security Operations"], provider: "AZURE_AD",          mfaEnabled: true,  status: "ACTIVE" },
    { firstName: "Sara",   lastName: "Khan",   email: "security.admin@nimbus.com",  password: pass, role: roleByName.SECURITY_ADMIN, roleId: roleByName.SECURITY_ADMIN._id, department: deptByName["Security Operations"], provider: "OKTA",              mfaEnabled: true,  status: "ACTIVE" },
    { firstName: "Rohit",  lastName: "Iyer",   email: "it.admin@nimbus.com",        password: pass, role: roleByName.IT_ADMIN,       roleId: roleByName.IT_ADMIN._id,       department: deptByName["IT Infrastructure"],  provider: "ACTIVE_DIRECTORY",  mfaEnabled: true,  status: "ACTIVE" },
    { firstName: "Neha",   lastName: "Patel",  email: "employee@nimbus.com",        password: pass, role: roleByName.EMPLOYEE,       roleId: roleByName.EMPLOYEE._id,       department: deptByName["Engineering"],        provider: "AZURE_AD",          mfaEnabled: false, status: "ACTIVE" },
    { firstName: "David",  lastName: "Roy",    email: "auditor@nimbus.com",         password: pass, role: roleByName.AUDITOR,        roleId: roleByName.AUDITOR._id,        department: deptByName["Finance"],            provider: "OKTA",              mfaEnabled: true,  status: "ACTIVE" },
  ]);

  await AuthLog.insertMany([
    { email: "employee@nimbus.com",        provider: "AZURE_AD",         status: "SUCCESS", reason: "SSO accepted",               createdAt: new Date() },
    { email: "unknown@nimbus.com",         provider: "OKTA",             status: "FAILED",  reason: "No user mapping",            createdAt: new Date() },
    { email: "security.admin@nimbus.com",  provider: "OKTA",             status: "SUCCESS", reason: "SAML assertion valid",       createdAt: new Date() },
    { email: "it.admin@nimbus.com",        provider: "ACTIVE_DIRECTORY", status: "FAILED",  reason: "Invalid bind credentials",   createdAt: new Date() },
  ]);

  await AccessLog.insertMany([
    { userId: users[0]._id, userEmail: "superadmin@nimbus.com",     applicationName: "Admin Policy Console",   result: "GRANTED", policyApplied: createdPolicies[0].name, sourceIp: "10.10.1.21",  devicePosture: "COMPLIANT",     createdAt: new Date() },
    { userId: users[3]._id, userEmail: "employee@nimbus.com",       applicationName: "Engineering Git Portal", result: "GRANTED", policyApplied: createdPolicies[1].name, sourceIp: "10.10.9.44",  devicePosture: "COMPLIANT",     createdAt: new Date() },
    { userId: users[3]._id, userEmail: "employee@nimbus.com",       applicationName: "Finance ERP",            result: "DENIED",  policyApplied: createdPolicies[2].name, sourceIp: "172.16.5.80", devicePosture: "NON_COMPLIANT", createdAt: new Date() },
  ]);

  await AuditLog.insertMany([
    { actorEmail: "security.admin@nimbus.com", action: "Updated conditional access policy", entityType: "ZscalerPolicy", details: "Set stricter posture check for privileged routes", severity: "HIGH",   createdAt: new Date() },
    { actorEmail: "it.admin@nimbus.com",       action: "Tested Active Directory connector",  entityType: "IdentityProvider", details: "Connection degraded due to timeout on ldap://dc01", severity: "MEDIUM", createdAt: new Date() },
    { actorEmail: "auditor@nimbus.com",        action: "Exported monthly access report",     entityType: "Report",           details: "Downloaded compliance snapshot in CSV",              severity: "LOW",    createdAt: new Date() },
  ]);

  await Report.insertMany([
    { title: "March Authentication Summary", type: "AUTH_SUMMARY",     generatedBy: "security.admin@nimbus.com", format: "PDF", summary: "95% authentication success rate across all IdPs",     createdAt: new Date() },
    { title: "Zscaler Access Compliance",    type: "POLICY_COMPLIANCE", generatedBy: "auditor@nimbus.com",        format: "CSV", summary: "3 policy violations detected in non-compliant devices", createdAt: new Date() },
  ]);

  await Setting.create({
    organizationName: "Nimbus Enterprise",
    enforceMfa: true,
    sessionTimeoutMinutes: 30,
    emailNotifications: true,
    slackNotifications: true,
    defaultProvider: "AZURE_AD",
  });

  console.log("✅ Seed complete. Demo: employee@nimbus.com / Password@123");
};
