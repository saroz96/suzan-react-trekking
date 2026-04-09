"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/app/components/admin/Sidebar";
// import Sidebar from "@/components/Sidebar"; // Fixed import path

const Dashboard: React.FC = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    // Check window width on client side only
    setWindowWidth(window.innerWidth);
    setIsSidebarOpen(window.innerWidth > 768);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 768) {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Protect route - redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
        <style jsx>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            gap: 20px;
          }

          .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #e67e22;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  // If not authenticated, don't render (redirect will happen)
  if (!isAuthenticated) {
    return null;
  }

  // Sample dashboard stats
  const stats = [
    {
      label: "Total Trips",
      value: "24",
      icon: "🏔️",
      color: "#e67e22",
      change: "+12%",
    },
    {
      label: "Active Bookings",
      value: "18",
      icon: "📅",
      color: "#3498db",
      change: "+5%",
    },
    {
      label: "Total Reviews",
      value: "156",
      icon: "⭐",
      color: "#f1c40f",
      change: "+23%",
    },
    {
      label: "Revenue",
      value: "$45.2K",
      icon: "💰",
      color: "#2ecc71",
      change: "+18%",
    },
  ];

  const recentBookings = [
    {
      id: 1,
      customer: "John Doe",
      trek: "Everest Base Camp",
      date: "2024-03-15",
      status: "confirmed",
      amount: "$1,200",
    },
    {
      id: 2,
      customer: "Jane Smith",
      trek: "Annapurna Circuit",
      date: "2024-03-14",
      status: "pending",
      amount: "$950",
    },
    {
      id: 3,
      customer: "Mike Johnson",
      trek: "Langtang Valley",
      date: "2024-03-13",
      status: "completed",
      amount: "$750",
    },
    {
      id: 4,
      customer: "Sarah Wilson",
      trek: "Manaslu Circuit",
      date: "2024-03-12",
      status: "confirmed",
      amount: "$1,500",
    },
  ];

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
          background-color: #f8f9fa;
          font-family: Arial, sans-serif;
        }

        .main {
          padding: 30px;
          transition: margin-left 0.3s ease;
          min-height: 100vh;
        }

        .top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 30px;
          background-color: white;
          padding: 15px 25px;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
        }

        .menu-toggle {
          background-color: transparent;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #2c3e50;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          transition: background-color 0.2s;
        }

        .menu-toggle:hover {
          background-color: #f8f9fa;
        }

        .page-title {
          font-size: 20px;
          font-weight: 600;
          color: #2c3e50;
          margin: 0;
        }

        .top-bar-right {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .date {
          color: #7f8c8d;
          font-size: 14px;
        }

        .welcome-banner {
          background-color: white;
          padding: 25px;
          border-radius: 12px;
          margin-bottom: 30px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
        }

        .welcome-title {
          font-size: 24px;
          font-weight: 600;
          color: #2c3e50;
          margin: 0 0 8px 0;
        }

        .welcome-text {
          font-size: 14px;
          color: #7f8c8d;
          margin: 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 20px;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
          transition:
            transform 0.2s,
            box-shadow 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
        }

        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .stat-info {
          flex: 1;
        }

        .stat-value {
          display: block;
          font-size: 24px;
          font-weight: bold;
          color: #2c3e50;
          line-height: 1.2;
        }

        .stat-label {
          display: block;
          font-size: 13px;
          color: #7f8c8d;
          margin-bottom: 4px;
        }

        .stat-change {
          font-size: 12px;
          font-weight: 500;
        }

        .card {
          background-color: white;
          border-radius: 12px;
          padding: 25px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .card-title {
          font-size: 18px;
          font-weight: 600;
          color: #2c3e50;
          margin: 0;
        }

        .view-all-button {
          background-color: transparent;
          border: none;
          color: #e67e22;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          padding: 5px 10px;
          border-radius: 4px;
          transition: background-color 0.2s;
        }

        .view-all-button:hover {
          background-color: #fff3e0;
        }

        .table-container {
          overflow-x: auto;
        }

        .table {
          width: 100%;
          border-collapse: collapse;
        }

        .table th {
          text-align: left;
          padding: 12px;
          border-bottom: 2px solid #ecf0f1;
          color: #7f8c8d;
          font-size: 13px;
          font-weight: 600;
        }

        .table td {
          padding: 12px;
          border-bottom: 1px solid #ecf0f1;
          color: #2c3e50;
          font-size: 14px;
        }

        .status-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          text-transform: capitalize;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          gap: 20px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #e67e22;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @media (max-width: 768px) {
          .main {
            padding: 20px;
          }

          .top-bar {
            padding: 12px 20px;
          }

          .welcome-title {
            font-size: 20px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .card {
            padding: 20px;
          }
        }
      `}</style>

      <div className="container">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content */}
        <main
          className="main"
          style={{
            marginLeft: isSidebarOpen && windowWidth > 768 ? "280px" : "0",
          }}
        >
          {/* Top Bar */}
          <div className="top-bar">
            <button
              onClick={toggleSidebar}
              className="menu-toggle"
              aria-label="Toggle sidebar"
            >
              ☰
            </button>
            <h1 className="page-title">Dashboard</h1>
            <div className="top-bar-right">
              <span className="date">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Welcome Banner */}
          <div className="welcome-banner">
            <div>
              <h2 className="welcome-title">Welcome back, {user?.name}! 👋</h2>
              <p className="welcome-text">
                Here's what's happening with your trekking business today.
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div
                  className="stat-icon"
                  style={{
                    backgroundColor: stat.color + "20",
                    color: stat.color,
                  }}
                >
                  {stat.icon}
                </div>
                <div className="stat-info">
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                  <span
                    className="stat-change"
                    style={{
                      color: stat.change.startsWith("+")
                        ? "#2ecc71"
                        : "#e74c3c",
                    }}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Bookings */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Recent Bookings</h3>
              <button className="view-all-button">View All →</button>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Trek</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>{booking.customer}</td>
                      <td>{booking.trek}</td>
                      <td>{booking.date}</td>
                      <td>
                        <span
                          className="status-badge"
                          style={{
                            backgroundColor:
                              booking.status === "confirmed"
                                ? "#e8f5e8"
                                : booking.status === "pending"
                                  ? "#fff3e0"
                                  : "#e8f4fd",
                            color:
                              booking.status === "confirmed"
                                ? "#2ecc71"
                                : booking.status === "pending"
                                  ? "#e67e22"
                                  : "#3498db",
                          }}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td>{booking.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
