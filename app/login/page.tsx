"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User } from "lucide-react";

type Tab = "login" | "register";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("login");
  const [loading, setLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    router.push("/account");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== regConfirm) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    router.push("/account");
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-bg-gradient" />
        <div className="auth-bg-pattern" />
      </div>

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-card-border" />
          <div className="auth-card-inner">
            <div className="auth-header">
              <span className="auth-symbol" aria-hidden>†</span>
              <h1 className="auth-title">Sanctum</h1>
              <p className="auth-subtitle">
                {tab === "login"
                  ? "Hesabına giriş yap"
                  : "Topluluğa katıl"}
              </p>
            </div>

            <div className="auth-tabs">
              <button
                type="button"
                className={`auth-tab ${tab === "login" ? "active" : ""}`}
                onClick={() => setTab("login")}
              >
                Giriş
              </button>
              <button
                type="button"
                className={`auth-tab ${tab === "register" ? "active" : ""}`}
                onClick={() => setTab("register")}
              >
                Kayıt
              </button>
            </div>

            {tab === "login" && (
              <form className="auth-form" onSubmit={handleLogin}>
                <label className="auth-label">
                  E-posta
                  <span className="auth-input-wrap">
                    <Mail size={18} className="auth-input-icon" />
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="sen@email.com"
                      required
                      autoComplete="email"
                    />
                  </span>
                </label>
                <label className="auth-label">
                  Şifre
                  <span className="auth-input-wrap">
                    <Lock size={18} className="auth-input-icon" />
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      autoComplete="current-password"
                    />
                  </span>
                </label>
                <button
                  type="submit"
                  className="auth-submit"
                  disabled={loading}
                >
                  {loading ? "Giriş yapılıyor…" : "Giriş yap"}
                </button>
              </form>
            )}

            {tab === "register" && (
              <form className="auth-form" onSubmit={handleRegister}>
                <label className="auth-label">
                  Ad
                  <span className="auth-input-wrap">
                    <User size={18} className="auth-input-icon" />
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Adın veya takma adın"
                      required
                      autoComplete="name"
                    />
                  </span>
                </label>
                <label className="auth-label">
                  E-posta
                  <span className="auth-input-wrap">
                    <Mail size={18} className="auth-input-icon" />
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="sen@email.com"
                      required
                      autoComplete="email"
                    />
                  </span>
                </label>
                <label className="auth-label">
                  Şifre
                  <span className="auth-input-wrap">
                    <Lock size={18} className="auth-input-icon" />
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="En az 8 karakter"
                      required
                      minLength={8}
                      autoComplete="new-password"
                    />
                  </span>
                </label>
                <label className="auth-label">
                  Şifre tekrar
                  <span className="auth-input-wrap">
                    <Lock size={18} className="auth-input-icon" />
                    <input
                      type="password"
                      value={regConfirm}
                      onChange={(e) => setRegConfirm(e.target.value)}
                      placeholder="••••••••"
                      required
                      autoComplete="new-password"
                    />
                  </span>
                </label>
                <button
                  type="submit"
                  className="auth-submit"
                  disabled={loading || regPassword !== regConfirm}
                >
                  {loading ? "Kaydediliyor…" : "Hesap oluştur"}
                </button>
              </form>
            )}

            <p className="auth-footer">
              <Link href="/">← Ana sayfaya dön</Link>
            </p>
          </div>
        </div>

        <p className="auth-tagline">In darkness we find beauty.</p>
      </div>
    </div>
  );
}
