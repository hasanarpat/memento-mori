"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Client-side validation
    if (tab === "register" && password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const endpoint = tab === "login" ? "/api/auth/login" : "/api/auth/register";
      const body = tab === "login" 
        ? { email, password }
        : { email, password, name: email.split('@')[0] }; // Simple name derivation

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      // Success handling
      if (tab === "login") {
        if (data.token) {
          localStorage.setItem("payload-token", data.token);
          // Dispatch a custom event to update auth state globally if needed
          window.dispatchEvent(new Event("auth-change"));
          router.push("/account");
        }
      } else {
        // Registration successful
        setTab("login");
        setError("Account created successfully! Please sign in.");
        // Clear form inputs if needed, or let user type again for security
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-bg-gradient" />
        <div className="auth-bg-pattern" />
      </div>
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-card-border" aria-hidden />
          <div className="auth-card-inner">
            <div className="auth-header">
              <span className="auth-symbol">☠</span>
              <h1 className="auth-title">MEMENTO MORI</h1>
              <p className="auth-subtitle">Enter the commune</p>
            </div>
            <div className="auth-tabs">
              <button
                type="button"
                className={`auth-tab ${tab === "login" ? "active" : ""}`}
                onClick={() => { setTab("login"); setError(""); }}
              >
                LOGIN
              </button>
              <button
                type="button"
                className={`auth-tab ${tab === "register" ? "active" : ""}`}
                onClick={() => { setTab("register"); setError(""); }}
              >
                REGISTER
              </button>
            </div>
            
            {error && (
              <div className={`auth-message ${error.includes("success") ? "success" : "error"}`} style={{ 
                color: error.includes("success") ? "#4ade80" : "#ef4444", 
                marginBottom: "1rem", 
                fontSize: "0.9rem",
                textAlign: "center"
              }}>
                {error}
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>
              <label className="auth-label">
                Email
                <span className="auth-input-wrap">
                  <Mail className="auth-input-icon" size={18} />
                  <input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                  />
                </span>
              </label>
              <label className="auth-label">
                Password
                <span className="auth-input-wrap">
                  <Lock className="auth-input-icon" size={18} />
                  <input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    minLength={8}
                    autoComplete={tab === "login" ? "current-password" : "new-password"}
                  />
                </span>
              </label>
              {tab === "register" && (
                <label className="auth-label">
                  Confirm password
                  <span className="auth-input-wrap">
                    <Lock className="auth-input-icon" size={18} />
                    <input
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      required
                      minLength={8}
                      autoComplete="new-password"
                    />
                  </span>
                </label>
              )}
              <button
                type="submit"
                className="auth-submit"
                disabled={loading}
              >
                {loading ? "PROCESSING..." : tab === "login" ? "SIGN IN" : "CREATE ACCOUNT"}
              </button>
            </form>
            <div className="auth-footer">
              <Link href="/">← Return to the shop</Link>
            </div>
            <p className="auth-tagline">From dust to dust.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
