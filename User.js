import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    groups: [{ type: String }],
    provider: {
      type: String,
      enum: ["LOCAL", "AZURE_AD", "OKTA", "ACTIVE_DIRECTORY"],
      default: "LOCAL"
    },
    providerAccountId: { type: String },
    mfaEnabled: { type: Boolean, default: false },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
    lastLoginAt: Date
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;

