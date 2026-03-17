import mongoose from "mongoose";

const identityProviderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, enum: ["AZURE_AD", "OKTA", "ACTIVE_DIRECTORY"] },
    protocol: { type: String, enum: ["SAML", "OAUTH2", "LDAP"], required: true },
    status: { type: String, enum: ["CONNECTED", "DISCONNECTED", "DEGRADED"], default: "CONNECTED" },
    syncStatus: { type: String, enum: ["SYNCED", "PENDING", "FAILED"], default: "SYNCED" },
    enabled: { type: Boolean, default: true },
    tenantId: String,
    clientId: String,
    domain: String,
    metadataUrl: String,
    testConnectionResult: { type: String, default: "Last test successful" },
    groupRoleMappings: [
      {
        groupName: String,
        mappedRole: String
      }
    ]
  },
  { timestamps: true }
);

const IdentityProvider = mongoose.model("IdentityProvider", identityProviderSchema);
export default IdentityProvider;

