// "use client";

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useRouter, usePathname } from "next/navigation";
// import NotificationToast from "@/NotificationToast";
// import Sidebar from "@/pages/admin/Sidebar";
// // import Sidebar from "./Sidebar";
// // import NotificationToast from "../../components/NotificationToast";

// // Types
// interface MainHeading {
//   id: number;
//   name: string;
// }

// interface Heading {
//   id: number;
//   name: string;
//   mainHeadingId: number;
// }

// interface SubHeading {
//   id: number;
//   name: string;
//   mainHeadingId: number;
//   mainHeadingName: string;
//   headingId: number;
//   headingName: string;
//   description?: string;
//   content?: string;
//   displayOrder: number;
//   isActive: boolean;
//   iconUrl?: string;
//   imageUrl?: string;
//   metaDescription?: string;
//   metaKeywords?: string;
//   createdAt: string;
//   updatedAt?: string;
// }

// interface HeadingWithSubHeadings {
//   headingId: number;
//   headingName: string;
//   subHeadings: SubHeading[];
// }

// interface MainHeadingWithHeadingsAndSubHeadings {
//   mainHeadingId: number;
//   mainHeadingName: string;
//   headings: HeadingWithSubHeadings[];
// }

// interface SubHeadingOrder {
//   id: number;
//   displayOrder: number;
// }

// const SubHeadings: React.FC = () => {
//   const router = useRouter();
//   const pathname = usePathname();

//   const [subHeadings, setSubHeadings] = useState<SubHeading[]>([]);
//   const [mainHeadings, setMainHeadings] = useState<MainHeading[]>([]);
//   const [headings, setHeadings] = useState<Heading[]>([]);
//   const [filteredHeadings, setFilteredHeadings] = useState<Heading[]>([]);
//   const [hierarchyData, setHierarchyData] = useState<
//     MainHeadingWithHeadingsAndSubHeadings[]
//   >([]);
//   const [filteredSubHeadings, setFilteredSubHeadings] = useState<SubHeading[]>(
//     [],
//   );
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedMainHeading, setSelectedMainHeading] = useState<
//     number | "all"
//   >("all");
//   const [selectedHeading, setSelectedHeading] = useState<number | "all">("all");
//   const [showModal, setShowModal] = useState(false);
//   const [showContentModal, setShowContentModal] = useState(false);
//   const [editingSubHeading, setEditingSubHeading] = useState<SubHeading | null>(
//     null,
//   );
//   const [viewingContent, setViewingContent] = useState<SubHeading | null>(null);
//   const [viewMode, setViewMode] = useState<"list" | "hierarchy">("hierarchy");
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [formData, setFormData] = useState({
//     name: "",
//     mainHeadingId: 0,
//     headingId: 0,
//     description: "",
//     content: "",
//     displayOrder: 0,
//     iconUrl: "",
//     imageUrl: "",
//     metaDescription: "",
//     metaKeywords: "",
//   });
//   const [bulkMode, setBulkMode] = useState(false);
//   const [bulkSubHeadings, setBulkSubHeadings] = useState<
//     Array<{
//       name: string;
//       description: string;
//       displayOrder: number;
//     }>
//   >([]);
//   const [notification, setNotification] = useState({
//     show: false,
//     message: "",
//     type: "success" as "success" | "error" | "warning",
//   });

//   // Base URL
//   const API_BASE_URL =
//     process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5232";

//   // Create axios instance
//   const api = axios.create({
//     baseURL: API_BASE_URL,
//     withCredentials: true,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   // Add token to requests
//   api.interceptors.request.use((config) => {
//     if (typeof window !== "undefined") {
//       const token = localStorage.getItem("trekking_app_token");
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     }
//     return config;
//   });

//   // Handle window resize
//   useEffect(() => {
//     const handleResize = () => {
//       setIsSidebarOpen(window.innerWidth > 768);
//     };

//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   useEffect(() => {
//     fetchMainHeadings();
//     fetchHeadings();
//     fetchSubHeadings();
//   }, []);

//   useEffect(() => {
//     if (viewMode === "hierarchy") {
//       fetchFullHierarchy();
//     }
//   }, [viewMode]);

//   useEffect(() => {
//     filterHeadingsByMainHeading();
//   }, [selectedMainHeading, headings]);

//   useEffect(() => {
//     filterSubHeadings();
//   }, [searchTerm, selectedMainHeading, selectedHeading, subHeadings]);

//   const fetchMainHeadings = async () => {
//     try {
//       const response = await api.get("/api/MainHeading");
//       setMainHeadings(response.data);
//     } catch (error: any) {
//       console.error("Error fetching main headings:", error);
//       showNotification("Error loading main headings", "error");
//     }
//   };

//   const fetchHeadings = async () => {
//     try {
//       const response = await api.get("/api/Heading");
//       setHeadings(response.data);
//       setFilteredHeadings(response.data);
//     } catch (error: any) {
//       console.error("Error fetching headings:", error);
//       showNotification("Error loading headings", "error");
//     }
//   };

//   const fetchSubHeadings = async () => {
//     try {
//       setLoading(true);
//       const response = await api.get("/api/SubHeading");
//       setSubHeadings(response.data);
//       setFilteredSubHeadings(response.data);
//     } catch (error: any) {
//       showNotification(
//         error.response?.data?.message || "Error loading subheadings",
//         "error",
//       );
//       console.error("Error fetching subheadings:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchFullHierarchy = async () => {
//     try {
//       const response = await api.get("/api/SubHeading/full-hierarchy");
//       setHierarchyData(response.data);
//     } catch (error: any) {
//       console.error("Error fetching hierarchy:", error);
//       showNotification("Error loading hierarchy data", "error");
//     }
//   };

//   const filterHeadingsByMainHeading = () => {
//     if (selectedMainHeading === "all") {
//       setFilteredHeadings(headings);
//     } else {
//       const filtered = headings.filter(
//         (h) => h.mainHeadingId === selectedMainHeading,
//       );
//       setFilteredHeadings(filtered);
//     }
//   };

//   const filterSubHeadings = () => {
//     let filtered = [...subHeadings];

//     // Filter by search term
//     if (searchTerm.trim() !== "") {
//       filtered = filtered.filter(
//         (sh) =>
//           sh.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           sh.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           sh.content?.toLowerCase().includes(searchTerm.toLowerCase()),
//       );
//     }

//     // Filter by main heading
//     if (selectedMainHeading !== "all") {
//       filtered = filtered.filter(
//         (sh) => sh.mainHeadingId === selectedMainHeading,
//       );
//     }

//     // Filter by heading
//     if (selectedHeading !== "all") {
//       filtered = filtered.filter((sh) => sh.headingId === selectedHeading);
//     }

//     setFilteredSubHeadings(filtered);
//   };

//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(e.target.value);
//   };

//   const handleMainHeadingFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const value = e.target.value;
//     setSelectedMainHeading(value === "all" ? "all" : parseInt(value));
//     setSelectedHeading("all"); // Reset heading filter when main heading changes
//   };

//   const handleHeadingFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const value = e.target.value;
//     setSelectedHeading(value === "all" ? "all" : parseInt(value));
//   };

//   const handleInputChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >,
//   ) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]:
//         name === "mainHeadingId" ||
//         name === "headingId" ||
//         name === "displayOrder"
//           ? parseInt(value) || 0
//           : value,
//     });
//   };

//   const handleBulkInputChange = (
//     index: number,
//     field: string,
//     value: string | number,
//   ) => {
//     const updated = [...bulkSubHeadings];
//     updated[index] = {
//       ...updated[index],
//       [field]:
//         field === "displayOrder" ? parseInt(value as string) || 0 : value,
//     };
//     setBulkSubHeadings(updated);
//   };

//   const addBulkRow = () => {
//     setBulkSubHeadings([
//       ...bulkSubHeadings,
//       { name: "", description: "", displayOrder: bulkSubHeadings.length },
//     ]);
//   };

//   const removeBulkRow = (index: number) => {
//     const updated = bulkSubHeadings.filter((_, i) => i !== index);
//     setBulkSubHeadings(updated);
//   };

//   const resetForm = () => {
//     setFormData({
//       name: "",
//       mainHeadingId: mainHeadings.length > 0 ? mainHeadings[0].id : 0,
//       headingId: 0,
//       description: "",
//       content: "",
//       displayOrder: 0,
//       iconUrl: "",
//       imageUrl: "",
//       metaDescription: "",
//       metaKeywords: "",
//     });
//     setBulkSubHeadings([]);
//     setEditingSubHeading(null);
//   };

//   const openCreateModal = () => {
//     resetForm();
//     setBulkMode(false);
//     setShowModal(true);
//   };

//   const openBulkCreateModal = () => {
//     resetForm();
//     setBulkMode(true);
//     setBulkSubHeadings([{ name: "", description: "", displayOrder: 0 }]);
//     setShowModal(true);
//   };

//   const openEditModal = (subHeading: SubHeading) => {
//     setEditingSubHeading(subHeading);
//     setFormData({
//       name: subHeading.name,
//       mainHeadingId: subHeading.mainHeadingId,
//       headingId: subHeading.headingId,
//       description: subHeading.description || "",
//       content: subHeading.content || "",
//       displayOrder: subHeading.displayOrder,
//       iconUrl: subHeading.iconUrl || "",
//       imageUrl: subHeading.imageUrl || "",
//       metaDescription: subHeading.metaDescription || "",
//       metaKeywords: subHeading.metaKeywords || "",
//     });
//     setBulkMode(false);
//     setShowModal(true);
//   };

//   const openContentModal = (subHeading: SubHeading) => {
//     setViewingContent(subHeading);
//     setShowContentModal(true);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!bulkMode) {
//       // Single create/update
//       if (!formData.name.trim()) {
//         showNotification("Name is required", "warning");
//         return;
//       }

//       if (!formData.mainHeadingId) {
//         showNotification("Please select a main heading", "warning");
//         return;
//       }

//       if (!formData.headingId) {
//         showNotification("Please select a heading", "warning");
//         return;
//       }

//       try {
//         if (editingSubHeading) {
//           // Update
//           await api.put(`/api/SubHeading/${editingSubHeading.id}`, {
//             name: formData.name.trim(),
//             description: formData.description || null,
//             content: formData.content || null,
//             displayOrder: formData.displayOrder,
//             isActive: true,
//             iconUrl: formData.iconUrl || null,
//             imageUrl: formData.imageUrl || null,
//             metaDescription: formData.metaDescription || null,
//             metaKeywords: formData.metaKeywords || null,
//           });
//           showNotification("SubHeading updated successfully!", "success");
//         } else {
//           // Create
//           await api.post("/api/SubHeading", {
//             name: formData.name.trim(),
//             mainHeadingId: formData.mainHeadingId,
//             headingId: formData.headingId,
//             description: formData.description || null,
//             content: formData.content || null,
//             displayOrder: formData.displayOrder,
//             iconUrl: formData.iconUrl || null,
//             imageUrl: formData.imageUrl || null,
//             metaDescription: formData.metaDescription || null,
//             metaKeywords: formData.metaKeywords || null,
//           });
//           showNotification("SubHeading created successfully!", "success");
//         }
//       } catch (error: any) {
//         console.error("Error saving subheading:", error);
//         showNotification(
//           error.response?.data?.message || "Error saving subheading",
//           "error",
//         );
//         return;
//       }
//     } else {
//       // Bulk create
//       const validSubHeadings = bulkSubHeadings.filter(
//         (sh) => sh.name.trim() !== "",
//       );

//       if (validSubHeadings.length === 0) {
//         showNotification(
//           "At least one valid subheading is required",
//           "warning",
//         );
//         return;
//       }

//       if (!formData.mainHeadingId) {
//         showNotification("Please select a main heading", "warning");
//         return;
//       }

//       if (!formData.headingId) {
//         showNotification("Please select a heading", "warning");
//         return;
//       }

//       try {
//         const response = await api.post("/api/SubHeading/bulk", {
//           mainHeadingId: formData.mainHeadingId,
//           headingId: formData.headingId,
//           subHeadings: validSubHeadings.map((sh) => ({
//             name: sh.name.trim(),
//             description: sh.description || null,
//             displayOrder: sh.displayOrder,
//           })),
//         });

//         if (response.data.errors) {
//           showNotification(
//             `${response.data.created.length} created, ${response.data.errors.length} errors`,
//             "warning",
//           );
//         } else {
//           showNotification(
//             `${response.data.length} subheadings created successfully!`,
//             "success",
//           );
//         }
//       } catch (error: any) {
//         console.error("Error creating bulk subheadings:", error);
//         showNotification(
//           error.response?.data?.message || "Error creating subheadings",
//           "error",
//         );
//         return;
//       }
//     }

//     setShowModal(false);
//     resetForm();
//     fetchSubHeadings();
//     if (viewMode === "hierarchy") {
//       fetchFullHierarchy();
//     }
//   };

//   const handleDelete = async (id: number) => {
//     if (!window.confirm("Are you sure you want to delete this subheading?")) {
//       return;
//     }

//     try {
//       await api.delete(`/api/SubHeading/${id}`);
//       showNotification("SubHeading deleted successfully!", "success");
//       fetchSubHeadings();
//       if (viewMode === "hierarchy") {
//         fetchFullHierarchy();
//       }
//     } catch (error: any) {
//       console.error("Error deleting subheading:", error);
//       showNotification(
//         error.response?.data?.message || "Error deleting subheading",
//         "error",
//       );
//     }
//   };

//   const handleToggleStatus = async (id: number, currentStatus: boolean) => {
//     try {
//       await api.patch(`/api/SubHeading/${id}/toggle-status`);
//       showNotification(
//         `SubHeading ${currentStatus ? "deactivated" : "activated"} successfully!`,
//         "success",
//       );
//       fetchSubHeadings();
//       if (viewMode === "hierarchy") {
//         fetchFullHierarchy();
//       }
//     } catch (error: any) {
//       console.error("Error toggling subheading status:", error);
//       showNotification(
//         error.response?.data?.message || "Error updating subheading status",
//         "error",
//       );
//     }
//   };

//   const handleDragStart = (e: React.DragEvent, subHeading: SubHeading) => {
//     e.dataTransfer.setData("text/plain", subHeading.id.toString());
//   };

//   const handleDrop = async (
//     e: React.DragEvent,
//     targetSubHeading: SubHeading,
//   ) => {
//     e.preventDefault();
//     const draggedId = parseInt(e.dataTransfer.getData("text/plain"));
//     if (draggedId === targetSubHeading.id) return;

//     // Get all subheadings in the same heading
//     const sameHeadingSubHeadings = filteredSubHeadings
//       .filter(
//         (sh) => sh.headingId === targetSubHeading.headingId && sh.isActive,
//       )
//       .sort((a, b) => a.displayOrder - b.displayOrder);

//     const draggedIndex = sameHeadingSubHeadings.findIndex(
//       (sh) => sh.id === draggedId,
//     );
//     const targetIndex = sameHeadingSubHeadings.findIndex(
//       (sh) => sh.id === targetSubHeading.id,
//     );

//     if (draggedIndex === -1 || targetIndex === -1) return;

//     // Reorder array
//     const [removed] = sameHeadingSubHeadings.splice(draggedIndex, 1);
//     sameHeadingSubHeadings.splice(targetIndex, 0, removed);

//     // Update display orders
//     const updates: SubHeadingOrder[] = sameHeadingSubHeadings.map(
//       (subHeading, index) => ({
//         id: subHeading.id,
//         displayOrder: index,
//       }),
//     );

//     try {
//       await api.post("/api/SubHeading/reorder", updates);
//       showNotification("SubHeadings reordered successfully!", "success");
//       fetchSubHeadings();
//       if (viewMode === "hierarchy") {
//         fetchFullHierarchy();
//       }
//     } catch (error: any) {
//       console.error("Error reordering subheadings:", error);
//       showNotification("Error reordering subheadings", "error");
//     }
//   };

//   const handleDragOver = (e: React.DragEvent) => {
//     e.preventDefault();
//   };

//   const showNotification = (
//     message: string,
//     type: "success" | "error" | "warning",
//   ) => {
//     setNotification({ show: true, message, type });
//   };

//   const getMainHeadingName = (mainHeadingId: number): string => {
//     const mainHeading = mainHeadings.find((mh) => mh.id === mainHeadingId);
//     return mainHeading?.name || "Unknown";
//   };

//   const getHeadingName = (headingId: number): string => {
//     const heading = headings.find((h) => h.id === headingId);
//     return heading?.name || "Unknown";
//   };

//   if (loading) {
//     return (
//       <div style={styles.container}>
//         <Sidebar
//           isOpen={isSidebarOpen}
//           onClose={() => setIsSidebarOpen(false)}
//         />
//         <main
//           style={{
//             ...styles.main,
//             marginLeft: isSidebarOpen ? "280px" : "0",
//           }}
//         >
//           <div style={styles.loadingContainer}>
//             <div style={styles.spinner}></div>
//             <p>Loading subheadings...</p>
//           </div>
//         </main>
//       </div>
//     );
//   }

//   return (
//     <div style={styles.container}>
//       <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

//       {/* Main Content */}
//       <main
//         style={{
//           ...styles.main,
//           marginLeft: isSidebarOpen ? "280px" : "0",
//         }}
//       >
//         {/* Top Bar */}
//         <div style={styles.topBar}>
//           <button
//             onClick={toggleSidebar}
//             style={styles.menuToggle}
//             id="sidebar-toggle"
//           >
//             ☰
//           </button>
//           <h1 style={styles.pageTitle}>SubHeadings Management</h1>
//           <div style={styles.topBarRight}>
//             <div style={styles.viewToggle}>
//               <button
//                 onClick={() => setViewMode("list")}
//                 style={{
//                   ...styles.viewToggleButton,
//                   ...(viewMode === "list" ? styles.viewToggleActive : {}),
//                 }}
//               >
//                 List View
//               </button>
//               <button
//                 onClick={() => setViewMode("hierarchy")}
//                 style={{
//                   ...styles.viewToggleButton,
//                   ...(viewMode === "hierarchy" ? styles.viewToggleActive : {}),
//                 }}
//               >
//                 Hierarchy View
//               </button>
//             </div>
//             <div style={styles.buttonGroup}>
//               <button onClick={openCreateModal} style={styles.addButton}>
//                 + Add SubHeading
//               </button>
//               <button onClick={openBulkCreateModal} style={styles.bulkButton}>
//                 + Bulk Create
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Filters */}
//         <div style={styles.filtersContainer}>
//           {/* Search Bar */}
//           <div style={styles.searchWrapper}>
//             <input
//               type="text"
//               placeholder="Search subheadings by name, description or content..."
//               value={searchTerm}
//               onChange={handleSearch}
//               style={styles.searchInput}
//             />
//             <span style={styles.searchIcon}>🔍</span>
//           </div>

