import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import FormError from "../components/FormError";
import { register } from "../services/authService";
import { useAuthStore } from "../store/authStore";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      const res = await register(email, password, fullName);
      setAuth(res.accessToken, res.user);
      navigate("/app/profile");
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Could not create your account. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Create your account" subtitle="Set your bearing and get started.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormError message={error} />
        <div>
          <label className="field-label" htmlFor="fullName">Full name</label>
          <input id="fullName" required value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="field-input" placeholder="Kasun Perera" />
        </div>
        <div>
          <label className="field-label" htmlFor="email">Email</label>
          <input id="email" type="email" required value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="field-input" placeholder="you@sltc.lk" />
        </div>
        <div>
          <label className="field-label" htmlFor="password">Password</label>
          <input id="password" type="password" required value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="field-input" placeholder="At least 8 characters" />
        </div>
        <div>
          <label className="field-label" htmlFor="confirm">Confirm password</label>
          <input id="confirm" type="password" required value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="field-input" placeholder="Re-enter your password" />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
      <p className="mt-6 text-sm text-slate">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-amber-deep hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
