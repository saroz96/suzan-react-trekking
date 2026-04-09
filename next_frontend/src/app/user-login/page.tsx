import { Suspense } from "react";
import LoginContent from "./LoginContent";

export default function UserLoginPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      }}>
        <div style={{
          width: "40px",
          height: "40px",
          border: "3px solid #f3f3f3",
          borderTop: "3px solid #e67e22",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }} />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}