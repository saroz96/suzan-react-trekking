"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/pages/admin/Sidebar";
import NotificationToast from "@/NotificationToast";

// Types
interface MainHeading {
  id: number;
  name: string;
  isActive?: boolean;
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
  const router = useRouter();
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [windowWidth, setWindowWidth] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error" | "warning",
  });

  // Base URL
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5232";

  // Get token from localStorage
  const getToken = (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("trekking_app_token");
    }
    return null;
  };

  // API call helper
  const apiCall = async <T,>(
    url: string,
    options?: RequestInit,
  ): Promise<T> => {
    const token = getToken();
    const headers: Record<string, string> = {};

    if (options?.body && !(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        ...headers,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      let errorMessage = "API call failed";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.title || errorData;
      } catch {
        errorMessage = await response.text();
      }
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }

    return {} as T;
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      setIsSidebarOpen(width > 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      const timestamp = new Date().getTime();
      const data = await apiCall<MainHeading[]>(
        `/api/MainHeading?_=${timestamp}`,
      );
      // Filter active main headings
      const activeMainHeadings = data.filter((mh) => mh.isActive !== false);
      setMainHeadings(activeMainHeadings);
    } catch (error: any) {
      console.error("Error fetching main headings:", error);
      showNotification("Error loading main headings", "error");
    }
  };

  const fetchHeadings = async () => {
    try {
      setLoading(true);
      const timestamp = new Date().getTime();
      const data = await apiCall<Heading[]>(`/api/Heading?_=${timestamp}`);
      // Filter active headings
      //   const activeHeadings = data.filter((h) => h.isActive !== false);
      setHeadings(data);
      setFilteredHeadings(data);
    } catch (error: any) {
      showNotification(error.message || "Error loading headings", "error");
      console.error("Error fetching headings:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupedHeadings = async () => {
    try {
      const timestamp = new Date().getTime();
      const data = await apiCall<MainHeadingWithHeadings[]>(
        `/api/Heading/grouped-by-mainheading?_=${timestamp}`,
      );
      setGroupedHeadings(data);
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
        .filter((h) => h.mainHeadingId === mh.id)
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
        await apiCall(`/api/Heading/${editingHeading.id}`, {
          method: "PUT",
          body: JSON.stringify({
            name: formData.name.trim(),
            description: formData.description || null,
            displayOrder: formData.displayOrder,
            isActive: true,
          }),
        });
        showNotification("Heading updated successfully!", "success");
      } else {
        // Create
        await apiCall("/api/Heading", {
          method: "POST",
          body: JSON.stringify({
            name: formData.name.trim(),
            mainHeadingId: formData.mainHeadingId,
            description: formData.description || null,
            displayOrder: formData.displayOrder,
          }),
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
      showNotification(error.message || "Error saving heading", "error");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this heading?")) {
      return;
    }

    try {
      await apiCall(`/api/Heading/${id}`, { method: "DELETE" });
      showNotification("Heading deleted successfully!", "success");
      fetchHeadings();
      if (viewMode === "grouped") {
        fetchGroupedHeadings();
      }
    } catch (error: any) {
      console.error("Error deleting heading:", error);
      showNotification(error.message || "Error deleting heading", "error");
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      await apiCall(`/api/Heading/${id}/toggle-status`, { method: "PATCH" });
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
        error.message || "Error updating heading status",
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
      await apiCall("/api/Heading/reorder", {
        method: "POST",
        body: JSON.stringify(updates),
      });
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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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
      <div className="headings-container">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main
          className="main-content"
          style={{
            marginLeft: isSidebarOpen && windowWidth > 768 ? "280px" : "0",
          }}
        >
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading headings...</p>
          </div>
        </main>
        <style jsx>{styles}</style>
      </div>
    );
  }

  return (
    <>
      <style jsx>{styles}</style>
      <style jsx global>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>

      <div className="headings-container">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content */}
        <main
          className="main-content"
          style={{
            marginLeft: isSidebarOpen && windowWidth > 768 ? "280px" : "0",
          }}
        >
          {/* Top Bar */}
          <div className="top-bar">
            <button
              onClick={toggleSidebar}
              className="menu-toggle"
              id="sidebar-toggle"
            >
              ☰
            </button>
            <h1 className="page-title">Headings Management</h1>
            <div className="top-bar-right">
              <div className="view-toggle">
                <button
                  onClick={() => setViewMode("list")}
                  className={`view-toggle-button ${viewMode === "list" ? "active" : ""}`}
                >
                  List View
                </button>
                <button
                  onClick={() => setViewMode("grouped")}
                  className={`view-toggle-button ${viewMode === "grouped" ? "active" : ""}`}
                >
                  Grouped View
                </button>
              </div>
              <button onClick={openCreateModal} className="add-button">
                + Add New Heading
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="filters-container">
            {/* Search Bar */}
            <div className="search-wrapper">
              <input
                type="text"
                placeholder="Search headings by name or description..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>

            {/* Main Heading Filter */}
            <select
              value={selectedMainHeading}
              onChange={handleMainHeadingFilter}
              className="filter-select"
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
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th className="th">S.N.</th>
                    <th className="th">Name</th>
                    <th className="th">Main Heading</th>
                    <th className="th">Description</th>
                    <th className="th">Order</th>
                    <th className="th">Status</th>
                    <th className="th">Created At</th>
                    <th className="th">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHeadings.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="no-data">
                        No headings found
                      </td>
                    </tr>
                  ) : (
                    filteredHeadings
                      .sort((a, b) => a.displayOrder - b.displayOrder)
                      .map((heading, index) => (
                        <tr
                          key={heading.id}
                          className={`row ${!heading.isActive ? "inactive" : ""}`}
                          draggable={heading.isActive}
                          onDragStart={(e) => handleDragStart(e, heading)}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, heading)}
                        >
                          <td className="td">{index + 1}</td>
                          <td className="td">
                            <span className="name-cell">{heading.name}</span>
                          </td>
                          <td className="td">
                            {getMainHeadingName(heading.mainHeadingId)}
                          </td>
                          <td className="td">{heading.description || "-"}</td>
                          <td className="td">{heading.displayOrder}</td>
                          <td className="td">
                            <span
                              className={`status-badge ${heading.isActive ? "active" : "inactive"}`}
                            >
                              {heading.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="td">
                            {new Date(heading.createdAt).toLocaleDateString()}
                          </td>
                          <td className="td">
                            <div className="action-buttons">
                              <button
                                onClick={() => openEditModal(heading)}
                                className="edit-button"
                                title="Edit"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() =>
                                  handleToggleStatus(
                                    heading.id,
                                    heading.isActive,
                                  )
                                }
                                className="status-button"
                                title={
                                  heading.isActive ? "Deactivate" : "Activate"
                                }
                              >
                                {heading.isActive ? "🔴" : "🟢"}
                              </button>
                              <button
                                onClick={() => handleDelete(heading.id)}
                                className="delete-button"
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
              <div className="drag-hint">
                💡 Drag and drop rows to reorder headings
              </div>
            </div>
          ) : (
            /* Grouped View */
            <div className="grouped-container">
              {groupedHeadings.map((group) => (
                <div key={group.mainHeadingId} className="group-card">
                  <div className="group-header">
                    <h2 className="group-title">{group.mainHeadingName}</h2>
                    <span className="group-count">
                      {group.headings.length} headings
                    </span>
                  </div>
                  {group.headings.length === 0 ? (
                    <p className="group-no-data">No headings in this group</p>
                  ) : (
                    <div className="group-list">
                      {group.headings.map((heading, index) => (
                        <div key={heading.id} className="group-item">
                          <div className="group-item-left">
                            <span className="group-item-number">
                              {index + 1}.
                            </span>
                            <span className="group-item-name">
                              {heading.name}
                            </span>
                            {heading.description && (
                              <span className="group-item-description">
                                - {heading.description}
                              </span>
                            )}
                          </div>
                          <div className="group-item-actions">
                            <button
                              onClick={() => openEditModal(heading)}
                              className="edit-button"
                              title="Edit"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDelete(heading.id)}
                              className="delete-button"
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
                className="modal-overlay"
                onClick={() => setShowModal(false)}
              />
              <div className="modal">
                <div className="modal-header">
                  <h2 className="modal-title">
                    {editingHeading ? "Edit Heading" : "Create New Heading"}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="close-button"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="form">
                  <div className="form-group">
                    <label className="label">
                      Main Heading <span className="required">*</span>
                    </label>
                    <select
                      name="mainHeadingId"
                      value={formData.mainHeadingId}
                      onChange={handleInputChange}
                      className="select"
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

                  <div className="form-group">
                    <label className="label">
                      Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter heading name"
                      className="input"
                      autoFocus
                      maxLength={200}
                    />
                    <small className="hint">Max 200 characters</small>
                  </div>

                  <div className="form-group">
                    <label className="label">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Enter description (optional)"
                      className="textarea"
                      rows={3}
                      maxLength={500}
                    />
                    <small className="hint">Max 500 characters</small>
                  </div>

                  <div className="form-group">
                    <label className="label">Display Order</label>
                    <input
                      type="number"
                      name="displayOrder"
                      value={formData.displayOrder}
                      onChange={handleInputChange}
                      placeholder="Enter display order"
                      className="input"
                      min="0"
                    />
                    <small className="hint">Lower numbers appear first</small>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="cancel-button"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="submit-button">
                      {editingHeading ? "Update" : "Create"}
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </main>
      </div>

      <NotificationToast
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ ...notification, show: false })}
      />
    </>
  );
};

const styles = `
  .headings-container {
    min-height: 100vh;
    background-color: #f8f9fa;
    font-family: Arial, sans-serif;
  }

  .main-content {
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

  .view-toggle {
    display: flex;
    gap: 5px;
    background-color: #f0f0f0;
    padding: 3px;
    border-radius: 8px;
  }

  .view-toggle-button {
    padding: 6px 12px;
    border: none;
    background-color: transparent;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    color: #666;
  }

  .view-toggle-button.active {
    background-color: white;
    color: #e67e22;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .add-button {
    background-color: #e67e22;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .add-button:hover {
    background-color: #d35400;
  }

  .filters-container {
    display: flex;
    gap: 15px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }

  .search-wrapper {
    position: relative;
    flex: 1;
    min-width: 300px;
  }

  .search-input {
    width: 100%;
    padding: 12px 40px 12px 15px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
    box-sizing: border-box;
  }

  .search-input:focus {
    border-color: #e67e22;
  }

  .search-icon {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 16px;
    color: #999;
    pointer-events: none;
  }

  .filter-select {
    padding: 12px 15px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
    outline: none;
    background-color: white;
    min-width: 200px;
    cursor: pointer;
  }

  .filter-select:focus {
    border-color: #e67e22;
  }

  .table-container {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: auto;
  }

  .table {
    width: 100%;
    border-collapse: collapse;
  }

  .th {
    text-align: left;
    padding: 15px;
    background-color: #f8f9fa;
    color: #2c3e50;
    font-size: 14px;
    font-weight: 600;
    border-bottom: 2px solid #e0e0e0;
  }

  .row {
    transition: background-color 0.2s;
    cursor: grab;
  }

  .row.inactive {
    opacity: 0.6;
  }

  .row:hover {
    background-color: #f8f9fa;
  }

  .row:active {
    cursor: grabbing;
  }

  .td {
    padding: 12px 15px;
    border-bottom: 1px solid #ecf0f1;
    font-size: 14px;
    color: #2c3e50;
  }

  .name-cell {
    font-weight: 500;
    color: #e67e22;
  }

  .status-badge {
    padding: 4px 8px;
    border-radius: 4px;
    color: white;
    font-size: 12px;
    font-weight: 500;
  }

  .status-badge.active {
    background-color: #4caf50;
  }

  .status-badge.inactive {
    background-color: #999;
  }

  .no-data {
    text-align: center;
    padding: 40px;
    color: #999;
    font-size: 14px;
  }

  .drag-hint {
    padding: 10px 15px;
    background-color: #f8f9fa;
    border-top: 1px solid #e0e0e0;
    font-size: 12px;
    color: #666;
    text-align: center;
  }

  .action-buttons {
    display: flex;
    gap: 8px;
  }

  .edit-button {
    background-color: transparent;
    border: none;
    font-size: 18px;
    cursor: pointer;
    padding: 5px;
    border-radius: 4px;
    transition: background-color 0.2s;
  }

  .edit-button:hover {
    background-color: #fff3e0;
  }

  .delete-button {
    background-color: transparent;
    border: none;
    font-size: 18px;
    cursor: pointer;
    padding: 5px;
    border-radius: 4px;
    transition: background-color 0.2s;
  }

  .delete-button:hover {
    background-color: #ffebee;
  }

  .status-button {
    background-color: transparent;
    border: none;
    font-size: 18px;
    cursor: pointer;
    padding: 5px;
    border-radius: 4px;
    transition: background-color 0.2s;
  }

  .status-button:hover {
    background-color: #f0f0f0;
  }

  .grouped-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .group-card {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .group-header {
    background-color: #f8f9fa;
    padding: 15px 20px;
    border-bottom: 2px solid #e0e0e0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .group-title {
    font-size: 18px;
    font-weight: 600;
    color: #2c3e50;
    margin: 0;
  }

  .group-count {
    font-size: 13px;
    color: #666;
    background-color: #e0e0e0;
    padding: 4px 8px;
    border-radius: 4px;
  }

  .group-list {
    padding: 10px;
  }

  .group-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 15px;
    border-bottom: 1px solid #ecf0f1;
  }

  .group-item:last-child {
    border-bottom: none;
  }

  .group-item:hover {
    background-color: #f8f9fa;
  }

  .group-item-left {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
  }

  .group-item-number {
    color: #999;
    font-size: 13px;
    min-width: 30px;
  }

  .group-item-name {
    font-weight: 500;
    color: #e67e22;
  }

  .group-item-description {
    color: #666;
    font-size: 13px;
    font-style: italic;
  }

  .group-item-actions {
    display: flex;
    gap: 5px;
  }

  .group-no-data {
    padding: 30px;
    text-align: center;
    color: #999;
    font-size: 14px;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
  }

  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    border-radius: 12px;
    padding: 30px;
    width: 90%;
    max-width: 500px;
    z-index: 1001;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    max-height: 90vh;
    overflow-y: auto;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .modal-title {
    font-size: 20px;
    font-weight: 600;
    color: #2c3e50;
    margin: 0;
  }

  .close-button {
    background-color: transparent;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #999;
    padding: 5px;
  }

  .close-button:hover {
    color: #e67e22;
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .label {
    font-size: 14px;
    font-weight: 500;
    color: #2c3e50;
  }

  .required {
    color: #e74c3c;
  }

  .input,
  .select,
  .textarea {
    padding: 10px;
    font-size: 14px;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    outline: none;
    transition: border-color 0.2s;
    font-family: inherit;
  }

  .input:focus,
  .select:focus,
  .textarea:focus {
    border-color: #e67e22;
  }

  .select {
    background-color: white;
    cursor: pointer;
  }

  .textarea {
    resize: vertical;
  }

  .hint {
    font-size: 12px;
    color: #999;
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 10px;
  }

  .cancel-button {
    padding: 8px 16px;
    background-color: transparent;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    font-size: 14px;
    color: #666;
    cursor: pointer;
    transition: all 0.2s;
  }

  .cancel-button:hover {
    background-color: #f5f5f5;
  }

  .submit-button {
    padding: 8px 20px;
    background-color: #e67e22;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .submit-button:hover {
    background-color: #d35400;
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 400px;
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
    .main-content {
      padding: 20px;
    }

    .top-bar {
      padding: 12px 20px;
    }

    .filters-container {
      flex-direction: column;
    }

    .search-wrapper {
      min-width: 100%;
    }

    .filter-select {
      width: 100%;
    }

    .table-container {
      overflow-x: auto;
    }

    .modal {
      padding: 20px;
      width: 95%;
    }

    .group-header {
      flex-direction: column;
      gap: 10px;
      text-align: center;
    }

    .group-item-left {
      flex-wrap: wrap;
    }
  }
`;

export default Headings;
