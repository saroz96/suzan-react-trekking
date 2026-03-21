import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

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

const BestSellersSection: React.FC = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<TrekPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5232";

  const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

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

  // Create slug from package name and ID
  const createPackageSlug = (name: string, id: number): string => {
    const slug = name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    return `${slug}-${id}`;
  };

  useEffect(() => {
    fetchBestSellerPackages();
  }, []);

  // const fetchBestSellerPackages = async () => {
  //   try {
  //     setLoading(true);
  //     setError(null);

  //     // Fetch all packages with seller status
  //     const response = await api.get("/api/TrekPackage");

  //     // Filter packages that are best sellers
  //     const bestSellers = response.data.filter(
  //       (pkg: TrekPackage) => pkg.isBestSeller === true,
  //     );

  //     // Sort by latest created first (newest first)
  //     bestSellers.sort((a: TrekPackage, b: TrekPackage) => {
  //       return (
  //         new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  //       );
  //     });

  //     // Only take the latest 8 packages
  //     const latestBestSellers = bestSellers.slice(0, 8);

  //     setPackages(latestBestSellers);
  //   } catch (error: any) {
  //     console.error("Error fetching best seller packages:", error);
  //     setError(
  //       error.response?.data?.message || "Error loading best seller packages",
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchBestSellerPackages = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all packages with seller status
      const response = await api.get("/api/TrekPackage");

      // Filter packages that are best sellers AND active
      const bestSellers = response.data.filter(
        (pkg: TrekPackage) =>
          pkg.isBestSeller === true && pkg.isActive === true, // Added active check
      );

      // Sort by latest created first (newest first)
      bestSellers.sort((a: TrekPackage, b: TrekPackage) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });

      // Only take the latest 8 packages
      const latestBestSellers = bestSellers.slice(0, 8);

      setPackages(latestBestSellers);
    } catch (error: any) {
      console.error("Error fetching best seller packages:", error);
      setError(
        error.response?.data?.message || "Error loading best seller packages",
      );
    } finally {
      setLoading(false);
    }
  };

  // Function to render star ratings (mock data - in real app, this would come from reviews API)
  const getRandomRating = (id: number) => {
    const ratings = [4.5, 4.8, 4.3, 4.9, 4.2, 4.7, 5.0, 4.6];
    const reviews = [12, 39, 17, 24, 8, 31, 45, 22];
    return {
      rating: ratings[id % ratings.length],
      reviews: reviews[id % reviews.length],
    };
  };

  const renderStars = (rating: number, reviewCount: number) => {
    if (reviewCount === 0) return null;

    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <span key={i} style={starFilledStyle}>
            ★
          </span>,
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <span key={i} style={starHalfStyle}>
            ½
          </span>,
        );
      } else {
        stars.push(
          <span key={i} style={starEmptyStyle}>
            ★
          </span>,
        );
      }
    }

    return (
      <div style={ratingContainerStyle}>
        <div style={starsContainerStyle}>{stars}</div>
        <span style={reviewCountStyle}>({reviewCount} reviews)</span>
      </div>
    );
  };

  const handleCardClick = (pkg: TrekPackage) => {
    const slug = createPackageSlug(pkg.name, pkg.id);
    navigate(`/trip/${slug}`);
  };

  if (loading) {
    return (
      <div style={loadingContainerStyle}>
        <div style={spinnerStyle}></div>
        <p>Loading best sellers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={errorContainerStyle}>
        <p style={errorTextStyle}>{error}</p>
        <button onClick={fetchBestSellerPackages} style={retryButtonStyle}>
          Try Again
        </button>
      </div>
    );
  }

  if (packages.length === 0) {
    return (
      <div style={emptyContainerStyle}>
        <p>No best seller packages available at the moment.</p>
        <Link to="/" style={viewAllButtonStyle}>
          Browse All Trips →
        </Link>
      </div>
    );
  }

  return (
    <div style={sectionContainerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={titleContainerStyle}>
          <span style={exclusiveTagStyle}>Unique and Exclusive!</span>
          <h2 style={mainTitleStyle}>ART's Best Sellers for 2026</h2>
        </div>
        <Link to="/best-seller-treks" style={viewAllButtonStyle}>
          VIEW ALL TRIPS <span style={arrowStyle}>→</span>
        </Link>
      </div>

      {/* Cards Grid */}
      <div style={cardsGridStyle}>
        {packages.map((pkg) => {
          const { rating, reviews } = getRandomRating(pkg.id);
          const heroImage =
            pkg.sliderImages && pkg.sliderImages.length > 0
              ? getFullImageUrl(pkg.sliderImages[0].imageUrl)
              : pkg.routeMapImageUrl
                ? getFullImageUrl(pkg.routeMapImageUrl)
                : "";

          return (
            <div
              key={pkg.id}
              onClick={() => handleCardClick(pkg)}
              style={cardContainerStyle}
              className="best-seller-card"
            >
              <div style={cardStyle}>
                {/* Image Container */}
                <div style={imageContainerStyle}>
                  {heroImage ? (
                    <img src={heroImage} alt={pkg.name} style={imageStyle} />
                  ) : (
                    <div style={noImageStyle}>🏔️</div>
                  )}

                  {/* Badges */}
                  <div style={badgesContainerStyle}>
                    <span style={bestSellerBadgeStyle}>Best Seller</span>
                    {pkg.hasGuaranteedDeparture && (
                      <span style={guaranteedBadgeStyle}>
                        Guaranteed Departures
                      </span>
                    )}
                    {pkg.isTopSeller && (
                      <span style={topSellerBadgeStyle}>TOPSELLER</span>
                    )}
                  </div>

                  {/* Discount Badge */}
                  {pkg.discountedPrice &&
                    pkg.price &&
                    pkg.discountedPrice < pkg.price && (
                      <div style={discountBadgeStyle}>
                        Save ${(pkg.price - pkg.discountedPrice).toFixed(0)}
                      </div>
                    )}
                </div>

                {/* Content */}
                <div style={cardContentStyle}>
                  {/* Duration */}
                  <div style={durationStyle}>
                    {pkg.durationDays} Days
                    {pkg.durationNights
                      ? ` / ${pkg.durationNights} Nights`
                      : ""}
                  </div>

                  {/* Title */}
                  <h3 style={titleStyle}>{pkg.name}</h3>

                  {/* Rating */}
                  {renderStars(rating, reviews)}

                  {/* Price */}
                  <div style={priceContainerStyle}>
                    {pkg.discountedPrice ? (
                      <>
                        <span style={originalPriceStyle}>US${pkg.price}</span>
                        <span style={discountedPriceStyle}>
                          US${pkg.discountedPrice}
                        </span>
                      </>
                    ) : (
                      <span style={priceStyle}>US${pkg.price}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add keyframes for spinner */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .best-seller-card:hover {
          transform: translateY(-5px);
        }
      `}</style>
    </div>
  );
};

// ==================== STYLES ====================

const loadingContainerStyle = {
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  justifyContent: "center",
  padding: "60px 20px",
  gap: "20px",
};

const spinnerStyle = {
  width: "40px",
  height: "40px",
  border: "3px solid #f3f3f3",
  borderTop: "3px solid #e67e22",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
};

const errorContainerStyle = {
  textAlign: "center" as const,
  padding: "60px 20px",
};

const errorTextStyle = {
  color: "#e74c3c",
  marginBottom: "20px",
};

const retryButtonStyle = {
  backgroundColor: "#e67e22",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
};

const emptyContainerStyle = {
  textAlign: "center" as const,
  padding: "60px 20px",
  color: "#666",
};

const cardContainerStyle = {
  cursor: "pointer",
  transition: "transform 0.3s, box-shadow 0.3s",
};

const sectionContainerStyle = {
  maxWidth: "1200px",
  margin: "40px auto",
  padding: "0 20px",
  fontFamily: "Arial, sans-serif",
};

// Header Styles
const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "30px",
  flexWrap: "wrap" as const,
  gap: "20px",
};

const titleContainerStyle = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "5px",
};

const exclusiveTagStyle = {
  color: "#e67e22",
  fontSize: "14px",
  fontWeight: "bold",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
};

const mainTitleStyle = {
  fontSize: "28px",
  fontWeight: "bold",
  color: "#2c3e50",
  margin: "0",
};

const viewAllButtonStyle = {
  backgroundColor: "#e67e22",
  color: "white",
  padding: "10px 20px",
  textDecoration: "none",
  borderRadius: "25px",
  fontSize: "14px",
  fontWeight: "bold",
  display: "inline-flex",
  alignItems: "center",
  gap: "5px",
  transition: "background-color 0.3s",
};

const arrowStyle = {
  fontSize: "16px",
};

// Cards Grid
const cardsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "20px",
  "@media (max-width: 992px)": {
    gridTemplateColumns: "repeat(2, 1fr)",
  },
  "@media (max-width: 576px)": {
    gridTemplateColumns: "1fr",
  },
};

// Card Styles
const cardStyle = {
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  transition: "all 0.3s",
  height: "100%",
  display: "flex",
  flexDirection: "column" as const,
};

const imageContainerStyle = {
  position: "relative" as const,
  height: "200px",
  overflow: "hidden",
  backgroundColor: "#f0f0f0",
};

const imageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover" as const,
};

const noImageStyle = {
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "48px",
  backgroundColor: "#f0f0f0",
};

const badgesContainerStyle = {
  position: "absolute" as const,
  top: "10px",
  left: "10px",
  display: "flex",
  flexDirection: "column" as const,
  gap: "5px",
  zIndex: 2,
};

const bestSellerBadgeStyle = {
  backgroundColor: "#e67e22",
  color: "white",
  padding: "4px 8px",
  borderRadius: "4px",
  fontSize: "11px",
  fontWeight: "bold",
  display: "inline-block",
  width: "fit-content",
};

const guaranteedBadgeStyle = {
  backgroundColor: "#27ae60",
  color: "white",
  padding: "4px 8px",
  borderRadius: "4px",
  fontSize: "11px",
  fontWeight: "bold",
  display: "inline-block",
  width: "fit-content",
};

const topSellerBadgeStyle = {
  backgroundColor: "#3498db",
  color: "white",
  padding: "4px 8px",
  borderRadius: "4px",
  fontSize: "11px",
  fontWeight: "bold",
  display: "inline-block",
  width: "fit-content",
};

const discountBadgeStyle = {
  position: "absolute" as const,
  bottom: "10px",
  right: "10px",
  backgroundColor: "#e74c3c",
  color: "white",
  padding: "4px 8px",
  borderRadius: "4px",
  fontSize: "11px",
  fontWeight: "bold",
  zIndex: 2,
};

const cardContentStyle = {
  padding: "15px",
  flex: 1,
  display: "flex",
  flexDirection: "column" as const,
  gap: "8px",
};

const durationStyle = {
  color: "#7f8c8d",
  fontSize: "13px",
};

const titleStyle = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#2c3e50",
  margin: "0",
  lineHeight: "1.4",
  minHeight: "45px",
};

// Rating Styles
const ratingContainerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  flexWrap: "wrap" as const,
};

const starsContainerStyle = {
  display: "flex",
  gap: "2px",
};

const starFilledStyle = {
  color: "#f1c40f",
  fontSize: "12px",
};

const starHalfStyle = {
  color: "#f1c40f",
  fontSize: "12px",
};

const starEmptyStyle = {
  color: "#bdc3c7",
  fontSize: "12px",
};

const reviewCountStyle = {
  color: "#7f8c8d",
  fontSize: "11px",
};

// Price Styles
const priceContainerStyle = {
  marginTop: "8px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  flexWrap: "wrap" as const,
};

const originalPriceStyle = {
  fontSize: "13px",
  color: "#95a5a6",
  textDecoration: "line-through",
};

const discountedPriceStyle = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#e67e22",
};

const priceStyle = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#e67e22",
};

export default BestSellersSection;
