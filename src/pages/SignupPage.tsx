import { useState } from "react";
import { ArrowRight, Lock, Mail, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import AuthBranding from "../components/auth/AuthBranding";
import InputField from "../components/auth/InputField";
import { signupUser } from "../services/api";

function SignupPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    // Basic validation
    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter a password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreedToTerms) {
      setError(
        "Please agree to the Terms of Service and Privacy Policy."
      );
      return;
    }

    try {
      setLoading(true);

      const data = await signupUser(
        name.trim(),
        email.trim(),
        password
      );

      // Save authentication data
      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // Go to dashboard
      navigate("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-white md:grid-cols-2">
      {/* Left branding */}
      <AuthBranding />

      {/* Right signup form */}
      <section className="flex min-h-screen items-center justify-center bg-white px-6 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-zinc-900">
              Create your account
            </h1>

            <p className="mt-2 text-zinc-500">
              Start organizing your thoughts with AI.
            </p>
          </div>

          <form
            className="space-y-4"
            onSubmit={handleSubmit}
          >
            <InputField
              icon={<User size={18} />}
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <InputField
              icon={<Mail size={18} />}
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <InputField
              icon={<Lock size={18} />}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <InputField
              icon={<Lock size={18} />}
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
            />

            {/* Error message */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Terms */}
            <label className="flex cursor-pointer items-start gap-3 pt-2 text-sm text-zinc-500">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) =>
                  setAgreedToTerms(e.target.checked)
                }
                className="mt-1 h-4 w-4 shrink-0 accent-violet-600"
              />

              <span>
                I agree to the{" "}
                <button
                  type="button"
                  className="font-medium text-violet-600 hover:underline"
                >
                  Terms of Service
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  className="font-medium text-violet-600 hover:underline"
                >
                  Privacy Policy
                </button>
              </span>
            </label>

            {/* Signup button */}
            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-violet-600 font-semibold text-white transition hover:bg-violet-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                "Creating Account..."
              ) : (
                <>
                  Create Account
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
              <GitHubIcon />
              GitHub
            </button>
          </div>

          {/* Login link */}
          <p className="mt-8 text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-violet-600 hover:underline"
            >
              Log in
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

function GitHubIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.71.5.1.68-.22.68-.49 0-.24-.01-1.05-.01-1.9-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.9 1.57 2.35 1.12 2.92.86.09-.67.35-1.12.64-1.38-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.73 0 0 .84-.28 2.75 1.05A9.34 9.34 0 0 1 12 6.72c.85 0 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.42.2 2.47.1 2.73.64.72 1.03 1.63 1.03 2.75 0 3.93-2.35 4.79-4.58 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.49A10.25 10.25 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

export default SignupPage;