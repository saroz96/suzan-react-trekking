"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/admin/Sidebar";
import NotificationToast from "@/NotificationToast";

interface MainHeading {
  id: number;
  name: string;
  createdAt: string;
  updatedAt?: string;
}

const MainHeadings: React.FC = () => {
  const router = useRouter();
  const [headings, setHeadings] = useState<MainHeading[]>([]);
  const [filteredHeadings, setFilteredHeadings] = useState<MainHeading[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingHeading, setEditingHeading] = useState<MainHeading | null>(
    null,
  );
  const [formData, setFormData] = useState({ name: "" });
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
      const timestamp = new Date().getTime();
      const data = await apiCall<MainHeading[]>(
        `/api/MainHeading?_=${timestamp}`,
      );
      setHeadings(data);
      setFilteredHeadings(data);
    } catch (error: any) {
      showNotification(error.message || "Error loading headings", "error");
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
        await apiCall(`/api/MainHeading/${editingHeading.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: formData.name.trim() }),
        });
        showNotification("Heading updated successfully!", "success");
      } else {
        // Create
        await apiCall("/api/MainHeading", {
          method: "POST",
          body: JSON.stringify({ name: formData.name.trim() }),
        });
        showNotification("Heading created successfully!", "success");
      }

      setShowModal(false);
      resetForm();
      fetchHeadings();
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
      await apiCall(`/api/MainHeading/${id}`, { method: "DELETE" });
      showNotification("Heading deleted successfully!", "success");
      fetchHeadings();
    } catch (error: any) {
      console.error("Error deleting heading:", error);
      showNotification(error.message || "Error deleting heading", "error");
    }
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

  if (loading) {
    return (
      <div className="main-headings-container">
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

      <div className="main-headings-container">
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
            <h1 className="page-title">Main Headings Management</h1>
            <div className="top-bar-right">
              <button onClick={openCreateModal} className="add-button">
                + Add New Heading
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Search headings by name..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>

          {/* Headings Table */}
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th className="th">S.N.</th>
                  <th className="th">Name</th>
                  <th className="th">Created At</th>
                  <th className="th">Last Updated</th>
                  <th className="th">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredHeadings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="no-data">
                      No headings found
                    </td>
                  </tr>
                ) : (
                  filteredHeadings.map((heading, index) => (
                    <tr key={heading.id} className="row">
                      <td className="td">{index + 1}</td>
                      <td className="td">
                        <span className="name-cell">{heading.name}</span>
                      </td>
                      <td className="td">
                        {new Date(heading.createdAt).toLocaleDateString()}
                      </td>
                      <td className="td">
                        {heading.updatedAt
                          ? new Date(heading.updatedAt).toLocaleDateString()
                          : "-"}
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
          </div>

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
  .main-headings-container {
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

  .search-container {
    position: relative;
    margin-bottom: 20px;
    max-width: 400px;
    width: 100%;
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
  }

  .row:hover {
    background-color: #f8f9fa;
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

  .no-data {
    text-align: center;
    padding: 40px;
    color: #999;
    font-size: 14px;
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

  .input {
    padding: 10px;
    font-size: 14px;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    outline: none;
    transition: border-color 0.2s;
  }

  .input:focus {
    border-color: #e67e22;
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

    .search-container {
      max-width: 100%;
    }

    .table-container {
      overflow-x: auto;
    }

    .modal {
      padding: 20px;
      width: 95%;
    }
  }
`;

export default MainHeadings;
