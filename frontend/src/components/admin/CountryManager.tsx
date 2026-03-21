import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import NotificationToast from "../NotificationToast";

// Types
interface Country {
  id: number;
  name: string;
  code?: string;
  description?: string;
  flagImageUrl?: string;
  coverImageUrl?: string;
  isActive: boolean;
  displayOrder: number;
  trekPackageCount: number;
  createdAt: string;
  updatedAt?: string;
}

interface CountryOrder {
  id: number;
  displayOrder: number;
}

const CountryManager: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [imageType, setImageType] = useState<"flag" | "cover">("flag");
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error" | "warning",
  });

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    displayOrder: 0,
  });

  // Image upload states
  const [flagImage, setFlagImage] = useState<File | null>(null);
  const [flagPreview, setFlagPreview] = useState<string>("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>("");

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
    fetchCountries();
  }, []);

  useEffect(() => {
    filterCountries();
  }, [searchTerm, countries]);

  //   const fetchCountries = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await api.get("/api/Country");
  //       setCountries(response.data);
  //       setFilteredCountries(response.data);
  //     } catch (error: any) {
  //       showNotification(
  //         error.response?.data?.message || "Error loading countries",
  //         "error",
  //       );
  //       console.error("Error fetching countries:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  const fetchCountries = async () => {
    try {
      setLoading(true);
      // Add a cache-busting parameter
      const response = await api.get("/api/Country?_=" + new Date().getTime());
      console.log("Fetched countries:", response.data);
      setCountries(response.data);
      setFilteredCountries(response.data);
    } catch (error: any) {
      showNotification(
        error.response?.data?.message || "Error loading countries",
        "error",
      );
      console.error("Error fetching countries:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFullImageUrl = (imageUrl: string | undefined): string => {
    if (!imageUrl) return "";

    console.log("Original imageUrl from API:", imageUrl);

    // If it's already a full URL
    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }

    // If it's a blob URL (preview)
    if (imageUrl.startsWith("blob:")) {
      return imageUrl;
    }

    // Construct full URL
    const baseUrl = API_BASE_URL.endsWith("/")
      ? API_BASE_URL.slice(0, -1)
      : API_BASE_URL;

    // Ensure imageUrl starts with /
    const normalizedUrl = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;

    const fullUrl = `${baseUrl}${normalizedUrl}`;
    console.log("Constructed full URL:", fullUrl);

    return fullUrl;
  };

  // Add this right before the return statement
  useEffect(() => {
    if (countries.length > 0) {
      console.log("=== CURRENT COUNTRY DATA ===");
      countries.forEach((country) => {
        console.log(`${country.name}:`, {
          flagUrl: country.flagImageUrl,
          coverUrl: country.coverImageUrl,
          fullFlagUrl: getFullImageUrl(country.flagImageUrl),
          fullCoverUrl: getFullImageUrl(country.coverImageUrl),
        });
      });
    }
  }, [countries]);

  const filterCountries = () => {
    if (searchTerm.trim() === "") {
      setFilteredCountries(countries);
    } else {
      const filtered = countries.filter(
        (c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredCountries(filtered);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "displayOrder" ? parseInt(value) || 0 : value,
    });
  };

  const handleFlagImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFlagImage(file);
      setFlagPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      description: "",
      displayOrder: 0,
    });
    setFlagImage(null);
    setFlagPreview("");
    setCoverImage(null);
    setCoverPreview("");
    setEditingCountry(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (country: Country) => {
    setEditingCountry(country);
    setFormData({
      name: country.name,
      code: country.code || "",
      description: country.description || "",
      displayOrder: country.displayOrder,
    });
    setFlagPreview(country.flagImageUrl || "");
    setCoverPreview(country.coverImageUrl || "");
    setShowModal(true);
  };

  const openImageModal = (country: Country, type: "flag" | "cover") => {
    setSelectedCountry(country);
    setImageType(type);
    if (type === "flag") {
      setFlagPreview(country.flagImageUrl || "");
      setFlagImage(null);
    } else {
      setCoverPreview(country.coverImageUrl || "");
      setCoverImage(null);
    }
    setShowImageModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showNotification("Country name is required", "warning");
      return;
    }

    try {
      // Create FormData
      const formDataToSend = new FormData();
      formDataToSend.append("Name", formData.name.trim()); // Note: Capital "N" to match backend
      formDataToSend.append("Code", formData.code.trim() || "");
      formDataToSend.append("Description", formData.description.trim() || "");
      formDataToSend.append("DisplayOrder", formData.displayOrder.toString());

      console.log("Sending FormData:"); // Debug log
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      if (editingCountry) {
        // Update
        const response = await api.put(
          `/api/Country/${editingCountry.id}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
        showNotification("Country updated successfully!", "success");
      } else {
        // Create
        const response = await api.post("/api/Country", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        showNotification("Country created successfully!", "success");
      }

      setShowModal(false);
      resetForm();
      fetchCountries();
    } catch (error: any) {
      console.error("Error saving country:", error);
      console.error("Error response:", error.response?.data);
      showNotification(
        error.response?.data?.message || "Error saving country",
        "error",
      );
    }
  };

  const handleImageUpload = async () => {
    if (!selectedCountry) return;

    const image = imageType === "flag" ? flagImage : coverImage;
    if (!image) {
      showNotification("Please select an image", "warning");
      return;
    }

    const formData = new FormData();
    formData.append(imageType === "flag" ? "flagImage" : "coverImage", image);

    try {
      const endpoint =
        imageType === "flag"
          ? `/api/Country/${selectedCountry.id}/upload-flag`
          : `/api/Country/${selectedCountry.id}/upload-cover`;

      await api.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showNotification(
        `${imageType === "flag" ? "Flag" : "Cover"} image uploaded successfully!`,
        "success",
      );
      setShowImageModal(false);
      setFlagImage(null);
      setCoverImage(null);
      setFlagPreview("");
      setCoverPreview("");
      fetchCountries();
    } catch (error: any) {
      console.error("Error uploading image:", error);
      showNotification(
        error.response?.data?.message || "Error uploading image",
        "error",
      );
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this country?")) {
      return;
    }

    try {
      await api.delete(`/api/Country/${id}`);
      showNotification("Country deleted successfully!", "success");
      fetchCountries();
    } catch (error: any) {
      console.error("Error deleting country:", error);
      showNotification(
        error.response?.data?.message || "Error deleting country",
        "error",
      );
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      await api.patch(`/api/Country/${id}/toggle-status`);
      showNotification(
        `Country ${currentStatus ? "deactivated" : "activated"} successfully!`,
        "success",
      );
      fetchCountries();
    } catch (error: any) {
      console.error("Error toggling country status:", error);
      showNotification(
        error.response?.data?.message || "Error updating country status",
        "error",
      );
    }
  };

  const handleDragStart = (e: React.DragEvent, country: Country) => {
    e.dataTransfer.setData("text/plain", country.id.toString());
  };

  const handleDrop = async (e: React.DragEvent, targetCountry: Country) => {
    e.preventDefault();
    const draggedId = parseInt(e.dataTransfer.getData("text/plain"));
    if (draggedId === targetCountry.id) return;

    // Get all active countries sorted by display order
    const sortedCountries = [...filteredCountries]
      .filter((c) => c.isActive)
      .sort((a, b) => a.displayOrder - b.displayOrder);

    const draggedIndex = sortedCountries.findIndex((c) => c.id === draggedId);
    const targetIndex = sortedCountries.findIndex(
      (c) => c.id === targetCountry.id,
    );

    if (draggedIndex === -1 || targetIndex === -1) return;

    // Reorder array
    const [removed] = sortedCountries.splice(draggedIndex, 1);
    sortedCountries.splice(targetIndex, 0, removed);

    // Update display orders
    const updates: CountryOrder[] = sortedCountries.map((country, index) => ({
      id: country.id,
      displayOrder: index,
    }));

    try {
      await api.post("/api/Country/reorder", updates);
      showNotification("Countries reordered successfully!", "success");
      fetchCountries();
    } catch (error: any) {
      console.error("Error reordering countries:", error);
      showNotification("Error reordering countries", "error");
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

  if (loading) {
    return (
      <div style={styles.container}>
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main
          style={{ ...styles.main, marginLeft: isSidebarOpen ? "280px" : "0" }}
        >
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p>Loading countries...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main
        style={{ ...styles.main, marginLeft: isSidebarOpen ? "280px" : "0" }}
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
          <h1 style={styles.pageTitle}>Country Management</h1>
          <div style={styles.topBarRight}>
            <button onClick={openCreateModal} style={styles.addButton}>
              + Add New Country
            </button>
          </div>
        </div>
        {/* Search Bar */}
        <div style={styles.searchContainer}>
          <div style={styles.searchWrapper}>
            <input
              type="text"
              placeholder="Search countries by name, code or description..."
              value={searchTerm}
              onChange={handleSearch}
              style={styles.searchInput}
            />
            <span style={styles.searchIcon}>🔍</span>
          </div>
        </div>
        {/* Countries Grid */}
        <div style={styles.gridContainer}>
          {filteredCountries.length === 0 ? (
            <div style={styles.noData}>No countries found</div>
          ) : (
            filteredCountries
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map((country) => (
                <div
                  key={country.id}
                  style={{
                    ...styles.countryCard,
                    opacity: country.isActive ? 1 : 0.6,
                    cursor: country.isActive ? "grab" : "default",
                  }}
                  draggable={country.isActive}
                  onDragStart={(e) => handleDragStart(e, country)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, country)}
                >
                  {/* Flag Image */}
                  <div style={styles.flagContainer}>
                    {country.flagImageUrl ? (
                      <img
                        src={getFullImageUrl(country.flagImageUrl)}
                        alt={`${country.name} flag`}
                        style={styles.flagImage}
                      />
                    ) : (
                      <div style={styles.noFlag}>🏳️</div>
                    )}
                    <button
                      onClick={() => openImageModal(country, "flag")}
                      style={styles.uploadFlagButton}
                      title="Upload Flag"
                    >
                      📷
                    </button>
                  </div>

                  {/* Country Info */}
                  <div style={styles.countryInfo}>
                    <div style={styles.countryHeader}>
                      <h3 style={styles.countryName}>{country.name}</h3>
                      {country.code && (
                        <span style={styles.countryCode}>{country.code}</span>
                      )}
                    </div>

                    {country.description && (
                      <p style={styles.countryDescription}>
                        {country.description.length > 100
                          ? `${country.description.substring(0, 100)}...`
                          : country.description}
                      </p>
                    )}

                    <div style={styles.countryStats}>
                      <span style={styles.statItem}>
                        📦 {country.trekPackageCount} Packages
                      </span>
                      <span style={styles.statItem}>
                        🏷️ Order: {country.displayOrder}
                      </span>
                    </div>

                    <div style={styles.statusBadgeContainer}>
                      <span
                        style={{
                          ...styles.statusBadge,
                          backgroundColor: country.isActive
                            ? "#4caf50"
                            : "#999",
                        }}
                      >
                        {country.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>

                  {/* Cover Image Preview */}
                  {country.coverImageUrl && (
                    <div style={styles.coverPreview}>
                      <img
                        src={getFullImageUrl(country.coverImageUrl)}
                        alt={`${country.name} cover`}
                        style={styles.coverThumb}
                      />
                      <button
                        onClick={() => openImageModal(country, "cover")}
                        style={styles.uploadCoverButton}
                        title="Upload Cover"
                      >
                        🖼️
                      </button>
                    </div>
                  )}

                  {/* Actions */}
                  <div style={styles.cardActions}>
                    <button
                      onClick={() => openImageModal(country, "cover")}
                      style={styles.coverButton}
                      title="Upload Cover Image"
                    >
                      🖼️
                    </button>
                    <button
                      onClick={() => openEditModal(country)}
                      style={styles.editButton}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() =>
                        handleToggleStatus(country.id, country.isActive)
                      }
                      style={styles.statusButton}
                      title={country.isActive ? "Deactivate" : "Activate"}
                    >
                      {country.isActive ? "🔴" : "🟢"}
                    </button>
                    <button
                      onClick={() => handleDelete(country.id)}
                      style={styles.deleteButton}
                      title="Delete"
                      disabled={country.trekPackageCount > 0}
                    >
                      🗑️
                    </button>
                  </div>

                  {country.trekPackageCount > 0 && (
                    <div style={styles.warningBadge}>⚠️ Has packages</div>
                  )}
                </div>
              ))
          )}
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
                  {editingCountry ? "Edit Country" : "Create New Country"}
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
                    Country Name <span style={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Nepal"
                    style={styles.input}
                    maxLength={100}
                  />
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Country Code</label>
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      placeholder="e.g., NP"
                      style={styles.input}
                      maxLength={10}
                    />
                    <small style={styles.hint}>
                      2-letter country code (optional)
                    </small>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Display Order</label>
                    <input
                      type="number"
                      name="displayOrder"
                      value={formData.displayOrder}
                      onChange={handleInputChange}
                      placeholder="0"
                      style={styles.input}
                      min="0"
                    />
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter country description..."
                    style={styles.textarea}
                    rows={4}
                    maxLength={500}
                  />
                  <small style={styles.hint}>
                    {formData.description.length}/500 characters
                  </small>
                </div>

                {/* Image Previews */}
                {(flagPreview || coverPreview) && (
                  <div style={styles.previewContainer}>
                    {flagPreview && (
                      <div style={styles.previewItem}>
                        <img
                          src={getFullImageUrl(flagPreview)}
                          alt="Flag preview"
                          style={styles.previewImage}
                        />
                        <span style={styles.previewLabel}>Flag</span>
                      </div>
                    )}
                    {coverPreview && (
                      <div style={styles.previewItem}>
                        <img
                          src={coverPreview}
                          alt="Cover preview"
                          style={styles.previewImage}
                        />
                        <span style={styles.previewLabel}>Cover</span>
                      </div>
                    )}
                  </div>
                )}

                <div style={styles.modalFooter}>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    style={styles.cancelButton}
                  >
                    Cancel
                  </button>
                  <button type="submit" style={styles.submitButton}>
                    {editingCountry ? "Update Country" : "Create Country"}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
        Image Upload Modal
        {showImageModal && selectedCountry && (
          <>
            <div
              style={styles.modalOverlay}
              onClick={() => setShowImageModal(false)}
            />
            <div style={styles.modalSmall}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>
                  Upload {imageType === "flag" ? "Flag" : "Cover"} Image
                </h2>
                <button
                  onClick={() => setShowImageModal(false)}
                  style={styles.closeButton}
                >
                  ✕
                </button>
              </div>

              <div style={styles.imageUploadContent}>
                <p style={styles.countryName}>
                  {selectedCountry.name}{" "}
                  {imageType === "flag" ? "Flag" : "Cover Image"}
                </p>

                {/* Current/Preview Image */}
                {(imageType === "flag" ? flagPreview : coverPreview) && (
                  <div style={styles.currentImageContainer}>
                    <img
                      src={imageType === "flag" ? flagPreview : coverPreview}
                      alt="Preview"
                      style={styles.currentImage}
                    />
                  </div>
                )}

                {/* Upload Input */}
                <div style={styles.uploadArea}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={
                      imageType === "flag"
                        ? handleFlagImageChange
                        : handleCoverImageChange
                    }
                    style={styles.fileInput}
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" style={styles.fileInputLabel}>
                    Choose Image
                  </label>
                </div>

                <div style={styles.modalFooter}>
                  <button
                    type="button"
                    onClick={() => setShowImageModal(false)}
                    style={styles.cancelButton}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleImageUpload}
                    style={styles.submitButton}
                    disabled={imageType === "flag" ? !flagImage : !coverImage}
                  >
                    Upload
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
        {/* Drag & Drop Hint */}
        {filteredCountries.filter((c) => c.isActive).length > 1 && (
          <div style={styles.dragHint}>
            💡 Drag and drop country cards to reorder them
          </div>
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

// Styles
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
    marginBottom: "30px",
  },
  searchWrapper: {
    position: "relative",
    maxWidth: "500px",
    width: "100%",
  },
  searchInput: {
    width: "100%",
    padding: "12px 40px 12px 15px",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
    ":focus": {
      borderColor: "#e67e22",
    },
  },
  searchIcon: {
    position: "absolute",
    right: "15px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "16px",
    color: "#999",
    pointerEvents: "none",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "20px",
    marginBottom: "20px",
  },
  countryCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    overflow: "hidden",
    position: "relative",
    transition: "transform 0.2s, boxShadow 0.2s",
    ":hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    },
  },

  //   flagContainer: {
  //     height: "120px",
  //     backgroundColor: "#f0f0f0",
  //     position: "relative",
  //     display: "flex",
  //     alignItems: "center",
  //     justifyContent: "center",
  //   },
  //   flagImage: {
  //     width: "100%",
  //     height: "100%",
  //     objectFit: "cover",
  //   },
  flagContainer: {
    height: "120px",
    backgroundColor: "#f0f0f0", // Light gray background for empty space
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden", // Keep this to prevent any overflow
  },

  flagImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain", // This shows the ENTIRE image without cropping
    objectPosition: "center", // Centers the image
    backgroundColor: "#f0f0f0", // Match container background
  },

  noFlag: {
    fontSize: "48px",
    opacity: 0.3,
  },
  uploadFlagButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "rgba(0,0,0,0.5)",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "5px 10px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "rgba(0,0,0,0.7)",
    },
  },
  countryInfo: {
    padding: "15px",
  },
  countryHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px",
  },
  countryName: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#2c3e50",
    margin: 0,
  },
  countryCode: {
    backgroundColor: "#e67e22",
    color: "white",
    padding: "2px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "500",
  },
  countryDescription: {
    fontSize: "14px",
    color: "#666",
    lineHeight: "1.5",
    marginBottom: "10px",
  },
  countryStats: {
    display: "flex",
    gap: "15px",
    marginBottom: "10px",
  },
  statItem: {
    fontSize: "13px",
    color: "#888",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  statusBadgeContainer: {
    marginBottom: "10px",
  },
  statusBadge: {
    padding: "4px 8px",
    borderRadius: "4px",
    color: "white",
    fontSize: "12px",
    fontWeight: "500",
  },

  //   coverPreview: {
  //     position: "relative",
  //     height: "60px",
  //     backgroundColor: "#f8f9fa",
  //     borderTop: "1px solid #e0e0e0",
  //   },
  //   coverThumb: {
  //     width: "100%",
  //     height: "100%",
  //     objectFit: "cover",
  //   },
  coverPreview: {
    position: "relative",
    height: "60px",
    backgroundColor: "#f8f9fa",
    borderTop: "1px solid #e0e0e0",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  coverThumb: {
    width: "100%",
    height: "100%",
    objectFit: "contain", // Show entire cover image
    objectPosition: "center",
    backgroundColor: "#f8f9fa",
  },
  uploadCoverButton: {
    position: "absolute",
    top: "50%",
    right: "10px",
    transform: "translateY(-50%)",
    backgroundColor: "rgba(0,0,0,0.5)",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "4px 8px",
    cursor: "pointer",
    fontSize: "12px",
    ":hover": {
      backgroundColor: "rgba(0,0,0,0.7)",
    },
  },
  cardActions: {
    display: "flex",
    gap: "5px",
    padding: "10px 15px",
    borderTop: "1px solid #e0e0e0",
    backgroundColor: "#f8f9fa",
  },
  coverButton: {
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "4px",
    fontSize: "14px",
    cursor: "pointer",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#2980b9",
    },
  },
  editButton: {
    backgroundColor: "#f39c12",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "4px",
    fontSize: "14px",
    cursor: "pointer",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#e67e22",
    },
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "4px",
    fontSize: "14px",
    cursor: "pointer",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#c0392b",
    },
    ":disabled": {
      backgroundColor: "#ccc",
      cursor: "not-allowed",
    },
  },
  statusButton: {
    backgroundColor: "#95a5a6",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "4px",
    fontSize: "14px",
    cursor: "pointer",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#7f8c8d",
    },
  },
  warningBadge: {
    position: "absolute",
    top: "10px",
    left: "10px",
    backgroundColor: "#e67e22",
    color: "white",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: "500",
    zIndex: 1,
  },
  noData: {
    textAlign: "center",
    padding: "60px",
    color: "#999",
    fontSize: "16px",
    backgroundColor: "white",
    borderRadius: "12px",
    gridColumn: "1 / -1",
  },
  dragHint: {
    padding: "15px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#666",
    textAlign: "center",
    border: "1px dashed #e0e0e0",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 1000,
  },
  modal: {
    position: "fixed",
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
    overflowY: "auto",
  },
  modalSmall: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "30px",
    width: "90%",
    maxWidth: "400px",
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
    flexDirection: "column",
    gap: "20px",
  },
  formRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
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
  textarea: {
    padding: "10px",
    fontSize: "14px",
    border: "1px solid #e0e0e0",
    borderRadius: "6px",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
    ":focus": {
      borderColor: "#e67e22",
    },
  },
  hint: {
    fontSize: "12px",
    color: "#999",
  },
  previewContainer: {
    display: "flex",
    gap: "15px",
    padding: "10px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
  },
  previewItem: {
    position: "relative",
    width: "80px",
    height: "60px",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "4px",
  },
  previewLabel: {
    position: "absolute",
    bottom: "2px",
    left: "2px",
    backgroundColor: "rgba(0,0,0,0.5)",
    color: "white",
    padding: "2px 4px",
    borderRadius: "2px",
    fontSize: "10px",
  },
  imageUploadContent: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  currentImageContainer: {
    textAlign: "center",
  },
  currentImage: {
    maxWidth: "100%",
    maxHeight: "200px",
    borderRadius: "8px",
    border: "1px solid #e0e0e0",
  },
  uploadArea: {
    textAlign: "center",
  },
  fileInput: {
    display: "none",
  },
  fileInputLabel: {
    display: "inline-block",
    backgroundColor: "#3498db",
    color: "white",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#2980b9",
    },
  },
  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "20px",
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
    ":disabled": {
      backgroundColor: "#ccc",
      cursor: "not-allowed",
    },
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
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

export default CountryManager;
