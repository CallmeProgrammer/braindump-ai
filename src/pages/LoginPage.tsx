import { useState } from "react";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import AuthBranding from "../components/auth/AuthBranding";
import InputField from "../components/auth/InputField";
import { loginUser } from "../services/api";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser(
        email.trim(),
        password
      );

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      navigate("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-white md:grid-cols-2">
      {/* Left branding */}
      <AuthBranding />

      {/* Right login form */}
      <section className="flex min-h-screen items-center justify-center bg-white px-6 py-12 sm:px-10">
        <div className="w-full max-w-md">
          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-zinc-900">
              Welcome back
            </h1>

            <p className="mt-2 text-zinc-500">
              Log in to continue organizing your thoughts.
            </p>
          </div>

          {/* Login form */}
          <form
            className="space-y-4"
            onSubmit={handleSubmit}
          >
            <InputField
              icon={<Mail size={18} />}
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

            <InputField
              icon={<Lock size={18} />}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Forgot password */}
            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm font-medium text-violet-600 transition hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-violet-600 font-semibold text-white transition hover:bg-violet-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                "Logging in..."
              ) : (
                <>
                  Log In
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-zinc-200" />

            <span className="whitespace-nowrap text-sm text-zinc-400">
              or continue with
            </span>

            <div className="h-px flex-1 bg-zinc-200" />
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className="flex h-12 items-center justify-center gap-2 rounded-xl border border-zinc-200 font-medium text-zinc-700 transition hover:bg-zinc-50"
            >
              <GoogleIcon />
              Google
            </button>

            <button
              type="button"
              className="flex h-12 items-center justify-center gap-2 rounded-xl border border-zinc-200 font-medium text-zinc-700 transition hover:bg-zinc-50"
            >
              GitHub
            </button>
          </div>

          {/* Signup link */}
          <p className="mt-8 text-center text-sm text-zinc-500">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-violet-600 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M21.35 12.27c0-.78-.07-1.53-.2-2.25H12v4.26h5.23a4.47 4.47 0 0 1-1.94 2.93v2.77h3.14c1.84-1.7 2.92-4.2 2.92-7.71Z"
      />
      <path
        fill="#34A853"
        d="M12 21.75c2.62 0 4.82-.87 6.43-2.36l-3.14-2.77c-.87.58-1.99.92-3.29.92-2.53 0-4.67-1.71-5.44-4.01H3.32v2.86A9.72 9.72 0 0 0 12 21.75Z"
      />
      <path
        fill="#FBBC05"
        d="M6.56 13.53A5.84 5.84 0 0 1 6.26 12c0-.53.09-1.04.3-1.53V7.61H3.32A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.07 4.39l3.24-2.86Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.46c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.81 3.53 14.62 2.25 12 2.25a9.72 9.72 0 0 0-8.68 5.36l3.24 2.86C7.33 8.17 9.47 6.46 12 6.46Z"
      />
    </svg>
  );
}

export default LoginPage;