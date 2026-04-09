"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import NotificationToast from "@/NotificationToast";
import Sidebar from "@/app/components/admin/Sidebar";
// import Sidebar from "@/components/Sidebar";
// import NotificationToast from "@/components/NotificationToast";

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
  const router = useRouter();
  const [countries, setCountries] = useState<Country[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [imageType, setImageType] = useState<"flag" | "cover">("flag");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [windowWidth, setWindowWidth] = useState(0);
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
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5232";

  // Helper function to get full image URL
  const getFullImageUrl = (imageUrl: string | undefined): string => {
    if (!imageUrl) return "";
    if (imageUrl.startsWith("http") || imageUrl.startsWith("blob:")) {
      return imageUrl;
    }
    const baseUrl = API_BASE_URL.endsWith("/")
      ? API_BASE_URL.slice(0, -1)
      : API_BASE_URL;
    const normalizedUrl = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
    return `${baseUrl}${normalizedUrl}`;
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

  // Get token from localStorage
  const getToken = (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("trekking_app_token");
    }
    return null;
  };

  // API call helper
  //   const apiCall = async <T,>(
  //     url: string,
  //     options?: RequestInit,
  //   ): Promise<T> => {
  //     const token = getToken();
  //     const headers: Record<string, string> = {
  //       "Content-Type": "application/json",
  //     };

  //     if (token) {
  //       headers["Authorization"] = `Bearer ${token}`;
  //     }

  //     if (options?.body instanceof FormData) {
  //       delete headers["Content-Type"];
  //     }

  //     const response = await fetch(`${API_BASE_URL}${url}`, {
  //       ...options,
  //       headers: {
  //         ...headers,
  //         ...options?.headers,
  //       },
  //     });

  //     if (!response.ok) {
  //       const error = await response.text();
  //       throw new Error(error || "API call failed");
  //     }

  //     return response.json();
  //   };

  // API call helper
  const apiCall = async <T,>(
    url: string,
    options?: RequestInit,
  ): Promise<T> => {
    const token = getToken();
    const headers: Record<string, string> = {};

    // Only set Content-Type if it's not FormData
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
      const error = await response.text();
      throw new Error(error || "API call failed");
    }

    // Handle empty responses
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }

    return {} as T;
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    filterCountries();
  }, [searchTerm, countries]);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      const data = await apiCall<Country[]>(
        "/api/Country?_=" + new Date().getTime(),
      );
      console.log("Fetched countries:", data);
      setCountries(data);
      setFilteredCountries(data);
    } catch (error: any) {
      showNotification(error.message || "Error loading countries", "error");
      console.error("Error fetching countries:", error);
    } finally {
      setLoading(false);
    }
  };

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

  //   const handleFlagImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     if (e.target.files && e.target.files[0]) {
  //       const file = e.target.files[0];
  //       setFlagImage(file);
  //       setFlagPreview(URL.createObjectURL(file));
  //     }
  //   };

  const handleFlagImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validate file type
      if (!file.type.startsWith("image/")) {
        showNotification("Please select an image file", "warning");
        return;
      }
      // Validate file size (e.g., 5MB max)
      if (file.size > 5 * 1024 * 1024) {
        showNotification("File size should be less than 5MB", "warning");
        return;
      }
      setFlagImage(file);
      setFlagPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validate file type
      if (!file.type.startsWith("image/")) {
        showNotification("Please select an image file", "warning");
        return;
      }
      // Validate file size (e.g., 5MB max)
      if (file.size > 5 * 1024 * 1024) {
        showNotification("File size should be less than 5MB", "warning");
        return;
      }
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };
  //   const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     if (e.target.files && e.target.files[0]) {
  //       const file = e.target.files[0];
  //       setCoverImage(file);
  //       setCoverPreview(URL.createObjectURL(file));
  //     }
  //   };

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

  //   const handleSubmit = async (e: React.FormEvent) => {
  //     e.preventDefault();

  //     if (!formData.name.trim()) {
  //       showNotification("Country name is required", "warning");
  //       return;
  //     }

  //     try {
  //       const formDataToSend = new FormData();
  //       formDataToSend.append("Name", formData.name.trim());
  //       formDataToSend.append("Code", formData.code.trim() || "");
  //       formDataToSend.append("Description", formData.description.trim() || "");
  //       formDataToSend.append("DisplayOrder", formData.displayOrder.toString());

  //       if (editingCountry) {
  //         await apiCall(`/api/Country/${editingCountry.id}`, {
  //           method: "PUT",
  //           body: formDataToSend,
  //         });
  //         showNotification("Country updated successfully!", "success");
  //       } else {
  //         await apiCall("/api/Country", {
  //           method: "POST",
  //           body: formDataToSend,
  //         });
  //         showNotification("Country created successfully!", "success");
  //       }

  //       setShowModal(false);
  //       resetForm();
  //       fetchCountries();
  //     } catch (error: any) {
  //       console.error("Error saving country:", error);
  //       showNotification(error.message || "Error saving country", "error");
  //     }
  //   };

  //   const handleImageUpload = async () => {
  //     if (!selectedCountry) return;

  //     const image = imageType === "flag" ? flagImage : coverImage;
  //     if (!image) {
  //       showNotification("Please select an image", "warning");
  //       return;
  //     }

  //     const formData = new FormData();
  //     formData.append(imageType === "flag" ? "flagImage" : "coverImage", image);

  //     try {
  //       const endpoint =
  //         imageType === "flag"
  //           ? `/api/Country/${selectedCountry.id}/upload-flag`
  //           : `/api/Country/${selectedCountry.id}/upload-cover`;

  //       await apiCall(endpoint, {
  //         method: "POST",
  //         body: formData,
  //       });

  //       showNotification(
  //         `${imageType === "flag" ? "Flag" : "Cover"} image uploaded successfully!`,
  //         "success",
  //       );
  //       setShowImageModal(false);
  //       setFlagImage(null);
  //       setCoverImage(null);
  //       setFlagPreview("");
  //       setCoverPreview("");
  //       fetchCountries();
  //     } catch (error: any) {
  //       console.error("Error uploading image:", error);
  //       showNotification(error.message || "Error uploading image", "error");
  //     }
  //   };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showNotification("Country name is required", "warning");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("Name", formData.name.trim());
      formDataToSend.append("Code", formData.code.trim() || "");
      formDataToSend.append("Description", formData.description.trim() || "");
      formDataToSend.append("DisplayOrder", formData.displayOrder.toString());

      // Append images if they exist
      if (flagImage) {
        formDataToSend.append("flagImage", flagImage);
      }
      if (coverImage) {
        formDataToSend.append("coverImage", coverImage);
      }

      const token = getToken();

      if (editingCountry) {
        // For update, use fetch directly to avoid Content-Type issues
        const response = await fetch(
          `${API_BASE_URL}/api/Country/${editingCountry.id}`,
          {
            method: "PUT",
            headers: {
              ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: formDataToSend,
          },
        );

        if (!response.ok) {
          const error = await response.text();
          throw new Error(error || "Update failed");
        }

        showNotification("Country updated successfully!", "success");
      } else {
        // For create
        const response = await fetch(`${API_BASE_URL}/api/Country`, {
          method: "POST",
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: formDataToSend,
        });

        if (!response.ok) {
          const error = await response.text();
          throw new Error(error || "Creation failed");
        }

        showNotification("Country created successfully!", "success");
      }

      setShowModal(false);
      resetForm();
      fetchCountries();
    } catch (error: any) {
      console.error("Error saving country:", error);
      showNotification(error.message || "Error saving country", "error");
    }
  };

  const handleImageUpload = async () => {
    if (!selectedCountry) return;

    const image = imageType === "flag" ? flagImage : coverImage;
    if (!image) {
      showNotification("Please select an image", "warning");
      return;
    }

    // Create FormData with the correct field name
    const formData = new FormData();
    const fieldName = imageType === "flag" ? "flagImage" : "coverImage";
    formData.append(fieldName, image);

    // Log the FormData for debugging
    console.log(`Uploading ${fieldName} for country ${selectedCountry.id}:`, {
      fileName: image.name,
      fileSize: image.size,
      fileType: image.type,
    });

    try {
      const endpoint =
        imageType === "flag"
          ? `/api/Country/${selectedCountry.id}/upload-flag`
          : `/api/Country/${selectedCountry.id}/upload-cover`;

      // Use fetch directly for multipart form data
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData, // Don't set Content-Type header, let browser set it
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Upload error response:", errorText);
        throw new Error(errorText || "Upload failed");
      }

      const result = await response.json();
      console.log("Upload success:", result);

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
      showNotification(error.message || "Error uploading image", "error");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this country?")) {
      return;
    }

    try {
      await apiCall(`/api/Country/${id}`, { method: "DELETE" });
      showNotification("Country deleted successfully!", "success");
      fetchCountries();
    } catch (error: any) {
      console.error("Error deleting country:", error);
      showNotification(error.message || "Error deleting country", "error");
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      await apiCall(`/api/Country/${id}/toggle-status`, { method: "PATCH" });
      showNotification(
        `Country ${currentStatus ? "deactivated" : "activated"} successfully!`,
        "success",
      );
      fetchCountries();
    } catch (error: any) {
      console.error("Error toggling country status:", error);
      showNotification(
        error.message || "Error updating country status",
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

    const sortedCountries = [...filteredCountries]
      .filter((c) => c.isActive)
      .sort((a, b) => a.displayOrder - b.displayOrder);

    const draggedIndex = sortedCountries.findIndex((c) => c.id === draggedId);
    const targetIndex = sortedCountries.findIndex(
      (c) => c.id === targetCountry.id,
    );

    if (draggedIndex === -1 || targetIndex === -1) return;

    const [removed] = sortedCountries.splice(draggedIndex, 1);
    sortedCountries.splice(targetIndex, 0, removed);

    const updates: CountryOrder[] = sortedCountries.map((country, index) => ({
      id: country.id,
      displayOrder: index,
    }));

    try {
      await apiCall("/api/Country/reorder", {
        method: "POST",
        body: JSON.stringify(updates),
      });
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
      <div className="container">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main
          className="main"
          style={{
            marginLeft: isSidebarOpen && windowWidth > 768 ? "280px" : "0",
          }}
        >
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading countries...</p>
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

      <div className="container">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

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
              id="sidebar-toggle"
            >
              ☰
            </button>
            <h1 className="page-title">Country Management</h1>
            <div className="top-bar-right">
              <button onClick={openCreateModal} className="add-button">
                + Add New Country
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="search-container">
            <div className="search-wrapper">
              <input
                type="text"
                placeholder="Search countries by name, code or description..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>

          {/* Countries Grid */}
          <div className="grid-container">
            {filteredCountries.length === 0 ? (
              <div className="no-data">No countries found</div>
            ) : (
              filteredCountries
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map((country) => (
                  <div
                    key={country.id}
                    className={`country-card ${!country.isActive ? "inactive" : ""}`}
                    draggable={country.isActive}
                    onDragStart={(e) => handleDragStart(e, country)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, country)}
                  >
                    {/* Flag Image */}
                    <div className="flag-container">
                      {country.flagImageUrl ? (
                        <Image
                          src={getFullImageUrl(country.flagImageUrl)}
                          alt={`${country.name} flag`}
                          fill
                          unoptimized
                          className="flag-image"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="no-flag">🏳️</div>
                      )}
                      <button
                        onClick={() => openImageModal(country, "flag")}
                        className="upload-flag-button"
                        title="Upload Flag"
                      >
                        📷
                      </button>
                    </div>

                    {/* Country Info */}
                    <div className="country-info">
                      <div className="country-header">
                        <h3 className="country-name">{country.name}</h3>
                        {country.code && (
                          <span className="country-code">{country.code}</span>
                        )}
                      </div>

                      {country.description && (
                        <p className="country-description">
                          {country.description.length > 100
                            ? `${country.description.substring(0, 100)}...`
                            : country.description}
                        </p>
                      )}

                      <div className="country-stats">
                        <span className="stat-item">
                          📦 {country.trekPackageCount} Packages
                        </span>
                        <span className="stat-item">
                          🏷️ Order: {country.displayOrder}
                        </span>
                      </div>

                      <div className="status-badge-container">
                        <span
                          className={`status-badge ${country.isActive ? "active" : "inactive"}`}
                        >
                          {country.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>

                    {/* Cover Image Preview */}
                    {country.coverImageUrl && (
                      <div className="cover-preview">
                        <Image
                          src={getFullImageUrl(country.coverImageUrl)}
                          alt={`${country.name} cover`}
                          fill
                          unoptimized
                          className="cover-thumb"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <button
                          onClick={() => openImageModal(country, "cover")}
                          className="upload-cover-button"
                          title="Upload Cover"
                        >
                          🖼️
                        </button>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="card-actions">
                      <button
                        onClick={() => openImageModal(country, "cover")}
                        className="cover-button"
                        title="Upload Cover Image"
                      >
                        🖼️
                      </button>
                      <button
                        onClick={() => openEditModal(country)}
                        className="edit-button"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() =>
                          handleToggleStatus(country.id, country.isActive)
                        }
                        className="status-button"
                        title={country.isActive ? "Deactivate" : "Activate"}
                      >
                        {country.isActive ? "🔴" : "🟢"}
                      </button>
                      <button
                        onClick={() => handleDelete(country.id)}
                        className="delete-button"
                        title="Delete"
                        disabled={country.trekPackageCount > 0}
                      >
                        🗑️
                      </button>
                    </div>

                    {country.trekPackageCount > 0 && (
                      <div className="warning-badge">⚠️ Has packages</div>
                    )}
                  </div>
                ))
            )}
          </div>

          {/* Drag & Drop Hint */}
          {filteredCountries.filter((c) => c.isActive).length > 1 && (
            <div className="drag-hint">
              💡 Drag and drop country cards to reorder them
            </div>
          )}
        </main>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <>
          <div className="modal-overlay" onClick={() => setShowModal(false)} />
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">
                {editingCountry ? "Edit Country" : "Create New Country"}
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
                  Country Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Nepal"
                  className="input"
                  maxLength={100}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="label">Country Code</label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    placeholder="e.g., NP"
                    className="input"
                    maxLength={10}
                  />
                  <small className="hint">
                    2-letter country code (optional)
                  </small>
                </div>

                <div className="form-group">
                  <label className="label">Display Order</label>
                  <input
                    type="number"
                    name="displayOrder"
                    value={formData.displayOrder}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="input"
                    min="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="label">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter country description..."
                  className="textarea"
                  rows={4}
                  maxLength={500}
                />
                <small className="hint">
                  {formData.description.length}/500 characters
                </small>
              </div>

              {/* Image Previews */}
              {(flagPreview || coverPreview) && (
                <div className="preview-container">
                  {flagPreview && (
                    <div className="preview-item">
                      <Image
                        src={getFullImageUrl(flagPreview)}
                        alt="Flag preview"
                        width={80}
                        height={60}
                        className="preview-image"
                      />
                      <span className="preview-label">Flag</span>
                    </div>
                  )}
                  {coverPreview && (
                    <div className="preview-item">
                      <Image
                        src={coverPreview}
                        alt="Cover preview"
                        width={80}
                        height={60}
                        className="preview-image"
                      />
                      <span className="preview-label">Cover</span>
                    </div>
                  )}
                </div>
              )}

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  {editingCountry ? "Update Country" : "Create Country"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Image Upload Modal */}
      {showImageModal && selectedCountry && (
        <>
          <div
            className="modal-overlay"
            onClick={() => setShowImageModal(false)}
          />
          <div className="modal-small">
            <div className="modal-header">
              <h2 className="modal-title">
                Upload {imageType === "flag" ? "Flag" : "Cover"} Image
              </h2>
              <button
                onClick={() => setShowImageModal(false)}
                className="close-button"
              >
                ✕
              </button>
            </div>

            <div className="image-upload-content">
              <p className="country-name-text">
                {selectedCountry.name}{" "}
                {imageType === "flag" ? "Flag" : "Cover Image"}
              </p>

              {/* Current/Preview Image */}
              {(imageType === "flag" ? flagPreview : coverPreview) && (
                <div className="current-image-container">
                  <Image
                    src={imageType === "flag" ? flagPreview : coverPreview}
                    alt="Preview"
                    width={300}
                    height={200}
                    className="current-image"
                  />
                </div>
              )}

              {/* Upload Input */}
              <div className="upload-area">
                <input
                  type="file"
                  accept="image/*"
                  onChange={
                    imageType === "flag"
                      ? handleFlagImageChange
                      : handleCoverImageChange
                  }
                  className="file-input"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="file-input-label">
                  Choose Image
                </label>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setShowImageModal(false)}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleImageUpload}
                  className="submit-button"
                  disabled={imageType === "flag" ? !flagImage : !coverImage}
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </>
      )}

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
    margin-bottom: 30px;
  }

  .search-wrapper {
    position: relative;
    max-width: 500px;
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

  .grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 20px;
    margin-bottom: 20px;
  }

  .country-card {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    position: relative;
    transition: transform 0.2s, box-shadow 0.2s;
    cursor: grab;
  }

  .country-card:active {
    cursor: grabbing;
  }

  .country-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .country-card.inactive {
    opacity: 0.6;
    cursor: default;
  }

  .flag-container {
    height: 120px;
    background-color: #f0f0f0;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .flag-image {
    object-fit: contain;
  }

  .no-flag {
    font-size: 48px;
    opacity: 0.3;
  }

  .upload-flag-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    border-radius: 4px;
    padding: 5px 10px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s;
    z-index: 1;
  }

  .upload-flag-button:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }

  .country-info {
    padding: 15px;
  }

  .country-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
  }

  .country-name {
    font-size: 18px;
    font-weight: 600;
    color: #2c3e50;
    margin: 0;
  }

  .country-code {
    background-color: #e67e22;
    color: white;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
  }

  .country-description {
    font-size: 14px;
    color: #666;
    line-height: 1.5;
    margin-bottom: 10px;
  }

  .country-stats {
    display: flex;
    gap: 15px;
    margin-bottom: 10px;
  }

  .stat-item {
    font-size: 13px;
    color: #888;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .status-badge-container {
    margin-bottom: 10px;
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

  .cover-preview {
    position: relative;
    height: 60px;
    background-color: #f8f9fa;
    border-top: 1px solid #e0e0e0;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cover-thumb {
    object-fit: contain;
  }

  .upload-cover-button {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    border-radius: 4px;
    padding: 4px 8px;
    cursor: pointer;
    font-size: 12px;
  }

  .upload-cover-button:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }

  .card-actions {
    display: flex;
    gap: 5px;
    padding: 10px 15px;
    border-top: 1px solid #e0e0e0;
    background-color: #f8f9fa;
  }

  .cover-button,
  .edit-button,
  .delete-button,
  .status-button {
    padding: 5px 10px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .cover-button {
    background-color: #3498db;
    color: white;
  }

  .cover-button:hover {
    background-color: #2980b9;
  }

  .edit-button {
    background-color: #f39c12;
    color: white;
  }

  .edit-button:hover {
    background-color: #e67e22;
  }

  .delete-button {
    background-color: #e74c3c;
    color: white;
  }

  .delete-button:hover {
    background-color: #c0392b;
  }

  .delete-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  .status-button {
    background-color: #95a5a6;
    color: white;
  }

  .status-button:hover {
    background-color: #7f8c8d;
  }

  .warning-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    background-color: #e67e22;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 500;
    z-index: 1;
  }

  .no-data {
    text-align: center;
    padding: 60px;
    color: #999;
    font-size: 16px;
    background-color: white;
    border-radius: 12px;
    grid-column: 1 / -1;
  }

  .drag-hint {
    padding: 15px;
    background-color: #f8f9fa;
    border-radius: 8px;
    font-size: 14px;
    color: #666;
    text-align: center;
    border: 1px dashed #e0e0e0;
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

  .modal,
  .modal-small {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    border-radius: 12px;
    padding: 30px;
    z-index: 1001;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    max-height: 90vh;
    overflow-y: auto;
  }

  .modal {
    width: 90%;
    max-width: 500px;
  }

  .modal-small {
    width: 90%;
    max-width: 400px;
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

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
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
  .textarea:focus {
    border-color: #e67e22;
  }

  .textarea {
    resize: vertical;
  }

  .hint {
    font-size: 12px;
    color: #999;
  }

  .preview-container {
    display: flex;
    gap: 15px;
    padding: 10px;
    background-color: #f8f9fa;
    border-radius: 8px;
  }

  .preview-item {
    position: relative;
    width: 80px;
    height: 60px;
  }

  .preview-image {
    object-fit: cover;
    border-radius: 4px;
  }

  .preview-label {
    position: absolute;
    bottom: 2px;
    left: 2px;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    padding: 2px 4px;
    border-radius: 2px;
    font-size: 10px;
  }

  .image-upload-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .country-name-text {
    font-size: 16px;
    font-weight: 500;
    text-align: center;
    margin: 0;
  }

  .current-image-container {
    text-align: center;
  }

  .current-image {
    object-fit: contain;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
  }

  .upload-area {
    text-align: center;
  }

  .file-input {
    display: none;
  }

  .file-input-label {
    display: inline-block;
    background-color: #3498db;
    color: white;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: background-color 0.2s;
  }

  .file-input-label:hover {
    background-color: #2980b9;
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
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

  .submit-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
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
    .main {
      padding: 20px;
    }
    
    .top-bar {
      padding: 12px 20px;
    }
    
    .grid-container {
      grid-template-columns: 1fr;
    }
    
    .form-row {
      grid-template-columns: 1fr;
    }
  }
`;

export default CountryManager;
