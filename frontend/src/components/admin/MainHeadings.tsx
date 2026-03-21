import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import NotificationToast from "../NotificationToast";

interface MainHeading {
  id: number;
  name: string;
  createdAt: string;
  updatedAt?: string;
}

const MainHeadings: React.FC = () => {
  const [headings, setHeadings] = useState<MainHeading[]>([]);
  const [filteredHeadings, setFilteredHeadings] = useState<MainHeading[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingHeading, setEditingHeading] = useState<MainHeading | null>(
    null,
  );
  const [formData, setFormData] = useState({ name: "" });
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error" | "warning",
  });

  // Base URL
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5232";

  // Create axios instance
  const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Add token to requests
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("trekking_app_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    fetchHeadings();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredHeadings(headings);
    } else {
      const filtered = headings.filter((h) =>
        h.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredHeadings(filtered);
    }
  }, [searchTerm, headings]);

  const fetchHeadings = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/MainHeading");
      setHeadings(response.data);
      setFilteredHeadings(response.data);
    } catch (error: any) {
      showNotification(
        error.response?.data?.message || "Error loading headings",
        "error",
      );
      console.error("Error fetching headings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({ name: "" });
    setEditingHeading(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (heading: MainHeading) => {
    setEditingHeading(heading);
    setFormData({ name: heading.name });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showNotification("Name is required", "warning");
      return;
    }

    try {
      if (editingHeading) {
        // Update
        await api.put(`/api/MainHeading/${editingHeading.id}`, {
          name: formData.name.trim(),
        });
        showNotification("Heading updated successfully!", "success");
      } else {
        // Create
        await api.post("/api/MainHeading", {
          name: formData.name.trim(),
        });
        showNotification("Heading created successfully!", "success");
      }

      setShowModal(false);
      resetForm();
      fetchHeadings();
    } catch (error: any) {
      console.error("Error saving heading:", error);
      showNotification(
        error.response?.data?.message || "Error saving heading",
        "error",
      );
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this heading?")) {
      return;
    }

    try {
      await api.delete(`/api/MainHeading/${id}`);
      showNotification("Heading deleted successfully!", "success");
      fetchHeadings();
    } catch (error: any) {
      console.error("Error deleting heading:", error);
      showNotification(
        error.response?.data?.message || "Error deleting heading",
        "error",
      );
    }
  };

  const showNotification = (
    message: string,
    type: "success" | "error" | "warning",
  ) => {
    setNotification({ show: true, message, type });
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main
          style={{
            ...styles.main,
            marginLeft: isSidebarOpen ? "280px" : "0",
          }}
        >
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p>Loading headings...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <main
        style={{
          ...styles.main,
          marginLeft: isSidebarOpen ? "280px" : "0",
        }}
      >
        {/* Top Bar */}
        <div style={styles.topBar}>
          <button
            onClick={toggleSidebar}
            style={styles.menuToggle}
            id="sidebar-toggle"
          >
            ☰
          </button>
          <h1 style={styles.pageTitle}>Main Headings Management</h1>
          <div style={styles.topBarRight}>
            <button onClick={openCreateModal} style={styles.addButton}>
              + Add New Heading
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search headings by name..."
            value={searchTerm}
            onChange={handleSearch}
            style={styles.searchInput}
          />
          <span style={styles.searchIcon}>🔍</span>
        </div>

        {/* Headings Table */}
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>S.N.</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Created At</th>
                <th style={styles.th}>Last Updated</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredHeadings.length === 0 ? (
                <tr>
                  <td colSpan={5} style={styles.noData}>
                    No headings found
                  </td>
                </tr>
              ) : (
                filteredHeadings.map((heading, index) => (
                  <tr key={heading.id} style={styles.row}>
                    <td style={styles.td}>{index + 1}</td>
                    <td style={styles.td}>
                      <span style={styles.nameCell}>{heading.name}</span>
                    </td>
                    <td style={styles.td}>
                      {new Date(heading.createdAt).toLocaleDateString()}
                    </td>
                    <td style={styles.td}>
                      {heading.updatedAt
                        ? new Date(heading.updatedAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actionButtons}>
                        <button
                          onClick={() => openEditModal(heading)}
                          style={styles.editButton}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(heading.id)}
                          style={styles.deleteButton}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Create/Edit Modal */}
        {showModal && (
          <>
            <div
              style={styles.modalOverlay}
              onClick={() => setShowModal(false)}
            />
            <div style={styles.modal}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>
                  {editingHeading ? "Edit Heading" : "Create New Heading"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  style={styles.closeButton}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    Name <span style={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter heading name"
                    style={styles.input}
                    autoFocus
                    maxLength={200}
                  />
                  <small style={styles.hint}>Max 200 characters</small>
                </div>

                <div style={styles.modalFooter}>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    style={styles.cancelButton}
                  >
                    Cancel
                  </button>
                  <button type="submit" style={styles.submitButton}>
                    {editingHeading ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}

        {/* Notification Toast */}
        <NotificationToast
          show={notification.show}
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ ...notification, show: false })}
        />
      </main>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
    fontFamily: "Arial, sans-serif",
  },
  main: {
    padding: "30px",
    transition: "margin-left 0.3s ease",
    minHeight: "100vh",
  },
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "30px",
    backgroundColor: "white",
    padding: "15px 25px",
    borderRadius: "12px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
  },
  menuToggle: {
    backgroundColor: "transparent",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    color: "#2c3e50",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    borderRadius: "8px",
    ":hover": {
      backgroundColor: "#f8f9fa",
    },
  },
  pageTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#2c3e50",
    margin: 0,
  },
  topBarRight: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  addButton: {
    backgroundColor: "#e67e22",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#d35400",
    },
  },
  searchContainer: {
    position: "relative" as const,
    marginBottom: "20px",
    maxWidth: "400px",
    width: "100%",
  },
  searchInput: {
    width: "400px",
    padding: "12px 40px 12px 15px",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
    ":focus": {
      borderColor: "#e67e22",
    },
  },
  searchIcon: {
    position: "absolute" as const,
    right: "15px",
    top: "50%",
    transform: "translateY(-50  %)",
    fontSize: "16px",
    color: "#999",
  },
  tableContainer: {
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    overflow: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
  },
  th: {
    textAlign: "left" as const,
    padding: "15px",
    backgroundColor: "#f8f9fa",
    color: "#2c3e50",
    fontSize: "14px",
    fontWeight: "600",
    borderBottom: "2px solid #e0e0e0",
  },
  row: {
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#f8f9fa",
    },
  },
  td: {
    padding: "12px 15px",
    borderBottom: "1px solid #ecf0f1",
    fontSize: "14px",
    color: "#2c3e50",
  },
  nameCell: {
    fontWeight: "500",
    color: "#e67e22",
  },
  noData: {
    textAlign: "center" as const,
    padding: "40px",
    color: "#999",
    fontSize: "14px",
  },
  actionButtons: {
    display: "flex",
    gap: "8px",
  },
  editButton: {
    backgroundColor: "transparent",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    padding: "5px",
    borderRadius: "4px",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#fff3e0",
    },
  },
  deleteButton: {
    backgroundColor: "transparent",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    padding: "5px",
    borderRadius: "4px",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#ffebee",
    },
  },
  modalOverlay: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 1000,
  },
  modal: {
    position: "fixed" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "30px",
    width: "90%",
    maxWidth: "500px",
    zIndex: 1001,
    boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  modalTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#2c3e50",
    margin: 0,
  },
  closeButton: {
    backgroundColor: "transparent",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    color: "#999",
    padding: "5px",
    ":hover": {
      color: "#e67e22",
    },
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "5px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#2c3e50",
  },
  required: {
    color: "#e74c3c",
  },
  input: {
    padding: "10px",
    fontSize: "14px",
    border: "1px solid #e0e0e0",
    borderRadius: "6px",
    outline: "none",
    transition: "border-color 0.2s",
    ":focus": {
      borderColor: "#e67e22",
    },
  },
  hint: {
    fontSize: "12px",
    color: "#999",
  },
  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "10px",
  },
  cancelButton: {
    padding: "8px 16px",
    backgroundColor: "transparent",
    border: "1px solid #e0e0e0",
    borderRadius: "6px",
    fontSize: "14px",
    color: "#666",
    cursor: "pointer",
    transition: "all 0.2s",
    ":hover": {
      backgroundColor: "#f5f5f5",
    },
  },
  submitButton: {
    padding: "8px 20px",
    backgroundColor: "#e67e22",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#d35400",
    },
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    height: "400px",
    gap: "20px",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid #f3f3f3",
    borderTop: "3px solid #e67e22",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};

// Add keyframes for spinner animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(styleSheet);

export default MainHeadings;
