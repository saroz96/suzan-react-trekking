"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import NotificationToast from "@/NotificationToast";
import Footer from "@/pages/Footer";
// import NotificationToast from "@/components/NotificationToast";
// import Footer from "@/components/Footer";

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
  packageCount: number;
  mainHeadingName?: string;
  headingName?: string;
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
  sliderImages: {
    id: number;
    imageUrl: string;
    title?: string;
    caption?: string;
    altText?: string;
    displayOrder: number;
  }[];
  isBestSeller?: boolean;
  isTopSeller?: boolean;
  hasGuaranteedDeparture?: boolean;
}

const PackageListBySubHeading: React.FC = () => {
  const params = useParams();
  const mainHeading = params.mainHeading as string;
  const heading = params.heading as string;
  const subHeading = params.subHeading as string;

  const [subHeadingData, setSubHeadingData] = useState<SubHeading | null>(null);
  const [mainHeadingData, setMainHeadingData] = useState<MainHeading | null>(
    null,
  );
  const [headingData, setHeadingData] = useState<Heading | null>(null);
  const [packages, setPackages] = useState<TrekPackage[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<TrekPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<
    "popular" | "price-low" | "price-high" | "duration"
  >("popular");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [durationRange, setDurationRange] = useState<[number, number]>([0, 30]);
  const [selectedGrade, setSelectedGrade] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [currentHeroImageIndex, setCurrentHeroImageIndex] = useState(0);
  const [heroImages, setHeroImages] = useState<
    {
      imageUrl: string;
      title?: string;
      caption?: string;
      packageName: string;
    }[]
  >([]);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error" | "warning",
  });
  const [windowWidth, setWindowWidth] = useState(0);

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

  // Helper function to convert slug back to name
  const slugToName = (slug: string): string => {
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (mainHeading && heading && subHeading) {
      fetchData();
    }
  }, [mainHeading, heading, subHeading]);

  useEffect(() => {
    filterAndSortPackages();
  }, [packages, searchTerm, sortBy, priceRange, durationRange, selectedGrade]);

  // Auto-slide functionality for hero section
  useEffect(() => {
    if (heroImages.length === 0) return;
    const interval = setInterval(() => {
      setCurrentHeroImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [heroImages]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const mainHeadingName = slugToName(mainHeading!);
      const headingName = slugToName(heading!);
      const subHeadingName = slugToName(subHeading!);

      const allSubHeadingsRes = await fetch(`${API_BASE_URL}/api/SubHeading`);
      const allSubHeadingsData = await allSubHeadingsRes.json();

      const foundSubHeading = allSubHeadingsData.find(
        (sh: any) =>
          sh.name.toLowerCase() === subHeadingName.toLowerCase() &&
          sh.headingName?.toLowerCase() === headingName.toLowerCase() &&
          sh.mainHeadingName?.toLowerCase() === mainHeadingName.toLowerCase(),
      );

      if (!foundSubHeading) {
        throw new Error("Subheading not found");
      }

      setSubHeadingData(foundSubHeading);
      setMainHeadingData({
        id: foundSubHeading.mainHeadingId,
        name: foundSubHeading.mainHeadingName,
      });
      setHeadingData({
        id: foundSubHeading.headingId,
        name: foundSubHeading.headingName,
        mainHeadingId: foundSubHeading.mainHeadingId,
      });

      const packagesRes = await fetch(
        `${API_BASE_URL}/api/TrekPackage/by-subheading/${foundSubHeading.id}`,
      );
      const packagesData = await packagesRes.json();
      setPackages(packagesData);
      setFilteredPackages(packagesData);

      // Extract all images from all packages for hero slider
      const allImages: {
        imageUrl: string;
        title?: string;
        caption?: string;
        packageName: string;
      }[] = [];
      packagesData.forEach((pkg: TrekPackage) => {
        if (pkg.sliderImages && pkg.sliderImages.length > 0) {
          pkg.sliderImages.forEach((img) => {
            allImages.push({
              imageUrl: img.imageUrl,
              title: img.title,
              caption: img.caption,
              packageName: pkg.name,
            });
          });
        }
      });
      setHeroImages(allImages);

      if (packagesData.length > 0) {
        const prices = packagesData.map(
          (p: any) => p.discountedPrice || p.price || 0,
        );
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        setPriceRange([minPrice, maxPrice]);

        const durations = packagesData.map((p: any) => p.durationDays || 0);
        const minDuration = Math.min(...durations);
        const maxDuration = Math.max(...durations);
        setDurationRange([minDuration, maxDuration]);
      }
    } catch (error: any) {
      console.error("Error fetching data:", error);
      showNotification(error.message || "Error loading packages", "error");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortPackages = () => {
    let filtered = [...packages];

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    filtered = filtered.filter((p) => {
      const price = p.discountedPrice || p.price || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    filtered = filtered.filter((p) => {
      const duration = p.durationDays || 0;
      return duration >= durationRange[0] && duration <= durationRange[1];
    });

    if (selectedGrade !== "all") {
      filtered = filtered.filter((p) => p.tripGrade === selectedGrade);
    }

    switch (sortBy) {
      case "price-low":
        filtered.sort(
          (a, b) =>
            (a.discountedPrice || a.price || 0) -
            (b.discountedPrice || b.price || 0),
        );
        break;
      case "price-high":
        filtered.sort(
          (a, b) =>
            (b.discountedPrice || b.price || 0) -
            (a.discountedPrice || a.price || 0),
        );
        break;
      case "duration":
        filtered.sort((a, b) => (a.durationDays || 0) - (b.durationDays || 0));
        break;
      default:
        filtered.sort(
          (a, b) =>
            (b.sliderImages?.length || 0) - (a.sliderImages?.length || 0),
        );
        break;
    }

    setFilteredPackages(filtered);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as any);
  };

  const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGrade(e.target.value);
  };

  const handlePriceRangeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: 0 | 1,
  ) => {
    const newRange: [number, number] = [...priceRange];
    newRange[index] = parseInt(e.target.value) || 0;
    setPriceRange(newRange);
  };

  const handleDurationRangeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: 0 | 1,
  ) => {
    const newRange: [number, number] = [...durationRange];
    newRange[index] = parseInt(e.target.value) || 0;
    setDurationRange(newRange);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSortBy("popular");
    setSelectedGrade("all");
    if (packages.length > 0) {
      const prices = packages.map((p) => p.discountedPrice || p.price || 0);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      setPriceRange([minPrice, maxPrice]);

      const durations = packages.map((p) => p.durationDays || 0);
      const minDuration = Math.min(...durations);
      const maxDuration = Math.max(...durations);
      setDurationRange([minDuration, maxDuration]);
    }
  };

  const nextHeroImage = () => {
    setCurrentHeroImageIndex((prev) => (prev + 1) % heroImages.length);
  };

  const prevHeroImage = () => {
    setCurrentHeroImageIndex(
      (prev) => (prev - 1 + heroImages.length) % heroImages.length,
    );
  };

  const showNotification = (
    message: string,
    type: "success" | "error" | "warning",
  ) => {
    setNotification({ show: true, message, type });
  };

  const uniqueGrades = [
    ...new Set(packages.map((p) => p.tripGrade).filter(Boolean)),
  ];

  const createSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const getRandomRating = (id: number) => {
    const ratings = [4.5, 4.8, 4.3, 4.9, 4.2, 4.7];
    const reviews = [12, 39, 17, 24, 8, 31];
    return {
      rating: ratings[id % ratings.length],
      reviews: reviews[id % reviews.length],
    };
  };

  if (loading) {
    return (
      <div className="package-list-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading packages...</p>
        </div>
        <style jsx>{styles}</style>
      </div>
    );
  }

  if (!subHeadingData) {
    return (
      <div className="package-list-container">
        <div className="not-found-container">
          <h2>Subheading Not Found</h2>
          <p>The requested subheading could not be found.</p>
          <Link href="/" className="home-button">
            Go Home
          </Link>
        </div>
        <style jsx>{styles}</style>
      </div>
    );
  }

  const currentHeroImage = heroImages[currentHeroImageIndex] || null;

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

      <div className="package-list-container">
        {/* Hero Section with Slider */}
        <div className="hero-section">
          {currentHeroImage && (
            <>
              <div className="hero-image-wrapper">
                <Image
                  src={getFullImageUrl(currentHeroImage.imageUrl)}
                  alt={currentHeroImage.title || currentHeroImage.packageName}
                  fill
                  className="hero-background-image"
                  priority
                  unoptimized
                />
              </div>
              <div className="hero-overlay">
                <div className="hero-content">
                  <h1 className="hero-title">{subHeadingData?.name}</h1>
                  <p className="hero-subtitle">
                    {mainHeadingData?.name} / {headingData?.name} /{" "}
                    {subHeadingData?.name}
                  </p>
                  <div className="stats-badge">
                    <span className="stats-icon">🏔️</span>
                    <span className="stats-text">
                      {filteredPackages.length} Package
                      {filteredPackages.length !== 1 ? "s" : ""} Available
                    </span>
                  </div>
                  {currentHeroImage.caption && (
                    <div className="image-caption">
                      {currentHeroImage.caption}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Navigation Arrows */}
          {heroImages.length > 1 && (
            <>
              <button
                onClick={prevHeroImage}
                className="hero-arrow hero-arrow-prev"
              >
                ❮
              </button>
              <button
                onClick={nextHeroImage}
                className="hero-arrow hero-arrow-next"
              >
                ❯
              </button>
              <div className="hero-indicators">
                {heroImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentHeroImageIndex(idx)}
                    className={`hero-indicator ${currentHeroImageIndex === idx ? "active" : ""}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link href="/" className="breadcrumb-link">
            Home
          </Link>
          <span className="breadcrumb-separator">/</span>
          <Link
            href={`/${createSlug(mainHeadingData?.name || "")}`}
            className="breadcrumb-link"
          >
            {mainHeadingData?.name}
          </Link>
          <span className="breadcrumb-separator">/</span>
          <Link
            href={`/${createSlug(mainHeadingData?.name || "")}/${createSlug(headingData?.name || "")}`}
            className="breadcrumb-link"
          >
            {headingData?.name}
          </Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{subHeadingData?.name}</span>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Mobile Filter Toggle */}
          <button
            className="mobile-filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <span>🔍 Filter & Sort</span>
            <span>{showFilters ? "−" : "+"}</span>
          </button>

          <div className="content-wrapper">
            {/* Filters Sidebar */}
            <div
              className={`filters-sidebar ${showFilters ? "show" : ""}`}
              style={{
                display:
                  windowWidth <= 768
                    ? showFilters
                      ? "block"
                      : "none"
                    : "block",
              }}
            >
              <div className="filters-header">
                <h3 className="filters-title">Filter Packages</h3>
                <button onClick={resetFilters} className="reset-button">
                  Reset
                </button>
              </div>

              <div className="filter-section">
                <label className="filter-label">Search</label>
                <input
                  type="text"
                  placeholder="Search packages..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="search-input"
                />
              </div>

              <div className="filter-section">
                <label className="filter-label">Sort By</label>
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="select"
                >
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="duration">Duration: Short to Long</option>
                </select>
              </div>

              <div className="filter-section">
                <label className="filter-label">Price Range (USD)</label>
                <div className="range-inputs">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceRangeChange(e, 0)}
                    min={0}
                    className="range-input"
                  />
                  <span className="range-separator">-</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceRangeChange(e, 1)}
                    min={priceRange[0]}
                    className="range-input"
                  />
                </div>
                <div className="range-slider">
                  <input
                    type="range"
                    min={0}
                    max={5000}
                    value={priceRange[0]}
                    onChange={(e) => handlePriceRangeChange(e, 0)}
                    className="slider"
                  />
                  <input
                    type="range"
                    min={0}
                    max={5000}
                    value={priceRange[1]}
                    onChange={(e) => handlePriceRangeChange(e, 1)}
                    className="slider"
                  />
                </div>
              </div>

              <div className="filter-section">
                <label className="filter-label">Duration (Days)</label>
                <div className="range-inputs">
                  <input
                    type="number"
                    value={durationRange[0]}
                    onChange={(e) => handleDurationRangeChange(e, 0)}
                    min={0}
                    className="range-input"
                  />
                  <span className="range-separator">-</span>
                  <input
                    type="number"
                    value={durationRange[1]}
                    onChange={(e) => handleDurationRangeChange(e, 1)}
                    min={durationRange[0]}
                    className="range-input"
                  />
                </div>
                <div className="range-slider">
                  <input
                    type="range"
                    min={0}
                    max={30}
                    value={durationRange[0]}
                    onChange={(e) => handleDurationRangeChange(e, 0)}
                    className="slider"
                  />
                  <input
                    type="range"
                    min={0}
                    max={30}
                    value={durationRange[1]}
                    onChange={(e) => handleDurationRangeChange(e, 1)}
                    className="slider"
                  />
                </div>
              </div>

              {uniqueGrades.length > 0 && (
                <div className="filter-section">
                  <label className="filter-label">Trip Grade</label>
                  <select
                    value={selectedGrade}
                    onChange={handleGradeChange}
                    className="select"
                  >
                    <option value="all">All Grades</option>
                    {uniqueGrades.map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Packages Grid */}
            <div className="packages-container">
              <div className="results-summary">
                <p className="results-text">
                  Showing <strong>{filteredPackages.length}</strong> of{" "}
                  <strong>{packages.length}</strong> packages
                </p>
              </div>

              {filteredPackages.length === 0 ? (
                <div className="no-results">
                  <p className="no-results-text">
                    No packages match your filters
                  </p>
                  <button onClick={resetFilters} className="reset-button-large">
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="packages-grid">
                  {filteredPackages.map((pkg) => {
                    const { rating, reviews } = getRandomRating(pkg.id);
                    return (
                      <Link
                        href={`/trip/${createSlug(pkg.name)}-${pkg.id}`}
                        key={pkg.id}
                        className="package-card"
                      >
                        <div className="image-container">
                          {pkg.sliderImages && pkg.sliderImages.length > 0 ? (
                            <Image
                              src={getFullImageUrl(
                                pkg.sliderImages[0].imageUrl,
                              )}
                              alt={pkg.name}
                              fill
                              className="package-image"
                              unoptimized
                            />
                          ) : (
                            <div className="no-image">
                              <span>🏔️</span>
                            </div>
                          )}
                          <div className="top-badges">
                            {pkg.isBestSeller && (
                              <span className="bestseller-badge">
                                Best Seller
                              </span>
                            )}
                            {pkg.isTopSeller && (
                              <span className="topseller-badge">TOPSELLER</span>
                            )}
                            {pkg.hasGuaranteedDeparture && (
                              <span className="guaranteed-badge">
                                Guaranteed Departures
                              </span>
                            )}
                          </div>
                          <div className="duration-container">
                            <span className="duration-number">
                              {pkg.durationDays}
                            </span>
                            <span className="duration-text">Days</span>
                          </div>
                          {pkg.discountedPrice &&
                            pkg.price &&
                            pkg.discountedPrice < pkg.price && (
                              <div className="discount-container">
                                <span className="discount-text">
                                  Save $
                                  {(pkg.price - pkg.discountedPrice).toFixed(0)}
                                </span>
                              </div>
                            )}
                        </div>
                        <div className="content-section">
                          <h3 className="card-title">{pkg.name}</h3>
                          <div className="rating-container">
                            <div className="stars">
                              {"★".repeat(Math.floor(rating))}
                              {rating % 1 !== 0 && "½"}
                              {"☆".repeat(5 - Math.ceil(rating))}
                            </div>
                            <span className="rating-text">{rating}</span>
                            <span className="review-count">
                              ({reviews} reviews)
                            </span>
                          </div>
                          <div className="price-row">
                            <span className="price-label">Price from</span>
                            <div className="price-container">
                              {pkg.discountedPrice ? (
                                <>
                                  <span className="original-price">
                                    US${pkg.price}
                                  </span>
                                  <span className="discounted-price">
                                    US${pkg.discountedPrice}
                                  </span>
                                </>
                              ) : (
                                <span className="discounted-price">
                                  US${pkg.price}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="view-details">
                            View Details <span className="arrow">→</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Region Information */}
        {subHeadingData?.description && (
          <div className="region-info">
            <div className="region-info-content">
              <h2 className="region-info-title">About {subHeadingData.name}</h2>
              <p className="region-info-text">{subHeadingData.description}</p>
            </div>
          </div>
        )}

        <Footer />

        <NotificationToast
          show={notification.show}
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ ...notification, show: false })}
        />
      </div>
    </>
  );
};

const styles = `
  .package-list-container {
    min-height: 100vh;
    background-color: #f8f9fa;
    font-family: Arial, sans-serif;
  }

  .not-found-container {
    text-align: center;
    padding: 100px 20px;
    background-color: #f8f9fa;
    min-height: 60vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .home-button {
    display: inline-block;
    background-color: #e67e22;
    color: white;
    text-decoration: none;
    padding: 12px 24px;
    border-radius: 6px;
    margin-top: 20px;
    font-size: 16px;
    font-weight: bold;
    transition: background-color 0.2s;
  }

  .home-button:hover {
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

  .hero-section {
    height: 500px;
    position: relative;
    overflow: hidden;
  }

  .hero-image-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .hero-background-image {
    object-fit: cover;
    transition: opacity 0.5s ease-in-out;
  }

  .hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .hero-content {
    text-align: center;
    color: white;
    padding: 0 20px;
    z-index: 2;
  }

  .hero-title {
    font-size: 48px;
    font-weight: bold;
    margin-bottom: 10px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 768px) {
    .hero-title {
      font-size: 36px;
    }
  }

  .hero-subtitle {
    font-size: 18px;
    margin-bottom: 20px;
    opacity: 0.9;
  }

  .stats-badge {
    display: inline-flex;
    align-items: center;
    background-color: #e67e22;
    padding: 10px 20px;
    border-radius: 50px;
    gap: 10px;
  }

  .stats-icon {
    font-size: 20px;
  }

  .stats-text {
    font-size: 16px;
    font-weight: bold;
  }

  .image-caption {
    margin-top: 15px;
    font-size: 14px;
    background-color: rgba(0, 0, 0, 0.6);
    display: inline-block;
    padding: 5px 15px;
    border-radius: 20px;
    max-width: 80%;
  }

  .hero-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    cursor: pointer;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    z-index: 3;
  }

  .hero-arrow-prev {
    left: 20px;
  }

  .hero-arrow-next {
    right: 20px;
  }

  .hero-arrow:hover {
    background-color: rgba(0, 0, 0, 0.8);
    transform: translateY(-50%) scale(1.1);
  }

  .hero-indicators {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;
    z-index: 3;
  }

  .hero-indicator {
    height: 8px;
    width: 8px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    padding: 0;
    transition: all 0.3s ease;
    background-color: rgba(255, 255, 255, 0.5);
  }

  .hero-indicator.active {
    background-color: #e67e22;
    width: 30px;
  }

  .hero-indicator:hover {
    transform: scale(1.2);
  }

  .breadcrumb {
    max-width: 1200px;
    margin: 20px auto;
    padding: 0 20px;
    font-size: 14px;
  }

  .breadcrumb-link {
    color: #e67e22;
    text-decoration: none;
  }

  .breadcrumb-link:hover {
    text-decoration: underline;
  }

  .breadcrumb-separator {
    margin: 0 8px;
    color: #999;
  }

  .breadcrumb-current {
    color: #666;
  }

  .main-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px 40px;
  }

  .mobile-filter-toggle {
    display: none;
    width: 100%;
    padding: 15px;
    background-color: #e67e22;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    margin-bottom: 20px;
    justify-content: space-between;
    align-items: center;
  }

  @media (max-width: 768px) {
    .mobile-filter-toggle {
      display: flex;
    }
  }

  .content-wrapper {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 30px;
  }

  @media (max-width: 1024px) {
    .content-wrapper {
      grid-template-columns: 250px 1fr;
    }
  }

  @media (max-width: 768px) {
    .content-wrapper {
      grid-template-columns: 1fr;
    }
  }

  .filters-sidebar {
    background-color: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    height: fit-content;
  }

  @media (max-width: 768px) {
    .filters-sidebar {
      display: none;
    }
    .filters-sidebar.show {
      display: block;
    }
  }

  .filters-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .filters-title {
    font-size: 18px;
    font-weight: bold;
    color: #2c3e50;
    margin: 0;
  }

  .reset-button {
    background-color: transparent;
    border: none;
    color: #e67e22;
    cursor: pointer;
    font-size: 14px;
  }

  .reset-button:hover {
    text-decoration: underline;
  }

  .filter-section {
    margin-bottom: 20px;
  }

  .filter-label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #2c3e50;
    margin-bottom: 8px;
  }

  .search-input {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
    outline: none;
    transition: all 0.2s;
    box-sizing: border-box;
  }

  .search-input:focus {
    border-color: #e67e22;
    box-shadow: 0 0 0 3px rgba(230, 126, 34, 0.1);
  }

  .select {
    width: 100%;
    padding: 10px;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    font-size: 14px;
    background-color: white;
    cursor: pointer;
    outline: none;
  }

  .select:focus {
    border-color: #e67e22;
  }

  .range-inputs {
    display: flex;
    gap: 10px;
    align-items: center;
    margin-bottom: 10px;
  }

  .range-input {
    width: 100px;
    padding: 8px 10px;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    font-size: 14px;
    outline: none;
    transition: all 0.2s;
    box-sizing: border-box;
  }

  .range-input:focus {
    border-color: #e67e22;
    box-shadow: 0 0 0 2px rgba(230, 126, 34, 0.1);
  }

  .range-separator {
    color: #999;
  }

  .range-slider {
    position: relative;
    height: 20px;
  }

  .slider {
    width: 100%;
    position: absolute;
    height: 5px;
    background: none;
    pointer-events: none;
    -webkit-appearance: none;
    appearance: none;
  }

  .slider::-webkit-slider-thumb {
    pointer-events: auto;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background-color: #e67e22;
    cursor: pointer;
    margin-top: -6px;
    -webkit-appearance: none;
  }

  .packages-container {
    flex: 1;
  }

  .results-summary {
    margin-bottom: 20px;
  }

  .results-text {
    font-size: 16px;
    color: #2c3e50;
    margin-bottom: 5px;
  }

  .no-results {
    text-align: center;
    padding: 60px;
    background-color: white;
    border-radius: 12px;
  }

  .no-results-text {
    font-size: 18px;
    color: #999;
    margin-bottom: 20px;
  }

  .reset-button-large {
    background-color: #e67e22;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    font-size: 16px;
    cursor: pointer;
  }

  .reset-button-large:hover {
    background-color: #d35400;
  }

  .packages-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  @media (max-width: 1024px) {
    .packages-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .packages-grid {
      grid-template-columns: 1fr;
    }
  }

  .package-card {
    background-color: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    text-decoration: none;
    color: inherit;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .package-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .image-container {
    position: relative;
    height: 200px;
    background-color: #f0f0f0;
    overflow: hidden;
  }

  .package-image {
    object-fit: cover;
  }

  .no-image {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
    opacity: 0.3;
  }

  .top-badges {
    position: absolute;
    top: 10px;
    left: 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    z-index: 2;
  }

  .bestseller-badge {
    background-color: #e67e22;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: bold;
    text-transform: uppercase;
    display: inline-block;
    width: fit-content;
  }

  .topseller-badge {
    background-color: #27ae60;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: bold;
    text-transform: uppercase;
    display: inline-block;
    width: fit-content;
  }

  .guaranteed-badge {
    background-color: #3498db;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: bold;
    display: inline-block;
    width: fit-content;
  }

  .duration-container {
    position: absolute;
    bottom: 10px;
    left: 10px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 4px 10px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    gap: 4px;
    z-index: 2;
  }

  .duration-number {
    font-size: 14px;
    font-weight: bold;
  }

  .duration-text {
    font-size: 12px;
  }

  .discount-container {
    position: absolute;
    bottom: 10px;
    right: 10px;
    background-color: #e74c3c;
    color: white;
    padding: 4px 10px;
    border-radius: 20px;
    z-index: 2;
  }

  .discount-text {
    font-size: 12px;
    font-weight: bold;
  }

  .content-section {
    padding: 15px;
  }

  .card-title {
    font-size: 18px;
    font-weight: bold;
    color: #2c3e50;
    margin-bottom: 8px;
    line-height: 1.3;
  }

  .rating-container {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 10px;
  }

  .stars {
    color: #f39c12;
    font-size: 14px;
    letter-spacing: 1px;
  }

  .rating-text {
    font-size: 13px;
    font-weight: bold;
    color: #2c3e50;
  }

  .review-count {
    font-size: 12px;
    color: #7f8c8d;
  }

  .price-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .price-label {
    font-size: 13px;
    color: #7f8c8d;
  }

  .price-container {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .original-price {
    font-size: 14px;
    color: #95a5a6;
    text-decoration: line-through;
  }

  .discounted-price {
    font-size: 18px;
    font-weight: bold;
    color: #e67e22;
  }

  .view-details {
    font-size: 14px;
    color: #e67e22;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 5px;
    margin-top: 10px;
  }

  .arrow {
    font-size: 16px;
    transition: transform 0.2s;
  }

  .package-card:hover .arrow {
    transform: translateX(4px);
  }

  .region-info {
    background-color: white;
    padding: 60px 0;
    margin-top: 40px;
  }

  .region-info-content {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 20px;
    text-align: center;
  }

  .region-info-title {
    font-size: 32px;
    font-weight: bold;
    color: #2c3e50;
    margin-bottom: 20px;
  }

  .region-info-text {
    font-size: 16px;
    line-height: 1.8;
    color: #666;
  }
`;

export default PackageListBySubHeading;
