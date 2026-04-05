import { Link } from "react-router-dom";
import bg1 from "../../../public/expense.png";

export default function VerifyEmailForm() {
  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img alt="Your Company" src={bg1} className="mx-auto h-30 w-30" />
        <h2 className="mt-0 text-center text-2xl/9 font-bold tracking-tight text-mutes">
          MyTrancy
        </h2>
        <p className="text-center text-sm tracking-tight text-mutes-foreground">
          Start Tracking your expense today
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="flex flex-col  mb-6">
          <h1 className="font-bold text-mutes text-xl">Verify your email</h1>
          <p className="text-sm text-mutes/50  mt-1">
            We sent a 6-digit code to{" "}
            <span className="text-mutes font-medium">your@email.com</span>
          </p>
        </div>

        <div className="flex justify-between gap-2 mb-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <input
              key={i}
              type="text"
              maxLength={1}
              className="w-full aspect-square text-center text-lg font-bold text-mutes bg-mutes/5 rounded-md outline-1 -outline-offset-1 outline-mutes/10 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
            />
          ))}
        </div>

        <button
          type="button"
          className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-mutes hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          Verify Email
        </button>

        <p className="mt-6 text-center text-sm/6 text-gray-400">
          Didn't receive the code?{" "}
          <button className="ml-1 font-semibold text-indigo-400 hover:text-indigo-300">
            Resend code
          </button>
        </p>

        <p className="mt-2 text-center text-sm/6 text-gray-400">
          Back to{" "}
          <Link
            to="/login"
            className="font-semibold text-indigo-400 hover:text-indigo-300"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
