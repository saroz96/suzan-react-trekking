// "use client";

// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import Link from "next/link";

// interface HeroSectionProps {
//   onSearch?: (query: string) => void;
// }

// const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => {
//   const router = useRouter();
//   const [searchQuery, setSearchQuery] = useState("");

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       if (onSearch) {
//         onSearch(searchQuery);
//       } else {
//         // Redirect to the new search results page
//         router.push(`/search-result?q=${encodeURIComponent(searchQuery)}`);
//       }
//     }
//   };

//   // Hero images - one large, two smaller in a single row
//   const heroImages = [
//     {
//       url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&h=800&fit=crop",
//       alt: "Everest Base Camp Trek",
//       title: "Everest Region",
//       slug: "everest-region",
//     },
//     {
//       url: "https://t3.ftcdn.net/jpg/03/09/46/88/360_F_309468860_TWLq9Bi0wtVcuJEtQHiXtg1eCRlHcVyv.jpg",
//       alt: "Annapurna Circuit Trek",
//       title: "Annapurna Region",
//       slug: "annapurna-region",
//     },
//     {
//       url: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=800&fit=crop",
//       alt: "Langtang Valley Trek",
//       title: "Langtang Region",
//       slug: "langtang-region",
//     },
//   ];

//   return (
//     <div style={styles.heroSection}>
//       <div style={styles.heroOverlay}></div>
//       <div style={styles.heroContainer}>
//         {/* Left Side - Text Content */}
//         <div style={styles.heroLeftContent}>
//           <div style={styles.badgeWrapper}>
//             <span style={styles.expertBadge}>
//               <svg
//                 width="16"
//                 height="16"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//               >
//                 <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z" />
//               </svg>
//               Expert Guidance & Custom Plans
//             </span>
//           </div>
//           <h1 style={styles.heroTitle}>
//             Discover Your Path
//             <br />
//             <span style={styles.heroTitleHighlight}>in the Himalayas</span>
//           </h1>
//           <p style={styles.heroDescription}>
//             Join thousands of adventurers who have experienced the magic of the
//             Himalayas with our expert local guides. From Everest Base Camp to
//             hidden mountain valleys, we craft unforgettable journeys tailored
//             just for you.
//           </p>

//           {/* Search Input */}
//           <form onSubmit={handleSearch} style={styles.searchForm}>
//             <div style={styles.searchWrapper}>
//               <div style={styles.searchIcon}>
//                 <svg
//                   width="20"
//                   height="20"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                 >
//                   <circle cx="11" cy="11" r="8" />
//                   <line x1="21" y1="21" x2="16.65" y2="16.65" />
//                 </svg>
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search treks, destinations, or activities..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 style={styles.searchInput}
//               />
//               <button type="submit" style={styles.searchButton}>
//                 Find Adventure
//                 <svg
//                   width="18"
//                   height="18"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   style={{ marginLeft: "8px" }}
//                 >
//                   <line x1="5" y1="12" x2="19" y2="12" />
//                   <polyline points="12 5 19 12 12 19" />
//                 </svg>
//               </button>
//             </div>
//           </form>

//           {/* Trust Indicators */}
//           <div style={styles.trustIndicators}>
//             <div style={styles.trustItem}>
//               <svg
//                 width="20"
//                 height="20"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="#e67e22"
//                 strokeWidth="2"
//               >
//                 <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
//                 <polyline points="22 4 12 14.01 9 11.01" />
//               </svg>
//               <span>10+ Years Experience</span>
//             </div>
//             <div style={styles.trustItem}>
//               <svg
//                 width="20"
//                 height="20"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="#e67e22"
//                 strokeWidth="2"
//               >
//                 <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
//                 <circle cx="12" cy="7" r="4" />
//               </svg>
//               <span>5000+ Happy Travelers</span>
//             </div>
//             <div style={styles.trustItem}>
//               <svg
//                 width="20"
//                 height="20"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="#e67e22"
//                 strokeWidth="2"
//               >
//                 <circle cx="12" cy="12" r="10" />
//                 <path d="M12 6v6l4 2" />
//               </svg>
//               <span>24/7 Local Support</span>
//             </div>
//           </div>
//         </div>

//         {/* Right Side - 3 Images in a Single Row */}
//         <div style={styles.heroImagesRow}>
//           {/* Two Small Images - Side by Side in a Row */}
//           <div style={styles.smallImagesRow}>
//             {heroImages.slice(1).map((image, index) => (
//               <Link
//                 key={index}
//                 href={`/destinations/${image.slug}`}
//                 style={{ textDecoration: "none", flex: 1 }}
//               >
//                 <div style={styles.heroImageCardSmall}>
//                   <Image
//                     src={image.url}
//                     alt={image.alt}
//                     width={400}
//                     height={300}
//                     style={styles.heroImage}
//                     priority={index === 0}
//                   />
//                   <div style={styles.heroImageOverlay}>
//                     <span style={styles.heroImageTitle}>{image.title}</span>
//                     <span style={styles.heroImageSubtitle}>View Treks →</span>
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>
//           {/* Large Image */}
//           <Link
//             href={`/destinations/${heroImages[0].slug}`}
//             style={{ textDecoration: "none", flex: "0 0 55%" }}
//           >
//             <div style={styles.largeImageWrapper}>
//               <div style={styles.heroImageCard}>
//                 <Image
//                   src={heroImages[0].url}
//                   alt={heroImages[0].alt}
//                   width={600}
//                   height={500}
//                   style={styles.heroImage}
//                   priority
//                 />
//                 <div style={styles.heroImageOverlay}>
//                   <span style={styles.heroImageTitle}>
//                     {heroImages[0].title}
//                   </span>
//                   <span style={styles.heroImageSubtitle}>Most Popular →</span>
//                 </div>
//               </div>
//             </div>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// const styles: { [key: string]: React.CSSProperties } = {
//   heroSection: {
//     minHeight: "90vh",
//     backgroundColor: "#DDF4FC",
//     position: "relative",
//     overflow: "hidden",
//   },
//   heroOverlay: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     background:
//       "radial-gradient(circle at 20% 50%, rgba(221, 244, 252, 0.95), rgba(221, 244, 252, 0.98))",
//     zIndex: 1,
//   },
//   heroContainer: {
//     display: "flex",
//     maxWidth: "1400px",
//     margin: "0 auto",
//     minHeight: "90vh",
//     alignItems: "center",
//     gap: "60px",
//     position: "relative",
//     zIndex: 2,
//     padding: "0 40px",
//   },
//   heroLeftContent: {
//     flex: "0 0 45%",
//     zIndex: 2,
//   },
//   badgeWrapper: {
//     marginBottom: "24px",
//   },
//   expertBadge: {
//     display: "inline-flex",
//     alignItems: "center",
//     gap: "8px",
//     backgroundColor: "rgba(230, 126, 34, 0.15)",
//     padding: "8px 20px",
//     borderRadius: "40px",
//     fontSize: "14px",
//     fontWeight: "600",
//     color: "#e67e22",
//     backdropFilter: "blur(10px)",
//   },
//   heroTitle: {
//     fontSize: "56px",
//     fontWeight: "800",
//     color: "#1a2a3a",
//     marginBottom: "20px",
//     lineHeight: "1.2",
//     letterSpacing: "-0.02em",
//   },
//   heroTitleHighlight: {
//     background: "linear-gradient(135deg, #e67e22, #f39c12)",
//     backgroundClip: "text",
//     WebkitBackgroundClip: "text",
//     color: "transparent",
//   },
//   heroDescription: {
//     fontSize: "16px",
//     lineHeight: "1.6",
//     color: "#5a6e7a",
//     marginBottom: "32px",
//     maxWidth: "90%",
//   },
//   searchForm: {
//     width: "100%",
//     marginBottom: "32px",
//   },
//   searchWrapper: {
//     display: "flex",
//     alignItems: "center",
//     backgroundColor: "white",
//     borderRadius: "60px",
//     overflow: "hidden",
//     boxShadow: "0 20px 40px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.05)",
//     border: "1px solid rgba(0,0,0,0.05)",
//     transition: "all 0.3s ease",
//   },
//   searchIcon: {
//     padding: "0 0 0 20px",
//     display: "flex",
//     alignItems: "center",
//     color: "#999",
//   },
//   searchInput: {
//     flex: 1,
//     padding: "18px 16px",
//     border: "none",
//     fontSize: "16px",
//     outline: "none",
//     fontFamily: "inherit",
//     backgroundColor: "transparent",
//   } as React.CSSProperties,
//   searchButton: {
//     padding: "18px 32px",
//     backgroundColor: "#e67e22",
//     color: "white",
//     border: "none",
//     fontSize: "15px",
//     fontWeight: "600",
//     cursor: "pointer",
//     transition: "all 0.3s ease",
//     display: "flex",
//     alignItems: "center",
//     gap: "8px",
//     whiteSpace: "nowrap",
//   } as React.CSSProperties,
//   trustIndicators: {
//     display: "flex",
//     gap: "24px",
//     marginTop: "24px",
//     flexWrap: "wrap",
//   },
//   trustItem: {
//     display: "flex",
//     alignItems: "center",
//     gap: "8px",
//     fontSize: "14px",
//     color: "#5a6e7a",
//     fontWeight: "500",
//   },
//   heroImagesRow: {
//     flex: "0 0 50%",
//     display: "flex",
//     gap: "20px",
//     alignItems: "stretch",
//   },
//   largeImageWrapper: {
//     flex: "0 0 55%",
//     height: "100%",
//   },
//   heroImageCard: {
//     position: "relative",
//     borderRadius: "24px",
//     overflow: "hidden",
//     boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
//     height: "100%",
//     minHeight: "500px",
//     cursor: "pointer",
//     transition: "transform 0.3s ease, box-shadow 0.3s ease",
//   },
//   smallImagesRow: {
//     flex: "0 0 45%",
//     display: "flex",
//     gap: "20px",
//     flexDirection: "column",
//   },
//   heroImageCardSmall: {
//     position: "relative",
//     borderRadius: "24px",
//     overflow: "hidden",
//     boxShadow: "0 20px 40px -12px rgba(0,0,0,0.2)",
//     flex: 1,
//     minHeight: "240px",
//     cursor: "pointer",
//     transition: "transform 0.3s ease, box-shadow 0.3s ease",
//   },
//   heroImage: {
//     width: "100%",
//     height: "100%",
//     objectFit: "cover",
//     transition: "transform 0.5s ease",
//   },
//   heroImageOverlay: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
//     padding: "24px",
//     display: "flex",
//     flexDirection: "column",
//     gap: "4px",
//   },
//   heroImageTitle: {
//     color: "white",
//     fontSize: "18px",
//     fontWeight: "bold",
//     textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
//   },
//   heroImageSubtitle: {
//     color: "rgba(255,255,255,0.9)",
//     fontSize: "12px",
//     fontWeight: "500",
//     textTransform: "uppercase",
//     letterSpacing: "0.5px",
//   },
// };

// export default HeroSection;


//-------------------------------------------------------------end

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

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

interface HeroImage {
  url: string;
  alt: string;
  title: string;
  slug: string;
  packageId: number;
}

interface HeroSectionProps {
  onSearch?: (query: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(true);

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

  const fetchLatestPackages = async () => {
    try {
      setLoading(true);
      // Fetch latest 3 active packages
      const response = await api.get("/api/TrekPackage", {
        params: {
          pageSize: 3,
          sortBy: "createdAt",
          sortOrder: "desc",
        },
      });

      let packages: TrekPackage[] = [];
      
      // Handle different response structures
      if (response.data.items) {
        packages = response.data.items;
      } else if (Array.isArray(response.data)) {
        packages = response.data;
      } else {
        packages = [];
      }

      // Filter only active packages
      const activePackages = packages.filter((pkg) => pkg.isActive === true);

      // Map to hero images
      const images: HeroImage[] = activePackages.map((pkg) => ({
        url: pkg.sliderImages && pkg.sliderImages.length > 0
          ? getFullImageUrl(pkg.sliderImages[0].imageUrl)
          : pkg.routeMapImageUrl
          ? getFullImageUrl(pkg.routeMapImageUrl)
          : "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&h=800&fit=crop",
        alt: pkg.name,
        title: pkg.headingName || pkg.countryName,
        slug: `${createSlug(pkg.name)}-${pkg.id}`,
        packageId: pkg.id,
      }));

      // Ensure we have at least 3 images, fallback to defaults if needed
      if (images.length >= 3) {
        setHeroImages(images);
      } else if (images.length === 2) {
        setHeroImages([
          images[0],
          images[1],
          {
            url: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=800&fit=crop",
            alt: "Himalayan Trek",
            title: "Himalayan Region",
            slug: "treks",
            packageId: 0,
          },
        ]);
      } else if (images.length === 1) {
        setHeroImages([
          images[0],
          {
            url: "https://t3.ftcdn.net/jpg/03/09/46/88/360_F_309468860_TWLq9Bi0wtVcuJEtQHiXtg1eCRlHcVyv.jpg",
            alt: "Mountain Trek",
            title: "Mountain Region",
            slug: "treks",
            packageId: 0,
          },
          {
            url: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=800&fit=crop",
            alt: "Valley Trek",
            title: "Valley Region",
            slug: "treks",
            packageId: 0,
          },
        ]);
      } else {
        // Use default images
        setHeroImages([
          {
            url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&h=800&fit=crop",
            alt: "Everest Base Camp Trek",
            title: "Everest Region",
            slug: "treks",
            packageId: 0,
          },
          {
            url: "https://t3.ftcdn.net/jpg/03/09/46/88/360_F_309468860_TWLq9Bi0wtVcuJEtQHiXtg1eCRlHcVyv.jpg",
            alt: "Annapurna Circuit Trek",
            title: "Annapurna Region",
            slug: "treks",
            packageId: 0,
          },
          {
            url: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=800&fit=crop",
            alt: "Langtang Valley Trek",
            title: "Langtang Region",
            slug: "treks",
            packageId: 0,
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching latest packages:", error);
      // Set default images on error
      setHeroImages([
        {
          url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&h=800&fit=crop",
          alt: "Everest Base Camp Trek",
          title: "Everest Region",
          slug: "treks",
          packageId: 0,
        },
        {
          url: "https://t3.ftcdn.net/jpg/03/09/46/88/360_F_309468860_TWLq9Bi0wtVcuJEtQHiXtg1eCRlHcVyv.jpg",
          alt: "Annapurna Circuit Trek",
          title: "Annapurna Region",
          slug: "treks",
          packageId: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=800&fit=crop",
          alt: "Langtang Valley Trek",
          title: "Langtang Region",
          slug: "treks",
          packageId: 0,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestPackages();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (onSearch) {
        onSearch(searchQuery);
      } else {
        router.push(`/search-result?q=${encodeURIComponent(searchQuery)}`);
      }
    }
  };

  if (loading) {
    return (
      <div style={styles.heroSection}>
        <div style={styles.heroOverlay}></div>
        <div style={styles.heroContainer}>
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p>Loading adventures...</p>
          </div>
        </div>
      </div>
    );
  }

  // Ensure we have exactly 3 images
  const displayImages = heroImages.length >= 3 ? heroImages : [...heroImages, ...heroImages.slice(0, 3 - heroImages.length)];
  const largeImage = displayImages[0];
  const smallImages = displayImages.slice(1, 3);

  return (
    <div style={styles.heroSection}>
      <div style={styles.heroOverlay}></div>
      <div style={styles.heroContainer}>
        {/* Left Side - Text Content */}
        <div style={styles.heroLeftContent}>
          <div style={styles.badgeWrapper}>
            <span style={styles.expertBadge}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z" />
              </svg>
              Expert Guidance & Custom Plans
            </span>
          </div>
          <h1 style={styles.heroTitle}>
            Discover Your Path
            <br />
            <span style={styles.heroTitleHighlight}>in the Himalayas</span>
          </h1>
          <p style={styles.heroDescription}>
            Join thousands of adventurers who have experienced the magic of the
            Himalayas with our expert local guides. From Everest Base Camp to
            hidden mountain valleys, we craft unforgettable journeys tailored
            just for you.
          </p>

          {/* Search Input */}
          <form onSubmit={handleSearch} style={styles.searchForm}>
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
              />
              <button type="submit" style={styles.searchButton}>
                Find Adventure
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

          {/* Trust Indicators */}
          <div style={styles.trustIndicators}>
            <div style={styles.trustItem}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#e67e22"
                strokeWidth="2"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>10+ Years Experience</span>
            </div>
            <div style={styles.trustItem}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#e67e22"
                strokeWidth="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>5000+ Happy Travelers</span>
            </div>
            <div style={styles.trustItem}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#e67e22"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <span>24/7 Local Support</span>
            </div>
          </div>
        </div>

        {/* Right Side - 3 Images in a Single Row */}
        <div style={styles.heroImagesRow}>
          {/* Two Small Images - Side by Side in a Row */}
          <div style={styles.smallImagesRow}>
            {smallImages.map((image, index) => (
              <Link
                key={index}
                href={image.packageId !== 0 ? `/trip/${image.slug}` : `/destinations/${image.slug}`}
                style={{ textDecoration: "none", flex: 1 }}
              >
                <div style={styles.heroImageCardSmall}>
                  <Image
                    src={image.url}
                    alt={image.alt}
                    width={400}
                    height={300}
                    style={styles.heroImage}
                    priority={index === 0}
                    unoptimized
                  />
                  <div style={styles.heroImageOverlay}>
                    <span style={styles.heroImageTitle}>{image.title}</span>
                    <span style={styles.heroImageSubtitle}>View Treks →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {/* Large Image */}
          <Link
            href={largeImage.packageId !== 0 ? `/trip/${largeImage.slug}` : `/destinations/${largeImage.slug}`}
            style={{ textDecoration: "none", flex: "0 0 55%" }}
          >
            <div style={styles.largeImageWrapper}>
              <div style={styles.heroImageCard}>
                <Image
                  src={largeImage.url}
                  alt={largeImage.alt}
                  width={600}
                  height={500}
                  style={styles.heroImage}
                  priority
                  unoptimized
                />
                <div style={styles.heroImageOverlay}>
                  <span style={styles.heroImageTitle}>{largeImage.title}</span>
                  <span style={styles.heroImageSubtitle}>Most Popular →</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  heroSection: {
    minHeight: "90vh",
    backgroundColor: "#DDF4FC",
    position: "relative",
    overflow: "hidden",
  },
  heroOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "radial-gradient(circle at 20% 50%, rgba(221, 244, 252, 0.95), rgba(221, 244, 252, 0.98))",
    zIndex: 1,
  },
  heroContainer: {
    display: "flex",
    maxWidth: "1400px",
    margin: "0 auto",
    minHeight: "90vh",
    alignItems: "center",
    gap: "60px",
    position: "relative",
    zIndex: 2,
    padding: "0 40px",
  },
  heroLeftContent: {
    flex: "0 0 45%",
    zIndex: 2,
  },
  badgeWrapper: {
    marginBottom: "24px",
  },
  expertBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "rgba(230, 126, 34, 0.15)",
    padding: "8px 20px",
    borderRadius: "40px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#e67e22",
    backdropFilter: "blur(10px)",
  },
  heroTitle: {
    fontSize: "56px",
    fontWeight: "800",
    color: "#1a2a3a",
    marginBottom: "20px",
    lineHeight: "1.2",
    letterSpacing: "-0.02em",
  },
  heroTitleHighlight: {
    background: "linear-gradient(135deg, #e67e22, #f39c12)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    color: "transparent",
  },
  heroDescription: {
    fontSize: "16px",
    lineHeight: "1.6",
    color: "#5a6e7a",
    marginBottom: "32px",
    maxWidth: "90%",
  },
  searchForm: {
    width: "100%",
    marginBottom: "32px",
  },
  searchWrapper: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: "60px",
    overflow: "hidden",
    boxShadow: "0 20px 40px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.05)",
    border: "1px solid rgba(0,0,0,0.05)",
    transition: "all 0.3s ease",
  },
  searchIcon: {
    padding: "0 0 0 20px",
    display: "flex",
    alignItems: "center",
    color: "#999",
  },
  searchInput: {
    flex: 1,
    padding: "18px 16px",
    border: "none",
    fontSize: "16px",
    outline: "none",
    fontFamily: "inherit",
    backgroundColor: "transparent",
  } as React.CSSProperties,
  searchButton: {
    padding: "18px 32px",
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
  trustIndicators: {
    display: "flex",
    gap: "24px",
    marginTop: "24px",
    flexWrap: "wrap",
  },
  trustItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    color: "#5a6e7a",
    fontWeight: "500",
  },
  heroImagesRow: {
    flex: "0 0 50%",
    display: "flex",
    gap: "20px",
    alignItems: "stretch",
  },
  largeImageWrapper: {
    flex: "0 0 55%",
    height: "100%",
  },
  heroImageCard: {
    position: "relative",
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
    height: "100%",
    minHeight: "500px",
    cursor: "pointer",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  smallImagesRow: {
    flex: "0 0 45%",
    display: "flex",
    gap: "20px",
    flexDirection: "column",
  },
  heroImageCardSmall: {
    position: "relative",
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 20px 40px -12px rgba(0,0,0,0.2)",
    flex: 1,
    minHeight: "240px",
    cursor: "pointer",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.5s ease",
  },
  heroImageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  heroImageTitle: {
    color: "white",
    fontSize: "18px",
    fontWeight: "bold",
    textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
  },
  heroImageSubtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: "12px",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: "100px",
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

export default HeroSection;