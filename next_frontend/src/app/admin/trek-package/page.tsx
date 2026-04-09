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
  headingId: number;
  description?: string;
}

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

interface SliderImage {
  id?: number;
  imageUrl?: string;
  file?: File;
  title?: string;
  caption?: string;
  altText?: string;
  displayOrder: number;
  isNew?: boolean;
}

interface GalleryImage {
  id?: number;
  imageUrl?: string;
  file?: File;
  title?: string;
  description?: string;
  altText?: string;
  displayOrder: number;
  isFeatured: boolean;
  isNew?: boolean;
}

interface ItineraryDay {
  id?: number;
  dayNumber: number;
  title: string;
  description: string;
  maxAltitude?: string;
  accommodation?: string;
  meals?: string;
  duration?: string;
  distance?: string;
}

interface CostItem {
  id?: number;
  description: string;
  category?: string;
  displayOrder: number;
}

interface FaqItem {
  id?: number;
  question: string;
  answer: string;
  displayOrder: number;
}

interface DepartureDate {
  id?: number;
  startDate: string;
  endDate: string;
  price: number;
  discountedPrice?: number;
  isGuaranteed: boolean;
  notes?: string;
  isBestSeller?: boolean;
  isTopSeller?: boolean;
  bookingCount?: number;
}

interface GroupDiscount {
  id?: number;
  minTravelers: number;
  maxTravelers: number;
  pricePerPerson: number;
  discountPercentage?: number;
  description?: string;
  displayOrder: number;
}

interface TrekPackage {
  id: number;
  name: string;
  shortDescription?: string;
  price?: number;
  discountedPrice?: number;
  durationDays?: number;
  durationNights?: number;
  tripGrade?: string;
  countryId: number;
  countryName: string;
  mainHeadingId: number;
  mainHeadingName: string;
  headingId: number;
  headingName: string;
  subHeadingId?: number;
  subHeadingName?: string;
  maximumAltitude?: string;
  groupSize?: string;
  startsAt?: string;
  endsAt?: string;
  activities?: string;
  bestTime?: string;
  overview?: string;
  essentialInformation?: string;
  videoReviewUrl?: string;
  routeMapImageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  sliderImages: SliderImage[];
  galleryImages: GalleryImage[];
  itinerary: ItineraryDay[];
  costIncludes: CostItem[];
  costExcludes: CostItem[];
  faqs: FaqItem[];
  departureDates: DepartureDate[];
  groupDiscounts?: GroupDiscount[];
}

