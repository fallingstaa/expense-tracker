import { Mail, User, Lock } from "lucide-react";
import { Link } from "react-router-dom";
export default function RegisterForm() {
  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-mutes">
          Join MyTrancy
        </h2>
        <p className="text-center text-sm tracking-tight text-mutes-foreground">
          Start Tracking your expense today
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className="font-bold text-mutes text-xl pb-5">Create Account</h1>
        <form action="#" method="POST" className="space-y-6">
          <div>
            <div className="flex items-center gap-1">
              <User className="w-5 h-5 text-mutes" />
              <label
                htmlFor="name"
                className="block text-sm/6 font-medium text-gray-100"
              >
                Full Name
              </label>
            </div>
            <div className="mt-2">
              <input
                id="name"
                name="name"
                type="name"
                required
                autoComplete="name"
                className="block w-full rounded-md bg-mutes/5 px-3 py-1.5 text-base text-mutes outline-1 -outline-offset-1 outline-mutes/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1 ">
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
                className="block w-full rounded-md bg-mutes/5 px-3 py-1.5 text-base text-mutes outline-1 -outline-offset-1 outline-mutes/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <div className="flex items gap-1 ">
                <Lock className="w-5 h-5 text-mutes" />
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-100"
                >
                  Password
                </label>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="block w-full rounded-md bg-mutes/5 px-3 py-1.5 text-base text-mutes outline-1 -outline-offset-1 outline-mutes/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 ">
                <Lock className="w-5 h-5 text-mutes" />
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-100"
                >
                  Confirm Password
                </label>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="block w-full rounded-md bg-mutes/5 px-3 py-1.5 text-base text-mutes outline-1 -outline-offset-1 outline-mutes/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-mutes hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Sign in
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-400">
          Already have account ?{""}
          <Link
            to="/login"
            className="ml-2 font-semibold text-indigo-400 hover:text-indigo-300"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