//           {/* Main Heading Filter */}
//           <select
//             value={selectedMainHeading}
//             onChange={handleMainHeadingFilter}
//             style={styles.filterSelect}
//           >
//             <option value="all">All Main Headings</option>
//             {mainHeadings.map((mh) => (
//               <option key={mh.id} value={mh.id}>
//                 {mh.name}
//               </option>
//             ))}
//           </select>

//           {/* Heading Filter */}
//           <select
//             value={selectedHeading}
//             onChange={handleHeadingFilter}
//             style={styles.filterSelect}
//             disabled={
//               selectedMainHeading === "all" && filteredHeadings.length === 0
//             }
//           >
//             <option value="all">All Headings</option>
//             {filteredHeadings.map((h) => (
//               <option key={h.id} value={h.id}>
//                 {h.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* SubHeadings Display */}
//         {viewMode === "list" ? (
//           /* Table View */
//           <div style={styles.tableContainer}>
//             <table style={styles.table}>
//               <thead>
//                 <tr>
//                   <th style={styles.th}>S.N.</th>
//                   <th style={styles.th}>Name</th>
//                   <th style={styles.th}>Main Heading</th>
//                   <th style={styles.th}>Heading</th>
//                   <th style={styles.th}>Description</th>
//                   <th style={styles.th}>Order</th>
//                   <th style={styles.th}>Status</th>
//                   <th style={styles.th}>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredSubHeadings.length === 0 ? (
//                   <tr>
//                     <td colSpan={8} style={styles.noData}>
//                       No subheadings found
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredSubHeadings
//                     .sort((a, b) => a.displayOrder - b.displayOrder)
//                     .map((subHeading, index) => (
//                       <tr
//                         key={subHeading.id}
//                         style={{
//                           ...styles.row,
//                           opacity: subHeading.isActive ? 1 : 0.6,
//                         }}
//                         draggable={subHeading.isActive}
//                         onDragStart={(e) => handleDragStart(e, subHeading)}
//                         onDragOver={handleDragOver}
//                         onDrop={(e) => handleDrop(e, subHeading)}
//                       >
//                         <td style={styles.td}>{index + 1}</td>
//                         <td style={styles.td}>
//                           <span style={styles.nameCell}>{subHeading.name}</span>
//                           {subHeading.iconUrl && (
//                             <span style={styles.iconIndicator}>🖼️</span>
//                           )}
//                         </td>
//                         <td style={styles.td}>{subHeading.mainHeadingName}</td>
//                         <td style={styles.td}>{subHeading.headingName}</td>
//                         <td style={styles.td}>
//                           {subHeading.description ? (
//                             <span title={subHeading.description}>
//                               {subHeading.description.length > 30
//                                 ? `${subHeading.description.substring(0, 30)}...`
//                                 : subHeading.description}
//                             </span>
//                           ) : (
//                             "-"
//                           )}
//                         </td>
//                         <td style={styles.td}>{subHeading.displayOrder}</td>
//                         <td style={styles.td}>
//                           <span
//                             style={{
//                               ...styles.statusBadge,
//                               backgroundColor: subHeading.isActive
//                                 ? "#4caf50"
//                                 : "#999",
//                             }}
//                           >
//                             {subHeading.isActive ? "Active" : "Inactive"}
//                           </span>
//                         </td>
//                         <td style={styles.td}>
//                           <div style={styles.actionButtons}>
//                             <button
//                               onClick={() => openContentModal(subHeading)}
//                               style={styles.viewButton}
//                               title="View Content"
//                             >
//                               📄
//                             </button>
//                             <button
//                               onClick={() => openEditModal(subHeading)}
//                               style={styles.editButton}
//                               title="Edit"
//                             >
//                               ✏️
//                             </button>
//                             <button
//                               onClick={() =>
//                                 handleToggleStatus(
//                                   subHeading.id,
//                                   subHeading.isActive,
//                                 )
//                               }
//                               style={styles.statusButton}
//                               title={
//                                 subHeading.isActive ? "Deactivate" : "Activate"
//                               }
//                             >
//                               {subHeading.isActive ? "🔴" : "🟢"}
//                             </button>
//                             <button
//                               onClick={() => handleDelete(subHeading.id)}
//                               style={styles.deleteButton}
//                               title="Delete"
//                             >
//                               🗑️
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                 )}
//               </tbody>
//             </table>
//             <div style={styles.dragHint}>
//               💡 Drag and drop rows to reorder subheadings within the same
//               heading
//             </div>
//           </div>
//         ) : (
//           /* Hierarchy View */
//           <div style={styles.hierarchyContainer}>
//             {hierarchyData.map((mainHeading) => (
//               <div
//                 key={mainHeading.mainHeadingId}
//                 style={styles.mainHeadingCard}
//               >
//                 <div style={styles.mainHeadingHeader}>
//                   <h2 style={styles.mainHeadingTitle}>
//                     {mainHeading.mainHeadingName}
//                   </h2>
//                 </div>

