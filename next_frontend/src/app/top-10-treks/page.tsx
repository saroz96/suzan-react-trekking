"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/pages/Footer";
import NotificationToast from "@/NotificationToast";
// import NotificationToast from "@/components/NotificationToast";
// import Footer from "@/components/Footer";

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

const TopTenTreks: React.FC = () => {
  const [packages, setPackages] = useState<TrekPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentHeroImageIndex, setCurrentHeroImageIndex] = useState(0);
  const [heroImages, setHeroImages] = useState<
    {
      imageUrl: string;
      title?: string;
      caption?: string;
      packageName: string;
    }[]
  >([]);
  const [windowWidth, setWindowWidth] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error" | "warning",
  });

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5232";

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
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchTopTenTreks();
  }, []);

  useEffect(() => {
    if (heroImages.length === 0) return;
    const interval = setInterval(() => {
      setCurrentHeroImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [heroImages]);

  const fetchTopTenTreks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/TrekPackage`);
      const data = await response.json();

      // Filter packages that are:
      // 1. Active (isActive === true)
      // 2. Have BOTH isBestSeller AND isTopSeller as true
      const premiumPackages = data.filter(
        (pkg: TrekPackage) =>
          pkg.isActive === true &&
          pkg.isBestSeller === true &&
          pkg.isTopSeller === true,
      );

      // Sort by createdAt (newest first) and take first 10
      const topTen = premiumPackages
        .sort((a: TrekPackage, b: TrekPackage) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        })
        .slice(0, 10);

      setPackages(topTen);

      // Extract hero images from top ten treks
      const allImages: {
        imageUrl: string;
        title?: string;
        caption?: string;
        packageName: string;
      }[] = [];
      topTen.forEach((pkg: TrekPackage) => {
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
    } catch (error: any) {
      console.error("Error fetching top ten treks:", error);
      showNotification(error.message || "Error loading top ten treks", "error");
    } finally {
      setLoading(false);
    }
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

  const nextHeroImage = () => {
    setCurrentHeroImageIndex((prev) => (prev + 1) % heroImages.length);
  };

  const prevHeroImage = () => {
    setCurrentHeroImageIndex(
      (prev) => (prev - 1 + heroImages.length) % heroImages.length,
    );
  };

  if (loading) {
    return (
      <div className="top-ten-treks-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading top ten treks...</p>
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

        .trek-card {
          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
        }

        .trek-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
      `}</style>

      <div className="top-ten-treks-container">
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
                  <h1 className="hero-title">Top 10 Treks in Nepal</h1>
                  <p className="hero-subtitle">
                    The ultimate collection of treks that are both Best Sellers
                    AND Top Sellers
                  </p>
                  <div className="stats-badge">
                    <span className="stats-icon">🏆</span>
                    <span className="stats-text">
                      {packages.length} Premium Active Treks
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
          <span className="breadcrumb-current">Top 10 Treks</span>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Introduction Section */}
          <div className="intro-section">
            <p className="intro-text">
              Discover the 10 most exceptional trekking experiences in Nepal.
              These hand-picked journeys have earned the prestigious distinction
              of being both <strong>Best Sellers</strong> and{" "}
              <strong>Top Sellers</strong>, representing the absolute best of
              what the Himalayas have to offer. Each trek promises unparalleled
              adventure, stunning scenery, and unforgettable memories.
            </p>
          </div>

          {/* Packages Grid */}
          <div className="packages-container">
            <div className="results-summary">
              <p className="results-text">
                Showing <strong>{packages.length}</strong> premium active treks
                {packages.length > 0 && " (Best Seller + Top Seller)"}
              </p>
            </div>

            {packages.length === 0 ? (
              <div className="no-results">
                <p className="no-results-text">
                  No premium treks available at the moment.
                </p>
                <p className="no-results-sub-text">
                  Treks that are both Best Sellers and Top Sellers will appear
                  here.
                </p>
                <Link href="/" className="reset-button-large">
                  Browse All Trips →
                </Link>
              </div>
            ) : (
              <div className="packages-grid">
                {packages.map((pkg, index) => {
                  const { rating, reviews } = getRandomRating(pkg.id);
                  return (
                    <Link
                      href={`/trip/${createSlug(pkg.name)}-${pkg.id}`}
                      key={pkg.id}
                      className="package-card trek-card"
                    >
                      {/* Rank Badge */}
                      <div className="rank-badge">
                        <span className="rank-number">{index + 1}</span>
                        <span className="rank-text">TOP</span>
                      </div>

                      <div className="image-container">
                        {pkg.sliderImages && pkg.sliderImages.length > 0 ? (
                          <div className="package-image-wrapper">
                            <Image
                              src={getFullImageUrl(
                                pkg.sliderImages[0].imageUrl,
                              )}
                              alt={pkg.name}
                              fill
                              className="package-image"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <div className="no-image">
                            <span>🏔️</span>
                          </div>
                        )}

                        <div className="top-badges">
                          <span className="bestseller-badge">Best Seller</span>
                          <span className="topseller-badge">Top Seller</span>
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

                        {pkg.shortDescription && (
                          <p className="short-description">
                            {pkg.shortDescription.length > 100
                              ? `${pkg.shortDescription.substring(0, 100)}...`
                              : pkg.shortDescription}
                          </p>
                        )}

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

        {/* Premium Badge Section */}
        {packages.length > 0 && (
          <div className="premium-section">
            <div className="premium-content">
              <div className="premium-badge">
                <span className="premium-icon">👑</span>
                <span className="premium-text">Premium Selection</span>
              </div>
              <h2 className="premium-title">Why These Treks?</h2>
              <p className="premium-description">
                These active treks have earned the rare distinction of being
                both
                <strong> Best Sellers </strong> and{" "}
                <strong> Top Sellers </strong>, meaning they are the most booked
                AND most highly recommended by our trekkers. Each journey
                offers:
              </p>
              <div className="features-list">
                <div className="feature-item">
                  <span className="feature-icon">⭐</span>
                  <span>Best Seller Status</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🔥</span>
                  <span>Top Seller Rating</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🏔️</span>
                  <span>Stunning Himalayan Views</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🤝</span>
                  <span>Expert Local Guides</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🛡️</span>
                  <span>Guaranteed Departures</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">📞</span>
                  <span>24/7 Support</span>
                </div>
              </div>
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
  .top-ten-treks-container {
    min-height: 100vh;
    background-color: #f8f9fa;
    font-family: Arial, sans-serif;
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

  .intro-section {
    margin-bottom: 40px;
    text-align: center;
  }

  .intro-text {
    font-size: 16px;
    line-height: 1.8;
    color: #666;
    max-width: 800px;
    margin: 0 auto;
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
    margin-bottom: 10px;
  }

  .no-results-sub-text {
    font-size: 14px;
    color: #7f8c8d;
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
    text-decoration: none;
    display: inline-block;
  }

  .reset-button-large:hover {
    background-color: #d35400;
  }

  .packages-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
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
    position: relative;
  }

  .rank-badge {
    position: absolute;
    top: 15px;
    right: 15px;
    background-color: #e67e22;
    color: white;
    border-radius: 8px;
    padding: 8px 12px;
    text-align: center;
    z-index: 3;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .rank-number {
    font-size: 20px;
    font-weight: bold;
    display: block;
  }

  .rank-text {
    font-size: 10px;
    font-weight: bold;
    letter-spacing: 0.5px;
  }

  .image-container {
    position: relative;
    height: 220px;
    background-color: #f0f0f0;
    overflow: hidden;
  }

  .package-image-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
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
    padding: 20px;
  }

  .card-title {
    font-size: 18px;
    font-weight: bold;
    color: #2c3e50;
    margin-bottom: 8px;
    line-height: 1.3;
  }

  .short-description {
    font-size: 13px;
    color: #666;
    line-height: 1.5;
    margin-bottom: 10px;
  }

  .rating-container {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 10px;
  }

  .stars {
    color: #f39c12;
    font-size: 12px;
    letter-spacing: 1px;
  }

  .rating-text {
    font-size: 12px;
    font-weight: bold;
    color: #2c3e50;
  }

  .review-count {
    font-size: 11px;
    color: #7f8c8d;
  }

  .price-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .price-label {
    font-size: 12px;
    color: #7f8c8d;
  }

  .price-container {
    display: flex;
    align-items: center;
    gap: 8px;
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

  .view-details {
    font-size: 13px;
    color: #e67e22;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 5px;
    margin-top: 10px;
  }

  .arrow {
    font-size: 14px;
    transition: transform 0.2s;
  }

  .package-card:hover .arrow {
    transform: translateX(4px);
  }

  .premium-section {
    background-color: #fff3e0;
    padding: 60px 20px;
    border-top: 1px solid #ffe0b3;
    border-bottom: 1px solid #ffe0b3;
  }

  .premium-content {
    max-width: 1000px;
    margin: 0 auto;
    text-align: center;
  }

  .premium-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background-color: #e67e22;
    color: white;
    padding: 8px 20px;
    border-radius: 50px;
    margin-bottom: 20px;
  }

  .premium-icon {
    font-size: 20px;
  }

  .premium-text {
    font-size: 14px;
    font-weight: bold;
  }

  .premium-title {
    font-size: 32px;
    font-weight: bold;
    color: #2c3e50;
    margin-bottom: 20px;
  }

  .premium-description {
    font-size: 16px;
    line-height: 1.8;
    color: #666;
    max-width: 800px;
    margin: 0 auto 30px;
  }

  .features-list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-top: 30px;
  }

  @media (max-width: 768px) {
    .features-list {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 480px) {
    .features-list {
      grid-template-columns: 1fr;
    }
  }

  .feature-item {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 14px;
    color: #2c3e50;
    padding: 10px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .feature-icon {
    font-size: 18px;
  }
`;

export default TopTenTreks;
