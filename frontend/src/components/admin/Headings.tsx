import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import NotificationToast from "../NotificationToast";

// Types
interface MainHeading {
  id: number;
  name: string;
}

interface Heading {
  id: number;
  name: string;
  mainHeadingId: number;
  mainHeadingName?: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

interface MainHeadingWithHeadings {
  mainHeadingId: number;
  mainHeadingName: string;
  headings: Heading[];
}

const Headings: React.FC = () => {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [mainHeadings, setMainHeadings] = useState<MainHeading[]>([]);
  const [groupedHeadings, setGroupedHeadings] = useState<
    MainHeadingWithHeadings[]
  >([]);
  const [filteredHeadings, setFilteredHeadings] = useState<Heading[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMainHeading, setSelectedMainHeading] = useState<
    number | "all"
  >("all");
  const [showModal, setShowModal] = useState(false);
  const [editingHeading, setEditingHeading] = useState<Heading | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    mainHeadingId: 0,
    description: "",
    displayOrder: 0,
  });
  const [viewMode, setViewMode] = useState<"list" | "grouped">("grouped");
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
    fetchMainHeadings();
    fetchHeadings();
  }, []);

  useEffect(() => {
    filterHeadings();
  }, [searchTerm, selectedMainHeading, headings]);

  useEffect(() => {
    if (viewMode === "grouped") {
      groupHeadingsByMainHeading();
    }
  }, [headings, mainHeadings, viewMode]);

  const fetchMainHeadings = async () => {
    try {
      const response = await api.get("/api/MainHeading");
      setMainHeadings(response.data);
    } catch (error: any) {
      console.error("Error fetching main headings:", error);
      showNotification("Error loading main headings", "error");
    }
  };

  const fetchHeadings = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/Heading");
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

  const fetchGroupedHeadings = async () => {
    try {
      const response = await api.get("/api/Heading/grouped-by-mainheading");
      setGroupedHeadings(response.data);
    } catch (error: any) {
      console.error("Error fetching grouped headings:", error);
      showNotification("Error loading grouped headings", "error");
    }
  };

  const filterHeadings = () => {
    let filtered = [...headings];

    // Filter by search term
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (h) =>
          h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          h.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filter by main heading
    if (selectedMainHeading !== "all") {
      filtered = filtered.filter(
        (h) => h.mainHeadingId === selectedMainHeading,
      );
    }

    setFilteredHeadings(filtered);
  };

  const groupHeadingsByMainHeading = () => {
    const grouped: MainHeadingWithHeadings[] = mainHeadings.map((mh) => ({
      mainHeadingId: mh.id,
      mainHeadingName: mh.name,
      headings: headings
        .filter((h) => h.mainHeadingId === mh.id && h.isActive)
        .sort((a, b) => a.displayOrder - b.displayOrder),
    }));

    setGroupedHeadings(grouped);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleMainHeadingFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedMainHeading(value === "all" ? "all" : parseInt(value));
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "mainHeadingId" || name === "displayOrder"
          ? parseInt(value) || 0
          : value,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      mainHeadingId: mainHeadings.length > 0 ? mainHeadings[0].id : 0,
      description: "",
      displayOrder: 0,
    });
    setEditingHeading(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (heading: Heading) => {
    setEditingHeading(heading);
    setFormData({
      name: heading.name,
      mainHeadingId: heading.mainHeadingId,
      description: heading.description || "",
      displayOrder: heading.displayOrder,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showNotification("Name is required", "warning");
      return;
    }

    if (!formData.mainHeadingId) {
      showNotification("Please select a main heading", "warning");
      return;
    }

    try {
      if (editingHeading) {
        // Update
        await api.put(`/api/Heading/${editingHeading.id}`, {
          name: formData.name.trim(),
          description: formData.description || null,
          displayOrder: formData.displayOrder,
          isActive: true,
        });
        showNotification("Heading updated successfully!", "success");
      } else {
        // Create
        await api.post("/api/Heading", {
          name: formData.name.trim(),
          mainHeadingId: formData.mainHeadingId,
          description: formData.description || null,
          displayOrder: formData.displayOrder,
        });
        showNotification("Heading created successfully!", "success");
      }

      setShowModal(false);
      resetForm();
      fetchHeadings();
      if (viewMode === "grouped") {
        fetchGroupedHeadings();
      }
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
      await api.delete(`/api/Heading/${id}`);
      showNotification("Heading deleted successfully!", "success");
      fetchHeadings();
      if (viewMode === "grouped") {
        fetchGroupedHeadings();
      }
    } catch (error: any) {
      console.error("Error deleting heading:", error);
      showNotification(
        error.response?.data?.message || "Error deleting heading",
        "error",
      );
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      await api.patch(`/api/Heading/${id}/toggle-status`);
      showNotification(
        `Heading ${currentStatus ? "deactivated" : "activated"} successfully!`,
        "success",
      );
      fetchHeadings();
      if (viewMode === "grouped") {
        fetchGroupedHeadings();
      }
    } catch (error: any) {
      console.error("Error toggling heading status:", error);
      showNotification(
        error.response?.data?.message || "Error updating heading status",
        "error",
      );
    }
  };

  const handleDragStart = (e: React.DragEvent, heading: Heading) => {
    e.dataTransfer.setData("text/plain", heading.id.toString());
  };

  const handleDrop = async (e: React.DragEvent, targetHeading: Heading) => {
    e.preventDefault();
    const draggedId = parseInt(e.dataTransfer.getData("text/plain"));
    if (draggedId === targetHeading.id) return;

    // Get all headings in the same main heading
    const sameMainHeadings = filteredHeadings
      .filter(
        (h) => h.mainHeadingId === targetHeading.mainHeadingId && h.isActive,
      )
      .sort((a, b) => a.displayOrder - b.displayOrder);

    const draggedIndex = sameMainHeadings.findIndex((h) => h.id === draggedId);
    const targetIndex = sameMainHeadings.findIndex(
      (h) => h.id === targetHeading.id,
    );

    if (draggedIndex === -1 || targetIndex === -1) return;

    // Reorder array
    const [removed] = sameMainHeadings.splice(draggedIndex, 1);
    sameMainHeadings.splice(targetIndex, 0, removed);

    // Update display orders
    const updates = sameMainHeadings.map((heading, index) => ({
      id: heading.id,
      displayOrder: index,
    }));

    try {
      await api.post("/api/Heading/reorder", updates);
      showNotification("Headings reordered successfully!", "success");
      fetchHeadings();
    } catch (error: any) {
      console.error("Error reordering headings:", error);
      showNotification("Error reordering headings", "error");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const showNotification = (
    message: string,
    type: "success" | "error" | "warning",
  ) => {
    setNotification({ show: true, message, type });
  };

  const getMainHeadingName = (mainHeadingId: number): string => {
    const mainHeading = mainHeadings.find((mh) => mh.id === mainHeadingId);
    return mainHeading?.name || "Unknown";
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
          <h1 style={styles.pageTitle}>Headings Management</h1>
          <div style={styles.topBarRight}>
            <div style={styles.viewToggle}>
              <button
                onClick={() => setViewMode("list")}
                style={{
                  ...styles.viewToggleButton,
                  ...(viewMode === "list" ? styles.viewToggleActive : {}),
                }}
              >
                List View
              </button>
              <button
                onClick={() => setViewMode("grouped")}
                style={{
                  ...styles.viewToggleButton,
                  ...(viewMode === "grouped" ? styles.viewToggleActive : {}),
                }}
              >
                Grouped View
              </button>
            </div>
            <button onClick={openCreateModal} style={styles.addButton}>
              + Add New Heading
            </button>
          </div>
        </div>

        {/* Filters */}
        <div style={styles.filtersContainer}>
          {/* Search Bar */}
          <div style={styles.searchWrapper}>
            <input
              type="text"
              placeholder="Search headings by name or description..."
              value={searchTerm}
              onChange={handleSearch}
              style={styles.searchInput}
            />
            <span style={styles.searchIcon}>🔍</span>
          </div>

          {/* Main Heading Filter */}
          <select
            value={selectedMainHeading}
            onChange={handleMainHeadingFilter}
            style={styles.filterSelect}
          >
            <option value="all">All Main Headings</option>
            {mainHeadings.map((mh) => (
              <option key={mh.id} value={mh.id}>
                {mh.name}
              </option>
            ))}
          </select>
        </div>

        {/* Headings Display */}
        {viewMode === "list" ? (
          /* Table View */
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>S.N.</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Main Heading</th>
                  <th style={styles.th}>Description</th>
                  <th style={styles.th}>Order</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Created At</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredHeadings.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={styles.noData}>
                      No headings found
                    </td>
                  </tr>
                ) : (
                  filteredHeadings
                    .sort((a, b) => a.displayOrder - b.displayOrder)
                    .map((heading, index) => (
                      <tr
                        key={heading.id}
                        style={{
                          ...styles.row,
                          opacity: heading.isActive ? 1 : 0.6,
                        }}
                        draggable={heading.isActive}
                        onDragStart={(e) => handleDragStart(e, heading)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, heading)}
                      >
                        <td style={styles.td}>{index + 1}</td>
                        <td style={styles.td}>
                          <span style={styles.nameCell}>{heading.name}</span>
                        </td>
                        <td style={styles.td}>
                          {getMainHeadingName(heading.mainHeadingId)}
                        </td>
                        <td style={styles.td}>{heading.description || "-"}</td>
                        <td style={styles.td}>{heading.displayOrder}</td>
                        <td style={styles.td}>
                          <span
                            style={{
                              ...styles.statusBadge,
                              backgroundColor: heading.isActive
                                ? "#4caf50"
                                : "#999",
                            }}
                          >
                            {heading.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td style={styles.td}>
                          {new Date(heading.createdAt).toLocaleDateString()}
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
                              onClick={() =>
                                handleToggleStatus(heading.id, heading.isActive)
                              }
                              style={styles.statusButton}
                              title={
                                heading.isActive ? "Deactivate" : "Activate"
                              }
                            >
                              {heading.isActive ? "🔴" : "🟢"}
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
            <div style={styles.dragHint}>
              💡 Drag and drop rows to reorder headings
            </div>
          </div>
        ) : (
          /* Grouped View */
          <div style={styles.groupedContainer}>
            {groupedHeadings.map((group) => (
              <div key={group.mainHeadingId} style={styles.groupCard}>
                <div style={styles.groupHeader}>
                  <h2 style={styles.groupTitle}>{group.mainHeadingName}</h2>
                  <span style={styles.groupCount}>
                    {group.headings.length} headings
                  </span>
                </div>
                {group.headings.length === 0 ? (
                  <p style={styles.groupNoData}>No headings in this group</p>
                ) : (
                  <div style={styles.groupList}>
                    {group.headings.map((heading, index) => (
                      <div key={heading.id} style={styles.groupItem}>
                        <div style={styles.groupItemLeft}>
                          <span style={styles.groupItemNumber}>
                            {index + 1}.
                          </span>
                          <span style={styles.groupItemName}>
                            {heading.name}
                          </span>
                          {heading.description && (
                            <span style={styles.groupItemDescription}>
                              - {heading.description}
                            </span>
                          )}
                        </div>
                        <div style={styles.groupItemActions}>
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
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

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
                    Main Heading <span style={styles.required}>*</span>
                  </label>
                  <select
                    name="mainHeadingId"
                    value={formData.mainHeadingId}
                    onChange={handleInputChange}
                    style={styles.select}
                    required
                  >
                    <option value="">Select Main Heading</option>
                    {mainHeadings.map((mh) => (
                      <option key={mh.id} value={mh.id}>
                        {mh.name}
                      </option>
                    ))}
                  </select>
                </div>

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

                <div style={styles.formGroup}>
                  <label style={styles.label}>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter description (optional)"
                    style={styles.textarea}
                    rows={3}
                    maxLength={500}
                  />
                  <small style={styles.hint}>Max 500 characters</small>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Display Order</label>
                  <input
                    type="number"
                    name="displayOrder"
                    value={formData.displayOrder}
                    onChange={handleInputChange}
                    placeholder="Enter display order"
                    style={styles.input}
                    min="0"
                  />
                  <small style={styles.hint}>Lower numbers appear first</small>
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
  viewToggle: {
    display: "flex",
    gap: "5px",
    backgroundColor: "#f0f0f0",
    padding: "3px",
    borderRadius: "8px",
  },
  viewToggleButton: {
    padding: "6px 12px",
    border: "none",
    backgroundColor: "transparent",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
    color: "#666",
  },
  viewToggleActive: {
    backgroundColor: "white",
    color: "#e67e22",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
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
  filtersContainer: {
    display: "flex",
    gap: "15px",
    marginBottom: "20px",
    flexWrap: "wrap" as const,
  },
  searchWrapper: {
    position: "relative" as const,
    flex: 1,
    minWidth: "300px",
  },
  searchInput: {
    width: "100%",
    padding: "12px 40px 12px 15px",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box" as const,
    ":focus": {
      borderColor: "#e67e22",
    },
  },
  searchIcon: {
    position: "absolute" as const,
    right: "15px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "16px",
    color: "#999",
    pointerEvents: "none" as const,
  },
  filterSelect: {
    padding: "12px 15px",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    backgroundColor: "white",
    minWidth: "200px",
    cursor: "pointer",
    ":focus": {
      borderColor: "#e67e22",
    },
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
    cursor: "grab",
    ":hover": {
      backgroundColor: "#f8f9fa",
    },
    ":active": {
      cursor: "grabbing",
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
  statusBadge: {
    padding: "4px 8px",
    borderRadius: "4px",
    color: "white",
    fontSize: "12px",
    fontWeight: "500",
  },
  noData: {
    textAlign: "center" as const,
    padding: "40px",
    color: "#999",
    fontSize: "14px",
  },
  dragHint: {
    padding: "10px 15px",
    backgroundColor: "#f8f9fa",
    borderTop: "1px solid #e0e0e0",
    fontSize: "12px",
    color: "#666",
    textAlign: "center" as const,
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
  statusButton: {
    backgroundColor: "transparent",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    padding: "5px",
    borderRadius: "4px",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#f0f0f0",
    },
  },
  groupedContainer: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "20px",
  },
  groupCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    overflow: "hidden",
  },
  groupHeader: {
    backgroundColor: "#f8f9fa",
    padding: "15px 20px",
    borderBottom: "2px solid #e0e0e0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  groupTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#2c3e50",
    margin: 0,
  },
  groupCount: {
    fontSize: "13px",
    color: "#666",
    backgroundColor: "#e0e0e0",
    padding: "4px 8px",
    borderRadius: "4px",
  },
  groupList: {
    padding: "10px",
  },
  groupItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 15px",
    borderBottom: "1px solid #ecf0f1",
    ":last-child": {
      borderBottom: "none",
    },
    ":hover": {
      backgroundColor: "#f8f9fa",
    },
  },
  groupItemLeft: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flex: 1,
  },
  groupItemNumber: {
    color: "#999",
    fontSize: "13px",
    minWidth: "30px",
  },
  groupItemName: {
    fontWeight: "500",
    color: "#e67e22",
  },
  groupItemDescription: {
    color: "#666",
    fontSize: "13px",
    fontStyle: "italic" as const,
  },
  groupItemActions: {
    display: "flex",
    gap: "5px",
  },
  groupNoData: {
    padding: "30px",
    textAlign: "center" as const,
    color: "#999",
    fontSize: "14px",
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
    maxHeight: "90vh",
    overflowY: "auto" as const,
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
  select: {
    padding: "10px",
    fontSize: "14px",
    border: "1px solid #e0e0e0",
    borderRadius: "6px",
    outline: "none",
    backgroundColor: "white",
    cursor: "pointer",
    ":focus": {
      borderColor: "#e67e22",
    },
  },
  textarea: {
    padding: "10px",
    fontSize: "14px",
    border: "1px solid #e0e0e0",
    borderRadius: "6px",
    outline: "none",
    resize: "vertical" as const,
    fontFamily: "inherit",
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

export default Headings;
