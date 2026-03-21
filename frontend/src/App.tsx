import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/pages/Header";
import BestSellersSection from "./components/pages/BestSellersSection";
import TripDetailsPage from "./components/pages/TripDetailsPage";
import Login from "./components/Login";
import Dashboard from "./components/admin/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import MainHeadings from "./components/admin/MainHeadings";
import Headings from "./components/admin/Headings";
import SubHeadings from "./components/admin/SubHeadings";
import TrekPackageManager from "./components/admin/TrekPackageManager";
import CountryManager from "./components/admin/CountryManager";
import PackageListBySubHeading from "./components/pages/PackageListBySubHeading";
import TopSellersSection from "./components/pages/TopSellersSection";
import Layouts from "./components/pages/Layouts";
import AllBestSellersPage from "./components/pages/AllBestSellersPage";
import AllTopSellersPage from "./components/pages/AllTopSellersPage";
import TopTenTreks from "./components/pages/TopTenTreks";

// Loading component
const LoadingSpinner = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
    <div
      style={{
        width: "50px",
        height: "50px",
        border: "5px solid #f3f3f3",
        borderTop: "5px solid #e67e22",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }}
    ></div>
  </div>
);

// Main App Content with Authentication
function AppContent() {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }
  const hideHeader =
    location.pathname === "/admin/dashboard" ||
    location.pathname === "/auth/login" ||
    location.pathname === "/admin/main-headings" ||
    location.pathname === "/admin/headings" ||
    location.pathname === "/admin/sub-headings" ||
    location.pathname === "/admin/trek-package" ||
    location.pathname === "/admin/country";
  return (
    <div className="App">
      {/* Only show header on non-dashboard pages */}
      {!hideHeader && <Header user={user} onLogout={logout} />}

      <Routes>
        {/* Public Routes */}
        <Route path="/top-10-treks" element={<TopTenTreks />} />
        <Route path="/best-seller-treks" element={<AllBestSellersPage />} />
        <Route path="/top-seller-treks" element={<AllTopSellersPage />} />
        <Route path="/" element={<Layouts />} />
        <Route path="/trip/:slug" element={<TripDetailsPage />} />
        <Route
          path="/:mainHeading/:heading/:subHeading"
          element={<PackageListBySubHeading />}
        />
        <Route
          path="/auth/login"
          element={
            !user ? <Login /> : <Navigate to="/admin/dashboard" replace />
          }
        />

        {/* Protected Routes - using ProtectedRoute component */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/main-headings"
          element={
            <ProtectedRoute requiredPermission="admin">
              <MainHeadings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/headings"
          element={
            <ProtectedRoute requiredPermission="admin">
              <Headings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/sub-headings"
          element={
            <ProtectedRoute requiredPermission="admin">
              <SubHeadings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/trek-package"
          element={
            <ProtectedRoute requiredPermission="admin">
              <TrekPackageManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/country"
          element={
            <ProtectedRoute requiredPermission="admin">
              <CountryManager />
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

// Main App component with AuthProvider
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
