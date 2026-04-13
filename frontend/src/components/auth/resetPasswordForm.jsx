import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Lock, KeyRound } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import bg1 from "../../../public/expense.png";

export default function ResetPasswordForm() {
  const [formData, setFormData] = useState({
    code: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [localError, setLocalError] = useState("");
  const { resetPassword, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) clearError();
    if (localError) setLocalError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    try {
      await resetPassword({
        email,
        code: formData.code,
        newPassword: formData.newPassword,
      });
      navigate('/login');
    } catch (err) {
      // Error is handled by the hook and displayed below
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img alt="Your Company" src={bg1} className="mx-auto h-30 w-30" />
        <h2 className="mt-0 text-center text-2xl/9 font-bold tracking-tight text-mutes">
          Join MyTrancy
        </h2>
        <p className="text-center text-sm tracking-tight text-mutes-foreground">
          Start Tracking your expense today
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className="font-bold text-mutes text-xl pb-5">Reset Password</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="flex items-center gap-1">
              <KeyRound className="h-5 w-5 text-mutes" />
              <label
                htmlFor="code"
                className="block text-sm/6 font-medium text-gray-100"
              >
                Reset Code
              </label>
            </div>
            <div className="mt-2">
              <input
                id="code"
                name="code"
                type="text"
                required
                value={formData.code}
                onChange={handleChange}
                placeholder="Enter 6-digit code"
                className="block w-full rounded-md bg-mutes/5 px-3 py-1.5 text-base text-mutes outline-1 -outline-offset-1 outline-mutes/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1">
              <Lock className="w-5 h-5 text-mutes" />
              <label
                htmlFor="newPassword"
                className="block text-sm/6 font-medium text-gray-100"
              >
                New Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                autoComplete="new-password"
                value={formData.newPassword}
                onChange={handleChange}
                className="block w-full rounded-md bg-mutes/5 px-3 py-1.5 text-base text-mutes outline-1 -outline-offset-1 outline-mutes/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <Lock className="w-5 h-5 text-mutes" />
              <label
                htmlFor="confirmPassword"
                className="block text-sm/6 font-medium text-gray-100"
              >
                Confirm New Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="block w-full rounded-md bg-mutes/5 px-3 py-1.5 text-base text-mutes outline-1 -outline-offset-1 outline-mutes/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

          {(error || localError) && (
            <div className="text-red-400 text-sm text-center">
              {error || localError}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-mutes hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        </form>

        <Link
          to="/login"
          className="flex items-center hover:text-indigo-400 justify-center mt-10 text-center text-sm/6 text-gray-400"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
