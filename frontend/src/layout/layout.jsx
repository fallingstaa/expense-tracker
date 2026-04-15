// import {
//   createBrowserRouter,
//   createRoutesFromElements,
//   Route,
//   Navigate,
// } from "react-router-dom";

// import RegisterPage from "../pages/auth/registerPage";
// import RootLayout from "./rootLayout";
// import LoginPage from "../pages/auth/loginPage";
// import DashboardPage from "../pages/dashboard/dashboardPage";
// import ForgotPasswordPage from "../pages/auth/forgotPasswordPage";
// import ResetPaswordPage from "../pages/auth/resetPaswordPage";
// import VerifyEmailPage from "../pages/auth/verifyEmailPage";
// import ProtectedRoute from "../components/auth/protectedRoute";

// export const router = createBrowserRouter(
//   createRoutesFromElements(
//     <Route path="/" element={<RootLayout />}>
//       <Route index element={<Navigate to="/register" />} />
//       <Route path="register" element={<RegisterPage />} />
//       <Route path="login" element={<LoginPage />} />
//       <Route path="forgot-password" element={<ForgotPasswordPage />} />
//       <Route path="reset-password" element={<ResetPaswordPage />} />
//       <Route path="verify-email" element={<VerifyEmailPage />} />
//       <Route
//         path="dashboard"
//         element={
//           <ProtectedRoute>
//             <DashboardPage />
//           </ProtectedRoute>
//         }
//       />
//     </Route>,
//   ),
// );

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import RootLayout from "./rootLayout";
import ProtectedRoute from "../components/auth/protectedRoute";

const RegisterPage = lazy(() => import("../pages/auth/registerPage"));
const LoginPage = lazy(() => import("../pages/auth/loginPage"));
const DashboardPage = lazy(() => import("../pages/dashboard/dashboardPage"));
const ForgotPasswordPage = lazy(
  () => import("../pages/auth/forgotPasswordPage"),
);
const ResetPaswordPage = lazy(() => import("../pages/auth/resetPaswordPage"));
const VerifyEmailPage = lazy(() => import("../pages/auth/verifyEmailPage"));

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={
        <Suspense
          fallback={
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm z-50">
              <div className="loader"></div>
            </div>
          }
        >
          <RootLayout />
        </Suspense>
      }
    >
      <Route index element={<Navigate to="/register" />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="forgot-password" element={<ForgotPasswordPage />} />
      <Route path="reset-password" element={<ResetPaswordPage />} />
      <Route path="verify-email" element={<VerifyEmailPage />} />

      <Route
        path="dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
    </Route>,
  ),
);
