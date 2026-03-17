import mongoose from "mongoose";

const accessLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    applicationName: { type: String, required: true },
    result: { type: String, enum: ["GRANTED", "DENIED"], required: true },
    policyApplied: { type: String },
    sourceIp: { type: String },
    devicePosture: { type: String, enum: ["COMPLIANT", "NON_COMPLIANT"], default: "COMPLIANT" }
  },
  { timestamps: true }
);

const AccessLog = mongoose.model("AccessLog", accessLogSchema);
export default AccessLog;