const TrekPackageManager: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [packages, setPackages] = useState<TrekPackage[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<TrekPackage[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [mainHeadings, setMainHeadings] = useState<MainHeading[]>([]);
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [subHeadings, setSubHeadings] = useState<SubHeading[]>([]);
  const [filteredHeadings, setFilteredHeadings] = useState<Heading[]>([]);
  const [filteredSubHeadings, setFilteredSubHeadings] = useState<SubHeading[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<number | "all">("all");
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState<TrekPackage | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState("hierarchy");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error" | "warning",
  });

  // Hierarchy selection state
  const [selectedMainHeading, setSelectedMainHeading] = useState<number>(0);
  const [selectedHeading, setSelectedHeading] = useState<number>(0);
  const [selectedSubHeading, setSelectedSubHeading] = useState<number>(0);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    price: "",
    discountedPrice: "",
    durationDays: "",
    durationNights: "",
    tripGrade: "",
    countryId: 0,
    maximumAltitude: "",
    groupSize: "",
    startsAt: "",
    endsAt: "",
    activities: "",
    bestTime: "",
    overview: "",
    essentialInformation: "",
    videoReviewUrl: "",
  });

  // Collection states
  const [sliderImages, setSliderImages] = useState<SliderImage[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [routeMapImage, setRouteMapImage] = useState<File | null>(null);
  const [routeMapPreview, setRouteMapPreview] = useState<string>("");
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [costIncludes, setCostIncludes] = useState<CostItem[]>([]);
  const [costExcludes, setCostExcludes] = useState<CostItem[]>([]);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [departureDates, setDepartureDates] = useState<DepartureDate[]>([]);
  const [groupDiscounts, setGroupDiscounts] = useState<GroupDiscount[]>([]);

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
    fetchCountries();
    fetchMainHeadings();
    fetchHeadings();
    fetchSubHeadings();
    fetchPackages();
  }, []);

  useEffect(() => {
    filterHeadings();
  }, [selectedMainHeading, headings]);

  useEffect(() => {
    filterSubHeadings();
  }, [selectedHeading, subHeadings]);

  useEffect(() => {
    filterPackages();
  }, [searchTerm, selectedCountry, packages]);

  const fetchCountries = async () => {
    try {
      const response = await api.get("/api/Country");
      setCountries(response.data);
    } catch (error) {
      console.error("Error fetching countries:", error);
      showNotification("Error loading countries", "error");
    }
  };

  const fetchMainHeadings = async () => {
    try {
      const response = await api.get("/api/MainHeading");
      setMainHeadings(response.data);
    } catch (error) {
      console.error("Error fetching main headings:", error);
      showNotification("Error loading main headings", "error");
    }
  };

  const fetchHeadings = async () => {
    try {
      const response = await api.get("/api/Heading");
      setHeadings(response.data);
    } catch (error) {
      console.error("Error fetching headings:", error);
      showNotification("Error loading headings", "error");
    }
  };

  const fetchSubHeadings = async () => {
    try {
      const response = await api.get("/api/SubHeading");
      setSubHeadings(response.data);
    } catch (error) {
      console.error("Error fetching subheadings:", error);
      showNotification("Error loading subheadings", "error");
    }
  };

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/TrekPackage");
      setPackages(response.data);
      setFilteredPackages(response.data);
    } catch (error: any) {
      showNotification(
        error.response?.data?.message || "Error loading packages",
        "error",
      );
      console.error("Error fetching packages:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterHeadings = () => {
    if (selectedMainHeading) {
      const filtered = headings.filter(
        (h) => h.mainHeadingId === selectedMainHeading,
      );
      setFilteredHeadings(filtered);
    } else {
      setFilteredHeadings([]);
    }
  };

  const filterSubHeadings = () => {
    if (selectedHeading) {
      const filtered = subHeadings.filter(
        (sh) => sh.headingId === selectedHeading,
      );
      setFilteredSubHeadings(filtered);
    } else {
      setFilteredSubHeadings([]);
    }
  };

  const filterPackages = () => {
    let filtered = [...packages];

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (selectedCountry !== "all") {
      filtered = filtered.filter((p) => p.countryId === selectedCountry);
    }

    setFilteredPackages(filtered);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCountryFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedCountry(value === "all" ? "all" : parseInt(value));
  };

  const handleMainHeadingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value);
    setSelectedMainHeading(value);
    setSelectedHeading(0);
    setSelectedSubHeading(0);
  };

  const handleHeadingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value);
    setSelectedHeading(value);
    setSelectedSubHeading(0);
  };

  const handleSubHeadingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubHeading(parseInt(e.target.value));
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value === "" ? "" : Number(value),
    });
  };

  // Slider Images
  const handleSliderImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages: SliderImage[] = Array.from(e.target.files).map(
        (file, index) => ({
          file,
          displayOrder: sliderImages.length + index,
          title: "",
          caption: "",
          altText: "",
          isNew: true,
        }),
      );
      setSliderImages([...sliderImages, ...newImages]);
    }
  };

  const updateSliderImage = (index: number, field: string, value: string) => {
    const updated = [...sliderImages];
    updated[index] = { ...updated[index], [field]: value };
    setSliderImages(updated);
  };

  const removeSliderImage = (index: number) => {
    const updated = sliderImages.filter((_, i) => i !== index);
    updated.forEach((img, i) => (img.displayOrder = i));
    setSliderImages(updated);
  };

  // Gallery Images
  const handleGalleryImagesUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files) {
      const newImages: GalleryImage[] = Array.from(e.target.files).map(
        (file, index) => ({
          file,
          displayOrder: galleryImages.length + index,
          title: "",
          description: "",
          altText: "",
          isFeatured: false,
          isNew: true,
        }),
      );
      setGalleryImages([...galleryImages, ...newImages]);
    }
  };

  const updateGalleryImage = (
    index: number,
    field: string,
    value: string | boolean,
  ) => {
    const updated = [...galleryImages];
    updated[index] = { ...updated[index], [field]: value };
    setGalleryImages(updated);
  };

  const removeGalleryImage = (index: number) => {
    const updated = galleryImages.filter((_, i) => i !== index);
    updated.forEach((img, i) => (img.displayOrder = i));
    setGalleryImages(updated);
  };

  const toggleFeaturedImage = (index: number) => {
    const updated = [...galleryImages];
    updated[index].isFeatured = !updated[index].isFeatured;
    setGalleryImages(updated);
  };

  // Route Map
  const handleRouteMapUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setRouteMapImage(file);
      setRouteMapPreview(URL.createObjectURL(file));
    }
  };

  // Itinerary
  const addItineraryDay = () => {
    setItinerary([
      ...itinerary,
      {
        dayNumber: itinerary.length + 1,
        title: "",
        description: "",
        maxAltitude: "",
        accommodation: "",
        meals: "",
        duration: "",
        distance: "",
      },
    ]);
  };

  const updateItineraryDay = (index: number, field: string, value: string) => {
    const updated = [...itinerary];
    updated[index] = { ...updated[index], [field]: value };
    setItinerary(updated);
  };

  const removeItineraryDay = (index: number) => {
    const updated = itinerary.filter((_, i) => i !== index);
    updated.forEach((day, i) => (day.dayNumber = i + 1));
    setItinerary(updated);
  };

  // Cost Includes/Excludes
  const addCostInclude = () => {
    setCostIncludes([
      ...costIncludes,
      {
        description: "",
        category: "",
        displayOrder: costIncludes.length,
      },
    ]);
  };

  const updateCostInclude = (index: number, field: string, value: string) => {
    const updated = [...costIncludes];
    updated[index] = { ...updated[index], [field]: value };
    setCostIncludes(updated);
  };

  const removeCostInclude = (index: number) => {
    const updated = costIncludes.filter((_, i) => i !== index);
    updated.forEach((item, i) => (item.displayOrder = i));
    setCostIncludes(updated);
  };

  const addCostExclude = () => {
    setCostExcludes([
      ...costExcludes,
      {
        description: "",
        category: "",
        displayOrder: costExcludes.length,
      },
    ]);
  };

  const updateCostExclude = (index: number, field: string, value: string) => {
    const updated = [...costExcludes];
    updated[index] = { ...updated[index], [field]: value };
    setCostExcludes(updated);
  };

  const removeCostExclude = (index: number) => {
    const updated = costExcludes.filter((_, i) => i !== index);
    updated.forEach((item, i) => (item.displayOrder = i));
    setCostExcludes(updated);
  };

  // FAQs
  const addFaq = () => {
    setFaqs([
      ...faqs,
      {
        question: "",
        answer: "",
        displayOrder: faqs.length,
      },
    ]);
  };

  const updateFaq = (index: number, field: string, value: string) => {
    const updated = [...faqs];
    updated[index] = { ...updated[index], [field]: value };
    setFaqs(updated);
  };

  const removeFaq = (index: number) => {
    const updated = faqs.filter((_, i) => i !== index);
    updated.forEach((item, i) => (item.displayOrder = i));
    setFaqs(updated);
  };

  // Departure Dates
  const addDepartureDate = () => {
    setDepartureDates([
      ...departureDates,
      {
        startDate: "",
        endDate: "",
        price: 0,
        discountedPrice: undefined,
        isGuaranteed: false,
        notes: "",
        isBestSeller: false,
        isTopSeller: false,
        bookingCount: 0,
      },
    ]);
  };

  const updateDepartureDate = (
    index: number,
    field: string,
    value: string | number | boolean,
  ) => {
    const updated = [...departureDates];
    updated[index] = { ...updated[index], [field]: value };
    setDepartureDates(updated);
  };

  const removeDepartureDate = (index: number) => {
    setDepartureDates(departureDates.filter((_, i) => i !== index));
  };

  // Group Discounts
  const addGroupDiscount = () => {
    setGroupDiscounts([
      ...groupDiscounts,
      {
        minTravelers: 1,
        maxTravelers: 1,
        pricePerPerson: 0,
        discountPercentage: undefined,
        description: "",
        displayOrder: groupDiscounts.length,
      },
    ]);
  };

  const updateGroupDiscount = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    const updated = [...groupDiscounts];
    updated[index] = { ...updated[index], [field]: value };
    setGroupDiscounts(updated);
  };

  const removeGroupDiscount = (index: number) => {
    const updated = groupDiscounts.filter((_, i) => i !== index);
    updated.forEach((item, i) => (item.displayOrder = i));
    setGroupDiscounts(updated);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      shortDescription: "",
      price: "",
      discountedPrice: "",
      durationDays: "",
      durationNights: "",
      tripGrade: "",
      countryId: countries[0]?.id || 0,
      maximumAltitude: "",
      groupSize: "",
      startsAt: "",
      endsAt: "",
      activities: "",
      bestTime: "",
      overview: "",
      essentialInformation: "",
      videoReviewUrl: "",
    });
    setSelectedMainHeading(0);
    setSelectedHeading(0);
    setSelectedSubHeading(0);
    setSliderImages([]);
    setGalleryImages([]);
    setRouteMapImage(null);
    setRouteMapPreview("");
    setItinerary([]);
    setCostIncludes([]);
    setCostExcludes([]);
    setFaqs([]);
    setDepartureDates([]);
    setGroupDiscounts([]);
    setEditingPackage(null);
    setActiveTab("hierarchy");
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (pkg: TrekPackage) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      shortDescription: pkg.shortDescription || "",
      price: pkg.price?.toString() || "",
      discountedPrice: pkg.discountedPrice?.toString() || "",
      durationDays: pkg.durationDays?.toString() || "",
      durationNights: pkg.durationNights?.toString() || "",
      tripGrade: pkg.tripGrade || "",
      countryId: pkg.countryId,
      maximumAltitude: pkg.maximumAltitude || "",
      groupSize: pkg.groupSize || "",
      startsAt: pkg.startsAt || "",
      endsAt: pkg.endsAt || "",
      activities: pkg.activities || "",
      bestTime: pkg.bestTime || "",
      overview: pkg.overview || "",
      essentialInformation: pkg.essentialInformation || "",
      videoReviewUrl: pkg.videoReviewUrl || "",
    });
    setSelectedMainHeading(pkg.mainHeadingId);
    setSelectedHeading(pkg.headingId);
    setSelectedSubHeading(pkg.subHeadingId || 0);

    setSliderImages(pkg.sliderImages.map((img) => ({ ...img, isNew: false })));
    setGalleryImages(
      pkg.galleryImages.map((img) => ({ ...img, isNew: false })),
    );
    setRouteMapPreview(pkg.routeMapImageUrl || "");
    setItinerary(pkg.itinerary || []);
    setCostIncludes(pkg.costIncludes || []);
    setCostExcludes(pkg.costExcludes || []);
    setFaqs(pkg.faqs || []);
    setDepartureDates(
      pkg.departureDates?.map((d) => ({
        ...d,
        startDate: d.startDate.split("T")[0],
        endDate: d.endDate.split("T")[0],
        isBestSeller: d.isBestSeller === true,
        isTopSeller: d.isTopSeller === true,
        bookingCount: d.bookingCount || 0,
        isGuaranteed: d.isGuaranteed === true,
      })) || [],
    );
    setGroupDiscounts(pkg.groupDiscounts || []);

    setShowModal(true);
    setActiveTab("hierarchy");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showNotification("Package name is required", "warning");
      return;
    }

    if (!formData.countryId) {
      showNotification("Please select a country", "warning");
      return;
    }

    if (!selectedMainHeading) {
      showNotification("Please select a main heading", "warning");
      return;
    }

    if (!selectedHeading) {
      showNotification("Please select a heading", "warning");
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Append basic fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          formDataToSend.append(key, value.toString());
        }
      });

      // Append hierarchy IDs
      formDataToSend.append("mainHeadingId", selectedMainHeading.toString());
      formDataToSend.append("headingId", selectedHeading.toString());
      if (selectedSubHeading) {
        formDataToSend.append("subHeadingId", selectedSubHeading.toString());
      }

      // Append route map if new
      if (routeMapImage) {
        formDataToSend.append("routeMapImage", routeMapImage);
      }

      // Slider Images
      sliderImages.forEach((img, index) => {
        if (img.id) {
          formDataToSend.append(`sliderImageIds[${index}]`, img.id.toString());
          formDataToSend.append(`sliderTitles[${index}]`, img.title || "");
          formDataToSend.append(`sliderCaptions[${index}]`, img.caption || "");
          formDataToSend.append(`sliderAltTexts[${index}]`, img.altText || "");
          const emptyBlob = new Blob([], { type: "application/octet-stream" });
          formDataToSend.append(`sliderImages`, emptyBlob, "placeholder.jpg");
        } else if (img.file) {
          formDataToSend.append(`sliderImages`, img.file);
          formDataToSend.append(`sliderTitles[${index}]`, img.title || "");
          formDataToSend.append(`sliderCaptions[${index}]`, img.caption || "");
          formDataToSend.append(`sliderAltTexts[${index}]`, img.altText || "");
        }
      });

      // Gallery Images
      galleryImages.forEach((img, index) => {
        if (img.id) {
          formDataToSend.append(`galleryImageIds[${index}]`, img.id.toString());
          formDataToSend.append(`galleryTitles[${index}]`, img.title || "");
          formDataToSend.append(
            `galleryDescriptions[${index}]`,
            img.description || "",
          );
          formDataToSend.append(`galleryAltTexts[${index}]`, img.altText || "");
          if (img.isFeatured) {
            formDataToSend.append(`featuredImageIndices`, index.toString());
          }
          const emptyBlob = new Blob([], { type: "application/octet-stream" });
          formDataToSend.append(`galleryImages`, emptyBlob, "placeholder.jpg");
        } else if (img.file) {
          formDataToSend.append(`galleryImages`, img.file);
          formDataToSend.append(`galleryTitles[${index}]`, img.title || "");
          formDataToSend.append(
            `galleryDescriptions[${index}]`,
            img.description || "",
          );
          formDataToSend.append(`galleryAltTexts[${index}]`, img.altText || "");
          if (img.isFeatured) {
            formDataToSend.append(`featuredImageIndices`, index.toString());
          }
        }
      });

      // Append Itinerary as JSON string
      if (itinerary.length > 0) {
        const itineraryData = itinerary.map((day) => ({
          id: day.id,
          dayNumber: day.dayNumber,
          title: day.title || "",
          description: day.description || "",
          maxAltitude: day.maxAltitude || "",
          accommodation: day.accommodation || "",
          meals: day.meals || "",
          duration: day.duration || "",
          distance: day.distance || "",
        }));
        formDataToSend.append("itineraryJson", JSON.stringify(itineraryData));
      }

      // Append Cost Includes as JSON string
      if (costIncludes.length > 0) {
        const costIncludesData = costIncludes.map((item) => ({
          id: item.id,
          description: item.description,
          category: item.category || "",
          displayOrder: item.displayOrder,
        }));
        formDataToSend.append(
          "costIncludesJson",
          JSON.stringify(costIncludesData),
        );
      }

      // Append Cost Excludes as JSON string
      if (costExcludes.length > 0) {
        const costExcludesData = costExcludes.map((item) => ({
          id: item.id,
          description: item.description,
          category: item.category || "",
          displayOrder: item.displayOrder,
        }));
        formDataToSend.append(
          "costExcludesJson",
          JSON.stringify(costExcludesData),
        );
      }

      // Append FAQs as JSON string
      if (faqs.length > 0) {
        const faqsData = faqs.map((faq) => ({
          id: faq.id,
          question: faq.question,
          answer: faq.answer,
          displayOrder: faq.displayOrder,
        }));
        formDataToSend.append("faqsJson", JSON.stringify(faqsData));
      }

      // Append Departure Dates with proper boolean values
      if (departureDates.length > 0) {
        const departureDatesData = departureDates.map((date) => ({
          id: date.id,
          startDate: date.startDate,
          endDate: date.endDate,
          price:
            typeof date.price === "number"
              ? date.price
              : Number(date.price) || 0,
          discountedPrice: date.discountedPrice
            ? typeof date.discountedPrice === "number"
              ? date.discountedPrice
              : Number(date.discountedPrice)
            : null,
          isGuaranteed: date.isGuaranteed === true,
          notes: date.notes || "",
          isBestSeller: date.isBestSeller === true,
          isTopSeller: date.isTopSeller === true,
          bookingCount:
            typeof date.bookingCount === "number"
              ? date.bookingCount
              : Number(date.bookingCount) || 0,
        }));
        formDataToSend.append(
          "departureDatesJson",
          JSON.stringify(departureDatesData),
        );
      }

      // Append Group Discounts as JSON string
      if (groupDiscounts.length > 0) {
        const groupDiscountsData = groupDiscounts.map((discount) => ({
          id: discount.id,
          minTravelers: discount.minTravelers,
          maxTravelers: discount.maxTravelers,
          pricePerPerson: discount.pricePerPerson,
          discountPercentage: discount.discountPercentage || null,
          description: discount.description || "",
          displayOrder: discount.displayOrder,
        }));
        formDataToSend.append(
          "groupDiscountsJson",
          JSON.stringify(groupDiscountsData),
        );
      }

      if (editingPackage) {
        await api.put(`/api/TrekPackage/${editingPackage.id}`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showNotification("Package updated successfully!", "success");
      } else {
        await api.post("/api/TrekPackage", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showNotification("Package created successfully!", "success");
      }

      setShowModal(false);
      resetForm();
      fetchPackages();
    } catch (error: any) {
      console.error("Error saving package:", error);
      showNotification(
        error.response?.data?.message || "Error saving package",
        "error",
      );
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this package?")) {
      return;
    }

    try {
      await api.delete(`/api/TrekPackage/${id}`);
      showNotification("Package deleted successfully!", "success");
      fetchPackages();
    } catch (error: any) {
      console.error("Error deleting package:", error);
      showNotification(
        error.response?.data?.message || "Error deleting package",
        "error",
      );
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      await api.patch(`/api/TrekPackage/${id}/toggle-status`);
      showNotification(
        `Package ${currentStatus ? "deactivated" : "activated"} successfully!`,
        "success",
      );
      fetchPackages();
    } catch (error: any) {
      console.error("Error toggling package status:", error);
      showNotification(
        error.response?.data?.message || "Error updating status",
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

  const getCountryName = (countryId: number): string => {
    const country = countries.find((c) => c.id === countryId);
    return country?.name || "Unknown";
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
            <p>Loading packages...</p>
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
          <h1 style={styles.pageTitle}>Trek Package Management</h1>
          <div style={styles.topBarRight}>
            <button onClick={openCreateModal} style={styles.addButton}>
              + Add New Package
            </button>
          </div>
        </div>

        {/* Filters */}
        <div style={styles.filtersContainer}>
          <div style={styles.searchWrapper}>
            <input
              type="text"
              placeholder="Search packages by name or description..."
              value={searchTerm}
              onChange={handleSearch}
              style={styles.searchInput}
            />
            <span style={styles.searchIcon}>🔍</span>
          </div>

          <select
            value={selectedCountry}
            onChange={handleCountryFilter}
            style={styles.filterSelect}
          >
            <option value="all">All Countries</option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        {/* Packages Table */}
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>S.N.</th>
                <th style={styles.th}>Package Name</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Country</th>
                <th style={styles.th}>Duration</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPackages.length === 0 ? (
                <tr>
                  <td colSpan={8} style={styles.noData}>
                    No packages found
                  </td>
                </tr>
              ) : (
                filteredPackages.map((pkg, index) => (
                  <tr
                    key={pkg.id}
                    style={{ ...styles.row, opacity: pkg.isActive ? 1 : 0.6 }}
                  >
                    <td style={styles.td}>{index + 1}</td>
                    <td style={styles.td}>
                      <span style={styles.nameCell}>{pkg.name}</span>
                    </td>
                    <td style={styles.td}>
                      {pkg.mainHeadingName} / {pkg.headingName}
                      {pkg.subHeadingName && ` / ${pkg.subHeadingName}`}
                    </td>
                    <td style={styles.td}>{pkg.countryName}</td>
                    <td style={styles.td}>{pkg.durationDays} days</td>
                    <td style={styles.td}>
                      {pkg.discountedPrice ? (
                        <>
                          <span style={styles.originalPrice}>
                            US${pkg.price}
                          </span>
                          <span style={styles.discountedPrice}>
                            {" "}
                            US${pkg.discountedPrice}
                          </span>
                        </>
                      ) : (
                        <>US${pkg.price}</>
                      )}
                    </td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.statusBadge,
                          backgroundColor: pkg.isActive ? "#4caf50" : "#999",
                        }}
                      >
                        {pkg.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actionButtons}>
                        <button
                          onClick={() => openEditModal(pkg)}
                          style={styles.editButton}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() =>
                            handleToggleStatus(pkg.id, pkg.isActive)
                          }
                          style={styles.statusButton}
                          title={pkg.isActive ? "Deactivate" : "Activate"}
                        >
                          {pkg.isActive ? "🔴" : "🟢"}
                        </button>
                        <button
                          onClick={() => handleDelete(pkg.id)}
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
            <div style={styles.modalLarge}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>
                  {editingPackage ? "Edit Package" : "Create New Package"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  style={styles.closeButton}
                >
                  ✕
                </button>
              </div>

              {/* Tabs */}
              <div style={styles.tabsContainer}>
                <button
                  style={{
                    ...styles.tab,
                    ...(activeTab === "hierarchy" ? styles.activeTab : {}),
                  }}
                  onClick={() => setActiveTab("hierarchy")}
                >
                  Category
                </button>
                <button
                  style={{
                    ...styles.tab,
                    ...(activeTab === "basic" ? styles.activeTab : {}),
                  }}
                  onClick={() => setActiveTab("basic")}
                >
                  Basic Info
                </button>
                <button
                  style={{
                    ...styles.tab,
                    ...(activeTab === "media" ? styles.activeTab : {}),
                  }}
                  onClick={() => setActiveTab("media")}
                >
                  Media
                </button>
                <button
                  style={{
                    ...styles.tab,
                    ...(activeTab === "itinerary" ? styles.activeTab : {}),
                  }}
                  onClick={() => setActiveTab("itinerary")}
                >
                  Itinerary
                </button>
                <button
                  style={{
                    ...styles.tab,
                    ...(activeTab === "costs" ? styles.activeTab : {}),
                  }}
                  onClick={() => setActiveTab("costs")}
                >
                  Costs
                </button>
                <button
                  style={{
                    ...styles.tab,
                    ...(activeTab === "faqs" ? styles.activeTab : {}),
                  }}
                  onClick={() => setActiveTab("faqs")}
                >
                  FAQs
                </button>
                <button
                  style={{
                    ...styles.tab,
                    ...(activeTab === "dates" ? styles.activeTab : {}),
                  }}
                  onClick={() => setActiveTab("dates")}
                >
                  Dates & Prices
                </button>
                <button
                  style={{
                    ...styles.tab,
                    ...(activeTab === "groupDiscounts" ? styles.activeTab : {}),
                  }}
                  onClick={() => setActiveTab("groupDiscounts")}
                >
                  Group Discounts
                </button>
              </div>

              <form onSubmit={handleSubmit} style={styles.form}>
                {/* Hierarchy Tab */}
                {activeTab === "hierarchy" && (
                  <div style={styles.tabContent}>
                    <h3 style={styles.sectionTitle}>Select Category</h3>
                    <p style={styles.hierarchyHint}>
                      Select where this package belongs in the website hierarchy
                    </p>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>
                        Main Heading <span style={styles.required}>*</span>
                      </label>
                      <select
                        value={selectedMainHeading}
                        onChange={handleMainHeadingChange}
                        style={styles.select}
                        required
                      >
                        <option value={0}>Select Main Heading</option>
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
                        value={selectedHeading}
                        onChange={handleHeadingChange}
                        style={styles.select}
                        disabled={!selectedMainHeading}
                        required
                      >
                        <option value={0}>Select Heading</option>
                        {filteredHeadings.map((h) => (
                          <option key={h.id} value={h.id}>
                            {h.name}
                          </option>
                        ))}
                      </select>
                      {!selectedMainHeading && (
                        <small style={styles.hint}>
                          First select a main heading
                        </small>
                      )}
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Sub Heading</label>
                      <select
                        value={selectedSubHeading}
                        onChange={handleSubHeadingChange}
                        style={styles.select}
                        disabled={!selectedHeading}
                      >
                        <option value={0}>Select Sub Heading</option>
                        {filteredSubHeadings.map((sh) => (
                          <option key={sh.id} value={sh.id}>
                            {sh.name}
                          </option>
                        ))}
                      </select>
                      {selectedHeading && filteredSubHeadings.length === 0 && (
                        <small style={styles.hint}>
                          No subheadings available for this heading
                        </small>
                      )}
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>
                        Country <span style={styles.required}>*</span>
                      </label>
                      <select
                        name="countryId"
                        value={formData.countryId}
                        onChange={handleInputChange}
                        style={styles.select}
                        required
                      >
                        <option value={0}>Select Country</option>
                        {countries.map((country) => (
                          <option key={country.id} value={country.id}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={styles.modalFooter}>
                      <button
                        type="button"
                        onClick={() => setActiveTab("basic")}
                        style={styles.submitButton}
                        disabled={
                          !selectedMainHeading ||
                          !selectedHeading ||
                          !formData.countryId
                        }
                      >
                        Next: Basic Info →
                      </button>
                    </div>
                  </div>
                )}

                {/* Basic Info Tab */}
                {activeTab === "basic" && (
                  <div style={styles.tabContent}>
                    <div style={styles.formRow}>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>
                          Package Name <span style={styles.required}>*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="e.g., Everest Base Camp Trek 14 Days"
                          style={styles.input}
                          maxLength={200}
                        />
                      </div>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Short Description</label>
                      <textarea
                        name="shortDescription"
                        value={formData.shortDescription}
                        onChange={handleInputChange}
                        placeholder="Brief description for cards and previews"
                        style={styles.textarea}
                        rows={2}
                        maxLength={500}
                      />
                    </div>

                    <div style={styles.formRow}>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Price (USD)</label>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleNumberInputChange}
                          placeholder="1299"
                          style={styles.input}
                          min="0"
                        />
                      </div>

                      <div style={styles.formGroup}>
                        <label style={styles.label}>
                          Discounted Price (USD)
                        </label>
                        <input
                          type="number"
                          name="discountedPrice"
                          value={formData.discountedPrice}
                          onChange={handleNumberInputChange}
                          placeholder="1599"
                          style={styles.input}
                          min="0"
                        />
                      </div>
                    </div>

                    <div style={styles.formRow}>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Duration (Days)</label>
                        <input
                          type="number"
                          name="durationDays"
                          value={formData.durationDays}
                          onChange={handleNumberInputChange}
                          placeholder="14"
                          style={styles.input}
                          min="1"
                        />
                      </div>

                      <div style={styles.formGroup}>
                        <label style={styles.label}>Duration (Nights)</label>
                        <input
                          type="number"
                          name="durationNights"
                          value={formData.durationNights}
                          onChange={handleNumberInputChange}
                          placeholder="13"
                          style={styles.input}
                          min="0"
                        />
                      </div>

                      <div style={styles.formGroup}>
                        <label style={styles.label}>Trip Grade</label>
                        <input
                          type="text"
                          name="tripGrade"
                          value={formData.tripGrade}
                          onChange={handleInputChange}
                          placeholder="Moderate - Strenuous"
                          style={styles.input}
                        />
                      </div>
                    </div>

                    <div style={styles.formRow}>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Maximum Altitude</label>
                        <input
                          type="text"
                          name="maximumAltitude"
                          value={formData.maximumAltitude}
                          onChange={handleInputChange}
                          placeholder="5545 M (Kalapathar)"
                          style={styles.input}
                        />
                      </div>

                      <div style={styles.formGroup}>
                        <label style={styles.label}>Group Size</label>
                        <input
                          type="text"
                          name="groupSize"
                          value={formData.groupSize}
                          onChange={handleInputChange}
                          placeholder="1-30"
                          style={styles.input}
                        />
                      </div>
                    </div>

                    <div style={styles.formRow}>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Starts At</label>
                        <input
                          type="text"
                          name="startsAt"
                          value={formData.startsAt}
                          onChange={handleInputChange}
                          placeholder="Kathmandu"
                          style={styles.input}
                        />
                      </div>

                      <div style={styles.formGroup}>
                        <label style={styles.label}>Ends At</label>
                        <input
                          type="text"
                          name="endsAt"
                          value={formData.endsAt}
                          onChange={handleInputChange}
                          placeholder="Kathmandu"
                          style={styles.input}
                        />
                      </div>
                    </div>

                    <div style={styles.formRow}>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Activities</label>
                        <input
                          type="text"
                          name="activities"
                          value={formData.activities}
                          onChange={handleInputChange}
                          placeholder="Trekking/Hiking"
                          style={styles.input}
                        />
                      </div>

                      <div style={styles.formGroup}>
                        <label style={styles.label}>Best Time</label>
                        <input
                          type="text"
                          name="bestTime"
                          value={formData.bestTime}
                          onChange={handleInputChange}
                          placeholder="Mar-May, Sep-Nov"
                          style={styles.input}
                        />
                      </div>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Overview</label>
                      <textarea
                        name="overview"
                        value={formData.overview}
                        onChange={handleInputChange}
                        placeholder="Detailed overview of the trek..."
                        style={styles.textarea}
                        rows={6}
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Essential Information</label>
                      <textarea
                        name="essentialInformation"
                        value={formData.essentialInformation}
                        onChange={handleInputChange}
                        placeholder="Essential information for trekkers..."
                        style={styles.textarea}
                        rows={6}
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Video Review URL</label>
                      <input
                        type="url"
                        name="videoReviewUrl"
                        value={formData.videoReviewUrl}
                        onChange={handleInputChange}
                        placeholder="https://youtube.com/watch?v=..."
                        style={styles.input}
                      />
                    </div>

                    <div style={styles.modalFooter}>
                      <button
                        type="button"
                        onClick={() => setActiveTab("hierarchy")}
                        style={styles.cancelButton}
                      >
                        ← Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("media")}
                        style={styles.submitButton}
                      >
                        Next: Media →
                      </button>
                    </div>
                  </div>
                )}

                {/* Media Tab */}
                {activeTab === "media" && (
                  <div style={styles.tabContent}>
                    <div style={styles.modalFooter}>
                      <button
                        type="button"
                        onClick={() => setActiveTab("basic")}
                        style={styles.cancelButton}
                      >
                        ← Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("itinerary")}
                        style={styles.submitButton}
                      >
                        Next: Itinerary →
                      </button>
                    </div>

                    <h3 style={styles.sectionTitle}>Route Map</h3>
                    <div style={styles.formGroup}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleRouteMapUpload}
                        style={styles.fileInput}
                      />
                      {routeMapPreview && (
                        <div style={styles.imagePreviewContainer}>
                          <img
                            src={routeMapPreview}
                            alt="Route Map"
                            style={styles.imagePreview}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setRouteMapImage(null);
                              setRouteMapPreview("");
                            }}
                            style={styles.removeImageButton}
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>

                    <h3 style={styles.sectionTitle}>Slider Images</h3>
                    <div style={styles.formGroup}>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleSliderImagesUpload}
                        style={styles.fileInput}
                      />
                      <small style={styles.hint}>
                        Upload multiple images for the hero slider
                      </small>
                    </div>

                    <div style={styles.imageGrid}>
                      {sliderImages.map((img, index) => (
                        <div key={index} style={styles.imageCard}>
                          <img
                            src={
                              img.file
                                ? URL.createObjectURL(img.file)
                                : getFullImageUrl(img.imageUrl)
                            }
                            alt={`Slider ${index + 1}`}
                            style={styles.imageThumb}
                          />
                          <div style={styles.imageDetails}>
                            <input
                              type="text"
                              placeholder="Title"
                              value={img.title || ""}
                              onChange={(e) =>
                                updateSliderImage(
                                  index,
                                  "title",
                                  e.target.value,
                                )
                              }
                              style={styles.imageInput}
                            />
                            <input
                              type="text"
                              placeholder="Caption"
                              value={img.caption || ""}
                              onChange={(e) =>
                                updateSliderImage(
                                  index,
                                  "caption",
                                  e.target.value,
                                )
                              }
                              style={styles.imageInput}
                            />
                            <input
                              type="text"
                              placeholder="Alt Text"
                              value={img.altText || ""}
                              onChange={(e) =>
                                updateSliderImage(
                                  index,
                                  "altText",
                                  e.target.value,
                                )
                              }
                              style={styles.imageInput}
                            />
                            <button
                              type="button"
                              onClick={() => removeSliderImage(index)}
                              style={styles.removeButton}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <h3 style={styles.sectionTitle}>Gallery Images</h3>
                    <div style={styles.formGroup}>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleGalleryImagesUpload}
                        style={styles.fileInput}
                      />
                      <small style={styles.hint}>
                        Upload multiple images for the gallery
                      </small>
                    </div>

                    <div style={styles.imageGrid}>
                      {galleryImages.map((img, index) => (
                        <div key={index} style={styles.imageCard}>
                          <img
                            src={
                              img.file
                                ? URL.createObjectURL(img.file)
                                : getFullImageUrl(img.imageUrl)
                            }
                            alt={`Gallery ${index + 1}`}
                            style={styles.imageThumb}
                          />
                          <div style={styles.imageDetails}>
                            <input
                              type="text"
                              placeholder="Title"
                              value={img.title || ""}
                              onChange={(e) =>
                                updateGalleryImage(
                                  index,
                                  "title",
                                  e.target.value,
                                )
                              }
                              style={styles.imageInput}
                            />
                            <input
                              type="text"
                              placeholder="Description"
                              value={img.description || ""}
                              onChange={(e) =>
                                updateGalleryImage(
                                  index,
                                  "description",
                                  e.target.value,
                                )
                              }
                              style={styles.imageInput}
                            />
                            <input
                              type="text"
                              placeholder="Alt Text"
                              value={img.altText || ""}
                              onChange={(e) =>
                                updateGalleryImage(
                                  index,
                                  "altText",
                                  e.target.value,
                                )
                              }
                              style={styles.imageInput}
                            />
                            <label style={styles.checkboxLabel}>
                              <input
                                type="checkbox"
                                checked={img.isFeatured}
                                onChange={() => toggleFeaturedImage(index)}
                              />
                              Featured Image
                            </label>
                            <button
                              type="button"
                              onClick={() => removeGalleryImage(index)}
                              style={styles.removeButton}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Itinerary Tab */}
                {activeTab === "itinerary" && (
                  <div style={styles.tabContent}>
                    <div style={styles.modalFooter}>
                      <button
                        type="button"
                        onClick={() => setActiveTab("media")}
                        style={styles.cancelButton}
                      >
                        ← Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("costs")}
                        style={styles.submitButton}
                      >
                        Next: Costs →
                      </button>
                    </div>

                    <div style={styles.sectionHeader}>
                      <h3 style={styles.sectionTitle}>Day-by-Day Itinerary</h3>
                      <button
                        type="button"
                        onClick={addItineraryDay}
                        style={styles.addButton}
                      >
                        + Add Day
                      </button>
                    </div>

                    {itinerary.map((day, index) => (
                      <div key={index} style={styles.itineraryCard}>
                        <div style={styles.cardHeader}>
                          <h4 style={styles.cardTitle}>Day {day.dayNumber}</h4>
                          <button
                            type="button"
                            onClick={() => removeItineraryDay(index)}
                            style={styles.removeButton}
                          >
                            Remove
                          </button>
                        </div>
                        <div style={styles.formRow}>
                          <div style={styles.formGroup}>
                            <label style={styles.label}>Title</label>
                            <input
                              type="text"
                              value={day.title || ""}
                              onChange={(e) =>
                                updateItineraryDay(
                                  index,
                                  "title",
                                  e.target.value,
                                )
                              }
                              placeholder="e.g., Namche Bazaar → Tengboche"
                              style={styles.input}
                            />
                          </div>
                        </div>
                        <div style={styles.formGroup}>
                          <label style={styles.label}>Description</label>
                          <textarea
                            value={day.description || ""}
                            onChange={(e) =>
                              updateItineraryDay(
                                index,
                                "description",
                                e.target.value,
                              )
                            }
                            placeholder="Detailed description of the day..."
                            style={styles.textarea}
                            rows={3}
                          />
                        </div>
                        <div style={styles.formRow}>
                          <div style={styles.formGroup}>
                            <label style={styles.label}>Max Altitude</label>
                            <input
                              type="text"
                              value={day.maxAltitude || ""}
                              onChange={(e) =>
                                updateItineraryDay(
                                  index,
                                  "maxAltitude",
                                  e.target.value,
                                )
                              }
                              placeholder="3,860 m"
                              style={styles.input}
                            />
                          </div>
                          <div style={styles.formGroup}>
                            <label style={styles.label}>Accommodation</label>
                            <input
                              type="text"
                              value={day.accommodation || ""}
                              onChange={(e) =>
                                updateItineraryDay(
                                  index,
                                  "accommodation",
                                  e.target.value,
                                )
                              }
                              placeholder="Himalaya Lodge"
                              style={styles.input}
                            />
                          </div>
                        </div>
                        <div style={styles.formRow}>
                          <div style={styles.formGroup}>
                            <label style={styles.label}>Meals</label>
                            <input
                              type="text"
                              value={day.meals || ""}
                              onChange={(e) =>
                                updateItineraryDay(
                                  index,
                                  "meals",
                                  e.target.value,
                                )
                              }
                              placeholder="Breakfast, Lunch, Dinner"
                              style={styles.input}
                            />
                          </div>
                          <div style={styles.formGroup}>
                            <label style={styles.label}>Duration</label>
                            <input
                              type="text"
                              value={day.duration || ""}
                              onChange={(e) =>
                                updateItineraryDay(
                                  index,
                                  "duration",
                                  e.target.value,
                                )
                              }
                              placeholder="5-6 hours"
                              style={styles.input}
                            />
                          </div>
                          <div style={styles.formGroup}>
                            <label style={styles.label}>Distance</label>
                            <input
                              type="text"
                              value={day.distance || ""}
                              onChange={(e) =>
                                updateItineraryDay(
                                  index,
                                  "distance",
                                  e.target.value,
                                )
                              }
                              placeholder="9.2 kilometers"
                              style={styles.input}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Costs Tab */}
                {activeTab === "costs" && (
                  <div style={styles.tabContent}>
                    <div style={styles.modalFooter}>
                      <button
                        type="button"
                        onClick={() => setActiveTab("itinerary")}
                        style={styles.cancelButton}
                      >
                        ← Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("faqs")}
                        style={styles.submitButton}
                      >
                        Next: FAQs →
                      </button>
                    </div>

                    <div style={styles.sectionHeader}>
                      <h3 style={styles.sectionTitle}>Cost Includes</h3>
                      <button
                        type="button"
                        onClick={addCostInclude}
                        style={styles.addButton}
                      >
                        + Add Include
                      </button>
                    </div>

                    {costIncludes.map((item, index) => (
                      <div key={index} style={styles.costItem}>
                        <div style={styles.formRow}>
                          <div style={styles.formGroup}>
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) =>
                                updateCostInclude(
                                  index,
                                  "description",
                                  e.target.value,
                                )
                              }
                              placeholder="Description"
                              style={styles.input}
                            />
                          </div>
                          <div style={styles.formGroup}>
                            <input
                              type="text"
                              value={item.category || ""}
                              onChange={(e) =>
                                updateCostInclude(
                                  index,
                                  "category",
                                  e.target.value,
                                )
                              }
                              placeholder="Category (e.g., Food)"
                              style={styles.input}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeCostInclude(index)}
                            style={styles.removeButton}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}

                    <div style={styles.sectionHeader}>
                      <h3 style={styles.sectionTitle}>Cost Excludes</h3>
                      <button
                        type="button"
                        onClick={addCostExclude}
                        style={styles.addButton}
                      >
                        + Add Exclude
                      </button>
                    </div>

                    {costExcludes.map((item, index) => (
                      <div key={index} style={styles.costItem}>
                        <div style={styles.formRow}>
                          <div style={styles.formGroup}>
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) =>
                                updateCostExclude(
                                  index,
                                  "description",
                                  e.target.value,
                                )
                              }
                              placeholder="Description"
                              style={styles.input}
                            />
                          </div>
                          <div style={styles.formGroup}>
                            <input
                              type="text"
                              value={item.category || ""}
                              onChange={(e) =>
                                updateCostExclude(
                                  index,
                                  "category",
                                  e.target.value,
                                )
                              }
                              placeholder="Category"
                              style={styles.input}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeCostExclude(index)}
                            style={styles.removeButton}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* FAQs Tab */}
                {activeTab === "faqs" && (
                  <div style={styles.tabContent}>
                    <div style={styles.modalFooter}>
                      <button
                        type="button"
                        onClick={() => setActiveTab("costs")}
                        style={styles.cancelButton}
                      >
                        ← Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("dates")}
                        style={styles.submitButton}
                      >
                        Next: Dates & Prices →
                      </button>
                    </div>

                    <div style={styles.sectionHeader}>
                      <h3 style={styles.sectionTitle}>
                        Frequently Asked Questions
                      </h3>
                      <button
                        type="button"
                        onClick={addFaq}
                        style={styles.addButton}
                      >
                        + Add FAQ
                      </button>
                    </div>

                    {faqs.map((faq, index) => (
                      <div key={index} style={styles.faqCard}>
                        <div style={styles.cardHeader}>
                          <h4 style={styles.cardTitle}>FAQ #{index + 1}</h4>
                          <button
                            type="button"
                            onClick={() => removeFaq(index)}
                            style={styles.removeButton}
                          >
                            Remove
                          </button>
                        </div>
                        <div style={styles.formGroup}>
                          <label style={styles.label}>Question</label>
                          <input
                            type="text"
                            value={faq.question}
                            onChange={(e) =>
                              updateFaq(index, "question", e.target.value)
                            }
                            placeholder="Enter question"
                            style={styles.input}
                          />
                        </div>
                        <div style={styles.formGroup}>
                          <label style={styles.label}>Answer</label>
                          <textarea
                            value={faq.answer}
                            onChange={(e) =>
                              updateFaq(index, "answer", e.target.value)
                            }
                            placeholder="Enter answer"
                            style={styles.textarea}
                            rows={3}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Dates & Prices Tab */}
                {activeTab === "dates" && (
                  <div style={styles.tabContent}>
                    <div style={styles.modalFooter}>
                      <button
                        type="button"
                        onClick={() => setActiveTab("faqs")}
                        style={styles.cancelButton}
                      >
                        ← Back
                      </button>
                    </div>

                    <div style={styles.sectionHeader}>
                      <h3 style={styles.sectionTitle}>
                        Departure Dates & Prices
                      </h3>
                      <button
                        type="button"
                        onClick={addDepartureDate}
                        style={styles.addButton}
                      >
                        + Add Date
                      </button>
                    </div>

                    {departureDates.map((date, index) => (
                      <div key={index} style={styles.dateCard}>
                        <div style={styles.cardHeader}>
                          <h4 style={styles.cardTitle}>
                            Departure #{index + 1}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeDepartureDate(index)}
                            style={styles.removeButton}
                          >
                            Remove
                          </button>
                        </div>
                        <div style={styles.formRow}>
                          <div style={styles.formGroup}>
                            <label style={styles.label}>Start Date</label>
                            <input
                              type="date"
                              value={date.startDate}
                              onChange={(e) =>
                                updateDepartureDate(
                                  index,
                                  "startDate",
                                  e.target.value,
                                )
                              }
                              style={styles.input}
                            />
                          </div>
                          <div style={styles.formGroup}>
                            <label style={styles.label}>End Date</label>
                            <input
                              type="date"
                              value={date.endDate}
                              onChange={(e) =>
                                updateDepartureDate(
                                  index,
                                  "endDate",
                                  e.target.value,
                                )
                              }
                              style={styles.input}
                            />
                          </div>
                        </div>
                        <div style={styles.formRow}>
                          <div style={styles.formGroup}>
                            <label style={styles.label}>Price (USD)</label>
                            <input
                              type="number"
                              value={date.price}
                              onChange={(e) =>
                                updateDepartureDate(
                                  index,
                                  "price",
                                  parseFloat(e.target.value),
                                )
                              }
                              style={styles.input}
                              min="0"
                            />
                          </div>
                          <div style={styles.formGroup}>
                            <label style={styles.label}>Discounted Price</label>
                            <input
                              type="number"
                              value={date.discountedPrice || ""}
                              onChange={(e) =>
                                updateDepartureDate(
                                  index,
                                  "discountedPrice",
                                  e.target.value
                                    ? parseFloat(e.target.value)
                                    : 0,
                                )
                              }
                              style={styles.input}
                              min="0"
                            />
                          </div>
                        </div>

                        <div style={styles.formRow}>
                          <div style={styles.formGroup}>
                            <label style={styles.checkboxLabel}>
                              <input
                                type="checkbox"
                                checked={date.isBestSeller || false}
                                onChange={(e) =>
                                  updateDepartureDate(
                                    index,
                                    "isBestSeller",
                                    e.target.checked,
                                  )
                                }
                              />
                              Best Seller
                            </label>
                          </div>
                          <div style={styles.formGroup}>
                            <label style={styles.checkboxLabel}>
                              <input
                                type="checkbox"
                                checked={date.isTopSeller || false}
                                onChange={(e) =>
                                  updateDepartureDate(
                                    index,
                                    "isTopSeller",
                                    e.target.checked,
                                  )
                                }
                              />
                              Top Seller
                            </label>
                          </div>
                          <div style={styles.formGroup}>
                            <label style={styles.label}>Booking Count</label>
                            <input
                              type="number"
                              value={date.bookingCount || 0}
                              onChange={(e) =>
                                updateDepartureDate(
                                  index,
                                  "bookingCount",
                                  parseInt(e.target.value) || 0,
                                )
                              }
                              style={styles.input}
                              min="0"
                            />
                          </div>
                        </div>

                        <div style={styles.formRow}>
                          <div style={styles.formGroup}>
                            <label style={styles.checkboxLabel}>
                              <input
                                type="checkbox"
                                checked={date.isGuaranteed}
                                onChange={(e) =>
                                  updateDepartureDate(
                                    index,
                                    "isGuaranteed",
                                    e.target.checked,
                                  )
                                }
                              />
                              Guaranteed Departure
                            </label>
                          </div>
                        </div>
                        <div style={styles.formGroup}>
                          <label style={styles.label}>Notes</label>
                          <input
                            type="text"
                            value={date.notes || ""}
                            onChange={(e) =>
                              updateDepartureDate(
                                index,
                                "notes",
                                e.target.value,
                              )
                            }
                            placeholder="Additional notes"
                            style={styles.input}
                          />
                        </div>
                      </div>
                    ))}

                    <div style={styles.modalFooter}>
                      <button
                        type="button"
                        onClick={() => setActiveTab("groupDiscounts")}
                        style={styles.submitButton}
                      >
                        Next: Group Discounts →
                      </button>
                    </div>
                  </div>
                )}

                {/* Group Discounts Tab */}
                {activeTab === "groupDiscounts" && (
                  <div style={styles.tabContent}>
                    <div style={styles.modalFooter}>
                      <button
                        type="button"
                        onClick={() => setActiveTab("dates")}
                        style={styles.cancelButton}
                      >
                        ← Back
                      </button>
                    </div>

                    <div style={styles.sectionHeader}>
                      <h3 style={styles.sectionTitle}>
                        Group Discount Pricing
                      </h3>
                      <button
                        type="button"
                        onClick={addGroupDiscount}
                        style={styles.addButton}
                      >
                        + Add Discount Tier
                      </button>
                    </div>

                    {groupDiscounts.length === 0 && (
                      <p style={styles.hint}>
                        Add group discount tiers based on group size. Example:
                        1-2 pax: $1000, 3-5 pax: $900
                      </p>
                    )}

                    {groupDiscounts.map((discount, index) => (
                      <div key={index} style={styles.discountCard}>
                        <div style={styles.cardHeader}>
                          <h4 style={styles.cardTitle}>
                            Tier {index + 1}: {discount.minTravelers} -{" "}
                            {discount.maxTravelers} travelers
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeGroupDiscount(index)}
                            style={styles.removeButton}
                          >
                            Remove
                          </button>
                        </div>

                        <div style={styles.formRow}>
                          <div style={styles.formGroup}>
                            <label style={styles.label}>Min Travelers</label>
                            <input
                              type="number"
                              value={discount.minTravelers}
                              onChange={(e) =>
                                updateGroupDiscount(
                                  index,
                                  "minTravelers",
                                  parseInt(e.target.value) || 1,
                                )
                              }
                              style={styles.input}
                              min="1"
                            />
                          </div>

                          <div style={styles.formGroup}>
                            <label style={styles.label}>Max Travelers</label>
                            <input
                              type="number"
                              value={discount.maxTravelers}
                              onChange={(e) =>
                                updateGroupDiscount(
                                  index,
                                  "maxTravelers",
                                  parseInt(e.target.value) ||
                                  discount.minTravelers,
                                )
                              }
                              style={styles.input}
                              min={discount.minTravelers}
                            />
                          </div>

                          <div style={styles.formGroup}>
                            <label style={styles.label}>
                              Price Per Person (USD)
                            </label>
                            <input
                              type="number"
                              value={discount.pricePerPerson}
                              onChange={(e) =>
                                updateGroupDiscount(
                                  index,
                                  "pricePerPerson",
                                  parseFloat(e.target.value) || 0,
                                )
                              }
                              style={styles.input}
                              min="0"
                              step="0.01"
                            />
                          </div>
                        </div>

                        <div style={styles.formRow}>
                          <div style={styles.formGroup}>
                            <label style={styles.label}>
                              Discount Percentage (Optional)
                            </label>
                            <input
                              type="number"
                              value={discount.discountPercentage || ""}
                              onChange={(e) =>
                                updateGroupDiscount(
                                  index,
                                  "discountPercentage",
                                  e.target.value
                                    ? parseFloat(e.target.value)
                                    : 0,
                                )
                              }
                              style={styles.input}
                              min="0"
                              max="100"
                              step="0.1"
                              placeholder="e.g., 10 for 10% off"
                            />
                          </div>

                          <div style={styles.formGroup}>
                            <label style={styles.label}>Description</label>
                            <input
                              type="text"
                              value={discount.description || ""}
                              onChange={(e) =>
                                updateGroupDiscount(
                                  index,
                                  "description",
                                  e.target.value,
                                )
                              }
                              style={styles.input}
                              placeholder="e.g., Group discount for families"
                            />
                          </div>
                        </div>

                        {discount.pricePerPerson > 0 && (
                          <div style={styles.discountPreview}>
                            <strong>
                              Total for {discount.maxTravelers} travelers:
                            </strong>{" "}
                            US$
                            {(
                              discount.pricePerPerson * discount.maxTravelers
                            ).toLocaleString()}
                            {discount.discountPercentage && (
                              <span style={styles.discountBadge}>
                                {discount.discountPercentage}% off regular price
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}

                    <div style={styles.modalFooter}>
                      <button type="submit" style={styles.submitButton}>
                        {editingPackage ? "Update Package" : "Create Package"}
                      </button>
                    </div>
                  </div>
                )}
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

// Styles
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
  originalPrice: {
    textDecoration: "line-through",
    color: "#999",
    marginRight: "5px",
  },
  discountedPrice: {
    color: "#e67e22",
    fontWeight: "bold",
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
  actionButtons: {
    display: "flex",
    gap: "5px",
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
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 1000,
  },
  modalLarge: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "30px",
    width: "90%",
    maxWidth: "1000px",
    maxHeight: "90vh",
    overflowY: "auto",
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
  },
  tabsContainer: {
    display: "flex",
    gap: "5px",
    marginBottom: "20px",
    borderBottom: "2px solid #e0e0e0",
    paddingBottom: "10px",
    flexWrap: "wrap",
  },
  tab: {
    padding: "8px 16px",
    border: "none",
    backgroundColor: "transparent",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
    color: "#666",
  },
  activeTab: {
    backgroundColor: "#e67e22",
    color: "white",
  },
  tabContent: {
    maxHeight: "60vh",
    overflowY: "auto",
    padding: "10px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  formRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    flex: 1,
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
    marginTop: "2px",
  },
  hierarchyHint: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "20px",
    fontStyle: "italic",
  },
  fileInput: {
    padding: "10px",
    fontSize: "14px",
    border: "1px solid #e0e0e0",
    borderRadius: "6px",
    backgroundColor: "white",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#2c3e50",
    margin: "20px 0 10px 0",
  },
  imageGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
    marginTop: "15px",
  },
  imageCard: {
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    padding: "10px",
    backgroundColor: "#f8f9fa",
  },
  imageThumb: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
    borderRadius: "4px",
    marginBottom: "10px",
  },
  imageDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  imageInput: {
    padding: "5px",
    fontSize: "12px",
    border: "1px solid #e0e0e0",
    borderRadius: "4px",
  },
  imagePreviewContainer: {
    marginTop: "10px",
    position: "relative",
    display: "inline-block",
  },
  imagePreview: {
    maxWidth: "200px",
    maxHeight: "200px",
    borderRadius: "4px",
  },
  removeImageButton: {
    position: "absolute",
    top: "5px",
    right: "5px",
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    padding: "2px 5px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "14px",
    color: "#2c3e50",
    cursor: "pointer",
  },
  itineraryCard: {
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "15px",
    backgroundColor: "#f8f9fa",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  cardTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#2c3e50",
    margin: 0,
  },
  removeButton: {
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    padding: "4px 8px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
  },
  costItem: {
    marginBottom: "10px",
  },
  faqCard: {
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "15px",
    backgroundColor: "#f8f9fa",
  },
  dateCard: {
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "15px",
    backgroundColor: "#f8f9fa",
  },
  discountCard: {
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "15px",
    backgroundColor: "#f8f9fa",
  },
  discountPreview: {
    marginTop: "10px",
    padding: "8px",
    backgroundColor: "#e8f5e9",
    borderRadius: "4px",
    fontSize: "13px",
    color: "#2c3e50",
  },
  discountBadge: {
    display: "inline-block",
    marginLeft: "10px",
    padding: "2px 8px",
    backgroundColor: "#e67e22",
    color: "white",
    borderRadius: "12px",
    fontSize: "11px",
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

// Add global styles for animations
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

export default TrekPackageManager;