//                 {mainHeading.headings.length === 0 ? (
//                   <p style={styles.noData}>No headings in this main heading</p>
//                 ) : (
//                   mainHeading.headings.map((heading) => (
//                     <div key={heading.headingId} style={styles.headingCard}>
//                       <div style={styles.headingHeader}>
//                         <h3 style={styles.headingTitle}>
//                           {heading.headingName}
//                         </h3>
//                         <span style={styles.countBadge}>
//                           {heading.subHeadings.length} subheadings
//                         </span>
//                       </div>

//                       {heading.subHeadings.length === 0 ? (
//                         <p style={styles.noSubData}>
//                           No subheadings in this heading
//                         </p>
//                       ) : (
//                         <div style={styles.subHeadingList}>
//                           {heading.subHeadings.map((subHeading, index) => (
//                             <div
//                               key={subHeading.id}
//                               style={styles.subHeadingItem}
//                             >
//                               <div style={styles.subHeadingLeft}>
//                                 <span style={styles.subHeadingNumber}>
//                                   {index + 1}.
//                                 </span>
//                                 <span style={styles.subHeadingName}>
//                                   {subHeading.name}
//                                 </span>
//                                 {subHeading.description && (
//                                   <span style={styles.subHeadingDescription}>
//                                     - {subHeading.description}
//                                   </span>
//                                 )}
//                                 {subHeading.iconUrl && (
//                                   <span style={styles.subHeadingIcon}>🖼️</span>
//                                 )}
//                               </div>
//                               <div style={styles.subHeadingActions}>
//                                 <button
//                                   onClick={() => openContentModal(subHeading)}
//                                   style={styles.viewButton}
//                                   title="View Content"
//                                 >
//                                   📄
//                                 </button>
//                                 <button
//                                   onClick={() => openEditModal(subHeading)}
//                                   style={styles.editButton}
//                                   title="Edit"
//                                 >
//                                   ✏️
//                                 </button>
//                                 <button
//                                   onClick={() =>
//                                     handleToggleStatus(
//                                       subHeading.id,
//                                       subHeading.isActive,
//                                     )
//                                   }
//                                   style={styles.statusButton}
//                                   title={
//                                     subHeading.isActive
//                                       ? "Deactivate"
//                                       : "Activate"
//                                   }
//                                 >
//                                   {subHeading.isActive ? "🔴" : "🟢"}
//                                 </button>
//                                 <button
//                                   onClick={() => handleDelete(subHeading.id)}
//                                   style={styles.deleteButton}
//                                   title="Delete"
//                                 >
//                                   🗑️
//                                 </button>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   ))
//                 )}
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Create/Edit Modal */}
//         {showModal && (
//           <>
//             <div
//               style={styles.modalOverlay}
//               onClick={() => setShowModal(false)}
//             />
//             <div style={styles.modal}>
//               <div style={styles.modalHeader}>
//                 <h2 style={styles.modalTitle}>
//                   {bulkMode
//                     ? "Bulk Create SubHeadings"
//                     : editingSubHeading
//                       ? "Edit SubHeading"
//                       : "Create New SubHeading"}
//                 </h2>
//                 <button
//                   onClick={() => setShowModal(false)}
//                   style={styles.closeButton}
//                 >
//                   ✕
//                 </button>
//               </div>

//               <form onSubmit={handleSubmit} style={styles.form}>
//                 {/* Main Heading Selection */}
//                 <div style={styles.formGroup}>
//                   <label style={styles.label}>
//                     Main Heading <span style={styles.required}>*</span>
//                   </label>
//                   <select
//                     name="mainHeadingId"
//                     value={formData.mainHeadingId}
//                     onChange={handleInputChange}
//                     style={styles.select}
//                     required
//                     disabled={!!editingSubHeading}
//                   >
//                     <option value="">Select Main Heading</option>
//                     {mainHeadings.map((mh) => (
//                       <option key={mh.id} value={mh.id}>
//                         {mh.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Heading Selection */}
//                 <div style={styles.formGroup}>
//                   <label style={styles.label}>
//                     Heading <span style={styles.required}>*</span>
//                   </label>
//                   <select
//                     name="headingId"
//                     value={formData.headingId}
//                     onChange={handleInputChange}
//                     style={styles.select}
//                     required
//                     disabled={!!editingSubHeading}
//                   >
//                     <option value="">Select Heading</option>
//                     {headings
//                       .filter((h) => h.mainHeadingId === formData.mainHeadingId)
//                       .map((h) => (
//                         <option key={h.id} value={h.id}>
//                           {h.name}
//                         </option>
//                       ))}
//                   </select>
//                 </div>

//                 {bulkMode ? (
//                   /* Bulk Create Mode */
//                   <div style={styles.bulkContainer}>
//                     <div style={styles.bulkHeader}>
//                       <h3 style={styles.bulkTitle}>SubHeadings</h3>
//                       <button
//                         type="button"
//                         onClick={addBulkRow}
//                         style={styles.addRowButton}
//                       >
//                         + Add Row
//                       </button>
//                     </div>

//                     {bulkSubHeadings.map((item, index) => (
//                       <div key={index} style={styles.bulkRow}>
//                         <div style={styles.bulkRowHeader}>
//                           <span style={styles.bulkRowNumber}>#{index + 1}</span>
//                           {bulkSubHeadings.length > 1 && (
//                             <button
//                               type="button"
//                               onClick={() => removeBulkRow(index)}
//                               style={styles.removeRowButton}
//                             >
//                               ✕
//                             </button>
//                           )}
//                         </div>
//                         <div style={styles.bulkRowFields}>
//                           <div style={styles.bulkField}>
//                             <label style={styles.bulkLabel}>Name *</label>
//                             <input
//                               type="text"
//                               value={item.name}
//                               onChange={(e) =>
//                                 handleBulkInputChange(
//                                   index,
//                                   "name",
//                                   e.target.value,
//                                 )
//                               }
//                               placeholder="Enter name"
//                               style={styles.bulkInput}
//                               maxLength={200}
//                             />
//                           </div>
//                           <div style={styles.bulkField}>
//                             <label style={styles.bulkLabel}>Description</label>
//                             <input
//                               type="text"
//                               value={item.description}
//                               onChange={(e) =>
//                                 handleBulkInputChange(
//                                   index,
//                                   "description",
//                                   e.target.value,
//                                 )
//                               }
//                               placeholder="Enter description"
//                               style={styles.bulkInput}
//                             />
//                           </div>
//                           <div style={styles.bulkFieldSmall}>
//                             <label style={styles.bulkLabel}>Order</label>
//                             <input
//                               type="number"
//                               value={item.displayOrder}
//                               onChange={(e) =>
//                                 handleBulkInputChange(
//                                   index,
//                                   "displayOrder",
//                                   e.target.value,
//                                 )
//                               }
//                               style={styles.bulkInput}
//                               min="0"
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   /* Single Create/Edit Mode */
//                   <>
//                     {/* Name */}
//                     <div style={styles.formGroup}>
//                       <label style={styles.label}>
//                         Name <span style={styles.required}>*</span>
//                       </label>
//                       <input
//                         type="text"
//                         name="name"
//                         value={formData.name}
//                         onChange={handleInputChange}
//                         placeholder="Enter subheading name"
//                         style={styles.input}
//                         autoFocus
//                         maxLength={200}
//                       />
//                       <small style={styles.hint}>Max 200 characters</small>
//                     </div>

//                     {/* Description */}
//                     <div style={styles.formGroup}>
//                       <label style={styles.label}>Description</label>
//                       <input
//                         type="text"
//                         name="description"
//                         value={formData.description}
//                         onChange={handleInputChange}
//                         placeholder="Enter description (optional)"
//                         style={styles.input}
//                         maxLength={500}
//                       />
//                       <small style={styles.hint}>Max 500 characters</small>
//                     </div>

//                     {/* Content */}
//                     <div style={styles.formGroup}>
//                       <label style={styles.label}>Content</label>
//                       <textarea
//                         name="content"
//                         value={formData.content}
//                         onChange={handleInputChange}
//                         placeholder="Enter content (optional)"
//                         style={styles.textarea}
//                         rows={4}
//                       />
//                     </div>

//                     {/* Display Order */}
//                     <div style={styles.formGroup}>
//                       <label style={styles.label}>Display Order</label>
//                       <input
//                         type="number"
//                         name="displayOrder"
//                         value={formData.displayOrder}
//                         onChange={handleInputChange}
//                         placeholder="Enter display order"
//                         style={styles.input}
//                         min="0"
//                       />
//                       <small style={styles.hint}>
//                         Lower numbers appear first
//                       </small>
//                     </div>

//                     {/* Icon URL */}
//                     <div style={styles.formGroup}>
//                       <label style={styles.label}>Icon URL</label>
//                       <input
//                         type="url"
//                         name="iconUrl"
//                         value={formData.iconUrl}
//                         onChange={handleInputChange}
//                         placeholder="Enter icon URL (optional)"
//                         style={styles.input}
//                       />
//                     </div>

//                     {/* Image URL */}
//                     <div style={styles.formGroup}>
//                       <label style={styles.label}>Image URL</label>
//                       <input
//                         type="url"
//                         name="imageUrl"
//                         value={formData.imageUrl}
//                         onChange={handleInputChange}
//                         placeholder="Enter image URL (optional)"
//                         style={styles.input}
//                       />
//                     </div>

//                     {/* SEO Section */}
//                     <div style={styles.seoSection}>
//                       <h3 style={styles.seoTitle}>SEO Information</h3>

//                       {/* Meta Description */}
//                       <div style={styles.formGroup}>
//                         <label style={styles.label}>Meta Description</label>
//                         <textarea
//                           name="metaDescription"
//                           value={formData.metaDescription}
//                           onChange={handleInputChange}
//                           placeholder="Enter meta description for SEO"
//                           style={styles.textarea}
//                           rows={2}
//                           maxLength={160}
//                         />
//                         <small style={styles.hint}>
//                           Max 160 characters. {formData.metaDescription.length}
//                           /160
//                         </small>
//                       </div>

