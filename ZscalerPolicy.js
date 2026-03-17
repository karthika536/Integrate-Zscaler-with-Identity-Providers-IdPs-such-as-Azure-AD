import mongoose from "mongoose";

const zscalerPolicySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ["APP_ACCESS", "DEVICE_POSTURE", "THREAT_PROTECTION", "SEGMENTATION"],
      required: true
    },
    assignedRoles: [{ type: String }],
    assignedDepartments: [{ type: String }],
    conditionSummary: { type: String },
    action: { type: String, enum: ["ALLOW", "DENY", "CHALLENGE"], default: "ALLOW" },
    enabled: { type: Boolean, default: true },
    complianceScore: { type: Number, default: 90 }
  },
  { timestamps: true }
);

const ZscalerPolicy = mongoose.model("ZscalerPolicy", zscalerPolicySchema);
export default ZscalerPolicy;

