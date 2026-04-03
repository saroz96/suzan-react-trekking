import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import NotificationToast from "../NotificationToast";
import Footer from "./Footer";

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

const AllTopSellersPage: React.FC = () => {
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

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5232";

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

  useEffect(() => {
    fetchTopSellerPackages();
  }, []);

  useEffect(() => {
    filterAndSortPackages();
  }, [packages, searchTerm, sortBy, priceRange, durationRange, selectedGrade]);

  useEffect(() => {
    if (heroImages.length === 0) return;
    const interval = setInterval(() => {
      setCurrentHeroImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [heroImages]);

  //   const fetchTopSellerPackages = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await api.get("/api/TrekPackage");
  //       const topSellers = response.data.filter(
  //         (pkg: TrekPackage) => pkg.isTopSeller === true,
  //       );
  //       setPackages(topSellers);
  //       setFilteredPackages(topSellers);

  //       // Extract hero images
  //       const allImages: {
  //         imageUrl: string;
  //         title?: string;
  //         caption?: string;
  //         packageName: string;
  //       }[] = [];
  //       topSellers.forEach((pkg: TrekPackage) => {
  //         if (pkg.sliderImages && pkg.sliderImages.length > 0) {
  //           pkg.sliderImages.forEach((img) => {
  //             allImages.push({
  //               imageUrl: img.imageUrl,
  //               title: img.title,
  //               caption: img.caption,
  //               packageName: pkg.name,
  //             });
  //           });
  //         }
  //       });
  //       setHeroImages(allImages);

  //       if (topSellers.length > 0) {
  //         const prices = topSellers.map(
  //           (p: any) => p.discountedPrice || p.price || 0,
  //         );
  //         const minPrice = Math.min(...prices);
  //         const maxPrice = Math.max(...prices);
  //         setPriceRange([minPrice, maxPrice]);

  //         const durations = topSellers.map((p: any) => p.durationDays || 0);
  //         const minDuration = Math.min(...durations);
  //         const maxDuration = Math.max(...durations);
  //         setDurationRange([minDuration, maxDuration]);
  //       }
  //     } catch (error: any) {
  //       console.error("Error fetching top seller packages:", error);
  //       showNotification(
  //         error.response?.data?.message || "Error loading top seller packages",
  //         "error",
  //       );
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  const fetchTopSellerPackages = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/TrekPackage");

      // Filter packages that are top sellers AND active
      const topSellers = response.data.filter(
        (pkg: TrekPackage) => pkg.isTopSeller === true && pkg.isActive === true, // Added active check
      );

      setPackages(topSellers);
      setFilteredPackages(topSellers);

      // Extract hero images
      const allImages: {
        imageUrl: string;
        title?: string;
        caption?: string;
        packageName: string;
      }[] = [];
      topSellers.forEach((pkg: TrekPackage) => {
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

      if (topSellers.length > 0) {
        const prices = topSellers.map(
          (p: any) => p.discountedPrice || p.price || 0,
        );
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        setPriceRange([minPrice, maxPrice]);

        const durations = topSellers.map((p: any) => p.durationDays || 0);
        const minDuration = Math.min(...durations);
        const maxDuration = Math.max(...durations);
        setDurationRange([minDuration, maxDuration]);
      }
    } catch (error: any) {
      console.error("Error fetching top seller packages:", error);
      showNotification(
        error.response?.data?.message || "Error loading top seller packages",
        "error",
      );
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

  const uniqueGrades = [
    ...new Set(packages.map((p) => p.tripGrade).filter(Boolean)),
  ];

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p>Loading top seller packages...</p>
        </div>
      </div>
    );
  }

  const currentHeroImage = heroImages[currentHeroImageIndex] || null;

  return (
    <div style={styles.container}>
      {/* Hero Section with Slider */}
      <div style={styles.heroSection}>
        {currentHeroImage && (
          <>
            <img
              src={getFullImageUrl(currentHeroImage.imageUrl)}
              alt={currentHeroImage.title || currentHeroImage.packageName}
              style={styles.heroBackgroundImage}
            />
            <div style={styles.heroOverlay}>
              <div style={styles.heroContent}>
                <h1 style={styles.heroTitle}>Top Selling Trips</h1>
                <p style={styles.heroSubtitle}>
                  Our most booked and highly recommended treks by our customers
                </p>
                <div style={styles.statsBadge}>
                  <span style={styles.statsIcon}>🔥</span>
                  <span style={styles.statsText}>
                    {filteredPackages.length} Top Seller Package
                    {filteredPackages.length !== 1 ? "s" : ""}
                  </span>
                </div>
                {currentHeroImage.caption && (
                  <div style={styles.imageCaption}>
                    {currentHeroImage.caption}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {heroImages.length > 1 && (
          <>
            <button
              onClick={() =>
                setCurrentHeroImageIndex(
                  (prev) => (prev - 1 + heroImages.length) % heroImages.length,
                )
              }
              style={{ ...styles.heroArrow, left: "20px" }}
            >
              ❮
            </button>
            <button
              onClick={() =>
                setCurrentHeroImageIndex(
                  (prev) => (prev + 1) % heroImages.length,
                )
              }
              style={{ ...styles.heroArrow, right: "20px" }}
            >
              ❯
            </button>
            <div style={styles.heroIndicators}>
              {heroImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentHeroImageIndex(idx)}
                  style={{
                    ...styles.heroIndicator,
                    backgroundColor:
                      currentHeroImageIndex === idx
                        ? "#e67e22"
                        : "rgba(255,255,255,0.5)",
                    width: currentHeroImageIndex === idx ? "30px" : "8px",
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Breadcrumb */}
      <div style={styles.breadcrumb}>
        <Link to="/" style={styles.breadcrumbLink}>
          Home
        </Link>
        <span style={styles.breadcrumbSeparator}>/</span>
        <span style={styles.breadcrumbCurrent}>Top Selling Trips</span>
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
                window.innerWidth <= 768
                  ? showFilters
                    ? "block"
                    : "none"
                  : "block",
            }}
          >
            <div style={styles.filtersHeader}>
              <h3 style={styles.filtersTitle}>Filter Packages</h3>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSortBy("popular");
                  setSelectedGrade("all");
                  if (packages.length > 0) {
                    const prices = packages.map(
                      (p) => p.discountedPrice || p.price || 0,
                    );
                    const minPrice = Math.min(...prices);
                    const maxPrice = Math.max(...prices);
                    setPriceRange([minPrice, maxPrice]);
                    const durations = packages.map((p) => p.durationDays || 0);
                    const minDuration = Math.min(...durations);
                    const maxDuration = Math.max(...durations);
                    setDurationRange([minDuration, maxDuration]);
                  }
                }}
                style={styles.resetButton}
              >
                Reset
              </button>
            </div>

            <div style={styles.filterSection}>
              <label style={styles.filterLabel}>Search</label>
              <input
                type="text"
                placeholder="Search packages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
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

            {uniqueGrades.length > 0 && (
              <div style={styles.filterSection}>
                <label style={styles.filterLabel}>Trip Grade</label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  style={styles.select}
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
          <div style={styles.packagesContainer}>
            <div style={styles.resultsSummary}>
              <p style={styles.resultsText}>
                Showing <strong>{filteredPackages.length}</strong> of{" "}
                <strong>{packages.length}</strong> top seller packages
              </p>
            </div>

            {filteredPackages.length === 0 ? (
              <div style={styles.noResults}>
                <p style={styles.noResultsText}>
                  No packages match your filters
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSortBy("popular");
                    setSelectedGrade("all");
                    if (packages.length > 0) {
                      const prices = packages.map(
                        (p) => p.discountedPrice || p.price || 0,
                      );
                      const minPrice = Math.min(...prices);
                      const maxPrice = Math.max(...prices);
                      setPriceRange([minPrice, maxPrice]);
                      const durations = packages.map(
                        (p) => p.durationDays || 0,
                      );
                      const minDuration = Math.min(...durations);
                      const maxDuration = Math.max(...durations);
                      setDurationRange([minDuration, maxDuration]);
                    }
                  }}
                  style={styles.resetButtonLarge}
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div style={styles.packagesGrid}>
                {filteredPackages.map((pkg) => {
                  const { rating, reviews } = getRandomRating(pkg.id);
                  return (
                    <Link
                      to={`/trip/${createSlug(pkg.name)}-${pkg.id}`}
                      key={pkg.id}
                      style={styles.packageCard}
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
                          <span style={styles.topsellerBadge}>Top Seller</span>
                          {pkg.isBestSeller && (
                            <span style={styles.bestsellerBadge}>
                              Best Seller
                            </span>
                          )}
                          {pkg.hasGuaranteedDeparture && (
                            <span style={styles.guaranteedBadge}>
                              Guaranteed Departures
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

                        <div style={styles.viewDetails}>
                          View Details <span style={styles.arrow}>→</span>
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

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// ==================== STYLES (Same as PackageListBySubHeading) ====================
const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
    fontFamily: "Arial, sans-serif",
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
  heroSection: {
    height: "500px",
    position: "relative" as const,
    overflow: "hidden",
  },
  heroBackgroundImage: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
    transition: "opacity 0.5s ease-in-out",
  },
  heroOverlay: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  heroContent: {
    textAlign: "center" as const,
    color: "white",
    padding: "0 20px",
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
    marginBottom: "20px",
    opacity: 0.9,
  },
  statsBadge: {
    display: "inline-flex",
    alignItems: "center",
    backgroundColor: "#e67e22",
    padding: "10px 20px",
    borderRadius: "50px",
    gap: "10px",
  },
  statsIcon: {
    fontSize: "20px",
  },
  statsText: {
    fontSize: "16px",
    fontWeight: "bold",
  },
  imageCaption: {
    marginTop: "15px",
    fontSize: "14px",
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "inline-block",
    padding: "5px 15px",
    borderRadius: "20px",
    maxWidth: "80%",
  },
  heroArrow: {
    position: "absolute" as const,
    top: "50%",
    transform: "translateY(-50%)",
    backgroundColor: "rgba(0,0,0,0.5)",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    cursor: "pointer",
    fontSize: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
    zIndex: 3,
  },
  heroIndicators: {
    position: "absolute" as const,
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: "10px",
    zIndex: 3,
  },
  heroIndicator: {
    height: "8px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    padding: 0,
    transition: "all 0.3s ease",
  },
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
  searchInput: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.2s",
    boxSizing: "border-box" as const,
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
    marginBottom: "10px",
  },
  rangeInput: {
    width: "100px",
    padding: "8px 10px",
    border: "1px solid #e0e0e0",
    borderRadius: "6px",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.2s",
    boxSizing: "border-box" as const,
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
    marginBottom: "5px",
  },
  noResults: {
    textAlign: "center" as const,
    padding: "60px",
    backgroundColor: "white",
    borderRadius: "12px",
  },
  noResultsText: {
    fontSize: "18px",
    color: "#999",
    marginBottom: "20px",
  },
  resetButtonLarge: {
    backgroundColor: "#e67e22",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
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
  },
  imageContainer: {
    position: "relative" as const,
    height: "200px",
    backgroundColor: "#f0f0f0",
    overflow: "hidden",
  },
  packageImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
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
    position: "absolute" as const,
    top: "10px",
    left: "10px",
    display: "flex",
    flexDirection: "column" as const,
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
    textTransform: "uppercase" as const,
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
    textTransform: "uppercase" as const,
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
    position: "absolute" as const,
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
    position: "absolute" as const,
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
  needHelp: {
    backgroundColor: "#1F439C",
    padding: "60px 0",
  },
  needHelpContent: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "0 20px",
    textAlign: "center" as const,
    color: "white",
  },
  needHelpTitle: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "15px",
  },
  needHelpText: {
    fontSize: "16px",
    marginBottom: "30px",
    opacity: 0.9,
  },
  contactButtons: {
    display: "flex",
    gap: "15px",
    justifyContent: "center",
    flexWrap: "wrap" as const,
  },
  phoneButton: {
    backgroundColor: "#e67e22",
    color: "white",
    textDecoration: "none",
    padding: "12px 24px",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "background-color 0.2s",
  },
  emailButton: {
    backgroundColor: "transparent",
    border: "2px solid white",
    color: "white",
    textDecoration: "none",
    padding: "12px 24px",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "all 0.2s",
  },
};

export default AllTopSellersPage;