//                       {/* Meta Keywords */}
//                       <div style={styles.formGroup}>
//                         <label style={styles.label}>Meta Keywords</label>
//                         <input
//                           type="text"
//                           name="metaKeywords"
//                           value={formData.metaKeywords}
//                           onChange={handleInputChange}
//                           placeholder="Enter comma-separated keywords"
//                           style={styles.input}
//                           maxLength={100}
//                         />
//                         <small style={styles.hint}>
//                           Separate keywords with commas
//                         </small>
//                       </div>
//                     </div>
//                   </>
//                 )}

//                 <div style={styles.modalFooter}>
//                   <button
//                     type="button"
//                     onClick={() => setShowModal(false)}
//                     style={styles.cancelButton}
//                   >
//                     Cancel
//                   </button>
//                   <button type="submit" style={styles.submitButton}>
//                     {bulkMode
//                       ? "Create All"
//                       : editingSubHeading
//                         ? "Update"
//                         : "Create"}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </>
//         )}

//         {/* Content View Modal */}
//         {showContentModal && viewingContent && (
//           <>
//             <div
//               style={styles.modalOverlay}
//               onClick={() => setShowContentModal(false)}
//             />
//             <div style={styles.contentModal}>
//               <div style={styles.modalHeader}>
//                 <h2 style={styles.modalTitle}>{viewingContent.name}</h2>
//                 <button
//                   onClick={() => setShowContentModal(false)}
//                   style={styles.closeButton}
//                 >
//                   ✕
//                 </button>
//               </div>

//               <div style={styles.contentBody}>
//                 {/* Metadata */}
//                 <div style={styles.metadataSection}>
//                   <div style={styles.metadataItem}>
//                     <strong>Main Heading:</strong>{" "}
//                     {viewingContent.mainHeadingName}
//                   </div>
//                   <div style={styles.metadataItem}>
//                     <strong>Heading:</strong> {viewingContent.headingName}
//                   </div>
//                   <div style={styles.metadataItem}>
//                     <strong>Display Order:</strong>{" "}
//                     {viewingContent.displayOrder}
//                   </div>
//                   <div style={styles.metadataItem}>
//                     <strong>Status:</strong>
//                     <span
//                       style={{
//                         ...styles.statusBadge,
//                         backgroundColor: viewingContent.isActive
//                           ? "#4caf50"
//                           : "#999",
//                         marginLeft: "8px",
//                       }}
//                     >
//                       {viewingContent.isActive ? "Active" : "Inactive"}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Description */}
//                 {viewingContent.description && (
//                   <div style={styles.contentSection}>
//                     <h3 style={styles.contentSectionTitle}>Description</h3>
//                     <p style={styles.contentText}>
//                       {viewingContent.description}
//                     </p>
//                   </div>
//                 )}

//                 {/* Content */}
//                 {viewingContent.content && (
//                   <div style={styles.contentSection}>
//                     <h3 style={styles.contentSectionTitle}>Content</h3>
//                     <div style={styles.contentText}>
//                       {viewingContent.content
//                         .split("\n")
//                         .map((paragraph, i) => (
//                           <p key={i} style={styles.contentParagraph}>
//                             {paragraph}
//                           </p>
//                         ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Media */}
//                 {(viewingContent.iconUrl || viewingContent.imageUrl) && (
//                   <div style={styles.mediaSection}>
//                     <h3 style={styles.contentSectionTitle}>Media</h3>
//                     <div style={styles.mediaGrid}>
//                       {viewingContent.iconUrl && (
//                         <div style={styles.mediaItem}>
//                           <strong>Icon:</strong>
//                           <img
//                             src={viewingContent.iconUrl}
//                             alt="Icon"
//                             style={styles.mediaImage}
//                             onError={(e) =>
//                               (e.currentTarget.style.display = "none")
//                             }
//                           />
//                         </div>
//                       )}
//                       {viewingContent.imageUrl && (
//                         <div style={styles.mediaItem}>
//                           <strong>Image:</strong>
//                           <img
//                             src={viewingContent.imageUrl}
//                             alt="Content"
//                             style={styles.mediaImage}
//                             onError={(e) =>
//                               (e.currentTarget.style.display = "none")
//                             }
//                           />
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 {/* SEO Information */}
//                 {(viewingContent.metaDescription ||
//                   viewingContent.metaKeywords) && (
//                   <div style={styles.seoSection}>
//                     <h3 style={styles.contentSectionTitle}>SEO Information</h3>
//                     {viewingContent.metaDescription && (
//                       <div style={styles.metadataItem}>
//                         <strong>Meta Description:</strong>{" "}
//                         {viewingContent.metaDescription}
//                       </div>
//                     )}
//                     {viewingContent.metaKeywords && (
//                       <div style={styles.metadataItem}>
//                         <strong>Meta Keywords:</strong>{" "}
//                         {viewingContent.metaKeywords}
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {/* Timestamps */}
//                 <div style={styles.timestampSection}>
//                   <div style={styles.metadataItem}>
//                     <strong>Created:</strong>{" "}
//                     {new Date(viewingContent.createdAt).toLocaleString()}
//                   </div>
//                   {viewingContent.updatedAt && (
//                     <div style={styles.metadataItem}>
//                       <strong>Last Updated:</strong>{" "}
//                       {new Date(viewingContent.updatedAt).toLocaleString()}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div style={styles.modalFooter}>
//                 <button
//                   onClick={() => {
//                     setShowContentModal(false);
//                     openEditModal(viewingContent);
//                   }}
//                   style={styles.editButton}
//                 >
//                   Edit SubHeading
//                 </button>
//                 <button
//                   onClick={() => setShowContentModal(false)}
//                   style={styles.cancelButton}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </>
//         )}

//         {/* Notification Toast */}
//         <NotificationToast
//           show={notification.show}
//           message={notification.message}
//           type={notification.type}
//           onClose={() => setNotification({ ...notification, show: false })}
//         />
//       </main>
//     </div>
//   );
// };

