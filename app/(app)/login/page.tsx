"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
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
                onClick={() => setTab("login")}
              >
                LOGIN
              </button>
              <button
                type="button"
                className={`auth-tab ${tab === "register" ? "active" : ""}`}
                onClick={() => setTab("register")}
              >
                REGISTER
              </button>
            </div>
            <form className="auth-form" onSubmit={handleSubmit}>
              <label className="auth-label">
                Email
                <span className="auth-input-wrap">
                  <Mail className="auth-input-icon" size={18} />
                  <input
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
                    type="password"
                    placeholder="••••••••"
                    required
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
                      type="password"
                      placeholder="••••••••"
                      required
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
                {loading ? "..." : tab === "login" ? "SIGN IN" : "CREATE ACCOUNT"}
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
