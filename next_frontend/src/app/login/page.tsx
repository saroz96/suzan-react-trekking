"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

const Login: React.FC = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  const { login, loading, error } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    // Validation
    if (!userName.trim()) {
      setLocalError("Username is required");
      return;
    }
    if (!password.trim()) {
      setLocalError("Password is required");
      return;
    }

    try {
      await login(userName, password);
      // Redirect to dashboard on success
      router.push("/admin/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const fillAdminCredentials = () => {
    setUserName("Admin");
    setPassword("admin");
  };

  return (
    <>
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
          font-family: Arial, sans-serif;
        }

        .card {
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 420px;
          padding: 40px;
        }

        .header {
          text-align: center;
          margin-bottom: 30px;
        }

        .title {
          font-size: 28px;
          font-weight: bold;
          color: #333;
          margin-bottom: 8px;
        }

        .subtitle {
          font-size: 14px;
          color: #666;
        }

        .demo-banner {
          background-color: #f0f9ff;
          border: 1px solid #bae6fd;
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 25px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
        }

        .demo-text {
          margin: 0;
          font-size: 13px;
          color: #0369a1;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .demo-icon {
          font-size: 16px;
        }

        .demo-button {
          background-color: transparent;
          border: 1px solid #0369a1;
          color: #0369a1;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .demo-button:hover {
          background-color: #0369a1;
          color: white;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .label {
          font-size: 14px;
          font-weight: 600;
          color: #333;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .label-icon {
          font-size: 16px;
        }

        .input {
          padding: 12px 14px;
          font-size: 15px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          transition: border-color 0.2s;
          outline: none;
        }

        .input:focus {
          border-color: #667eea;
        }

        .input:disabled {
          background-color: #f5f5f5;
          cursor: not-allowed;
        }

        .password-container {
          position: relative;
          width: 100%;
        }

        .password-input {
          width: 100%;
          padding: 12px 14px;
          padding-right: 45px;
          font-size: 15px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          transition: border-color 0.2s;
          outline: none;
          box-sizing: border-box;
        }

        .password-input:focus {
          border-color: #667eea;
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          font-size: 18px;
          color: #666;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .error-container {
          background-color: #fee2e2;
          border: 1px solid #ef4444;
          border-radius: 6px;
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .error-icon {
          font-size: 16px;
        }

        .error-text {
          color: #dc2626;
          font-size: 14px;
          flex: 1;
        }

        .button {
          background-color: #667eea;
          color: white;
          padding: 14px;
          font-size: 16px;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 10px;
        }

        .button:hover:not(:disabled) {
          background-color: #5a67d8;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .button:disabled {
          background-color: #a0aec0;
          cursor: not-allowed;
        }

        .loading-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 3px solid #ffffff;
          border-top: 3px solid transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .footer {
          margin-top: 25px;
          text-align: center;
          border-top: 1px solid #e0e0e0;
          padding-top: 20px;
        }

        .footer-text {
          font-size: 14px;
          color: #666;
        }

        .link {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
        }

        .link:hover {
          text-decoration: underline;
        }
      `}</style>

      <div className="container">
        <div className="card">
          <div className="header">
            <h2 className="title">Welcome Back</h2>
            <p className="subtitle">
              Sign in to continue your trekking adventure
            </p>
          </div>

          {/* Demo Credentials Banner */}
          <div className="demo-banner">
            <p className="demo-text">
              <span className="demo-icon">🔐</span>
              Demo: Use <strong>Admin</strong> / <strong>admin</strong>
            </p>
            <button onClick={fillAdminCredentials} className="demo-button">
              Fill Demo Credentials
            </button>
          </div>

          <form onSubmit={handleSubmit} className="form">
            <div className="input-group">
              <label className="label">
                <span className="label-icon">👤</span>
                Username
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your username"
                className="input"
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <label className="label">
                <span className="label-icon">🔒</span>
                Password
              </label>
              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="password-input"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            {(localError || error) && (
              <div className="error-container">
                <span className="error-icon">⚠️</span>
                <span className="error-text">{localError || error}</span>
              </div>
            )}

            <button type="submit" disabled={loading} className="button">
              {loading ? (
                <span className="loading-content">
                  <span className="spinner"></span>
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <div className="footer">
            <p className="footer-text">
              Don't have an account?{" "}
              <Link href="/register" className="link">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