// // Styles remain the same as in your original code
// const styles: { [key: string]: React.CSSProperties } = {
//   container: {
//     minHeight: "100vh",
//     backgroundColor: "#f8f9fa",
//     fontFamily: "Arial, sans-serif",
//   },
//   main: {
//     padding: "30px",
//     transition: "margin-left 0.3s ease",
//     minHeight: "100vh",
//   },
//   topBar: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: "30px",
//     backgroundColor: "white",
//     padding: "15px 25px",
//     borderRadius: "12px",
//     boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
//   },
//   menuToggle: {
//     backgroundColor: "transparent",
//     border: "none",
//     fontSize: "24px",
//     cursor: "pointer",
//     color: "#2c3e50",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     width: "40px",
//     height: "40px",
//     borderRadius: "8px",
//   },
//   pageTitle: {
//     fontSize: "20px",
//     fontWeight: "600",
//     color: "#2c3e50",
//     margin: 0,
//   },
//   topBarRight: {
//     display: "flex",
//     alignItems: "center",
//     gap: "15px",
//   },
//   viewToggle: {
//     display: "flex",
//     gap: "5px",
//     backgroundColor: "#f0f0f0",
//     padding: "3px",
//     borderRadius: "8px",
//   },
//   viewToggleButton: {
//     padding: "6px 12px",
//     border: "none",
//     backgroundColor: "transparent",
//     borderRadius: "6px",
//     fontSize: "13px",
//     fontWeight: "500",
//     cursor: "pointer",
//     transition: "all 0.2s",
//     color: "#666",
//   },
//   viewToggleActive: {
//     backgroundColor: "white",
//     color: "#e67e22",
//     boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//   },
//   buttonGroup: {
//     display: "flex",
//     gap: "10px",
//   },
//   addButton: {
//     backgroundColor: "#e67e22",
//     color: "white",
//     border: "none",
//     padding: "8px 16px",
//     borderRadius: "6px",
//     fontSize: "14px",
//     fontWeight: "500",
//     cursor: "pointer",
//     transition: "background-color 0.2s",
//   },
//   bulkButton: {
//     backgroundColor: "#3498db",
//     color: "white",
//     border: "none",
//     padding: "8px 16px",
//     borderRadius: "6px",
//     fontSize: "14px",
//     fontWeight: "500",
//     cursor: "pointer",
//     transition: "background-color 0.2s",
//   },
//   filtersContainer: {
//     display: "flex",
//     gap: "15px",
//     marginBottom: "20px",
//     flexWrap: "wrap",
//   },
//   searchWrapper: {
//     position: "relative",
//     flex: 2,
//     minWidth: "300px",
//   },
//   searchInput: {
//     width: "100%",
//     padding: "12px 40px 12px 15px",
//     border: "1px solid #e0e0e0",
//     borderRadius: "8px",
//     fontSize: "14px",
//     outline: "none",
//     transition: "border-color 0.2s",
//     boxSizing: "border-box",
//   },
//   searchIcon: {
//     position: "absolute",
//     right: "15px",
//     top: "50%",
//     transform: "translateY(-50%)",
//     fontSize: "16px",
//     color: "#999",
//     pointerEvents: "none",
//   },
//   filterSelect: {
//     padding: "12px 15px",
//     border: "1px solid #e0e0e0",
//     borderRadius: "8px",
//     fontSize: "14px",
//     outline: "none",
//     backgroundColor: "white",
//     minWidth: "200px",
//     cursor: "pointer",
//   },
//   tableContainer: {
//     backgroundColor: "white",
//     borderRadius: "12px",
//     boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//     overflow: "auto",
//   },
//   table: {
//     width: "100%",
//     borderCollapse: "collapse",
//   },
//   th: {
//     textAlign: "left",
//     padding: "15px",
//     backgroundColor: "#f8f9fa",
//     color: "#2c3e50",
//     fontSize: "14px",
//     fontWeight: "600",
//     borderBottom: "2px solid #e0e0e0",
//   },
//   row: {
//     transition: "background-color 0.2s",
//     cursor: "grab",
//   },
//   td: {
//     padding: "12px 15px",
//     borderBottom: "1px solid #ecf0f1",
//     fontSize: "14px",
//     color: "#2c3e50",
//   },
//   nameCell: {
//     fontWeight: "500",
//     color: "#e67e22",
//     marginRight: "5px",
//   },
//   iconIndicator: {
//     fontSize: "12px",
//   },
//   statusBadge: {
//     padding: "4px 8px",
//     borderRadius: "4px",
//     color: "white",
//     fontSize: "12px",
//     fontWeight: "500",
//   },
//   noData: {
//     textAlign: "center",
//     padding: "40px",
//     color: "#999",
//     fontSize: "14px",
//   },
//   dragHint: {
//     padding: "10px 15px",
//     backgroundColor: "#f8f9fa",
//     borderTop: "1px solid #e0e0e0",
//     fontSize: "12px",
//     color: "#666",
//     textAlign: "center",
//   },
//   actionButtons: {
//     display: "flex",
//     gap: "5px",
//     flexWrap: "wrap",
//   },
//   viewButton: {
//     backgroundColor: "transparent",
//     border: "none",
//     fontSize: "18px",
//     cursor: "pointer",
//     padding: "5px",
//     borderRadius: "4px",
//     transition: "background-color 0.2s",
//   },
//   editButton: {
//     backgroundColor: "transparent",
//     border: "none",
//     fontSize: "18px",
//     cursor: "pointer",
//     padding: "5px",
//     borderRadius: "4px",
//     transition: "background-color 0.2s",
//   },
//   deleteButton: {
//     backgroundColor: "transparent",
//     border: "none",
//     fontSize: "18px",
//     cursor: "pointer",
//     padding: "5px",
//     borderRadius: "4px",
//     transition: "background-color 0.2s",
//   },
//   statusButton: {
//     backgroundColor: "transparent",
//     border: "none",
//     fontSize: "18px",
//     cursor: "pointer",
//     padding: "5px",
//     borderRadius: "4px",
//     transition: "background-color 0.2s",
//   },
//   hierarchyContainer: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "20px",
//   },
//   mainHeadingCard: {
//     backgroundColor: "white",
//     borderRadius: "12px",
//     boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//     overflow: "hidden",
//   },
//   mainHeadingHeader: {
//     backgroundColor: "#2c3e50",
//     color: "white",
//     padding: "15px 20px",
//   },
//   mainHeadingTitle: {
//     fontSize: "18px",
//     fontWeight: "600",
//     margin: 0,
//   },
//   headingCard: {
//     margin: "15px",
//     marginTop: "10px",
//     border: "1px solid #e0e0e0",
//     borderRadius: "8px",
//     overflow: "hidden",
//   },
//   headingHeader: {
//     backgroundColor: "#f8f9fa",
//     padding: "12px 15px",
//     borderBottom: "1px solid #e0e0e0",
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   headingTitle: {
//     fontSize: "16px",
//     fontWeight: "600",
//     color: "#34495e",
//     margin: 0,
//   },
//   countBadge: {
//     backgroundColor: "#e67e22",
//     color: "white",
//     padding: "3px 8px",
//     borderRadius: "4px",
//     fontSize: "12px",
//   },
//   noSubData: {
//     padding: "20px",
//     textAlign: "center",
//     color: "#999",
//     fontSize: "14px",
//   },
//   subHeadingList: {
//     padding: "10px",
//   },
//   subHeadingItem: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: "10px 12px",
//     borderBottom: "1px solid #ecf0f1",
//   },
//   subHeadingLeft: {
//     display: "flex",
//     alignItems: "center",
//     gap: "10px",
//     flex: 1,
//     flexWrap: "wrap",
//   },
//   subHeadingNumber: {
//     color: "#999",
//     fontSize: "12px",
//     minWidth: "25px",
//   },
//   subHeadingName: {
//     fontWeight: "500",
//     color: "#e67e22",
//   },
//   subHeadingDescription: {
//     color: "#666",
//     fontSize: "13px",
//     fontStyle: "italic",
//   },
//   subHeadingIcon: {
//     fontSize: "14px",
//   },
//   subHeadingActions: {
//     display: "flex",
//     gap: "5px",
//   },
//   modalOverlay: {
//     position: "fixed",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     zIndex: 1000,
//   },
//   modal: {
//     position: "fixed",
//     top: "50%",
//     left: "50%",
//     transform: "translate(-50%, -50%)",
//     backgroundColor: "white",
//     borderRadius: "12px",
//     padding: "30px",
//     width: "90%",
//     maxWidth: "600px",
//     zIndex: 1001,
//     boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
//     maxHeight: "90vh",
//     overflowY: "auto",
//   },
//   contentModal: {
//     position: "fixed",
//     top: "50%",
//     left: "50%",
//     transform: "translate(-50%, -50%)",
//     backgroundColor: "white",
//     borderRadius: "12px",
//     padding: "30px",
//     width: "90%",
//     maxWidth: "700px",
//     zIndex: 1001,
//     boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
//     maxHeight: "90vh",
//     overflowY: "auto",
//   },
//   modalHeader: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: "20px",
//   },
//   modalTitle: {
//     fontSize: "20px",
//     fontWeight: "600",
//     color: "#2c3e50",
//     margin: 0,
//   },
//   closeButton: {
//     backgroundColor: "transparent",
//     border: "none",
//     fontSize: "20px",
//     cursor: "pointer",
//     color: "#999",
//     padding: "5px",
//   },
//   form: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "20px",
//   },
//   formGroup: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "5px",
//   },
//   label: {
//     fontSize: "14px",
//     fontWeight: "500",
//     color: "#2c3e50",
//   },
//   required: {
//     color: "#e74c3c",
//   },
//   input: {
//     padding: "10px",
//     fontSize: "14px",
//     border: "1px solid #e0e0e0",
//     borderRadius: "6px",
//     outline: "none",
//     transition: "border-color 0.2s",
//   },
//   select: {
//     padding: "10px",
//     fontSize: "14px",
//     border: "1px solid #e0e0e0",
//     borderRadius: "6px",
//     outline: "none",
//     backgroundColor: "white",
//     cursor: "pointer",
//   },
//   textarea: {
//     padding: "10px",
//     fontSize: "14px",
//     border: "1px solid #e0e0e0",
//     borderRadius: "6px",
//     outline: "none",
//     resize: "vertical",
//     fontFamily: "inherit",
//   },
//   hint: {
//     fontSize: "12px",
//     color: "#999",
//   },
//   seoSection: {
//     border: "1px solid #e0e0e0",
//     borderRadius: "8px",
//     padding: "15px",
//     backgroundColor: "#f8f9fa",
//   },
//   seoTitle: {
//     fontSize: "16px",
//     fontWeight: "600",
//     color: "#2c3e50",
//     margin: "0 0 15px 0",
//   },
//   bulkContainer: {
//     border: "1px solid #e0e0e0",
//     borderRadius: "8px",
//     padding: "15px",
//     maxHeight: "400px",
//     overflowY: "auto",
//   },
//   bulkHeader: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: "15px",
//   },
//   bulkTitle: {
//     fontSize: "16px",
//     fontWeight: "600",
//     color: "#2c3e50",
//     margin: 0,
//   },
//   addRowButton: {
//     backgroundColor: "#3498db",
//     color: "white",
//     border: "none",
//     padding: "5px 10px",
//     borderRadius: "4px",
//     fontSize: "12px",
//     cursor: "pointer",
//   },
//   bulkRow: {
//     border: "1px solid #e0e0e0",
//     borderRadius: "6px",
//     padding: "12px",
//     marginBottom: "10px",
//     backgroundColor: "white",
//   },
//   bulkRowHeader: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: "10px",
//   },
//   bulkRowNumber: {
//     fontSize: "13px",
//     fontWeight: "600",
//     color: "#666",
//   },
//   removeRowButton: {
//     backgroundColor: "transparent",
//     border: "none",
//     color: "#e74c3c",
//     fontSize: "16px",
//     cursor: "pointer",
//     padding: "0 5px",
//   },
//   bulkRowFields: {
//     display: "grid",
//     gridTemplateColumns: "2fr 2fr 1fr",
//     gap: "10px",
//   },
//   bulkField: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "3px",
//   },
//   bulkFieldSmall: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "3px",
//   },
//   bulkLabel: {
//     fontSize: "12px",
//     color: "#666",
//   },
//   bulkInput: {
//     padding: "6px",
//     fontSize: "13px",
//     border: "1px solid #e0e0e0",
//     borderRadius: "4px",
//     outline: "none",
//   },
//   modalFooter: {
//     display: "flex",
//     justifyContent: "flex-end",
//     gap: "10px",
//     marginTop: "20px",
//   },
//   cancelButton: {
//     padding: "8px 16px",
//     backgroundColor: "transparent",
//     border: "1px solid #e0e0e0",
//     borderRadius: "6px",
//     fontSize: "14px",
//     color: "#666",
//     cursor: "pointer",
//     transition: "all 0.2s",
//   },
//   submitButton: {
//     padding: "8px 20px",
//     backgroundColor: "#e67e22",
//     color: "white",
//     border: "none",
//     borderRadius: "6px",
//     fontSize: "14px",
//     fontWeight: "500",
//     cursor: "pointer",
//     transition: "background-color 0.2s",
//   },
//   contentBody: {
//     padding: "10px 0",
//   },
//   metadataSection: {
//     backgroundColor: "#f8f9fa",
//     padding: "15px",
//     borderRadius: "8px",
//     marginBottom: "20px",
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
//     gap: "10px",
//   },
//   metadataItem: {
//     fontSize: "14px",
//     color: "#2c3e50",
//   },
//   contentSection: {
//     marginBottom: "20px",
//   },
//   contentSectionTitle: {
//     fontSize: "16px",
//     fontWeight: "600",
//     color: "#2c3e50",
//     margin: "0 0 10px 0",
//     paddingBottom: "5px",
//     borderBottom: "2px solid #e67e22",
//   },
//   contentText: {
//     fontSize: "14px",
//     lineHeight: "1.6",
//     color: "#444",
//   },
//   contentParagraph: {
//     margin: "0 0 10px 0",
//   },
//   mediaSection: {
//     marginBottom: "20px",
//   },
//   mediaGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
//     gap: "15px",
//   },
//   mediaItem: {
//     textAlign: "center",
//   },
//   mediaImage: {
//     maxWidth: "100%",
//     maxHeight: "150px",
//     marginTop: "5px",
//     borderRadius: "4px",
//   },
//   timestampSection: {
//     marginTop: "20px",
//     padding: "15px",
//     backgroundColor: "#f8f9fa",
//     borderRadius: "8px",
//     fontSize: "13px",
//     color: "#666",
//   },
//   loadingContainer: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     height: "400px",
//     gap: "20px",
//   },
//   spinner: {
//     width: "40px",
//     height: "40px",
//     border: "3px solid #f3f3f3",
//     borderTop: "3px solid #e67e22",
//     borderRadius: "50%",
//     animation: "spin 1s linear infinite",
//   },
// };

// // Add global styles for animations
// if (typeof document !== "undefined") {
//   const styleSheet = document.createElement("style");
//   styleSheet.textContent = `
//     @keyframes spin {
//       0% { transform: rotate(0deg); }
//       100% { transform: rotate(360deg); }
//     }

//     button:hover {
//       opacity: 0.9;
//     }

//     select:focus, input:focus, textarea:focus {
//       border-color: #e67e22;
//     }
//   `;
//   document.head.appendChild(styleSheet);
// }

// export default SubHeadings;

//-----------------------------------------------end

"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";
import NotificationToast from "@/NotificationToast";
import Sidebar from "@/app/components/admin/Sidebar";

// Types
interface MainHeading {
  id: number;
  name: string;
}

interface Heading {
  id: number;
  name: string;
  mainHeadingId: number;
}

interface SubHeading {
  id: number;
  name: string;
  mainHeadingId: number;
  mainHeadingName: string;
  headingId: number;
  headingName: string;
  description?: string;
  content?: string;
  displayOrder: number;
  isActive: boolean;
  iconUrl?: string;
  imageUrl?: string;
  metaDescription?: string;
  metaKeywords?: string;
  createdAt: string;
  updatedAt?: string;
}

interface HeadingWithSubHeadings {
  headingId: number;
  headingName: string;
  subHeadings: SubHeading[];
}

interface MainHeadingWithHeadingsAndSubHeadings {
  mainHeadingId: number;
  mainHeadingName: string;
  headings: HeadingWithSubHeadings[];
}

interface SubHeadingOrder {
  id: number;
  displayOrder: number;
}

const SubHeadings: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [subHeadings, setSubHeadings] = useState<SubHeading[]>([]);
  const [mainHeadings, setMainHeadings] = useState<MainHeading[]>([]);
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [filteredHeadings, setFilteredHeadings] = useState<Heading[]>([]);
  const [hierarchyData, setHierarchyData] = useState<
    MainHeadingWithHeadingsAndSubHeadings[]
  >([]);
  const [filteredSubHeadings, setFilteredSubHeadings] = useState<SubHeading[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMainHeading, setSelectedMainHeading] = useState<
    number | "all"
  >("all");
  const [selectedHeading, setSelectedHeading] = useState<number | "all">("all");
  const [showModal, setShowModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [editingSubHeading, setEditingSubHeading] = useState<SubHeading | null>(
    null,
  );
  const [viewingContent, setViewingContent] = useState<SubHeading | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "hierarchy">("hierarchy");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    mainHeadingId: 0,
    headingId: 0,
    description: "",
    content: "",
    displayOrder: 0,
    iconUrl: "",
    imageUrl: "",
    metaDescription: "",
    metaKeywords: "",
  });
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkSubHeadings, setBulkSubHeadings] = useState<
    Array<{
      name: string;
      description: string;
      displayOrder: number;
    }>
  >([]);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error" | "warning",
  });

  // Base URL
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5232";

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
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("trekking_app_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth > 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    fetchMainHeadings();
    fetchHeadings();
    fetchSubHeadings();
  }, []);

  useEffect(() => {
    if (viewMode === "hierarchy") {
      fetchFullHierarchy();
    }
  }, [viewMode]);

  useEffect(() => {
    filterHeadingsByMainHeading();
  }, [selectedMainHeading, headings]);

  useEffect(() => {
    filterSubHeadings();
  }, [searchTerm, selectedMainHeading, selectedHeading, subHeadings]);

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
      const response = await api.get("/api/Heading");
      setHeadings(response.data);
      setFilteredHeadings(response.data);
    } catch (error: any) {
      console.error("Error fetching headings:", error);
      showNotification("Error loading headings", "error");
    }
  };

  const fetchSubHeadings = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/SubHeading");
      setSubHeadings(response.data);
      setFilteredSubHeadings(response.data);
    } catch (error: any) {
      showNotification(
        error.response?.data?.message || "Error loading subheadings",
        "error",
      );
      console.error("Error fetching subheadings:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFullHierarchy = async () => {
    try {
      const response = await api.get("/api/SubHeading/full-hierarchy");
      setHierarchyData(response.data);
    } catch (error: any) {
      console.error("Error fetching hierarchy:", error);
      showNotification("Error loading hierarchy data", "error");
    }
  };

  const filterHeadingsByMainHeading = () => {
    if (selectedMainHeading === "all") {
      setFilteredHeadings(headings);
    } else {
      const filtered = headings.filter(
        (h) => h.mainHeadingId === selectedMainHeading,
      );
      setFilteredHeadings(filtered);
    }
  };

  const filterSubHeadings = () => {
    let filtered = [...subHeadings];

    // Filter by search term
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (sh) =>
          sh.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sh.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sh.content?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filter by main heading
    if (selectedMainHeading !== "all") {
      filtered = filtered.filter(
        (sh) => sh.mainHeadingId === selectedMainHeading,
      );
    }

    // Filter by heading
    if (selectedHeading !== "all") {
      filtered = filtered.filter((sh) => sh.headingId === selectedHeading);
    }

    setFilteredSubHeadings(filtered);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleMainHeadingFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedMainHeading(value === "all" ? "all" : parseInt(value));
    setSelectedHeading("all");
  };

  const handleHeadingFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedHeading(value === "all" ? "all" : parseInt(value));
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
        name === "mainHeadingId" ||
        name === "headingId" ||
        name === "displayOrder"
          ? parseInt(value) || 0
          : value,
    });
  };

  const handleBulkInputChange = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    const updated = [...bulkSubHeadings];
    updated[index] = {
      ...updated[index],
      [field]:
        field === "displayOrder" ? parseInt(value as string) || 0 : value,
    };
    setBulkSubHeadings(updated);
  };

  const addBulkRow = () => {
    setBulkSubHeadings([
      ...bulkSubHeadings,
      { name: "", description: "", displayOrder: bulkSubHeadings.length },
    ]);
  };

  const removeBulkRow = (index: number) => {
    const updated = bulkSubHeadings.filter((_, i) => i !== index);
    setBulkSubHeadings(updated);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      mainHeadingId: mainHeadings.length > 0 ? mainHeadings[0].id : 0,
      headingId: 0,
      description: "",
      content: "",
      displayOrder: 0,
      iconUrl: "",
      imageUrl: "",
      metaDescription: "",
      metaKeywords: "",
    });
    setBulkSubHeadings([]);
    setEditingSubHeading(null);
  };

  const openCreateModal = () => {
    resetForm();
    setBulkMode(false);
    setShowModal(true);
  };

  const openBulkCreateModal = () => {
    resetForm();
    setBulkMode(true);
    setBulkSubHeadings([{ name: "", description: "", displayOrder: 0 }]);
    setShowModal(true);
  };

  const openEditModal = (subHeading: SubHeading) => {
    setEditingSubHeading(subHeading);
    setFormData({
      name: subHeading.name,
      mainHeadingId: subHeading.mainHeadingId,
      headingId: subHeading.headingId,
      description: subHeading.description || "",
      content: subHeading.content || "",
      displayOrder: subHeading.displayOrder,
      iconUrl: subHeading.iconUrl || "",
      imageUrl: subHeading.imageUrl || "",
      metaDescription: subHeading.metaDescription || "",
      metaKeywords: subHeading.metaKeywords || "",
    });
    setBulkMode(false);
    setShowModal(true);
  };

  const openContentModal = (subHeading: SubHeading) => {
    setViewingContent(subHeading);
    setShowContentModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bulkMode) {
      if (!formData.name.trim()) {
        showNotification("Name is required", "warning");
        return;
      }

      if (!formData.mainHeadingId) {
        showNotification("Please select a main heading", "warning");
        return;
      }

      if (!formData.headingId) {
        showNotification("Please select a heading", "warning");
        return;
      }

      try {
        if (editingSubHeading) {
          await api.put(`/api/SubHeading/${editingSubHeading.id}`, {
            name: formData.name.trim(),
            description: formData.description || null,
            content: formData.content || null,
            displayOrder: formData.displayOrder,
            isActive: true,
            iconUrl: formData.iconUrl || null,
            imageUrl: formData.imageUrl || null,
            metaDescription: formData.metaDescription || null,
            metaKeywords: formData.metaKeywords || null,
          });
          showNotification("SubHeading updated successfully!", "success");
        } else {
          await api.post("/api/SubHeading", {
            name: formData.name.trim(),
            mainHeadingId: formData.mainHeadingId,
            headingId: formData.headingId,
            description: formData.description || null,
            content: formData.content || null,
            displayOrder: formData.displayOrder,
            iconUrl: formData.iconUrl || null,
            imageUrl: formData.imageUrl || null,
            metaDescription: formData.metaDescription || null,
            metaKeywords: formData.metaKeywords || null,
          });
          showNotification("SubHeading created successfully!", "success");
        }
      } catch (error: any) {
        console.error("Error saving subheading:", error);
        showNotification(
          error.response?.data?.message || "Error saving subheading",
          "error",
        );
        return;
      }
    } else {
      const validSubHeadings = bulkSubHeadings.filter(
        (sh) => sh.name.trim() !== "",
      );

      if (validSubHeadings.length === 0) {
        showNotification(
          "At least one valid subheading is required",
          "warning",
        );
        return;
      }

      if (!formData.mainHeadingId) {
        showNotification("Please select a main heading", "warning");
        return;
      }

      if (!formData.headingId) {
        showNotification("Please select a heading", "warning");
        return;
      }

      try {
        const response = await api.post("/api/SubHeading/bulk", {
          mainHeadingId: formData.mainHeadingId,
          headingId: formData.headingId,
          subHeadings: validSubHeadings.map((sh) => ({
            name: sh.name.trim(),
            description: sh.description || null,
            displayOrder: sh.displayOrder,
          })),
        });

        if (response.data.errors) {
          showNotification(
            `${response.data.created.length} created, ${response.data.errors.length} errors`,
            "warning",
          );
        } else {
          showNotification(
            `${response.data.length} subheadings created successfully!`,
            "success",
          );
        }
      } catch (error: any) {
        console.error("Error creating bulk subheadings:", error);
        showNotification(
          error.response?.data?.message || "Error creating subheadings",
          "error",
        );
        return;
      }
    }

    setShowModal(false);
    resetForm();
    fetchSubHeadings();
    if (viewMode === "hierarchy") {
      fetchFullHierarchy();
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this subheading?")) {
      return;
    }

    try {
      await api.delete(`/api/SubHeading/${id}`);
      showNotification("SubHeading deleted successfully!", "success");
      fetchSubHeadings();
      if (viewMode === "hierarchy") {
        fetchFullHierarchy();
      }
    } catch (error: any) {
      console.error("Error deleting subheading:", error);
      showNotification(
        error.response?.data?.message || "Error deleting subheading",
        "error",
      );
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      await api.patch(`/api/SubHeading/${id}/toggle-status`);
      showNotification(
        `SubHeading ${currentStatus ? "deactivated" : "activated"} successfully!`,
        "success",
      );
      fetchSubHeadings();
      if (viewMode === "hierarchy") {
        fetchFullHierarchy();
      }
    } catch (error: any) {
      console.error("Error toggling subheading status:", error);
      showNotification(
        error.response?.data?.message || "Error updating subheading status",
        "error",
      );
    }
  };

  const handleDragStart = (e: React.DragEvent, subHeading: SubHeading) => {
    e.dataTransfer.setData("text/plain", subHeading.id.toString());
  };

  const handleDrop = async (
    e: React.DragEvent,
    targetSubHeading: SubHeading,
  ) => {
    e.preventDefault();
    const draggedId = parseInt(e.dataTransfer.getData("text/plain"));
    if (draggedId === targetSubHeading.id) return;

    const sameHeadingSubHeadings = filteredSubHeadings
      .filter(
        (sh) => sh.headingId === targetSubHeading.headingId && sh.isActive,
      )
      .sort((a, b) => a.displayOrder - b.displayOrder);

    const draggedIndex = sameHeadingSubHeadings.findIndex(
      (sh) => sh.id === draggedId,
    );
    const targetIndex = sameHeadingSubHeadings.findIndex(
      (sh) => sh.id === targetSubHeading.id,
    );

    if (draggedIndex === -1 || targetIndex === -1) return;

    const [removed] = sameHeadingSubHeadings.splice(draggedIndex, 1);
    sameHeadingSubHeadings.splice(targetIndex, 0, removed);

    const updates: SubHeadingOrder[] = sameHeadingSubHeadings.map(
      (subHeading, index) => ({
        id: subHeading.id,
        displayOrder: index,
      }),
    );

    try {
      await api.post("/api/SubHeading/reorder", updates);
      showNotification("SubHeadings reordered successfully!", "success");
      fetchSubHeadings();
      if (viewMode === "hierarchy") {
        fetchFullHierarchy();
      }
    } catch (error: any) {
      console.error("Error reordering subheadings:", error);
      showNotification("Error reordering subheadings", "error");
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

  const getHeadingName = (headingId: number): string => {
    const heading = headings.find((h) => h.id === headingId);
    return heading?.name || "Unknown";
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
            <p>Loading subheadings...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main
        style={{
          ...styles.main,
          marginLeft: isSidebarOpen ? "280px" : "0",
        }}
      >
        <div style={styles.topBar}>
          <button
            onClick={toggleSidebar}
            style={styles.menuToggle}
            id="sidebar-toggle"
          >
            ☰
          </button>
          <h1 style={styles.pageTitle}>SubHeadings Management</h1>
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
                onClick={() => setViewMode("hierarchy")}
                style={{
                  ...styles.viewToggleButton,
                  ...(viewMode === "hierarchy" ? styles.viewToggleActive : {}),
                }}
              >
                Hierarchy View
              </button>
            </div>
            <div style={styles.buttonGroup}>
              <button onClick={openCreateModal} style={styles.addButton}>
                + Add SubHeading
              </button>
              <button onClick={openBulkCreateModal} style={styles.bulkButton}>
                + Bulk Create
              </button>
            </div>
          </div>
        </div>

        <div style={styles.filtersContainer}>
          <div style={styles.searchWrapper}>
            <input
              type="text"
              placeholder="Search subheadings by name, description or content..."
              value={searchTerm}
              onChange={handleSearch}
              style={styles.searchInput}
            />
            <span style={styles.searchIcon}>🔍</span>
          </div>

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

          <select
            value={selectedHeading}
            onChange={handleHeadingFilter}
            style={styles.filterSelect}
            disabled={
              selectedMainHeading === "all" && filteredHeadings.length === 0
            }
          >
            <option value="all">All Headings</option>
            {filteredHeadings.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>
        </div>

        {viewMode === "list" ? (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>S.N.</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Main Heading</th>
                  <th style={styles.th}>Heading</th>
                  <th style={styles.th}>Description</th>
                  <th style={styles.th}>Order</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubHeadings.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={styles.noData}>
                      No subheadings found
                    </td>
                  </tr>
                ) : (
                  filteredSubHeadings
                    .sort((a, b) => a.displayOrder - b.displayOrder)
                    .map((subHeading, index) => (
                      <tr
                        key={subHeading.id}
                        style={{
                          ...styles.row,
                          opacity: subHeading.isActive ? 1 : 0.6,
                        }}
                        draggable={subHeading.isActive}
                        onDragStart={(e) => handleDragStart(e, subHeading)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, subHeading)}
                      >
                        <td style={styles.td}>{index + 1}</td>
                        <td style={styles.td}>
                          <span style={styles.nameCell}>{subHeading.name}</span>
                          {subHeading.iconUrl && (
                            <span style={styles.iconIndicator}>🖼️</span>
                          )}
                        </td>
                        <td style={styles.td}>{subHeading.mainHeadingName}</td>
                        <td style={styles.td}>{subHeading.headingName}</td>
                        <td style={styles.td}>
                          {subHeading.description ? (
                            <span title={subHeading.description}>
                              {subHeading.description.length > 30
                                ? `${subHeading.description.substring(0, 30)}...`
                                : subHeading.description}
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td style={styles.td}>{subHeading.displayOrder}</td>
                        <td style={styles.td}>
                          <span
                            style={{
                              ...styles.statusBadge,
                              backgroundColor: subHeading.isActive
                                ? "#4caf50"
                                : "#999",
                            }}
                          >
                            {subHeading.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <div style={styles.actionButtons}>
                            <button
                              onClick={() => openContentModal(subHeading)}
                              style={styles.viewButton}
                              title="View Content"
                            >
                              📄
                            </button>
                            <button
                              onClick={() => openEditModal(subHeading)}
                              style={styles.editButton}
                              title="Edit"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() =>
                                handleToggleStatus(
                                  subHeading.id,
                                  subHeading.isActive,
                                )
                              }
                              style={styles.statusButton}
                              title={
                                subHeading.isActive ? "Deactivate" : "Activate"
                              }
                            >
                              {subHeading.isActive ? "🔴" : "🟢"}
                            </button>
                            <button
                              onClick={() => handleDelete(subHeading.id)}
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
              💡 Drag and drop rows to reorder subheadings within the same
              heading
            </div>
          </div>
        ) : (
          /* Hierarchy View - Matches List View Styling */
          <div style={styles.hierarchyContainer}>
            {hierarchyData.map((mainHeading) => (
              <div
                key={mainHeading.mainHeadingId}
                style={styles.mainHeadingCard}
              >
                <div style={styles.mainHeadingHeader}>
                  <h2 style={styles.mainHeadingTitle}>
                    {mainHeading.mainHeadingName}
                  </h2>
                </div>

                {mainHeading.headings.length === 0 ? (
                  <p style={styles.noData}>No headings in this main heading</p>
                ) : (
                  mainHeading.headings.map((heading) => {
                    const activeCount = heading.subHeadings.filter(
                      (sh) => sh.isActive,
                    ).length;
                    const inactiveCount =
                      heading.subHeadings.length - activeCount;

                    return (
                      <div key={heading.headingId} style={styles.headingCard}>
                        <div style={styles.headingHeader}>
                          <h3 style={styles.headingTitle}>
                            {heading.headingName}
                          </h3>
                          <span style={styles.countBadge}>
                            {activeCount} active / {heading.subHeadings.length}{" "}
                            total
                            {inactiveCount > 0 &&
                              ` (${inactiveCount} inactive)`}
                          </span>
                        </div>

                        {heading.subHeadings.length === 0 ? (
                          <p style={styles.noSubData}>
                            No subheadings in this heading
                          </p>
                        ) : (
                          <div style={styles.subHeadingList}>
                            {heading.subHeadings.map((subHeading, index) => (
                              <div
                                key={subHeading.id}
                                style={{
                                  ...styles.subHeadingItem,
                                  opacity: subHeading.isActive ? 1 : 0.6, // Same as list view
                                }}
                              >
                                <div style={styles.subHeadingLeft}>
                                  <span style={styles.subHeadingNumber}>
                                    {index + 1}.
                                  </span>
                                  <span
                                    style={{
                                      ...styles.subHeadingName,
                                      color: "#e67e22", // Orange color like list view
                                      fontWeight: "500", // Same weight as list view
                                    }}
                                  >
                                    {subHeading.name}
                                  </span>
                                  {subHeading.description && (
                                    <span style={styles.subHeadingDescription}>
                                      - {subHeading.description}
                                    </span>
                                  )}
                                  {subHeading.iconUrl && (
                                    <span style={styles.subHeadingIcon}>
                                      🖼️
                                    </span>
                                  )}
                                </div>
                                <div style={styles.subHeadingActions}>
                                  <button
                                    onClick={() => openContentModal(subHeading)}
                                    style={styles.viewButton}
                                    title="View Content"
                                  >
                                    📄
                                  </button>
                                  <button
                                    onClick={() => openEditModal(subHeading)}
                                    style={styles.editButton}
                                    title="Edit"
                                  >
                                    ✏️
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleToggleStatus(
                                        subHeading.id,
                                        subHeading.isActive,
                                      )
                                    }
                                    style={styles.statusButton}
                                    title={
                                      subHeading.isActive
                                        ? "Deactivate"
                                        : "Activate"
                                    }
                                  >
                                    {subHeading.isActive ? "🔴" : "🟢"}
                                  </button>
                                  <button
                                    onClick={() => handleDelete(subHeading.id)}
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
                    );
                  })
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
                  {bulkMode
                    ? "Bulk Create SubHeadings"
                    : editingSubHeading
                      ? "Edit SubHeading"
                      : "Create New SubHeading"}
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
                    disabled={!!editingSubHeading}
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
                    Heading <span style={styles.required}>*</span>
                  </label>
                  <select
                    name="headingId"
                    value={formData.headingId}
                    onChange={handleInputChange}
                    style={styles.select}
                    required
                    disabled={!!editingSubHeading}
                  >
                    <option value="">Select Heading</option>
                    {headings
                      .filter((h) => h.mainHeadingId === formData.mainHeadingId)
                      .map((h) => (
                        <option key={h.id} value={h.id}>
                          {h.name}
                        </option>
                      ))}
                  </select>
                </div>

                {bulkMode ? (
                  <div style={styles.bulkContainer}>
                    <div style={styles.bulkHeader}>
                      <h3 style={styles.bulkTitle}>SubHeadings</h3>
                      <button
                        type="button"
                        onClick={addBulkRow}
                        style={styles.addRowButton}
                      >
                        + Add Row
                      </button>
                    </div>

                    {bulkSubHeadings.map((item, index) => (
                      <div key={index} style={styles.bulkRow}>
                        <div style={styles.bulkRowHeader}>
                          <span style={styles.bulkRowNumber}>#{index + 1}</span>
                          {bulkSubHeadings.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeBulkRow(index)}
                              style={styles.removeRowButton}
                            >
                              ✕
                            </button>
                          )}
                        </div>
                        <div style={styles.bulkRowFields}>
                          <div style={styles.bulkField}>
                            <label style={styles.bulkLabel}>Name *</label>
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) =>
                                handleBulkInputChange(
                                  index,
                                  "name",
                                  e.target.value,
                                )
                              }
                              placeholder="Enter name"
                              style={styles.bulkInput}
                              maxLength={200}
                            />
                          </div>
                          <div style={styles.bulkField}>
                            <label style={styles.bulkLabel}>Description</label>
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) =>
                                handleBulkInputChange(
                                  index,
                                  "description",
                                  e.target.value,
                                )
                              }
                              placeholder="Enter description"
                              style={styles.bulkInput}
                            />
                          </div>
                          <div style={styles.bulkFieldSmall}>
                            <label style={styles.bulkLabel}>Order</label>
                            <input
                              type="number"
                              value={item.displayOrder}
                              onChange={(e) =>
                                handleBulkInputChange(
                                  index,
                                  "displayOrder",
                                  e.target.value,
                                )
                              }
                              style={styles.bulkInput}
                              min="0"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>
                        Name <span style={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter subheading name"
                        style={styles.input}
                        autoFocus
                        maxLength={200}
                      />
                      <small style={styles.hint}>Max 200 characters</small>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Description</label>
                      <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Enter description (optional)"
                        style={styles.input}
                        maxLength={500}
                      />
                      <small style={styles.hint}>Max 500 characters</small>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Content</label>
                      <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        placeholder="Enter content (optional)"
                        style={styles.textarea}
                        rows={4}
                      />
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
                      <small style={styles.hint}>
                        Lower numbers appear first
                      </small>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Icon URL</label>
                      <input
                        type="url"
                        name="iconUrl"
                        value={formData.iconUrl}
                        onChange={handleInputChange}
                        placeholder="Enter icon URL (optional)"
                        style={styles.input}
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Image URL</label>
                      <input
                        type="url"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleInputChange}
                        placeholder="Enter image URL (optional)"
                        style={styles.input}
                      />
                    </div>

                    <div style={styles.seoSection}>
                      <h3 style={styles.seoTitle}>SEO Information</h3>

                      <div style={styles.formGroup}>
                        <label style={styles.label}>Meta Description</label>
                        <textarea
                          name="metaDescription"
                          value={formData.metaDescription}
                          onChange={handleInputChange}
                          placeholder="Enter meta description for SEO"
                          style={styles.textarea}
                          rows={2}
                          maxLength={160}
                        />
                        <small style={styles.hint}>
                          Max 160 characters. {formData.metaDescription.length}
                          /160
                        </small>
                      </div>

                      <div style={styles.formGroup}>
                        <label style={styles.label}>Meta Keywords</label>
                        <input
                          type="text"
                          name="metaKeywords"
                          value={formData.metaKeywords}
                          onChange={handleInputChange}
                          placeholder="Enter comma-separated keywords"
                          style={styles.input}
                          maxLength={100}
                        />
                        <small style={styles.hint}>
                          Separate keywords with commas
                        </small>
                      </div>
                    </div>
                  </>
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
                    {bulkMode
                      ? "Create All"
                      : editingSubHeading
                        ? "Update"
                        : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}

        {showContentModal && viewingContent && (
          <>
            <div
              style={styles.modalOverlay}
              onClick={() => setShowContentModal(false)}
            />
            <div style={styles.contentModal}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>{viewingContent.name}</h2>
                <button
                  onClick={() => setShowContentModal(false)}
                  style={styles.closeButton}
                >
                  ✕
                </button>
              </div>

              <div style={styles.contentBody}>
                <div style={styles.metadataSection}>
                  <div style={styles.metadataItem}>
                    <strong>Main Heading:</strong>{" "}
                    {viewingContent.mainHeadingName}
                  </div>
                  <div style={styles.metadataItem}>
                    <strong>Heading:</strong> {viewingContent.headingName}
                  </div>
                  <div style={styles.metadataItem}>
                    <strong>Display Order:</strong>{" "}
                    {viewingContent.displayOrder}
                  </div>
                  <div style={styles.metadataItem}>
                    <strong>Status:</strong>
                    <span
                      style={{
                        ...styles.statusBadge,
                        backgroundColor: viewingContent.isActive
                          ? "#4caf50"
                          : "#999",
                        marginLeft: "8px",
                      }}
                    >
                      {viewingContent.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                {viewingContent.description && (
                  <div style={styles.contentSection}>
                    <h3 style={styles.contentSectionTitle}>Description</h3>
                    <p style={styles.contentText}>
                      {viewingContent.description}
                    </p>
                  </div>
                )}

                {viewingContent.content && (
                  <div style={styles.contentSection}>
                    <h3 style={styles.contentSectionTitle}>Content</h3>
                    <div style={styles.contentText}>
                      {viewingContent.content
                        .split("\n")
                        .map((paragraph, i) => (
                          <p key={i} style={styles.contentParagraph}>
                            {paragraph}
                          </p>
                        ))}
                    </div>
                  </div>
                )}

                {(viewingContent.iconUrl || viewingContent.imageUrl) && (
                  <div style={styles.mediaSection}>
                    <h3 style={styles.contentSectionTitle}>Media</h3>
                    <div style={styles.mediaGrid}>
                      {viewingContent.iconUrl && (
                        <div style={styles.mediaItem}>
                          <strong>Icon:</strong>
                          <img
                            src={viewingContent.iconUrl}
                            alt="Icon"
                            style={styles.mediaImage}
                            onError={(e) =>
                              (e.currentTarget.style.display = "none")
                            }
                          />
                        </div>
                      )}
                      {viewingContent.imageUrl && (
                        <div style={styles.mediaItem}>
                          <strong>Image:</strong>
                          <img
                            src={viewingContent.imageUrl}
                            alt="Content"
                            style={styles.mediaImage}
                            onError={(e) =>
                              (e.currentTarget.style.display = "none")
                            }
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {(viewingContent.metaDescription ||
                  viewingContent.metaKeywords) && (
                  <div style={styles.seoSection}>
                    <h3 style={styles.contentSectionTitle}>SEO Information</h3>
                    {viewingContent.metaDescription && (
                      <div style={styles.metadataItem}>
                        <strong>Meta Description:</strong>{" "}
                        {viewingContent.metaDescription}
                      </div>
                    )}
                    {viewingContent.metaKeywords && (
                      <div style={styles.metadataItem}>
                        <strong>Meta Keywords:</strong>{" "}
                        {viewingContent.metaKeywords}
                      </div>
                    )}
                  </div>
                )}

                <div style={styles.timestampSection}>
                  <div style={styles.metadataItem}>
                    <strong>Created:</strong>{" "}
                    {new Date(viewingContent.createdAt).toLocaleString()}
                  </div>
                  {viewingContent.updatedAt && (
                    <div style={styles.metadataItem}>
                      <strong>Last Updated:</strong>{" "}
                      {new Date(viewingContent.updatedAt).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>

              <div style={styles.modalFooter}>
                <button
                  onClick={() => {
                    setShowContentModal(false);
                    openEditModal(viewingContent);
                  }}
                  style={styles.editButton}
                >
                  Edit SubHeading
                </button>
                <button
                  onClick={() => setShowContentModal(false)}
                  style={styles.cancelButton}
                >
                  Close
                </button>
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
      </main>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
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
  buttonGroup: {
    display: "flex",
    gap: "10px",
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
  },
  bulkButton: {
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  filtersContainer: {
    display: "flex",
    gap: "15px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  searchWrapper: {
    position: "relative",
    flex: 2,
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
    boxSizing: "border-box",
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
  filterSelect: {
    padding: "12px 15px",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    backgroundColor: "white",
    minWidth: "200px",
    cursor: "pointer",
  },
  tableContainer: {
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    overflow: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
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
    marginRight: "5px",
  },
  iconIndicator: {
    fontSize: "12px",
  },
  statusBadge: {
    padding: "4px 8px",
    borderRadius: "4px",
    color: "white",
    fontSize: "12px",
    fontWeight: "500",
  },
  noData: {
    textAlign: "center",
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
    textAlign: "center",
  },
  actionButtons: {
    display: "flex",
    gap: "5px",
    flexWrap: "wrap",
  },
  viewButton: {
    backgroundColor: "transparent",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    padding: "5px",
    borderRadius: "4px",
    transition: "background-color 0.2s",
  },
  editButton: {
    backgroundColor: "transparent",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    padding: "5px",
    borderRadius: "4px",
    transition: "background-color 0.2s",
  },
  deleteButton: {
    backgroundColor: "transparent",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    padding: "5px",
    borderRadius: "4px",
    transition: "background-color 0.2s",
  },
  statusButton: {
    backgroundColor: "transparent",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    padding: "5px",
    borderRadius: "4px",
    transition: "background-color 0.2s",
  },
  hierarchyContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  mainHeadingCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    overflow: "hidden",
  },
  mainHeadingHeader: {
    backgroundColor: "#2c3e50",
    color: "white",
    padding: "15px 20px",
  },
  mainHeadingTitle: {
    fontSize: "18px",
    fontWeight: "600",
    margin: 0,
  },
  headingCard: {
    margin: "15px",
    marginTop: "10px",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    overflow: "hidden",
  },
  headingHeader: {
    backgroundColor: "#f8f9fa",
    padding: "12px 15px",
    borderBottom: "1px solid #e0e0e0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headingTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#34495e",
    margin: 0,
  },
  countBadge: {
    backgroundColor: "#e67e22",
    color: "white",
    padding: "3px 8px",
    borderRadius: "4px",
    fontSize: "12px",
  },
  noSubData: {
    padding: "20px",
    textAlign: "center",
    color: "#999",
    fontSize: "14px",
  },
  subHeadingList: {
    padding: "10px",
  },
  subHeadingItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 12px",
    borderBottom: "1px solid #ecf0f1",
    transition: "all 0.2s ease",
  },
  subHeadingLeft: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flex: 1,
    flexWrap: "wrap",
  },
  subHeadingNumber: {
    color: "#999",
    fontSize: "12px",
    minWidth: "25px",
  },
  subHeadingName: {
    fontWeight: "500",
    transition: "all 0.2s ease",
  },
  subHeadingDescription: {
    color: "#666",
    fontSize: "13px",
    fontStyle: "italic",
  },
  subHeadingIcon: {
    fontSize: "14px",
  },
  inactiveBadge: {
    fontSize: "11px",
    color: "#999",
    fontStyle: "italic",
    marginLeft: "5px",
    padding: "2px 6px",
    backgroundColor: "#f0f0f0",
    borderRadius: "4px",
  },
  subHeadingActions: {
    display: "flex",
    gap: "5px",
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
    maxWidth: "600px",
    zIndex: 1001,
    boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
    maxHeight: "90vh",
    overflowY: "auto",
  },
  contentModal: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "30px",
    width: "90%",
    maxWidth: "700px",
    zIndex: 1001,
    boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
    maxHeight: "90vh",
    overflowY: "auto",
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
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
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
  },
  select: {
    padding: "10px",
    fontSize: "14px",
    border: "1px solid #e0e0e0",
    borderRadius: "6px",
    outline: "none",
    backgroundColor: "white",
    cursor: "pointer",
  },
  textarea: {
    padding: "10px",
    fontSize: "14px",
    border: "1px solid #e0e0e0",
    borderRadius: "6px",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
  },
  hint: {
    fontSize: "12px",
    color: "#999",
  },
  seoSection: {
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    padding: "15px",
    backgroundColor: "#f8f9fa",
  },
  seoTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#2c3e50",
    margin: "0 0 15px 0",
  },
  bulkContainer: {
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    padding: "15px",
    maxHeight: "400px",
    overflowY: "auto",
  },
  bulkHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },
  bulkTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#2c3e50",
    margin: 0,
  },
  addRowButton: {
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "4px",
    fontSize: "12px",
    cursor: "pointer",
  },
  bulkRow: {
    border: "1px solid #e0e0e0",
    borderRadius: "6px",
    padding: "12px",
    marginBottom: "10px",
    backgroundColor: "white",
  },
  bulkRowHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  bulkRowNumber: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#666",
  },
  removeRowButton: {
    backgroundColor: "transparent",
    border: "none",
    color: "#e74c3c",
    fontSize: "16px",
    cursor: "pointer",
    padding: "0 5px",
  },
  bulkRowFields: {
    display: "grid",
    gridTemplateColumns: "2fr 2fr 1fr",
    gap: "10px",
  },
  bulkField: {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
  },
  bulkFieldSmall: {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
  },
  bulkLabel: {
    fontSize: "12px",
    color: "#666",
  },
  bulkInput: {
    padding: "6px",
    fontSize: "13px",
    border: "1px solid #e0e0e0",
    borderRadius: "4px",
    outline: "none",
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
  },
  contentBody: {
    padding: "10px 0",
  },
  metadataSection: {
    backgroundColor: "#f8f9fa",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "20px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "10px",
  },
  metadataItem: {
    fontSize: "14px",
    color: "#2c3e50",
  },
  contentSection: {
    marginBottom: "20px",
  },
  contentSectionTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#2c3e50",
    margin: "0 0 10px 0",
    paddingBottom: "5px",
    borderBottom: "2px solid #e67e22",
  },
  contentText: {
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#444",
  },
  contentParagraph: {
    margin: "0 0 10px 0",
  },
  mediaSection: {
    marginBottom: "20px",
  },
  mediaGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "15px",
  },
  mediaItem: {
    textAlign: "center",
  },
  mediaImage: {
    maxWidth: "100%",
    maxHeight: "150px",
    marginTop: "5px",
    borderRadius: "4px",
  },
  timestampSection: {
    marginTop: "20px",
    padding: "15px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    fontSize: "13px",
    color: "#666",
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

if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    button:hover {
      opacity: 0.9;
    }
    
    select:focus, input:focus, textarea:focus {
      border-color: #e67e22;
    }
  `;
  document.head.appendChild(styleSheet);
}

export default SubHeadings;
