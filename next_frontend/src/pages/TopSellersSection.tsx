"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

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

const TopSellersSection: React.FC = () => {
  const router = useRouter();
  const [packages, setPackages] = useState<TrekPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    fetchTopSellerPackages();
  }, []);

  const fetchTopSellerPackages = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all packages with seller status
      const response = await fetch(`${API_BASE_URL}/api/TrekPackage`);
      const data = await response.json();

      // Filter packages that are top sellers AND active
      const topSellers = data.filter(
        (pkg: TrekPackage) => pkg.isTopSeller === true && pkg.isActive === true,
      );

      // Sort by latest created first (newest first)
      topSellers.sort((a: TrekPackage, b: TrekPackage) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });

      // Only take the latest 8 packages
      const latestTopSellers = topSellers.slice(0, 8);

      setPackages(latestTopSellers);
    } catch (error: any) {
      console.error("Error fetching top seller packages:", error);
      setError(error.message || "Error loading top seller packages");
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
          <span key={i} className="star-filled">
            ★
          </span>,
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <span key={i} className="star-half">
            ½
          </span>,
        );
      } else {
        stars.push(
          <span key={i} className="star-empty">
            ★
          </span>,
        );
      }
    }

    return (
      <div className="rating-container">
        <div className="stars-container">{stars}</div>
        <span className="review-count">({reviewCount} reviews)</span>
      </div>
    );
  };

  const handleCardClick = (pkg: TrekPackage) => {
    const slug = createPackageSlug(pkg.name, pkg.id);
    router.push(`/trip/${slug}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading top sellers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-text">{error}</p>
        <button onClick={fetchTopSellerPackages} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  if (packages.length === 0) {
    return (
      <div className="empty-container">
        <p>No top seller packages available at the moment.</p>
        <Link href="/" className="view-all-button">
          Browse All Trips →
        </Link>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
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

        .error-container {
          text-align: center;
          padding: 60px 20px;
        }

        .error-text {
          color: #e74c3c;
          margin-bottom: 20px;
        }

        .retry-button {
          background-color: #e67e22;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        }

        .empty-container {
          text-align: center;
          padding: 60px 20px;
          color: #666;
        }

        .section-container {
          max-width: 1200px;
          margin: 40px auto;
          padding: 0 20px;
          font-family: Arial, sans-serif;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .title-container {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .exclusive-tag {
          color: #e67e22;
          font-size: 14px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .main-title {
          font-size: 28px;
          font-weight: bold;
          color: #2c3e50;
          margin: 0;
        }

        .view-all-button {
          background-color: #e67e22;
          color: white;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 25px;
          font-size: 14px;
          font-weight: bold;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          transition: background-color 0.3s;
        }

        .view-all-button:hover {
          background-color: #d35400;
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        @media (max-width: 992px) {
          .cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 576px) {
          .cards-grid {
            grid-template-columns: 1fr;
          }
        }

        .card-container {
          cursor: pointer;
          transition:
            transform 0.3s,
            box-shadow 0.3s;
        }

        .card-container:hover {
          transform: translateY(-5px);
        }

        .card {
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          transition: all 0.3s;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .image-container {
          position: relative;
          height: 200px;
          overflow: hidden;
          background-color: #f0f0f0;
        }

        .image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .no-image {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          background-color: #f0f0f0;
        }

        .badges-container {
          position: absolute;
          top: 10px;
          left: 10px;
          display: flex;
          flex-direction: column;
          gap: 5px;
          z-index: 2;
        }

        .top-seller-badge {
          background-color: #3498db;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: bold;
          display: inline-block;
          width: fit-content;
        }

        .best-seller-badge {
          background-color: #e67e22;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: bold;
          display: inline-block;
          width: fit-content;
        }

        .guaranteed-badge {
          background-color: #27ae60;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: bold;
          display: inline-block;
          width: fit-content;
        }

        .discount-badge {
          position: absolute;
          bottom: 10px;
          right: 10px;
          background-color: #e74c3c;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: bold;
          z-index: 2;
        }

        .card-content {
          padding: 15px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .duration {
          color: #7f8c8d;
          font-size: 13px;
        }

        .title {
          font-size: 16px;
          font-weight: bold;
          color: #2c3e50;
          margin: 0;
          line-height: 1.4;
          min-height: 45px;
        }

        .rating-container {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .stars-container {
          display: flex;
          gap: 2px;
        }

        .star-filled {
          color: #f1c40f;
          font-size: 12px;
        }

        .star-half {
          color: #f1c40f;
          font-size: 12px;
        }

        .star-empty {
          color: #bdc3c7;
          font-size: 12px;
        }

        .review-count {
          color: #7f8c8d;
          font-size: 11px;
        }

        .price-container {
          margin-top: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .original-price {
          font-size: 13px;
          color: #95a5a6;
          text-decoration: line-through;
        }

        .discounted-price {
          font-size: 18px;
          font-weight: bold;
          color: #e67e22;
        }

        .price {
          font-size: 18px;
          font-weight: bold;
          color: #e67e22;
        }
      `}</style>

      <div className="section-container">
        {/* Header */}
        <div className="header">
          <div className="title-container">
            <span className="exclusive-tag">Popular & Recommended!</span>
            <h2 className="main-title">ART's Top Sellers for 2026</h2>
          </div>
          <Link href="/top-seller-treks" className="view-all-button">
            VIEW ALL TRIPS <span>→</span>
          </Link>
        </div>

        {/* Cards Grid */}
        <div className="cards-grid">
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
                className="card-container"
              >
                <div className="card">
                  {/* Image Container */}
                  <div className="image-container">
                    {heroImage ? (
                      <Image
                        src={heroImage}
                        alt={pkg.name}
                        fill
                        className="image"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="no-image">🏔️</div>
                    )}

                    {/* Badges */}
                    <div className="badges-container">
                      <span className="top-seller-badge">Top Seller</span>
                      {pkg.isBestSeller && (
                        <span className="best-seller-badge">Best Seller</span>
                      )}
                      {pkg.hasGuaranteedDeparture && (
                        <span className="guaranteed-badge">
                          Guaranteed Departures
                        </span>
                      )}
                    </div>

                    {/* Discount Badge */}
                    {pkg.discountedPrice &&
                      pkg.price &&
                      pkg.discountedPrice < pkg.price && (
                        <div className="discount-badge">
                          Save ${(pkg.price - pkg.discountedPrice).toFixed(0)}
                        </div>
                      )}
                  </div>

                  {/* Content */}
                  <div className="card-content">
                    {/* Duration */}
                    <div className="duration">
                      {pkg.durationDays} Days
                      {pkg.durationNights
                        ? ` / ${pkg.durationNights} Nights`
                        : ""}
                    </div>

                    {/* Title */}
                    <h3 className="title">{pkg.name}</h3>

                    {/* Rating */}
                    {renderStars(rating, reviews)}

                    {/* Price */}
                    <div className="price-container">
                      {pkg.discountedPrice ? (
                        <>
                          <span className="original-price">US${pkg.price}</span>
                          <span className="discounted-price">
                            US${pkg.discountedPrice}
                          </span>
                        </>
                      ) : (
                        <span className="price">US${pkg.price}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default TopSellersSection;
