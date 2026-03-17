import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    organizationName: { type: String, default: "Nimbus Enterprise" },
    enforceMfa: { type: Boolean, default: true },
    sessionTimeoutMinutes: { type: Number, default: 30 },
    emailNotifications: { type: Boolean, default: true },
    slackNotifications: { type: Boolean, default: false },
    defaultProvider: {
      type: String,
      enum: ["AZURE_AD", "OKTA", "ACTIVE_DIRECTORY"],
      default: "AZURE_AD"
    }
  },
  { timestamps: true }
);

const Setting = mongoose.model("Setting", settingSchema);
export default Setting;

