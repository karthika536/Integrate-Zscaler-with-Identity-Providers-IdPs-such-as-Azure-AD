import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
  console.log(`📋 Demo logins:`);
  console.log(`   superadmin@nimbus.com / security.admin@nimbus.com / it.admin@nimbus.com`);
  console.log(`   employee@nimbus.com  / auditor@nimbus.com`);
  console.log(`🔑 Password for all: Password@123`);
});
