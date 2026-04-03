"use client";

import React, { useEffect } from "react";

interface NotificationToastProps {
  show: boolean;
  message: string;
  type: "success" | "error" | "warning";
  onClose: () => void;
  duration?: number;
}

const NotificationToast: React.FC<NotificationToastProps> = ({
  show,
  message,
  type,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, onClose, duration]);

  if (!show) return null;

  const getStyles = () => {
    switch (type) {
      case "success":
        return { backgroundColor: "#4caf50", icon: "✅" };
      case "error":
        return { backgroundColor: "#f44336", icon: "❌" };
      case "warning":
        return { backgroundColor: "#ff9800", icon: "⚠️" };
      default:
        return { backgroundColor: "#4caf50", icon: "✅" };
    }
  };

  const { backgroundColor, icon } = getStyles();

  return (
    <>
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .toast-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 9999;
          animation: slideIn 0.3s ease;
        }

        .toast {
          background-color: ${backgroundColor};
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 300px;
        }

        .toast-icon {
          font-size: 20px;
        }

        .toast-message {
          flex: 1;
          font-size: 14px;
          font-weight: 500;
        }

        .toast-close {
          background: none;
          border: none;
          color: white;
          font-size: 18px;
          cursor: pointer;
          padding: 0 5px;
          opacity: 0.8;
          transition: opacity 0.2s;
        }

        .toast-close:hover {
          opacity: 1;
        }

        @media (max-width: 768px) {
          .toast {
            min-width: 250px;
            padding: 10px 16px;
          }

          .toast-message {
            font-size: 13px;
          }
        }
      `}</style>

      <div className="toast-container">
        <div className="toast">
          <span className="toast-icon">{icon}</span>
          <span className="toast-message">{message}</span>
          <button onClick={onClose} className="toast-close">
            ✕
          </button>
        </div>
      </div>
    </>
  );
};

export default NotificationToast;
