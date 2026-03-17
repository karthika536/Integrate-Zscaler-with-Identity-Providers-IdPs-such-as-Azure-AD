export const departments = [
  { name: "Security Operations", code: "SECOPS" },
  { name: "IT Infrastructure", code: "ITINF" },
  { name: "Finance", code: "FIN" },
  { name: "Human Resources", code: "HR" },
  { name: "Engineering", code: "ENG" }
];

export const roles = [
  {
    name: "SUPER_ADMIN",
    displayName: "Super Admin",
    permissions: ["*"],
    description: "Full platform ownership and governance"
  },
  {
    name: "SECURITY_ADMIN",
    displayName: "Security Administrator",
    permissions: [
      "VIEW_DASHBOARD",
      "MANAGE_POLICIES",
      "VIEW_LOGS",
      "VIEW_REPORTS",
      "MANAGE_PROVIDERS",
      "MANAGE_ACCESS_REQUESTS"
    ],
    description: "Manages risk, policy and compliance"
  },
  {
    name: "IT_ADMIN",
    displayName: "IT Administrator",
    permissions: ["VIEW_DASHBOARD", "MANAGE_USERS", "MANAGE_PROVIDERS", "VIEW_LOGS", "VIEW_REPORTS"],
    description: "Manages identity lifecycle and operations"
  },
  {
    name: "EMPLOYEE",
    displayName: "Employee / End User",
    permissions: ["VIEW_DASHBOARD", "REQUEST_ACCESS", "VIEW_PROFILE"],
    description: "Consumes enterprise applications securely"
  },
  {
    name: "AUDITOR",
    displayName: "Auditor",
    permissions: ["VIEW_DASHBOARD", "VIEW_LOGS", "VIEW_REPORTS", "VIEW_AUDIT_TRAIL"],
    description: "Reviews compliance posture and control evidence"
  }
];

export const providers = [
  {
    name: "AZURE_AD",
    protocol: "OAUTH2",
    status: "CONNECTED",
    syncStatus: "SYNCED",
    enabled: true,
    tenantId: "aad-tenant-001",
    clientId: "aad-client-201",
    domain: "contoso.onmicrosoft.com",
    metadataUrl: "https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration",
    groupRoleMappings: [
      { groupName: "AAD-SecAdmins", mappedRole: "SECURITY_ADMIN" },
      { groupName: "AAD-Employees", mappedRole: "EMPLOYEE" }
    ]
  },
  {
    name: "OKTA",
    protocol: "SAML",
    status: "CONNECTED",
    syncStatus: "SYNCED",
    enabled: true,
    tenantId: "okta-org-112",
    clientId: "okta-client-556",
    domain: "nimbus.okta.com",
    metadataUrl: "https://nimbus.okta.com/app/metadata",
    groupRoleMappings: [
      { groupName: "OKTA-IT", mappedRole: "IT_ADMIN" },
      { groupName: "OKTA-Audit", mappedRole: "AUDITOR" }
    ]
  },
  {
    name: "ACTIVE_DIRECTORY",
    protocol: "LDAP",
    status: "DEGRADED",
    syncStatus: "PENDING",
    enabled: true,
    tenantId: "ad-domain-22",
    clientId: "ad-bind-service",
    domain: "corp.local",
    metadataUrl: "ldap://dc01.corp.local",
    groupRoleMappings: [
      { groupName: "AD-Employees", mappedRole: "EMPLOYEE" },
      { groupName: "AD-SuperAdmins", mappedRole: "SUPER_ADMIN" }
    ]
  }
];

export const policies = [
  {
    name: "Privileged Admin Console Access",
    category: "APP_ACCESS",
    assignedRoles: ["SUPER_ADMIN", "SECURITY_ADMIN"],
    assignedDepartments: ["Security Operations", "IT Infrastructure"],
    conditionSummary: "MFA required + compliant device + corporate network",
    action: "ALLOW",
    enabled: true,
    complianceScore: 98
  },
  {
    name: "Engineering Repository Segmentation",
    category: "SEGMENTATION",
    assignedRoles: ["IT_ADMIN", "EMPLOYEE"],
    assignedDepartments: ["Engineering"],
    conditionSummary: "Allow only engineering group from managed devices",
    action: "ALLOW",
    enabled: true,
    complianceScore: 91
  },
  {
    name: "Non-Compliant Device Restriction",
    category: "DEVICE_POSTURE",
    assignedRoles: ["SUPER_ADMIN", "SECURITY_ADMIN", "IT_ADMIN", "EMPLOYEE", "AUDITOR"],
    assignedDepartments: ["Security Operations", "IT Infrastructure", "Finance", "Human Resources", "Engineering"],
    conditionSummary: "Block access if endpoint health check fails",
    action: "DENY",
    enabled: true,
    complianceScore: 95
  }
];

