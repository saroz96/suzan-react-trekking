// src/app/login/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import Footer from "@/pages/Footer";

const LoginContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams?.get("redirect") || "/";

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // Login form state
  const [loginData, setLoginData] = useState({
    userName: "",
    password: "",
  });

  // Signup form state
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5232";

  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push(redirectUrl);
    }
  }, [router, redirectUrl]);

  // const handleLogin = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError("");
  //   setLoading(true);

  //   try {
  //     const response = await api.post("/api/Auth/login", loginData);

  //     if (response.data.token) {
  //       localStorage.setItem("token", response.data.token);
  //       localStorage.setItem("user", JSON.stringify(response.data.user));

  //       // Redirect to the original page
  //       router.push(redirectUrl);
  //     }
  //   } catch (err: any) {
  //     setError(
  //       err.response?.data?.message ||
  //         "Login failed. Please check your credentials.",
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // In your login page, make sure the token is stored properly
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/api/Auth/login", loginData);

      if (response.data.token) {
        // Store token with consistent key name
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        console.log(
          "✅ Token stored:",
          response.data.token.substring(0, 20) + "...",
        );

        // Redirect to the original page
        router.push(redirectUrl);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (signupData.password !== signupData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (signupData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/api/Auth/register", {
        name: signupData.name,
        email: signupData.email,
        password: signupData.password,
        userType: "Customer",
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        setShowSuccess(true);
        setTimeout(() => {
          router.push(redirectUrl);
        }, 2000);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style jsx global>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-20px);
          }
        }
      `}</style>

      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <Link href="/">
              <Image
                src="https://www.alpineramble.com/themes/images/new-logo.svg"
                alt="Logo"
                width={180}
                height={50}
                className="login-logo"
                unoptimized
              />
            </Link>
            <h1>{isLogin ? "Welcome Back" : "Create Account"}</h1>
            <p>
              {isLogin
                ? "Sign in to continue your adventure"
                : "Join our community of adventurers"}
            </p>
          </div>

          {showSuccess && (
            <div className="success-message">
              <span>✓</span> Account created successfully! Redirecting...
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          {isLogin ? (
            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label>Username or Email</label>
                <input
                  type="text"
                  value={loginData.userName}
                  onChange={(e) =>
                    setLoginData({ ...loginData, userName: e.target.value })
                  }
                  placeholder="Enter your username or email"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
              </div>

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? <div className="spinner-small"></div> : "Sign In"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="login-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={signupData.name}
                  onChange={(e) =>
                    setSignupData({ ...signupData, name: e.target.value })
                  }
                  placeholder="Enter your full name"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={signupData.email}
                  onChange={(e) =>
                    setSignupData({ ...signupData, email: e.target.value })
                  }
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={signupData.password}
                  onChange={(e) =>
                    setSignupData({ ...signupData, password: e.target.value })
                  }
                  placeholder="Create a password (min. 6 characters)"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={signupData.confirmPassword}
                  onChange={(e) =>
                    setSignupData({
                      ...signupData,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="Confirm your password"
                  required
                  disabled={loading}
                />
              </div>

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? (
                  <div className="spinner-small"></div>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
          )}

          <div className="login-footer">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="switch-mode-btn"
            >
              {isLogin
                ? "Don't have an account? Sign Up"
                : "Already have an account? Sign In"}
            </button>
          </div>

          <div className="guest-info">
            <p>
              ⭐ Join thousands of happy travelers who have explored the
              Himalayas with us!
            </p>
          </div>
        </div>
      </div>

      <Footer />

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }

        .login-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          padding: 40px;
          width: 100%;
          max-width: 450px;
          animation: slideIn 0.5s ease;
        }

        .login-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .login-logo {
          margin-bottom: 20px;
        }

        .login-header h1 {
          font-size: 28px;
          color: #2c3e50;
          margin-bottom: 10px;
        }

        .login-header p {
          color: #7f8c8d;
          font-size: 14px;
        }

        .success-message {
          background-color: #d4edda;
          color: #155724;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          animation: fadeOut 0.5s ease 3s forwards;
        }

        .error-message {
          background-color: #f8d7da;
          color: #721c24;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-weight: 500;
          color: #2c3e50;
          font-size: 14px;
        }

        .form-group input {
          padding: 12px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.2s;
        }

        .form-group input:focus {
          outline: none;
          border-color: #e67e22;
        }

        .login-btn {
          background-color: #e67e22;
          color: white;
          border: none;
          padding: 14px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
          margin-top: 10px;
        }

        .login-btn:hover {
          background-color: #d35400;
        }

        .login-btn:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }

        .spinner-small {
          width: 20px;
          height: 20px;
          border: 2px solid #f3f3f3;
          border-top: 2px solid #e67e22;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }

        .login-footer {
          margin-top: 30px;
          text-align: center;
        }

        .switch-mode-btn {
          background: none;
          border: none;
          color: #e67e22;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.2s;
        }

        .switch-mode-btn:hover {
          color: #d35400;
          text-decoration: underline;
        }

        .guest-info {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
          text-align: center;
        }

        .guest-info p {
          color: #7f8c8d;
          font-size: 12px;
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 30px 20px;
          }

          .login-header h1 {
            font-size: 24px;
          }
        }
      `}</style>
    </>
  );
};

export default LoginContent;
