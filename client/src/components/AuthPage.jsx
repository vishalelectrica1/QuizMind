import React, { useState } from "react";
import { Lightbulb, LogIn, UserPlus, Mail, Lock, User, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

export default function AuthPage() {
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState("login"); // "login" or "register"
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setError("");
    setShowPassword(false);
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const endpoint = activeTab === "login" ? "/login" : "/register";
    const body = activeTab === "login" ? { email, password } : { name, email, password };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      // Save token and user data via AuthContext
      login(data.token, data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ justifyContent: "center", minHeight: "100vh" }}>
      {/* Header */}
      <header>
        <div className="logo-container">
          <Lightbulb className="logo-icon" size={40} />
          <h1 className="logo-text">QuizMind AI</h1>
        </div>
        <p className="subtitle">Instant, intelligent quizzes powered by Gemini</p>
      </header>

      {/* Auth Card */}
      <div className="glass-panel" style={{ maxWidth: "420px", margin: "0 auto", padding: "2rem" }}>
        {/* Tab Switcher */}
        <div className="nav-tabs" style={{ marginBottom: "1.75rem" }}>
          <button
            className={`nav-tab ${activeTab === "login" ? "active" : ""}`}
            onClick={() => switchTab("login")}
          >
            <LogIn size={16} />
            Login
          </button>
          <button
            className={`nav-tab ${activeTab === "register" ? "active" : ""}`}
            onClick={() => switchTab("register")}
          >
            <UserPlus size={16} />
            Register
          </button>
        </div>

        <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.35rem", textAlign: "center" }}>
          {activeTab === "login" ? "Welcome Back! 👋" : "Create an Account ✨"}
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", textAlign: "center", marginBottom: "1.5rem" }}>
          {activeTab === "login"
            ? "Login to access your quizzes and history."
            : "Sign up to start generating AI-powered quizzes."}
        </p>

        {/* Error Message */}
        {error && (
          <div style={{
            display: "flex", alignItems: "flex-start", gap: "0.75rem",
            background: "var(--error-glow)", border: "1px solid var(--error-border)",
            padding: "0.9rem 1rem", borderRadius: "12px", marginBottom: "1.25rem", color: "#fecaca",
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0, color: "var(--error)", marginTop: "2px" }} />
            <span style={{ fontSize: "0.88rem", lineHeight: 1.4 }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Name Field (Register only) */}
          {activeTab === "register" && (
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">
                <User size={16} /> Full Name
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  className="text-input"
                  placeholder="e.g. Vishal Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                  minLength={2}
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">
              <Mail size={16} /> Email Address
            </label>
            <input
              type="email"
              className="text-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {/* Password Field */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">
              <Lock size={16} /> Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                className="text-input"
                placeholder={activeTab === "register" ? "At least 6 characters" : "Your password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                minLength={6}
                style={{ paddingRight: "3rem" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer",
                  color: "var(--text-secondary)", padding: 0, display: "flex", alignItems: "center",
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
            style={{ marginTop: "0.5rem" }}
          >
            {isLoading
              ? (activeTab === "login" ? "Logging in..." : "Creating account...")
              : (activeTab === "login" ? "Login" : "Create Account")}
          </button>
        </form>

        {/* Switch tab link */}
        <p style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "0.88rem", color: "var(--text-secondary)" }}>
          {activeTab === "login" ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => switchTab(activeTab === "login" ? "register" : "login")}
            style={{
              background: "none", border: "none", color: "var(--primary-hover)",
              cursor: "pointer", fontWeight: 600, fontSize: "0.88rem",
              fontFamily: "var(--font-family)",
            }}
          >
            {activeTab === "login" ? "Register here" : "Login here"}
          </button>
        </p>
      </div>

      <footer style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.85rem", color: "var(--text-muted)" }}>
        Powered by Gemini 2.5 Flash &bull; React &bull; Node.js &bull; MongoDB
      </footer>
    </div>
  );
}
