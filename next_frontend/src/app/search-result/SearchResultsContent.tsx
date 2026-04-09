"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import NotificationToast from "@/NotificationToast";
import Footer from "@/pages/Footer";

// Types
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

interface FilterOptions {
  mainHeadingId?: number;
  headingId?: number;
  countryId?: number;
  minDays?: number;
  maxDays?: number;
  grade?: string;
  maxPrice?: number;
  month?: string;
}

const SearchResultsContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams?.get("q") || "";

  const [packages, setPackages] = useState<TrekPackage[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<TrekPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(query);
  const [sortBy, setSortBy] = useState<
    "popular" | "price-low" | "price-high" | "duration"
  >("popular");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [durationRange, setDurationRange] = useState<[number, number]>([0, 30]);
  const [selectedGrade, setSelectedGrade] = useState<string>("all");
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error" | "warning",
  });
  const [heroImage, setHeroImage] = useState<string>("");

  // Available filter options from results
  const [availableCountries, setAvailableCountries] = useState<string[]>([]);
  const [availableGrades, setAvailableGrades] = useState<string[]>([]);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5232";

  const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

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

  const createSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (query) {
      setSearchTerm(query);
      fetchSearchResults();
    } else {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    filterAndSortPackages();
  }, [
    packages,
    searchTerm,
    sortBy,
    priceRange,
    durationRange,
    selectedGrade,
    selectedCountry,
  ]);

  const fetchSearchResults = async () => {
    try {
      setLoading(true);

      // Use the search endpoint with the query parameter
      const response = await api.get("/api/TrekPackage/search", {
        params: { name: query },
      });

      // Filter only active packages
      const activePackages = response.data.filter(
        (pkg: TrekPackage) => pkg.isActive === true,
      );

      setPackages(activePackages);
      setFilteredPackages(activePackages);

      // Set hero image from the first package's slider image
      if (
        activePackages.length > 0 &&
        activePackages[0].sliderImages &&
        activePackages[0].sliderImages.length > 0
      ) {
        setHeroImage(
          getFullImageUrl(activePackages[0].sliderImages[0].imageUrl),
        );
      } else if (
        activePackages.length > 0 &&
        activePackages[0].routeMapImageUrl
      ) {
        setHeroImage(getFullImageUrl(activePackages[0].routeMapImageUrl));
      }

      // Extract available filter options
      const countries = [
        ...new Set(
          activePackages.map((p: TrekPackage) => p.countryName).filter(Boolean),
        ),
      ];
      const grades = [
        ...new Set(
          activePackages.map((p: TrekPackage) => p.tripGrade).filter(Boolean),
        ),
      ];

      setAvailableCountries(countries as string[]);
      setAvailableGrades(grades as string[]);

      // Set price and duration ranges based on results
      if (activePackages.length > 0) {
        const prices = activePackages.map(
          (p: any) => p.discountedPrice || p.price || 0,
        );
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        setPriceRange([minPrice, maxPrice]);

        const durations = activePackages.map((p: any) => p.durationDays || 0);
        const minDuration = Math.min(...durations);
        const maxDuration = Math.max(...durations);
        setDurationRange([minDuration, maxDuration]);
      }
    } catch (error: any) {
      console.error("Error fetching search results:", error);
      showNotification(
        error.response?.data?.message || "Error loading search results",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search-result?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const filterAndSortPackages = () => {
    let filtered = [...packages];

    // Apply search filter
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Apply price filter
    filtered = filtered.filter((p) => {
      const price = p.discountedPrice || p.price || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Apply duration filter
    filtered = filtered.filter((p) => {
      const duration = p.durationDays || 0;
      return duration >= durationRange[0] && duration <= durationRange[1];
    });

    // Apply grade filter
    if (selectedGrade !== "all") {
      filtered = filtered.filter((p) => p.tripGrade === selectedGrade);
    }

    // Apply country filter
    if (selectedCountry !== "all") {
      filtered = filtered.filter((p) => p.countryName === selectedCountry);
    }

    // Apply sorting
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
        // Popular - sort by best seller status first, then by creation date
        filtered.sort((a, b) => {
          if (a.isBestSeller && !b.isBestSeller) return -1;
          if (!a.isBestSeller && b.isBestSeller) return 1;
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
        break;
    }

    setFilteredPackages(filtered);
  };

  const getRandomRating = (id: number) => {
    const ratings = [4.5, 4.8, 4.3, 4.9, 4.2, 4.7];
    const reviews = [12, 39, 17, 24, 8, 31];
    return {
      rating: ratings[id % ratings.length],
      reviews: reviews[id % reviews.length],
    };
  };

  const showNotification = (
    message: string,
    type: "success" | "error" | "warning",
  ) => {
    setNotification({ show: true, message, type });
  };

  const resetFilters = () => {
    setSearchTerm(query);
    setSortBy("popular");
    setSelectedGrade("all");
    setSelectedCountry("all");
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

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p>Searching for treks...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Hero Section with Image */}
      <div style={styles.heroSection}>
        {heroImage ? (
          <div style={styles.heroImageWrapper}>
            <Image
              src={heroImage}
              alt="Search Results"
              fill
              style={styles.heroImage}
              priority
              unoptimized
            />
          </div>
        ) : (
          <div style={styles.heroImagePlaceholder}>🏔️</div>
        )}
        <div style={styles.heroOverlay}>
          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>
              {query ? `Search Results for "${query}"` : "Search Treks"}
            </h1>
            <p style={styles.heroSubtitle}>
              {filteredPackages.length} trek
              {filteredPackages.length !== 1 ? "s" : ""} found matching your
              search
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearchSubmit} style={styles.searchForm}>
              <div style={styles.searchWrapper}>
                <div style={styles.searchIcon}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search treks, destinations, or activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={styles.searchInput}
                />
                <button type="submit" style={styles.searchButton}>
                  Search
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{ marginLeft: "8px" }}
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div style={styles.breadcrumb}>
        <Link href="/" style={styles.breadcrumbLink}>
          Home
        </Link>
        <span style={styles.breadcrumbSeparator}>/</span>
        <Link href="/treks" style={styles.breadcrumbLink}>
          Treks
        </Link>
        <span style={styles.breadcrumbSeparator}>/</span>
        <span style={styles.breadcrumbCurrent}>Search Results</span>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <button
          style={styles.mobileFilterToggle}
          onClick={() => setShowFilters(!showFilters)}
        >
          <span>🔍 Filter & Sort</span>
          <span>{showFilters ? "−" : "+"}</span>
        </button>

        <div style={styles.contentWrapper}>
          {/* Filters Sidebar */}
          <div
            style={{
              ...styles.filtersSidebar,
              display:
                windowWidth <= 768 ? (showFilters ? "block" : "none") : "block",
            }}
          >
            <div style={styles.filtersHeader}>
              <h3 style={styles.filtersTitle}>Filter Packages</h3>
              <button onClick={resetFilters} style={styles.resetButton}>
                Reset
              </button>
            </div>

            <div style={styles.filterSection}>
              <label style={styles.filterLabel}>Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                style={styles.select}
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="duration">Duration: Short to Long</option>
              </select>
            </div>

            <div style={styles.filterSection}>
              <label style={styles.filterLabel}>Price Range (USD)</label>
              <div style={styles.rangeInputs}>
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => {
                    const newRange: [number, number] = [...priceRange];
                    newRange[0] = parseInt(e.target.value) || 0;
                    setPriceRange(newRange);
                  }}
                  min={0}
                  style={styles.rangeInput}
                />
                <span style={styles.rangeSeparator}>-</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => {
                    const newRange: [number, number] = [...priceRange];
                    newRange[1] = parseInt(e.target.value) || 0;
                    setPriceRange(newRange);
                  }}
                  min={priceRange[0]}
                  style={styles.rangeInput}
                />
              </div>
            </div>

            <div style={styles.filterSection}>
              <label style={styles.filterLabel}>Duration (Days)</label>
              <div style={styles.rangeInputs}>
                <input
                  type="number"
                  value={durationRange[0]}
                  onChange={(e) => {
                    const newRange: [number, number] = [...durationRange];
                    newRange[0] = parseInt(e.target.value) || 0;
                    setDurationRange(newRange);
                  }}
                  min={0}
                  style={styles.rangeInput}
                />
                <span style={styles.rangeSeparator}>-</span>
                <input
                  type="number"
                  value={durationRange[1]}
                  onChange={(e) => {
                    const newRange: [number, number] = [...durationRange];
                    newRange[1] = parseInt(e.target.value) || 0;
                    setDurationRange(newRange);
                  }}
                  min={durationRange[0]}
                  style={styles.rangeInput}
                />
              </div>
            </div>

            {availableCountries.length > 0 && (
              <div style={styles.filterSection}>
                <label style={styles.filterLabel}>Country</label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  style={styles.select}
                >
                  <option value="all">All Countries</option>
                  {availableCountries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {availableGrades.length > 0 && (
              <div style={styles.filterSection}>
                <label style={styles.filterLabel}>Trip Grade</label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  style={styles.select}
                >
                  <option value="all">All Grades</option>
                  {availableGrades.map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Packages Grid */}
          <div style={styles.packagesContainer}>
            <div style={styles.resultsSummary}>
              <p style={styles.resultsText}>
                Showing <strong>{filteredPackages.length}</strong> of{" "}
                <strong>{packages.length}</strong> results
                {query && ` for "${query}"`}
              </p>
            </div>

            {filteredPackages.length === 0 ? (
              <div style={styles.noResults}>
                <div style={styles.noResultsIcon}>🔍</div>
                <p style={styles.noResultsText}>
                  No treks found matching your criteria
                </p>
                <p style={styles.noResultsSubtext}>
                  Try adjusting your filters or search for something else
                </p>
                <button onClick={resetFilters} style={styles.resetButtonLarge}>
                  Reset All Filters
                </button>
                <Link href="/" style={styles.backHomeLink}>
                  Back to Home
                </Link>
              </div>
            ) : (
              <div style={styles.packagesGrid}>
                {filteredPackages.map((pkg) => {
                  const { rating, reviews } = getRandomRating(pkg.id);
                  return (
                    <Link
                      href={`/trip/${createSlug(pkg.name)}-${pkg.id}`}
                      key={pkg.id}
                      style={styles.packageCard}
                      className="package-card"
                    >
                      <div style={styles.imageContainer}>
                        {pkg.sliderImages && pkg.sliderImages.length > 0 ? (
                          <img
                            src={getFullImageUrl(pkg.sliderImages[0].imageUrl)}
                            alt={pkg.name}
                            style={styles.packageImage}
                          />
                        ) : (
                          <div style={styles.noImage}>
                            <span>🏔️</span>
                          </div>
                        )}

                        <div style={styles.topBadges}>
                          {pkg.isBestSeller && (
                            <span style={styles.bestsellerBadge}>
                              Best Seller
                            </span>
                          )}
                          {pkg.hasGuaranteedDeparture && (
                            <span style={styles.guaranteedBadge}>
                              Guaranteed
                            </span>
                          )}
                          {pkg.isTopSeller && (
                            <span style={styles.topsellerBadge}>
                              Top Seller
                            </span>
                          )}
                        </div>

                        <div style={styles.durationContainer}>
                          <span style={styles.durationNumber}>
                            {pkg.durationDays}
                          </span>
                          <span style={styles.durationText}>Days</span>
                        </div>

                        {pkg.discountedPrice &&
                          pkg.price &&
                          pkg.discountedPrice < pkg.price && (
                            <div style={styles.discountContainer}>
                              <span style={styles.discountText}>
                                Save $
                                {(pkg.price - pkg.discountedPrice).toFixed(0)}
                              </span>
                            </div>
                          )}
                      </div>

                      <div style={styles.contentSection}>
                        <h3 style={styles.cardTitle}>{pkg.name}</h3>

                        <div style={styles.locationContainer}>
                          <span style={styles.locationIcon}>📍</span>
                          <span style={styles.locationText}>
                            {pkg.countryName}
                          </span>
                        </div>

                        <div style={styles.ratingContainer}>
                          <div style={styles.stars}>
                            {"★".repeat(Math.floor(rating))}
                            {rating % 1 !== 0 && "½"}
                            {"☆".repeat(5 - Math.ceil(rating))}
                          </div>
                          <span style={styles.ratingText}>{rating}</span>
                          <span style={styles.reviewCount}>
                            ({reviews} reviews)
                          </span>
                        </div>

                        <p style={styles.shortDescription}>
                          {pkg.shortDescription?.substring(0, 80)}
                          {pkg.shortDescription &&
                          pkg.shortDescription.length > 80
                            ? "..."
                            : ""}
                        </p>

                        <div style={styles.priceRow}>
                          <span style={styles.priceLabel}>Price from</span>
                          <div style={styles.priceContainer}>
                            {pkg.discountedPrice ? (
                              <>
                                <span style={styles.originalPrice}>
                                  US${pkg.price}
                                </span>
                                <span style={styles.discountedPrice}>
                                  US${pkg.discountedPrice}
                                </span>
                              </>
                            ) : (
                              <span style={styles.discountedPrice}>
                                US${pkg.price}
                              </span>
                            )}
                          </div>
                        </div>

                        <div
                          style={styles.viewDetails}
                          className="view-details"
                        >
                          View Details{" "}
                          <span style={styles.arrow} className="arrow">
                            →
                          </span>
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

      <Footer />

      <NotificationToast
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ ...notification, show: false })}
      />

      <style jsx global>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .package-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .package-card:hover .view-details .arrow {
          transform: translateX(5px);
        }

        @media (max-width: 768px) {
          .content-wrapper {
            grid-template-columns: 1fr !important;
          }
          .packages-grid {
            grid-template-columns: 1fr !important;
          }
          .hero-title {
            font-size: 32px !important;
          }
          .hero-subtitle {
            font-size: 14px !important;
          }
          .mobile-filter-toggle {
            display: flex !important;
          }
        }

        @media (max-width: 480px) {
          .hero-section {
            height: 400px !important;
          }
          .hero-title {
            font-size: 24px !important;
          }
          .package-card:hover {
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
};

// ==================== STYLES ====================
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
    fontFamily: "Arial, sans-serif",
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
  heroSection: {
    height: "500px",
    position: "relative",
    overflow: "hidden",
  },
  heroImageWrapper: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
  heroImage: {
    objectFit: "cover",
  },
  heroImagePlaceholder: {
    width: "100%",
    height: "500px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1a2a3a",
    fontSize: "64px",
    color: "white",
  },
  heroOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(135deg, rgba(0,0,0,0.7), rgba(0,0,0,0.5))",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  heroContent: {
    textAlign: "center",
    color: "white",
    padding: "0 20px",
    maxWidth: "800px",
    width: "100%",
    zIndex: 2,
  },
  heroTitle: {
    fontSize: "48px",
    fontWeight: "bold",
    marginBottom: "10px",
    textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
  },
  heroSubtitle: {
    fontSize: "18px",
    marginBottom: "30px",
    opacity: 0.9,
  },
  searchForm: {
    width: "100%",
    maxWidth: "600px",
    margin: "0 auto",
  },
  searchWrapper: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: "60px",
    overflow: "hidden",
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
    border: "1px solid rgba(0,0,0,0.05)",
  },
  searchIcon: {
    padding: "0 0 0 20px",
    display: "flex",
    alignItems: "center",
    color: "#999",
  },
  searchInput: {
    flex: 1,
    padding: "16px 16px",
    border: "none",
    fontSize: "16px",
    outline: "none",
    fontFamily: "inherit",
    backgroundColor: "transparent",
  } as React.CSSProperties,
  searchButton: {
    padding: "16px 32px",
    backgroundColor: "#e67e22",
    color: "white",
    border: "none",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    whiteSpace: "nowrap",
  } as React.CSSProperties,
  breadcrumb: {
    maxWidth: "1200px",
    margin: "20px auto",
    padding: "0 20px",
    fontSize: "14px",
  },
  breadcrumbLink: {
    color: "#e67e22",
    textDecoration: "none",
  },
  breadcrumbSeparator: {
    margin: "0 8px",
    color: "#999",
  },
  breadcrumbCurrent: {
    color: "#666",
  },
  mainContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px 40px",
  },
  mobileFilterToggle: {
    display: "none",
    width: "100%",
    padding: "15px",
    backgroundColor: "#e67e22",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    marginBottom: "20px",
    justifyContent: "space-between",
    alignItems: "center",
  },
  contentWrapper: {
    display: "grid",
    gridTemplateColumns: "280px 1fr",
    gap: "30px",
  },
  filtersSidebar: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    height: "fit-content",
  },
  filtersHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    paddingBottom: "10px",
    borderBottom: "1px solid #eee",
  },
  filtersTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#2c3e50",
    margin: 0,
  },
  resetButton: {
    backgroundColor: "transparent",
    border: "none",
    color: "#e67e22",
    cursor: "pointer",
    fontSize: "14px",
  },
  filterSection: {
    marginBottom: "20px",
  },
  filterLabel: {
    display: "block",
    fontSize: "14px",
    fontWeight: "500",
    color: "#2c3e50",
    marginBottom: "8px",
  },
  select: {
    width: "100%",
    padding: "10px",
    border: "1px solid #e0e0e0",
    borderRadius: "6px",
    fontSize: "14px",
    backgroundColor: "white",
    cursor: "pointer",
    outline: "none",
  },
  rangeInputs: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  rangeInput: {
    width: "100px",
    padding: "8px 10px",
    border: "1px solid #e0e0e0",
    borderRadius: "6px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },
  rangeSeparator: {
    color: "#999",
  },
  packagesContainer: {
    flex: 1,
  },
  resultsSummary: {
    marginBottom: "20px",
  },
  resultsText: {
    fontSize: "16px",
    color: "#2c3e50",
  },
  noResults: {
    textAlign: "center",
    padding: "60px",
    backgroundColor: "white",
    borderRadius: "12px",
  },
  noResultsIcon: {
    fontSize: "64px",
    marginBottom: "20px",
  },
  noResultsText: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: "10px",
  },
  noResultsSubtext: {
    fontSize: "14px",
    color: "#999",
    marginBottom: "30px",
  },
  resetButtonLarge: {
    backgroundColor: "#e67e22",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
    marginRight: "10px",
  },
  backHomeLink: {
    display: "inline-block",
    marginTop: "15px",
    color: "#e67e22",
    textDecoration: "none",
    fontSize: "14px",
  },
  packagesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
  },
  packageCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    textDecoration: "none",
    color: "inherit",
    transition: "transform 0.2s, boxShadow 0.2s",
    display: "block",
  },
  imageContainer: {
    position: "relative",
    height: "200px",
    backgroundColor: "#f0f0f0",
    overflow: "hidden",
  },
  packageImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  noImage: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "48px",
    opacity: 0.3,
  },
  topBadges: {
    position: "absolute",
    top: "10px",
    left: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    zIndex: 2,
  },
  bestsellerBadge: {
    backgroundColor: "#e67e22",
    color: "white",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: "bold",
    textTransform: "uppercase",
    display: "inline-block",
    width: "fit-content",
  },
  topsellerBadge: {
    backgroundColor: "#27ae60",
    color: "white",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: "bold",
    textTransform: "uppercase",
    display: "inline-block",
    width: "fit-content",
  },
  guaranteedBadge: {
    backgroundColor: "#3498db",
    color: "white",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: "bold",
    display: "inline-block",
    width: "fit-content",
  },
  durationContainer: {
    position: "absolute",
    bottom: "10px",
    left: "10px",
    backgroundColor: "rgba(0,0,0,0.7)",
    color: "white",
    padding: "4px 10px",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    zIndex: 2,
  },
  durationNumber: {
    fontSize: "14px",
    fontWeight: "bold",
  },
  durationText: {
    fontSize: "12px",
  },
  discountContainer: {
    position: "absolute",
    bottom: "10px",
    right: "10px",
    backgroundColor: "#e74c3c",
    color: "white",
    padding: "4px 10px",
    borderRadius: "20px",
    zIndex: 2,
  },
  discountText: {
    fontSize: "12px",
    fontWeight: "bold",
  },
  contentSection: {
    padding: "15px",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: "8px",
    lineHeight: "1.3",
  },
  locationContainer: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    marginBottom: "8px",
  },
  locationIcon: {
    fontSize: "12px",
  },
  locationText: {
    fontSize: "12px",
    color: "#7f8c8d",
  },
  ratingContainer: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    marginBottom: "10px",
  },
  stars: {
    color: "#f39c12",
    fontSize: "14px",
    letterSpacing: "1px",
  },
  ratingText: {
    fontSize: "13px",
    fontWeight: "bold",
    color: "#2c3e50",
  },
  reviewCount: {
    fontSize: "12px",
    color: "#7f8c8d",
  },
  shortDescription: {
    fontSize: "13px",
    color: "#666",
    lineHeight: "1.4",
    marginBottom: "12px",
  },
  priceRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  priceLabel: {
    fontSize: "13px",
    color: "#7f8c8d",
  },
  priceContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  originalPrice: {
    fontSize: "14px",
    color: "#95a5a6",
    textDecoration: "line-through",
  },
  discountedPrice: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#e67e22",
  },
  viewDetails: {
    fontSize: "14px",
    color: "#e67e22",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    marginTop: "10px",
  },
  arrow: {
    fontSize: "16px",
    transition: "transform 0.2s",
  },
};

export default SearchResultsContent;
