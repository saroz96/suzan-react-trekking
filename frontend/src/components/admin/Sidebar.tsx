import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

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
  const navigate = useNavigate();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768 && !isOpen) {
        onClose();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen, onClose]);

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

  const toggleSubmenu = (menuName: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menuName)
        ? prev.filter((item) => item !== menuName)
        : [...prev, menuName],
    );
  };

  const handleLogout = async () => {
    await logout();
    navigate("/auth/login");
  };

  const menuItems: MenuItem[] = [
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
        { path: "/admin/main-headings", name: "Main Headings", icon: "📑" },
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
        { path: "/admin/treks/destinations", name: "Destinations", icon: "📍" },
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
        { path: "/admin/users/roles", name: "Roles & Permissions", icon: "🔐" },
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
        { path: "/admin/reports/trekking", name: "Trekking Stats", icon: "🏔️" },
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

  const renderMenuItem = (item: MenuItem, index: number) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMenus.includes(item.name);

    return (
      <li key={index} style={styles.menuItem}>
        {hasChildren ? (
          <>
            <div
              onClick={() => toggleSubmenu(item.name)}
              style={{
                ...styles.menuLink,
                ...(isExpanded ? styles.menuLinkActive : {}),
              }}
            >
              <span style={styles.menuIcon}>{item.icon}</span>
              <span style={styles.menuText}>{item.name}</span>
              {item.badge && (
                <span
                  style={{
                    ...styles.badge,
                    backgroundColor: item.badgeColor || "#e67e22",
                  }}
                >
                  {item.badge}
                </span>
              )}
              <span
                style={{
                  ...styles.arrow,
                  transform: isExpanded ? "rotate(180deg)" : "rotate(0)",
                }}
              >
                ▼
              </span>
            </div>
            {isExpanded && (
              <ul style={styles.submenu}>
                {item.children.map((child, childIndex) => (
                  <li key={childIndex}>
                    <NavLink
                      to={child.path}
                      style={({ isActive }) => ({
                        ...styles.submenuLink,
                        ...(isActive ? styles.submenuLinkActive : {}),
                      })}
                      onClick={isMobile ? onClose : undefined}
                    >
                      <span style={styles.menuIcon}>{child.icon}</span>
                      <span style={styles.menuText}>{child.name}</span>
                      {child.badge && (
                        <span
                          style={{
                            ...styles.badge,
                            backgroundColor: child.badgeColor || "#e67e22",
                            fontSize: "10px",
                            padding: "2px 6px",
                          }}
                        >
                          {child.badge}
                        </span>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <NavLink
            to={item.path}
            style={({ isActive }) => ({
              ...styles.menuLink,
              ...(isActive ? styles.menuLinkActive : {}),
            })}
            onClick={isMobile ? onClose : undefined}
          >
            <span style={styles.menuIcon}>{item.icon}</span>
            <span style={styles.menuText}>{item.name}</span>
            {item.badge && (
              <span
                style={{
                  ...styles.badge,
                  backgroundColor: item.badgeColor || "#e67e22",
                }}
              >
                {item.badge}
              </span>
            )}
          </NavLink>
        )}
      </li>
    );
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isOpen && <div style={styles.overlay} onClick={onClose} />}

      {/* Sidebar */}
      <aside
        id="admin-sidebar"
        style={{
          ...styles.sidebar,
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logoContainer}>
            <span style={styles.logoIcon}>🏔️</span>
            <span style={styles.logoText}>Admin Panel</span>
          </div>
          {isMobile && (
            <button onClick={onClose} style={styles.closeButton}>
              ✕
            </button>
          )}
        </div>

        {/* User Info */}
        <div style={styles.userInfo}>
          <div style={styles.userAvatar}>{user?.name?.charAt(0) || "A"}</div>
          <div style={styles.userDetails}>
            <div style={styles.userName}>{user?.name || "Admin"}</div>
            <div style={styles.userRole}>Administrator</div>
          </div>
        </div>

        {/* Menu Items */}
        <nav style={styles.nav}>
          <ul style={styles.menuList}>
            {menuItems.map((item, index) => renderMenuItem(item, index))}
          </ul>
        </nav>

        {/* Footer */}
        <div style={styles.footer}>
          <button onClick={handleLogout} style={styles.logoutButton}>
            <span style={styles.menuIcon}>🚪</span>
            <span style={styles.menuText}>Logout</span>
          </button>
          <div style={styles.version}>Version 1.0.0</div>
        </div>
      </aside>
    </>
  );
};

const styles = {
  overlay: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
    animation: "fadeIn 0.3s ease",
  },
  sidebar: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    width: "280px",
    height: "100vh",
    backgroundColor: "#1a1a2e",
    color: "#fff",
    zIndex: 1000,
    transition: "transform 0.3s ease",
    display: "flex",
    flexDirection: "column" as const,
    boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
    overflowY: "auto" as const,
  },
  header: {
    padding: "20px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logoIcon: {
    fontSize: "24px",
  },
  logoText: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#fff",
  },
  closeButton: {
    backgroundColor: "transparent",
    border: "none",
    color: "#fff",
    fontSize: "20px",
    cursor: "pointer",
    padding: "5px 10px",
    borderRadius: "4px",
    ":hover": {
      backgroundColor: "rgba(255,255,255,0.1)",
    },
  },
  userInfo: {
    padding: "20px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  userAvatar: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    backgroundColor: "#e67e22",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    fontWeight: "bold",
    color: "#fff",
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#fff",
    marginBottom: "4px",
  },
  userRole: {
    fontSize: "12px",
    color: "rgba(255,255,255,0.6)",
  },
  nav: {
    flex: 1,
    padding: "20px 0",
    overflowY: "auto" as const,
  },
  menuList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  menuItem: {
    marginBottom: "4px",
  },
  menuLink: {
    display: "flex",
    alignItems: "center",
    padding: "12px 20px",
    color: "rgba(255,255,255,0.8)",
    textDecoration: "none",
    cursor: "pointer",
    transition: "all 0.2s",
    position: "relative" as const,
    ":hover": {
      backgroundColor: "rgba(230, 126, 34, 0.1)",
      color: "#e67e22",
    },
  },
  menuLinkActive: {
    backgroundColor: "rgba(230, 126, 34, 0.15)",
    color: "#e67e22",
    borderLeft: "3px solid #e67e22",
  },
  menuIcon: {
    fontSize: "18px",
    marginRight: "12px",
    width: "24px",
    textAlign: "center" as const,
  },
  menuText: {
    flex: 1,
    fontSize: "14px",
    fontWeight: "500",
  },
  badge: {
    padding: "3px 8px",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: "bold",
    color: "#fff",
    marginLeft: "8px",
  },
  arrow: {
    fontSize: "12px",
    marginLeft: "8px",
    transition: "transform 0.2s",
  },
  submenu: {
    listStyle: "none",
    padding: "0 0 0 56px",
    margin: "4px 0",
  },
  submenuLink: {
    display: "flex",
    alignItems: "center",
    padding: "10px 20px",
    color: "rgba(255,255,255,0.6)",
    textDecoration: "none",
    fontSize: "13px",
    transition: "all 0.2s",
    borderRadius: "4px",
    ":hover": {
      backgroundColor: "rgba(230, 126, 34, 0.1)",
      color: "#e67e22",
    },
  },
  submenuLinkActive: {
    color: "#e67e22",
    backgroundColor: "rgba(230, 126, 34, 0.1)",
  },
  footer: {
    padding: "20px",
    borderTop: "1px solid rgba(255,255,255,0.1)",
  },
  logoutButton: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    padding: "12px 20px",
    backgroundColor: "transparent",
    border: "1px solid rgba(230, 126, 34, 0.3)",
    borderRadius: "8px",
    color: "#e67e22",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s",
    marginBottom: "10px",
    ":hover": {
      backgroundColor: "#e67e22",
      color: "#fff",
      borderColor: "#e67e22",
    },
  },
  version: {
    textAlign: "center" as const,
    fontSize: "11px",
    color: "rgba(255,255,255,0.3)",
  },
};

// Add keyframes for animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default Sidebar;
