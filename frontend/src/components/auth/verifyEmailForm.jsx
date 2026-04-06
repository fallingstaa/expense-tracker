import { MailCheck } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bg1 from "../../../public/expense.png";

export default function VerifyEmailForm({ email = "you@example.com" }) {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);
  const [seconds, setSeconds] = useState(30);
  const inputs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);
  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const update = (idx, val) => {
    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);
  };

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/\D/g, "");
    if (!val) return;
    if (val.length > 1) {
      const digits = val.slice(0, 6 - idx).split("");
      const newOtp = [...otp];
      digits.forEach((d, i) => {
        newOtp[idx + i] = d;
      });
      setOtp(newOtp);
      inputs.current[Math.min(idx + digits.length, 5)]?.focus();
      return;
    }
    update(idx, val);
    setError("");
    if (idx < 5) inputs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      update(idx, "");
      if (!otp[idx] && idx > 0) {
        update(idx - 1, "");
        inputs.current[idx - 1]?.focus();
      }
      setError("");
    }
    if (e.key === "ArrowLeft" && idx > 0) inputs.current[idx - 1]?.focus();
    if (e.key === "ArrowRight" && idx < 5) inputs.current[idx + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const digits = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6)
      .split("");
    const newOtp = Array(6).fill("");
    digits.forEach((d, i) => {
      newOtp[i] = d;
    });
    setOtp(newOtp);
    inputs.current[Math.min(digits.length, 5)]?.focus();
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (otp.join("") === "123456") {
      // replace with your API call
      setVerified(true);
      setTimeout(() => navigate("/dashboard"), 1500);
    } else {
      setError("Incorrect code. Please try again.");
      setOtp(Array(6).fill(""));
      inputs.current[0]?.focus();
    }
  };

  const slotClass =
    "w-full aspect-square text-center text-xl font-bold text-mutes rounded-md bg-mutes/5 outline-1 -outline-offset-1 outline-mutes/10 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500";

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img alt="MyTrancy" src={bg1} className="mx-auto h-30 w-30" />
        <h2 className="mt-0 text-center text-2xl/9 font-bold tracking-tight text-mutes">
          MyTrancy
        </h2>
        <p className="text-center text-sm tracking-tight text-mutes-foreground">
          Start Tracking your expense today
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="flex items-center gap-1 pb-5">
          <MailCheck className="w-5 h-5 text-mutes" />
          <h1 className="font-bold text-mutes text-xl">Verify your email</h1>
        </div>
        <p className="text-sm text-gray-400 mb-6">
          We sent a 6-digit code to{" "}
          <span className="text-mutes font-medium">{email}</span>.
        </p>

        {verified ? (
          <p className="text-center text-sm font-semibold text-indigo-400 py-4">
            Email verified! Redirecting...
          </p>
        ) : (
          <form onSubmit={handleVerify} className="space-y-6">
            {/* OTP slots — key fix: group by pairs with separator */}
            <div className="flex items-center justify-between gap-2">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <>
                  {(i === 2 || i === 4) && (
                    <span key={`sep-${i}`} className="text-gray-600">
                      —
                    </span>
                  )}
                  <input
                    key={i}
                    ref={(el) => (inputs.current[i] = el)}
                    maxLength={1}
                    inputMode="numeric"
                    value={otp[i]}
                    onChange={(e) => handleChange(e, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    onPaste={handlePaste}
                    onFocus={(e) => e.target.select()}
                    className={slotClass}
                  />
                </>
              ))}
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={!otp.every(Boolean)}
              className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-mutes hover:bg-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Verify email
            </button>

            <p className="text-center text-sm/6 text-gray-400">
              Didn't receive it?{" "}
              <button
                type="button"
                onClick={() => {
                  setSeconds(30);
                  setOtp(Array(6).fill(""));
                  setError("");
                  inputs.current[0]?.focus();
                }}
                disabled={seconds > 0}
                className="ml-1 font-semibold text-indigo-400 hover:text-indigo-300 disabled:text-gray-600 disabled:cursor-not-allowed"
              >
                {seconds > 0 ? `Resend in ${seconds}s` : "Resend code"}
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
