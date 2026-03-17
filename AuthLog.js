import mongoose from "mongoose";

const authLogSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    provider: {
      type: String,
      enum: ["LOCAL", "AZURE_AD", "OKTA", "ACTIVE_DIRECTORY"],
      required: true
    },
    status: { type: String, enum: ["SUCCESS", "FAILED"], required: true },
    reason: { type: String },
    sourceIp: { type: String }
  },
  { timestamps: true }
);

const AuthLog = mongoose.model("AuthLog", authLogSchema);
export default AuthLog;

