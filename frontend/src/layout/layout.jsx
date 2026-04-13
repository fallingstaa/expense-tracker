import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";
import RegisterPage from "../pages/auth/registerPage";
import RootLayout from "./rootLayout";
import LoginPage from "../pages/auth/loginPage";
import DashboardPage from "../pages/dashboard/dashboardPage";
import ForgotPasswordPage from "../pages/auth/forgotPasswordPage";
import ResetPaswordPage from "../pages/auth/resetPaswordPage";
import VerifyEmailPage from "../pages/auth/verifyEmailPage";
import ProtectedRoute from "../components/auth/protectedRoute";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Navigate to="/register" />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPaswordPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } />
    </Route>,
  ),
);
