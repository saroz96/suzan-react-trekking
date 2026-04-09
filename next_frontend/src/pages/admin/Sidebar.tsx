"use client";

import React, { useState, useEffect, useCallback, memo, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  path: string;
  name: string;
  icon: string;
  badge?: string;
  badgeColor?: string;
  children?: MenuItem[];
  permissions?: string[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const prevPathnameRef = useRef<string>(pathname);

  // Load expanded menus from localStorage on mount
  useEffect(() => {
    const savedExpandedMenus = localStorage.getItem("sidebarExpandedMenus");
    if (savedExpandedMenus) {
      try {
        const parsed = JSON.parse(savedExpandedMenus);
        setExpandedMenus(parsed);
      } catch (e) {
        console.error("Error loading expanded menus:", e);
      }
    }
  }, []);

  // Save expanded menus to localStorage when they change
  useEffect(() => {
    localStorage.setItem("sidebarExpandedMenus", JSON.stringify(expandedMenus));
  }, [expandedMenus]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const isMobileView = width <= 768;
      setIsMobile(isMobileView);

      if (!isMobileView && !isOpen) {
        onClose();
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen, onClose]);

  // Auto-expand menus based on current path
  useEffect(() => {
    const menuItems = getMenuItems();
    const newExpandedMenus: string[] = [];

    // Check which menus should be expanded based on current path
    const checkAndExpand = (items: MenuItem[]) => {
      items.forEach((item) => {
        if (item.children) {
          // Check if any child path matches current path
          const hasActiveChild = item.children.some(
            (child) => pathname === child.path,
          );
          if (hasActiveChild && !expandedMenus.includes(item.name)) {
            newExpandedMenus.push(item.name);
          }
          // Recursively check children
          checkAndExpand(item.children);
        }
      });
    };

    checkAndExpand(menuItems);

    if (newExpandedMenus.length > 0) {
      setExpandedMenus((prev) => {
        const combined = [...new Set([...prev, ...newExpandedMenus])];
        return combined;
      });
    }
  }, [pathname]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isMobile && isOpen) {
        const sidebar = document.getElementById("admin-sidebar");
        const toggleBtn = document.getElementById("sidebar-toggle");

        if (
          sidebar &&
          !sidebar.contains(e.target as Node) &&
          toggleBtn &&
          !toggleBtn.contains(e.target as Node)
        ) {
          onClose();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, isOpen, onClose]);

  const toggleSubmenu = useCallback((menuName: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menuName)
        ? prev.filter((item) => item !== menuName)
        : [...prev, menuName],
    );
  }, []);

  const handleLogout = useCallback(async () => {
    await logout();
    router.push("/login");
  }, [logout, router]);

  const getMenuItems = useCallback((): MenuItem[] => {
    return [
      {
        path: "/admin/dashboard",
        name: "Dashboard",
        icon: "📊",
      },
      {
        path: "/admin/content",
        name: "Menu Management",
        icon: "📑",
        children: [
          { path: "/admin/menu", name: "Main Headings", icon: "📑" },
          { path: "/admin/headings", name: "Headings", icon: "📑" },
          { path: "/admin/sub-headings", name: "Sub Headings", icon: "📑" },
        ],
      },
      {
        path: "/admin/treks",
        name: "Treks Management",
        icon: "🏔️",
        children: [
          { path: "/admin/trek-package", name: "Treks Package", icon: "🗂️" },
          { path: "/admin/country", name: "Country", icon: "➕" },
          { path: "/admin/treks/categories", name: "Categories", icon: "📑" },
          {
            path: "/admin/treks/destinations",
            name: "Destinations",
            icon: "📍",
          },
        ],
      },
      {
        path: "/admin/bookings",
        name: "Bookings",
        icon: "📅",
        badge: "12",
        badgeColor: "#e67e22",
        children: [
          { path: "/admin/bookings/all", name: "All Bookings", icon: "📋" },
          {
            path: "/admin/bookings/pending",
            name: "Pending",
            icon: "⏳",
            badge: "5",
          },
          { path: "/admin/bookings/confirmed", name: "Confirmed", icon: "✅" },
          { path: "/admin/bookings/cancelled", name: "Cancelled", icon: "❌" },
        ],
      },
      {
        path: "/admin/users",
        name: "Users",
        icon: "👥",
        badge: "3",
        badgeColor: "#3498db",
        children: [
          { path: "/admin/users/all", name: "All Users", icon: "👤" },
          { path: "/admin/users/add", name: "Add User", icon: "➕" },
          {
            path: "/admin/users/roles",
            name: "Roles & Permissions",
            icon: "🔐",
          },
        ],
      },
      {
        path: "/admin/reviews",
        name: "Reviews",
        icon: "⭐",
        badge: "8",
        badgeColor: "#f1c40f",
      },
      {
        path: "/admin/payments",
        name: "Payments",
        icon: "💰",
        children: [
          {
            path: "/admin/payments/transactions",
            name: "Transactions",
            icon: "💳",
          },
          { path: "/admin/payments/pending", name: "Pending", icon: "⏳" },
          {
            path: "/admin/payments/settlements",
            name: "Settlements",
            icon: "📊",
          },
        ],
      },
      {
        path: "/admin/reports",
        name: "Reports",
        icon: "📈",
        children: [
          { path: "/admin/reports/sales", name: "Sales Report", icon: "📊" },
          {
            path: "/admin/reports/trekking",
            name: "Trekking Stats",
            icon: "🏔️",
          },
          { path: "/admin/reports/financial", name: "Financial", icon: "💰" },
        ],
      },
      {
        path: "/admin/settings",
        name: "Settings",
        icon: "⚙️",
        permissions: ["admin"],
        children: [
          { path: "/admin/settings/general", name: "General", icon: "🛠️" },
          { path: "/admin/settings/company", name: "Company Info", icon: "🏢" },
          {
            path: "/admin/settings/notifications",
            name: "Notifications",
            icon: "🔔",
          },
          {
            path: "/admin/settings/backup",
            name: "Backup & Restore",
            icon: "💾",
          },
        ],
      },
    ];
  }, []);

  const menuItems = getMenuItems();

  const renderMenuItem = (item: MenuItem, index: number) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMenus.includes(item.name);
    const isActive =
      pathname === item.path ||
      (hasChildren && item.children?.some((child) => pathname === child.path));

    if (hasChildren) {
      return (
        <li key={index} className="menu-item">
          <div
            onClick={() => toggleSubmenu(item.name)}
            className={`menu-link ${isExpanded ? "active" : ""}`}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-text">{item.name}</span>
            {item.badge && (
              <span
                className="badge"
                style={{ backgroundColor: item.badgeColor || "#e67e22" }}
              >
                {item.badge}
              </span>
            )}
            <span className={`arrow ${isExpanded ? "expanded" : ""}`}>▼</span>
          </div>
          {/* {isExpanded && item.children && (
            <ul className="submenu">
              {item.children.map((child, childIndex) => {
                const isChildActive = pathname === child.path;
                return (
                  <li key={childIndex}>
                    <Link
                      href={child.path}
                      className={`submenu-link ${isChildActive ? "active" : ""}`}
                      onClick={isMobile ? onClose : undefined}
                      prefetch={false}
                    >
                      <span className="menu-icon">{child.icon}</span>
                      <span className="menu-text">{child.name}</span>
                      {child.badge && (
                        <span
                          className="badge small"
                          style={{
                            backgroundColor: child.badgeColor || "#e67e22",
                          }}
                        >
                          {child.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )} */}

          {isExpanded && item.children && (
            <ul className="submenu">
              {item.children.map((child, childIndex) => {
                const isChildActive = pathname === child.path;
                return (
                  <li key={childIndex}>
                    <Link
                      href={child.path}
                      className={`submenu-link ${isChildActive ? "active" : ""}`}
                      onClick={isMobile ? onClose : undefined}
                      prefetch={false}
                    >
                      <span className="menu-icon">{child.icon}</span>
                      <span className="menu-text">{child.name}</span>
                      {child.badge && (
                        <span
                          className="badge small"
                          style={{
                            backgroundColor: child.badgeColor || "#e67e22",
                          }}
                        >
                          {child.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </li>
      );
    }

    return (
      <li key={index} className="menu-item">
        <Link
          href={item.path}
          className={`menu-link ${isActive ? "active" : ""}`}
          onClick={isMobile ? onClose : undefined}
          prefetch={false}
        >
          <span className="menu-icon">{item.icon}</span>
          <span className="menu-text">{item.name}</span>
          {item.badge && (
            <span
              className="badge"
              style={{ backgroundColor: item.badgeColor || "#e67e22" }}
            >
              {item.badge}
            </span>
          )}
        </Link>
      </li>
    );
  };

  return (
    <>
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .admin-sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(2px);
          z-index: 999;
          animation: fadeIn 0.3s ease;
        }

        .admin-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          width: 280px;
          height: 100vh;
          background: linear-gradient(135deg, #1e1e2f 0%, #1a1a2e 100%);
          color: #fff;
          z-index: 1000;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          box-shadow: 2px 0 20px rgba(0, 0, 0, 0.2);
          overflow-y: auto;
          overflow-x: hidden;
          will-change: transform;
        }

        .admin-sidebar::-webkit-scrollbar {
          width: 5px;
        }

        .admin-sidebar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }

        .admin-sidebar::-webkit-scrollbar-thumb {
          background: rgba(230, 126, 34, 0.5);
          border-radius: 3px;
        }

        .admin-sidebar::-webkit-scrollbar-thumb:hover {
          background: #e67e22;
        }

        .admin-sidebar.closed {
          transform: translateX(-100%);
        }

        .admin-sidebar.open {
          transform: translateX(0);
        }

        .sidebar-header {
          padding: 24px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(0, 0, 0, 0.2);
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          font-size: 28px;
          animation: pulse 2s infinite;
        }

        .logo-text {
          font-size: 18px;
          font-weight: bold;
          background: linear-gradient(135deg, #fff 0%, #e67e22 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .close-button {
          background-color: rgba(255, 255, 255, 0.05);
          border: none;
          color: #fff;
          font-size: 18px;
          cursor: pointer;
          padding: 6px 12px;
          border-radius: 8px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-button:hover {
          background-color: rgba(230, 126, 34, 0.3);
          transform: rotate(90deg);
        }

        .user-info {
          padding: 24px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          gap: 15px;
          background: rgba(0, 0, 0, 0.1);
        }

        .user-avatar {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: linear-gradient(135deg, #e67e22, #f39c12);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          font-weight: bold;
          color: #fff;
          box-shadow: 0 4px 12px rgba(230, 126, 34, 0.3);
          transition: transform 0.2s;
        }

        .user-avatar:hover {
          transform: scale(1.05);
        }

        .user-details {
          flex: 1;
        }

        .user-name {
          font-size: 16px;
          font-weight: bold;
          color: #fff;
          margin-bottom: 4px;
          letter-spacing: 0.3px;
        }

        .user-role {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .user-role::before {
          content: "●";
          color: #2ecc71;
          font-size: 8px;
        }

        .nav {
          flex: 1;
          padding: 16px 0;
          overflow-y: auto;
        }

        .menu-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .menu-item {
          margin-bottom: 2px;
        }

        .menu-link {
          display: flex;
          align-items: center;
          padding: 12px 20px;
          margin: 0 12px;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          border-radius: 10px;
        }

        .menu-link:hover {
          background: rgba(230, 126, 34, 0.1);
          color: #e67e22;
          transform: translateX(4px);
        }

        .menu-link.active {
          background: linear-gradient(
            90deg,
            rgba(230, 126, 34, 0.15),
            transparent
          );
          color: #e67e22;
          border-left: 3px solid #e67e22;
        }

        .menu-icon {
          font-size: 18px;
          margin-right: 12px;
          width: 24px;
          text-align: center;
        }

        .menu-text {
          flex: 1;
          font-size: 14px;
          font-weight: 500;
        }

        .badge {
          padding: 3px 8px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: bold;
          color: #fff;
          margin-left: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .badge.small {
          font-size: 10px;
          padding: 2px 6px;
        }

        .arrow {
          font-size: 10px;
          margin-left: 8px;
          transition: transform 0.2s;
          opacity: 0.6;
        }

        .arrow.expanded {
          transform: rotate(180deg);
          opacity: 1;
        }

        .submenu {
          list-style: none;
          padding: 4px 0 4px 56px;
          margin: 0;
        }

        .submenu-link {
          display: flex;
          align-items: center;
          padding: 8px 16px;
          margin: 2px 12px;
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
          font-size: 13px;
          transition: all 0.2s;
          border-radius: 8px;
        }

        .submenu-link:hover {
          background: rgba(230, 126, 34, 0.1);
          color: #e67e22;
          transform: translateX(4px);
        }

        .submenu-link.active {
          color: #e67e22;
          background: rgba(230, 126, 34, 0.08);
        }

        .footer {
          padding: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(0, 0, 0, 0.2);
        }

        .logout-button {
          width: 100%;
          display: flex;
          align-items: center;
          padding: 12px 16px;
          background: rgba(230, 126, 34, 0.1);
          border: 1px solid rgba(230, 126, 34, 0.3);
          border-radius: 10px;
          color: #e67e22;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
          margin-bottom: 12px;
        }

        .logout-button:hover {
          background: #e67e22;
          color: #fff;
          border-color: #e67e22;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(230, 126, 34, 0.3);
        }

        .version {
          text-align: center;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.3);
          letter-spacing: 0.5px;
        }

        @media (max-width: 768px) {
          .admin-sidebar {
            width: 260px;
          }

          .admin-sidebar.closed {
            transform: translateX(-100%);
          }

          .admin-sidebar.open {
            transform: translateX(0);
            animation: slideIn 0.3s ease;
          }

          .menu-link {
            margin: 0 8px;
            padding: 10px 16px;
          }

          .submenu {
            padding-left: 48px;
          }

          .submenu-link {
            margin: 2px 8px;
          }
        }
      `}</style>

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div className="admin-sidebar-overlay" onClick={onClose} />
      )}

      {/* Sidebar */}
      <aside
        id="admin-sidebar"
        className={`admin-sidebar ${isOpen ? "open" : "closed"}`}
      >
        {/* Header */}
        <div className="sidebar-header">
          <div className="logo-container">
            <span className="logo-icon">🏔️</span>
            <span className="logo-text">Admin Panel</span>
          </div>
          {isMobile && (
            <button onClick={onClose} className="close-button">
              ✕
            </button>
          )}
        </div>

        {/* User Info */}
        <div className="user-info">
          <div className="user-avatar">{user?.name?.charAt(0) || "A"}</div>
          <div className="user-details">
            <div className="user-name">{user?.name || "Admin"}</div>
            <div className="user-role">Administrator</div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="nav">
          <ul className="menu-list">
            {menuItems.map((item, index) => renderMenuItem(item, index))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="footer">
          <button onClick={handleLogout} className="logout-button">
            <span className="menu-icon">🚪</span>
            <span className="menu-text">Logout</span>
          </button>
          <div className="version">Version 1.0.0</div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
