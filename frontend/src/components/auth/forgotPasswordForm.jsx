import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Mail } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import bg1 from "../../../public/expense.png";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const { forgotPassword, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword({ email });
      navigate('/reset-password', { state: { email } });
    } catch (err) {
      // Error is handled by the hook and displayed below
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img alt="Your Company" src={bg1} className="mx-auto h-30 w-30" />
        <h2 className="mt-0 text-center text-2xl/9 font-bold tracking-tight text-mutes">
          MyTrancy
        </h2>
        <p className="text-center text-sm tracking-tight text-mutes-foreground">
          Reset Your Password
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className="font-bold text-mutes text-xl pb-3 ">Forgot Password</h1>
        <p className="pb-5 text-sm text-mutes-foreground">
          Enter your email address and we'll send you a reset code to create a new password.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="flex items-center gap-1">
              <Mail className="w-5 h-5 text-mutes" />
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-100"
              >
                Email
              </label>
            </div>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={handleChange}
                className="block w-full rounded-md bg-mutes/5 px-3 py-1.5 text-base text-mutes outline-1 -outline-offset-1 outline-mutes/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-mutes hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Reset Codes"}
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
