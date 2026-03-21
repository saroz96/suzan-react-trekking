// import React, { useEffect } from 'react';

// interface NotificationToastProps {
//     show: boolean;
//     message: string;
//     type: 'success' | 'error' | 'warning';
//     onClose: () => void;
//     duration?: number;
// }

// const NotificationToast: React.FC<NotificationToastProps> = ({
//     show,
//     message,
//     type,
//     onClose,
//     duration = 3000
// }) => {
//     useEffect(() => {
//         if (show) {
//             const timer = setTimeout(() => {
//                 onClose();
//             }, duration);
//             return () => clearTimeout(timer);
//         }
//     }, [show, duration, onClose]);

//     if (!show) return null;

//     const getStyles = () => {
//         switch (type) {
//             case 'success':
//                 return {
//                     backgroundColor: '#4caf50',
//                     icon: '✅'
//                 };
//             case 'error':
//                 return {
//                     backgroundColor: '#f44336',
//                     icon: '❌'
//                 };
//             case 'warning':
//                 return {
//                     backgroundColor: '#ff9800',
//                     icon: '⚠️'
//                 };
//             default:
//                 return {
//                     backgroundColor: '#4caf50',
//                     icon: '✅'
//                 };
//         }
//     };

//     const { backgroundColor, icon } = getStyles();

//     return (
//         <div style={{
//             position: 'fixed',
//             top: '20px',
//             right: '20px',
//             zIndex: 9999,
//             animation: 'slideIn 0.3s ease',
//         }}>
//             <div style={{
//                 backgroundColor,
//                 color: 'white',
//                 padding: '12px 20px',
//                 borderRadius: '8px',
//                 boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '10px',
//                 minWidth: '300px',
//             }}>
//                 <span style={{ fontSize: '20px' }}>{icon}</span>
//                 <span style={{ flex: 1, fontSize: '14px', fontWeight: '500' }}>{message}</span>
//                 <button
//                     onClick={onClose}
//                     style={{
//                         background: 'none',
//                         border: 'none',
//                         color: 'white',
//                         fontSize: '18px',
//                         cursor: 'pointer',
//                         padding: '0 5px',
//                         opacity: 0.8,
//                         ':hover': { opacity: 1 }
//                     }}
//                 >
//                     ✕
//                 </button>
//             </div>
//         </div>
//     );
// };

// // Add animation styles
// const styleSheet = document.createElement('style');
// styleSheet.textContent = `
//     @keyframes slideIn {
//         from {
//             transform: translateX(100%);
//             opacity: 0;
//         }
//         to {
//             transform: translateX(0);
//             opacity: 1;
//         }
//     }
// `;
// document.head.appendChild(styleSheet);

// export default NotificationToast;

import React, { useEffect } from "react";

interface NotificationToastProps {
  show: boolean;
  message: string;
  type: "success" | "error" | "warning";
  onClose: () => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({
  show,
  message,
  type,
  onClose,
}) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

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
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 9999,
        animation: "slideIn 0.3s ease",
      }}
    >
      <div
        style={{
          backgroundColor,
          color: "white",
          padding: "12px 20px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          minWidth: "300px",
        }}
      >
        <span style={{ fontSize: "20px" }}>{icon}</span>
        <span style={{ flex: 1, fontSize: "14px", fontWeight: "500" }}>
          {message}
        </span>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "white",
            fontSize: "18px",
            cursor: "pointer",
            padding: "0 5px",
            opacity: 0.8,
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.8")}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

// Add keyframes for animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `
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
`;
document.head.appendChild(styleSheet);

export default NotificationToast;
