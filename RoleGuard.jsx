import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import { canAccess } from "./permissions.js";

const RoleGuard = ({ permission, children }) => {
  const { user } = useAuth();

  if (!user || !canAccess(user.role, permission)) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
};

export default RoleGuard;
