import { Navigate, Route, Routes } from "react-router-dom";
import PublicLayout from "./PublicLayout.jsx";
import DashboardLayout from "./DashboardLayout.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import RoleGuard from "./RoleGuard.jsx";

import HomePage from "./HomePage.jsx";
import AboutPage from "./AboutPage.jsx";
import FeaturesPage from "./FeaturesPage.jsx";
import ArchitecturePage from "./ArchitecturePage.jsx";
import ContactPage from "./ContactPage.jsx";
import HelpPage from "./HelpPage.jsx";

import LoginPage from "./LoginPage.jsx";
import RegisterPage from "./RegisterPage.jsx";
import ForgotPasswordPage from "./ForgotPasswordPage.jsx";
import ResetPasswordPage from "./ResetPasswordPage.jsx";

import DashboardPage from "./DashboardPage.jsx";
import UserManagementPage from "./UserManagementPage.jsx";
import RoleManagementPage from "./RoleManagementPage.jsx";
import IdentityProvidersPage from "./IdentityProvidersPage.jsx";
import ZscalerPoliciesPage from "./ZscalerPoliciesPage.jsx";
import AccessLogsPage from "./AccessLogsPage.jsx";
import ReportsPage from "./ReportsPage.jsx";
import SettingsPage from "./SettingsPage.jsx";
import ProfilePage from "./ProfilePage.jsx";
import AppHelpPage from "./AppHelpPage.jsx";
import UnauthorizedPage from "./UnauthorizedPage.jsx";
import ForbiddenPage from "./ForbiddenPage.jsx";
import NotFoundPage from "./NotFoundPage.jsx";

const App = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/architecture" element={<ArchitecturePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/app" element={<DashboardLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route
            path="users"
            element={
              <RoleGuard permission="MANAGE_USERS">
                <UserManagementPage />
              </RoleGuard>
            }
          />
          <Route path="roles" element={<RoleManagementPage />} />
          <Route path="providers" element={<IdentityProvidersPage />} />
          <Route path="policies" element={<ZscalerPoliciesPage />} />
          <Route path="logs" element={<AccessLogsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="help" element={<AppHelpPage />} />
        </Route>
      </Route>

      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/forbidden" element={<ForbiddenPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
