import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["USER_ACTIVITY", "AUTH_SUMMARY", "IDP_USAGE", "POLICY_COMPLIANCE", "ZSCALER_ACCESS"],
      required: true
    },
    generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    format: { type: String, enum: ["PDF", "CSV"], default: "PDF" },
    status: { type: String, enum: ["READY", "PROCESSING"], default: "READY" },
    summary: { type: String }
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);
export default Report;

