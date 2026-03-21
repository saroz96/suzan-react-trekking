// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import NotificationToast from "../NotificationToast";

// // Types
// interface TrekPackage {
//   id: number;
//   name: string;
//   shortDescription?: string;
//   price?: number;
//   discountedPrice?: number;
//   durationDays?: number;
//   durationNights?: number;
//   tripGrade?: string;
//   countryId: number;
//   countryName: string;
//   mainHeadingId: number;
//   mainHeadingName: string;
//   headingId: number;
//   headingName: string;
//   subHeadingId?: number;
//   subHeadingName?: string;
//   maximumAltitude?: string;
//   groupSize?: string;
//   startsAt?: string;
//   endsAt?: string;
//   activities?: string;
//   bestTime?: string;
//   overview?: string;
//   essentialInformation?: string;
//   videoReviewUrl?: string;
//   routeMapImageUrl?: string;
//   isActive: boolean;
//   createdAt: string;
//   updatedAt?: string;
//   sliderImages: {
//     id: number;
//     imageUrl: string;
//     title?: string;
//     caption?: string;
//     altText?: string;
//     displayOrder: number;
//   }[];
//   isBestSeller?: boolean;
//   isTopSeller?: boolean;
//   hasGuaranteedDeparture?: boolean;
// }

// const TopTenTreks: React.FC = () => {
//   const [packages, setPackages] = useState<TrekPackage[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [currentHeroImageIndex, setCurrentHeroImageIndex] = useState(0);
//   const [heroImages, setHeroImages] = useState<
//     {
//       imageUrl: string;
//       title?: string;
//       caption?: string;
//       packageName: string;
//     }[]
//   >([]);
//   const [notification, setNotification] = useState({
//     show: false,
//     message: "",
//     type: "success" as "success" | "error" | "warning",
//   });

//   const API_BASE_URL =
//     import.meta.env.VITE_API_BASE_URL || "http://localhost:5232";

//   const api = axios.create({
//     baseURL: API_BASE_URL,
//     withCredentials: true,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   const getFullImageUrl = (imageUrl: string | undefined): string => {
//     if (!imageUrl) return "";
//     if (imageUrl.startsWith("http") || imageUrl.startsWith("blob:")) {
//       return imageUrl;
//     }
//     const baseUrl = API_BASE_URL.endsWith("/")
//       ? API_BASE_URL.slice(0, -1)
//       : API_BASE_URL;
//     const normalizedUrl = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
//     return `${baseUrl}${normalizedUrl}`;
//   };

//   const createSlug = (name: string): string => {
//     return name
//       .toLowerCase()
//       .replace(/[^\w\s-]/g, "")
//       .replace(/\s+/g, "-")
//       .replace(/-+/g, "-");
//   };

//   useEffect(() => {
//     fetchTopTenTreks();
//   }, []);

//   useEffect(() => {
//     if (heroImages.length === 0) return;
//     const interval = setInterval(() => {
//       setCurrentHeroImageIndex((prev) => (prev + 1) % heroImages.length);
//     }, 4000);
//     return () => clearInterval(interval);
//   }, [heroImages]);

//   const fetchTopTenTreks = async () => {
//     try {
//       setLoading(true);
//       const response = await api.get("/api/TrekPackage");

//       // Filter packages that have BOTH isBestSeller AND isTopSeller as true
//       const topSellerPackages = response.data.filter(
//         (pkg: TrekPackage) =>
//           pkg.isBestSeller === true && pkg.isTopSeller === true,
//       );

//       // Sort by createdAt (newest first) and take first 10
//       const topTen = topSellerPackages
//         .sort((a: TrekPackage, b: TrekPackage) => {
//           return (
//             new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//           );
//         })
//         .slice(0, 10);

//       setPackages(topTen);

//       // Extract hero images from top ten treks
//       const allImages: {
//         imageUrl: string;
//         title?: string;
//         caption?: string;
//         packageName: string;
//       }[] = [];
//       topTen.forEach((pkg: TrekPackage) => {
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
//     } catch (error: any) {
//       console.error("Error fetching top ten treks:", error);
//       showNotification(
//         error.response?.data?.message || "Error loading top ten treks",
//         "error",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getRandomRating = (id: number) => {
//     const ratings = [4.5, 4.8, 4.3, 4.9, 4.2, 4.7];
//     const reviews = [12, 39, 17, 24, 8, 31];
//     return {
//       rating: ratings[id % ratings.length],
//       reviews: reviews[id % reviews.length],
//     };
//   };

//   const showNotification = (
//     message: string,
//     type: "success" | "error" | "warning",
//   ) => {
//     setNotification({ show: true, message, type });
//   };

//   if (loading) {
//     return (
//       <div style={styles.container}>
//         <div style={styles.loadingContainer}>
//           <div style={styles.spinner}></div>
//           <p>Loading top ten treks...</p>
//         </div>
//       </div>
//     );
//   }

//   const currentHeroImage = heroImages[currentHeroImageIndex] || null;

//   return (
//     <div style={styles.container}>
//       {/* Hero Section with Slider */}
//       <div style={styles.heroSection}>
//         {currentHeroImage && (
//           <>
//             <img
//               src={getFullImageUrl(currentHeroImage.imageUrl)}
//               alt={currentHeroImage.title || currentHeroImage.packageName}
//               style={styles.heroBackgroundImage}
//             />
//             <div style={styles.heroOverlay}>
//               <div style={styles.heroContent}>
//                 <h1 style={styles.heroTitle}>Top 10 Treks in Nepal</h1>
//                 <p style={styles.heroSubtitle}>
//                   The ultimate collection of treks that are both Best Sellers
//                   AND Top Sellers
//                 </p>
//                 <div style={styles.statsBadge}>
//                   <span style={styles.statsIcon}>🏆</span>
//                   <span style={styles.statsText}>
//                     {packages.length} Premium Treks
//                   </span>
//                 </div>
//                 {currentHeroImage.caption && (
//                   <div style={styles.imageCaption}>
//                     {currentHeroImage.caption}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </>
//         )}

//         {heroImages.length > 1 && (
//           <>
//             <button
//               onClick={() =>
//                 setCurrentHeroImageIndex(
//                   (prev) => (prev - 1 + heroImages.length) % heroImages.length,
//                 )
//               }
//               style={{ ...styles.heroArrow, left: "20px" }}
//             >
//               ❮
//             </button>
//             <button
//               onClick={() =>
//                 setCurrentHeroImageIndex(
//                   (prev) => (prev + 1) % heroImages.length,
//                 )
//               }
//               style={{ ...styles.heroArrow, right: "20px" }}
//             >
//               ❯
//             </button>
//             <div style={styles.heroIndicators}>
//               {heroImages.map((_, idx) => (
//                 <button
//                   key={idx}
//                   onClick={() => setCurrentHeroImageIndex(idx)}
//                   style={{
//                     ...styles.heroIndicator,
//                     backgroundColor:
//                       currentHeroImageIndex === idx
//                         ? "#e67e22"
//                         : "rgba(255,255,255,0.5)",
//                     width: currentHeroImageIndex === idx ? "30px" : "8px",
//                   }}
//                 />
//               ))}
//             </div>
//           </>
//         )}
//       </div>

//       {/* Breadcrumb */}
//       <div style={styles.breadcrumb}>
//         <Link to="/" style={styles.breadcrumbLink}>
//           Home
//         </Link>
//         <span style={styles.breadcrumbSeparator}>/</span>
//         <span style={styles.breadcrumbCurrent}>Top 10 Treks</span>
//       </div>

//       {/* Main Content */}
//       <div style={styles.mainContent}>
//         {/* Introduction Section */}
//         <div style={styles.introSection}>
//           <p style={styles.introText}>
//             Discover the 10 most exceptional trekking experiences in Nepal.
//             These hand-picked journeys have earned the prestigious distinction
//             of being both <strong>Best Sellers</strong> and{" "}
//             <strong>Top Sellers</strong>, representing the absolute best of what
//             the Himalayas have to offer. Each trek promises unparalleled
//             adventure, stunning scenery, and unforgettable memories.
//           </p>
//         </div>

//         {/* Packages Grid */}
//         <div style={styles.packagesContainer}>
//           <div style={styles.resultsSummary}>
//             <p style={styles.resultsText}>
//               Showing <strong>{packages.length}</strong> premium treks
//               {packages.length > 0 && " (Best Seller + Top Seller)"}
//             </p>
//           </div>

//           {packages.length === 0 ? (
//             <div style={styles.noResults}>
//               <p style={styles.noResultsText}>
//                 No premium treks available at the moment.
//               </p>
//               <p style={styles.noResultsSubText}>
//                 Treks that are both Best Sellers and Top Sellers will appear
//                 here.
//               </p>
//               <Link to="/" style={styles.resetButtonLarge}>
//                 Browse All Trips →
//               </Link>
//             </div>
//           ) : (
//             <div style={styles.packagesGrid}>
//               {packages.map((pkg, index) => {
//                 const { rating, reviews } = getRandomRating(pkg.id);
//                 return (
//                   <Link
//                     to={`/trip/${createSlug(pkg.name)}-${pkg.id}`}
//                     key={pkg.id}
//                     style={styles.packageCard}
//                     className="trek-card"
//                   >
//                     {/* Rank Badge */}
//                     <div style={styles.rankBadge}>
//                       <span style={styles.rankNumber}>{index + 1}</span>
//                       <span style={styles.rankText}>TOP</span>
//                     </div>

//                     <div style={styles.imageContainer}>
//                       {pkg.sliderImages && pkg.sliderImages.length > 0 ? (
//                         <img
//                           src={getFullImageUrl(pkg.sliderImages[0].imageUrl)}
//                           alt={pkg.name}
//                           style={styles.packageImage}
//                         />
//                       ) : (
//                         <div style={styles.noImage}>
//                           <span>🏔️</span>
//                         </div>
//                       )}

//                       <div style={styles.topBadges}>
//                         <span style={styles.bestsellerBadge}>Best Seller</span>
//                         <span style={styles.topsellerBadge}>Top Seller</span>
//                         {pkg.hasGuaranteedDeparture && (
//                           <span style={styles.guaranteedBadge}>
//                             Guaranteed Departures
//                           </span>
//                         )}
//                       </div>

//                       <div style={styles.durationContainer}>
//                         <span style={styles.durationNumber}>
//                           {pkg.durationDays}
//                         </span>
//                         <span style={styles.durationText}>Days</span>
//                       </div>

//                       {pkg.discountedPrice &&
//                         pkg.price &&
//                         pkg.discountedPrice < pkg.price && (
//                           <div style={styles.discountContainer}>
//                             <span style={styles.discountText}>
//                               Save $
//                               {(pkg.price - pkg.discountedPrice).toFixed(0)}
//                             </span>
//                           </div>
//                         )}
//                     </div>

//                     <div style={styles.contentSection}>
//                       <h3 style={styles.cardTitle}>{pkg.name}</h3>

//                       {pkg.shortDescription && (
//                         <p style={styles.shortDescription}>
//                           {pkg.shortDescription.length > 100
//                             ? `${pkg.shortDescription.substring(0, 100)}...`
//                             : pkg.shortDescription}
//                         </p>
//                       )}

//                       <div style={styles.ratingContainer}>
//                         <div style={styles.stars}>
//                           {"★".repeat(Math.floor(rating))}
//                           {rating % 1 !== 0 && "½"}
//                           {"☆".repeat(5 - Math.ceil(rating))}
//                         </div>
//                         <span style={styles.ratingText}>{rating}</span>
//                         <span style={styles.reviewCount}>
//                           ({reviews} reviews)
//                         </span>
//                       </div>

//                       <div style={styles.priceRow}>
//                         <span style={styles.priceLabel}>Price from</span>
//                         <div style={styles.priceContainer}>
//                           {pkg.discountedPrice ? (
//                             <>
//                               <span style={styles.originalPrice}>
//                                 US${pkg.price}
//                               </span>
//                               <span style={styles.discountedPrice}>
//                                 US${pkg.discountedPrice}
//                               </span>
//                             </>
//                           ) : (
//                             <span style={styles.discountedPrice}>
//                               US${pkg.price}
//                             </span>
//                           )}
//                         </div>
//                       </div>

//                       <div style={styles.viewDetails}>
//                         View Details <span style={styles.arrow}>→</span>
//                       </div>
//                     </div>
//                   </Link>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Premium Badge Section */}
//       {packages.length > 0 && (
//         <div style={styles.premiumSection}>
//           <div style={styles.premiumContent}>
//             <div style={styles.premiumBadge}>
//               <span style={styles.premiumIcon}>👑</span>
//               <span style={styles.premiumText}>Premium Selection</span>
//             </div>
//             <h2 style={styles.premiumTitle}>Why These Treks?</h2>
//             <p style={styles.premiumText}>
//               These treks have earned the rare distinction of being both
//               <strong> Best Sellers </strong> and <strong> Top Sellers </strong>
//               , meaning they are the most booked AND most highly recommended by
//               our trekkers. Each journey offers:
//             </p>
//             <div style={styles.featuresList}>
//               <div style={styles.featureItem}>
//                 <span style={styles.featureIcon}>⭐</span>
//                 <span>Best Seller Status</span>
//               </div>
//               <div style={styles.featureItem}>
//                 <span style={styles.featureIcon}>🔥</span>
//                 <span>Top Seller Rating</span>
//               </div>
//               <div style={styles.featureItem}>
//                 <span style={styles.featureIcon}>🏔️</span>
//                 <span>Stunning Himalayan Views</span>
//               </div>
//               <div style={styles.featureItem}>
//                 <span style={styles.featureIcon}>🤝</span>
//                 <span>Expert Local Guides</span>
//               </div>
//               <div style={styles.featureItem}>
//                 <span style={styles.featureIcon}>🛡️</span>
//                 <span>Guaranteed Departures</span>
//               </div>
//               <div style={styles.featureItem}>
//                 <span style={styles.featureIcon}>📞</span>
//                 <span>24/7 Support</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Need Help Section */}
//       <div style={styles.needHelp}>
//         <div style={styles.needHelpContent}>
//           <h3 style={styles.needHelpTitle}>Need Help Choosing?</h3>
//           <p style={styles.needHelpText}>
//             Our trekking experts are here to help you find the perfect trek for
//             your adventure.
//           </p>
//           <div style={styles.contactButtons}>
//             <a href="tel:+9779851175531" style={styles.phoneButton}>
//               📞 Call Us: +977 9851175531
//             </a>
//             <a href="/contact" style={styles.emailButton}>
//               ✉️ Contact Us
//             </a>
//           </div>
//         </div>
//       </div>

//       <NotificationToast
//         show={notification.show}
//         message={notification.message}
//         type={notification.type}
//         onClose={() => setNotification({ ...notification, show: false })}
//       />

//       <style>{`
//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }

//         .trek-card {
//           transition: transform 0.3s ease, box-shadow 0.3s ease;
//         }

//         .trek-card:hover {
//           transform: translateY(-5px);
//           box-shadow: 0 8px 25px rgba(0,0,0,0.15);
//         }
//       `}</style>
//     </div>
//   );
// };

// // ==================== STYLES ====================
// const styles = {
//   container: {
//     minHeight: "100vh",
//     backgroundColor: "#f8f9fa",
//     fontFamily: "Arial, sans-serif",
//   },
//   loadingContainer: {
//     display: "flex",
//     flexDirection: "column" as const,
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
//   heroSection: {
//     height: "500px",
//     position: "relative" as const,
//     overflow: "hidden",
//   },
//   heroBackgroundImage: {
//     position: "absolute" as const,
//     top: 0,
//     left: 0,
//     width: "100%",
//     height: "100%",
//     objectFit: "cover" as const,
//     transition: "opacity 0.5s ease-in-out",
//   },
//   heroOverlay: {
//     position: "absolute" as const,
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   heroContent: {
//     textAlign: "center" as const,
//     color: "white",
//     padding: "0 20px",
//     zIndex: 2,
//   },
//   heroTitle: {
//     fontSize: "48px",
//     fontWeight: "bold",
//     marginBottom: "10px",
//     textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
//   },
//   heroSubtitle: {
//     fontSize: "18px",
//     marginBottom: "20px",
//     opacity: 0.9,
//   },
//   statsBadge: {
//     display: "inline-flex",
//     alignItems: "center",
//     backgroundColor: "#e67e22",
//     padding: "10px 20px",
//     borderRadius: "50px",
//     gap: "10px",
//   },
//   statsIcon: {
//     fontSize: "20px",
//   },
//   statsText: {
//     fontSize: "16px",
//     fontWeight: "bold",
//   },
//   imageCaption: {
//     marginTop: "15px",
//     fontSize: "14px",
//     backgroundColor: "rgba(0,0,0,0.6)",
//     display: "inline-block",
//     padding: "5px 15px",
//     borderRadius: "20px",
//     maxWidth: "80%",
//   },
//   heroArrow: {
//     position: "absolute" as const,
//     top: "50%",
//     transform: "translateY(-50%)",
//     backgroundColor: "rgba(0,0,0,0.5)",
//     color: "white",
//     border: "none",
//     borderRadius: "50%",
//     width: "40px",
//     height: "40px",
//     cursor: "pointer",
//     fontSize: "20px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     transition: "all 0.2s",
//     zIndex: 3,
//   },
//   heroIndicators: {
//     position: "absolute" as const,
//     bottom: "20px",
//     left: "50%",
//     transform: "translateX(-50%)",
//     display: "flex",
//     gap: "10px",
//     zIndex: 3,
//   },
//   heroIndicator: {
//     height: "8px",
//     borderRadius: "4px",
//     border: "none",
//     cursor: "pointer",
//     padding: 0,
//     transition: "all 0.3s ease",
//   },
//   breadcrumb: {
//     maxWidth: "1200px",
//     margin: "20px auto",
//     padding: "0 20px",
//     fontSize: "14px",
//   },
//   breadcrumbLink: {
//     color: "#e67e22",
//     textDecoration: "none",
//   },
//   breadcrumbSeparator: {
//     margin: "0 8px",
//     color: "#999",
//   },
//   breadcrumbCurrent: {
//     color: "#666",
//   },
//   mainContent: {
//     maxWidth: "1200px",
//     margin: "0 auto",
//     padding: "0 20px 40px",
//   },
//   introSection: {
//     marginBottom: "40px",
//     textAlign: "center" as const,
//   },
//   introText: {
//     fontSize: "16px",
//     lineHeight: "1.8",
//     color: "#666",
//     maxWidth: "800px",
//     margin: "0 auto",
//   },
//   packagesContainer: {
//     flex: 1,
//   },
//   resultsSummary: {
//     marginBottom: "20px",
//   },
//   resultsText: {
//     fontSize: "16px",
//     color: "#2c3e50",
//     marginBottom: "5px",
//   },
//   noResults: {
//     textAlign: "center" as const,
//     padding: "60px",
//     backgroundColor: "white",
//     borderRadius: "12px",
//   },
//   noResultsText: {
//     fontSize: "18px",
//     color: "#999",
//     marginBottom: "10px",
//   },
//   noResultsSubText: {
//     fontSize: "14px",
//     color: "#7f8c8d",
//     marginBottom: "20px",
//   },
//   resetButtonLarge: {
//     backgroundColor: "#e67e22",
//     color: "white",
//     border: "none",
//     padding: "12px 24px",
//     borderRadius: "6px",
//     fontSize: "16px",
//     cursor: "pointer",
//     textDecoration: "none",
//     display: "inline-block",
//   },
//   packagesGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(2, 1fr)",
//     gap: "30px",
//   },
//   packageCard: {
//     backgroundColor: "white",
//     borderRadius: "12px",
//     overflow: "hidden",
//     boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//     textDecoration: "none",
//     color: "inherit",
//     transition: "transform 0.2s, boxShadow 0.2s",
//     position: "relative" as const,
//   },
//   rankBadge: {
//     position: "absolute" as const,
//     top: "15px",
//     right: "15px",
//     backgroundColor: "#e67e22",
//     color: "white",
//     borderRadius: "8px",
//     padding: "8px 12px",
//     textAlign: "center" as const,
//     zIndex: 3,
//     boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
//   },
//   rankNumber: {
//     fontSize: "20px",
//     fontWeight: "bold",
//     display: "block",
//   },
//   rankText: {
//     fontSize: "10px",
//     fontWeight: "bold",
//     letterSpacing: "0.5px",
//   },
//   imageContainer: {
//     position: "relative" as const,
//     height: "220px",
//     backgroundColor: "#f0f0f0",
//     overflow: "hidden",
//   },
//   packageImage: {
//     width: "100%",
//     height: "100%",
//     objectFit: "cover" as const,
//   },
//   noImage: {
//     width: "100%",
//     height: "100%",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: "48px",
//     opacity: 0.3,
//   },
//   topBadges: {
//     position: "absolute" as const,
//     top: "10px",
//     left: "10px",
//     display: "flex",
//     flexDirection: "column" as const,
//     gap: "5px",
//     zIndex: 2,
//   },
//   bestsellerBadge: {
//     backgroundColor: "#e67e22",
//     color: "white",
//     padding: "4px 8px",
//     borderRadius: "4px",
//     fontSize: "11px",
//     fontWeight: "bold",
//     textTransform: "uppercase" as const,
//     display: "inline-block",
//     width: "fit-content",
//   },
//   topsellerBadge: {
//     backgroundColor: "#27ae60",
//     color: "white",
//     padding: "4px 8px",
//     borderRadius: "4px",
//     fontSize: "11px",
//     fontWeight: "bold",
//     textTransform: "uppercase" as const,
//     display: "inline-block",
//     width: "fit-content",
//   },
//   guaranteedBadge: {
//     backgroundColor: "#3498db",
//     color: "white",
//     padding: "4px 8px",
//     borderRadius: "4px",
//     fontSize: "11px",
//     fontWeight: "bold",
//     display: "inline-block",
//     width: "fit-content",
//   },
//   durationContainer: {
//     position: "absolute" as const,
//     bottom: "10px",
//     left: "10px",
//     backgroundColor: "rgba(0,0,0,0.7)",
//     color: "white",
//     padding: "4px 10px",
//     borderRadius: "20px",
//     display: "flex",
//     alignItems: "center",
//     gap: "4px",
//     zIndex: 2,
//   },
//   durationNumber: {
//     fontSize: "14px",
//     fontWeight: "bold",
//   },
//   durationText: {
//     fontSize: "12px",
//   },
//   discountContainer: {
//     position: "absolute" as const,
//     bottom: "10px",
//     right: "10px",
//     backgroundColor: "#e74c3c",
//     color: "white",
//     padding: "4px 10px",
//     borderRadius: "20px",
//     zIndex: 2,
//   },
//   discountText: {
//     fontSize: "12px",
//     fontWeight: "bold",
//   },
//   contentSection: {
//     padding: "20px",
//   },
//   cardTitle: {
//     fontSize: "18px",
//     fontWeight: "bold",
//     color: "#2c3e50",
//     marginBottom: "8px",
//     lineHeight: "1.3",
//   },
//   shortDescription: {
//     fontSize: "13px",
//     color: "#666",
//     lineHeight: "1.5",
//     marginBottom: "10px",
//   },
//   ratingContainer: {
//     display: "flex",
//     alignItems: "center",
//     gap: "5px",
//     marginBottom: "10px",
//   },
//   stars: {
//     color: "#f39c12",
//     fontSize: "12px",
//     letterSpacing: "1px",
//   },
//   ratingText: {
//     fontSize: "12px",
//     fontWeight: "bold",
//     color: "#2c3e50",
//   },
//   reviewCount: {
//     fontSize: "11px",
//     color: "#7f8c8d",
//   },
//   priceRow: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: "10px",
//   },
//   priceLabel: {
//     fontSize: "12px",
//     color: "#7f8c8d",
//   },
//   priceContainer: {
//     display: "flex",
//     alignItems: "center",
//     gap: "8px",
//   },
//   originalPrice: {
//     fontSize: "13px",
//     color: "#95a5a6",
//     textDecoration: "line-through",
//   },
//   discountedPrice: {
//     fontSize: "18px",
//     fontWeight: "bold",
//     color: "#e67e22",
//   },
//   viewDetails: {
//     fontSize: "13px",
//     color: "#e67e22",
//     fontWeight: "500",
//     display: "flex",
//     alignItems: "center",
//     gap: "5px",
//     marginTop: "10px",
//   },
//   arrow: {
//     fontSize: "14px",
//     transition: "transform 0.2s",
//   },
//   premiumSection: {
//     backgroundColor: "#fff3e0",
//     padding: "60px 20px",
//     borderTop: "1px solid #ffe0b3",
//     borderBottom: "1px solid #ffe0b3",
//   },
//   premiumContent: {
//     maxWidth: "1000px",
//     margin: "0 auto",
//     textAlign: "center" as const,
//   },
//   premiumBadge: {
//     display: "inline-flex",
//     alignItems: "center",
//     gap: "8px",
//     backgroundColor: "#e67e22",
//     color: "white",
//     padding: "8px 20px",
//     borderRadius: "50px",
//     marginBottom: "20px",
//   },
//   premiumIcon: {
//     fontSize: "20px",
//   },
//   premiumText: {
//     fontSize: "14px",
//     fontWeight: "bold",
//   },
//   premiumTitle: {
//     fontSize: "32px",
//     fontWeight: "bold",
//     color: "#2c3e50",
//     marginBottom: "20px",
//   },
//   featuresList: {
//     display: "grid",
//     gridTemplateColumns: "repeat(3, 1fr)",
//     gap: "20px",
//     marginTop: "30px",
//   },
//   featureItem: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: "8px",
//     fontSize: "14px",
//     color: "#2c3e50",
//     padding: "10px",
//     backgroundColor: "white",
//     borderRadius: "8px",
//     boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
//   },
//   featureIcon: {
//     fontSize: "18px",
//   },
//   needHelp: {
//     backgroundColor: "#1F439C",
//     padding: "60px 0",
//   },
//   needHelpContent: {
//     maxWidth: "600px",
//     margin: "0 auto",
//     padding: "0 20px",
//     textAlign: "center" as const,
//     color: "white",
//   },
//   needHelpTitle: {
//     fontSize: "28px",
//     fontWeight: "bold",
//     marginBottom: "15px",
//   },
//   needHelpText: {
//     fontSize: "16px",
//     marginBottom: "30px",
//     opacity: 0.9,
//   },
//   contactButtons: {
//     display: "flex",
//     gap: "15px",
//     justifyContent: "center",
//     flexWrap: "wrap" as const,
//   },
//   phoneButton: {
//     backgroundColor: "#e67e22",
//     color: "white",
//     textDecoration: "none",
//     padding: "12px 24px",
//     borderRadius: "6px",
//     fontSize: "16px",
//     fontWeight: "bold",
//     transition: "background-color 0.2s",
//   },
//   emailButton: {
//     backgroundColor: "transparent",
//     border: "2px solid white",
//     color: "white",
//     textDecoration: "none",
//     padding: "12px 24px",
//     borderRadius: "6px",
//     fontSize: "16px",
//     fontWeight: "bold",
//     transition: "all 0.2s",
//   },
// };

// export default TopTenTreks;

//--------------------------------------------------------------end

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import NotificationToast from "../NotificationToast";

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
      const response = await api.get("/api/TrekPackage");

      // Filter packages that are:
      // 1. Active (isActive === true)
      // 2. Have BOTH isBestSeller AND isTopSeller as true
      const premiumPackages = response.data.filter(
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
      showNotification(
        error.response?.data?.message || "Error loading top ten treks",
        "error",
      );
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

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p>Loading top ten treks...</p>
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
                <h1 style={styles.heroTitle}>Top 10 Treks in Nepal</h1>
                <p style={styles.heroSubtitle}>
                  The ultimate collection of treks that are both Best Sellers
                  AND Top Sellers
                </p>
                <div style={styles.statsBadge}>
                  <span style={styles.statsIcon}>🏆</span>
                  <span style={styles.statsText}>
                    {packages.length} Premium Active Treks
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
        <span style={styles.breadcrumbCurrent}>Top 10 Treks</span>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Introduction Section */}
        <div style={styles.introSection}>
          <p style={styles.introText}>
            Discover the 10 most exceptional trekking experiences in Nepal.
            These hand-picked journeys have earned the prestigious distinction
            of being both <strong>Best Sellers</strong> and{" "}
            <strong>Top Sellers</strong>, representing the absolute best of what
            the Himalayas have to offer. Each trek promises unparalleled
            adventure, stunning scenery, and unforgettable memories.
          </p>
        </div>

        {/* Packages Grid */}
        <div style={styles.packagesContainer}>
          <div style={styles.resultsSummary}>
            <p style={styles.resultsText}>
              Showing <strong>{packages.length}</strong> premium active treks
              {packages.length > 0 && " (Best Seller + Top Seller)"}
            </p>
          </div>

          {packages.length === 0 ? (
            <div style={styles.noResults}>
              <p style={styles.noResultsText}>
                No premium treks available at the moment.
              </p>
              <p style={styles.noResultsSubText}>
                Treks that are both Best Sellers and Top Sellers will appear
                here.
              </p>
              <Link to="/" style={styles.resetButtonLarge}>
                Browse All Trips →
              </Link>
            </div>
          ) : (
            <div style={styles.packagesGrid}>
              {packages.map((pkg, index) => {
                const { rating, reviews } = getRandomRating(pkg.id);
                return (
                  <Link
                    to={`/trip/${createSlug(pkg.name)}-${pkg.id}`}
                    key={pkg.id}
                    style={styles.packageCard}
                    className="trek-card"
                  >
                    {/* Rank Badge */}
                    <div style={styles.rankBadge}>
                      <span style={styles.rankNumber}>{index + 1}</span>
                      <span style={styles.rankText}>TOP</span>
                    </div>

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
                        <span style={styles.bestsellerBadge}>Best Seller</span>
                        <span style={styles.topsellerBadge}>Top Seller</span>
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

                      {pkg.shortDescription && (
                        <p style={styles.shortDescription}>
                          {pkg.shortDescription.length > 100
                            ? `${pkg.shortDescription.substring(0, 100)}...`
                            : pkg.shortDescription}
                        </p>
                      )}

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

      {/* Premium Badge Section */}
      {packages.length > 0 && (
        <div style={styles.premiumSection}>
          <div style={styles.premiumContent}>
            <div style={styles.premiumBadge}>
              <span style={styles.premiumIcon}>👑</span>
              <span style={styles.premiumText}>Premium Selection</span>
            </div>
            <h2 style={styles.premiumTitle}>Why These Treks?</h2>
            <p style={styles.premiumText}>
              These active treks have earned the rare distinction of being both
              <strong> Best Sellers </strong> and <strong> Top Sellers </strong>
              , meaning they are the most booked AND most highly recommended by
              our trekkers. Each journey offers:
            </p>
            <div style={styles.featuresList}>
              <div style={styles.featureItem}>
                <span style={styles.featureIcon}>⭐</span>
                <span>Best Seller Status</span>
              </div>
              <div style={styles.featureItem}>
                <span style={styles.featureIcon}>🔥</span>
                <span>Top Seller Rating</span>
              </div>
              <div style={styles.featureItem}>
                <span style={styles.featureIcon}>🏔️</span>
                <span>Stunning Himalayan Views</span>
              </div>
              <div style={styles.featureItem}>
                <span style={styles.featureIcon}>🤝</span>
                <span>Expert Local Guides</span>
              </div>
              <div style={styles.featureItem}>
                <span style={styles.featureIcon}>🛡️</span>
                <span>Guaranteed Departures</span>
              </div>
              <div style={styles.featureItem}>
                <span style={styles.featureIcon}>📞</span>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Need Help Section */}
      <div style={styles.needHelp}>
        <div style={styles.needHelpContent}>
          <h3 style={styles.needHelpTitle}>Need Help Choosing?</h3>
          <p style={styles.needHelpText}>
            Our trekking experts are here to help you find the perfect trek for
            your adventure.
          </p>
          <div style={styles.contactButtons}>
            <a href="tel:+9779851175531" style={styles.phoneButton}>
              📞 Call Us: +977 9851175531
            </a>
            <a href="/contact" style={styles.emailButton}>
              ✉️ Contact Us
            </a>
          </div>
        </div>
      </div>

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
        
        .trek-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .trek-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  );
};

// ==================== STYLES ====================
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
  introSection: {
    marginBottom: "40px",
    textAlign: "center" as const,
  },
  introText: {
    fontSize: "16px",
    lineHeight: "1.8",
    color: "#666",
    maxWidth: "800px",
    margin: "0 auto",
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
    marginBottom: "10px",
  },
  noResultsSubText: {
    fontSize: "14px",
    color: "#7f8c8d",
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
    textDecoration: "none",
    display: "inline-block",
  },
  packagesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "30px",
  },
  packageCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    textDecoration: "none",
    color: "inherit",
    transition: "transform 0.2s, boxShadow 0.2s",
    position: "relative" as const,
  },
  rankBadge: {
    position: "absolute" as const,
    top: "15px",
    right: "15px",
    backgroundColor: "#e67e22",
    color: "white",
    borderRadius: "8px",
    padding: "8px 12px",
    textAlign: "center" as const,
    zIndex: 3,
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
  },
  rankNumber: {
    fontSize: "20px",
    fontWeight: "bold",
    display: "block",
  },
  rankText: {
    fontSize: "10px",
    fontWeight: "bold",
    letterSpacing: "0.5px",
  },
  imageContainer: {
    position: "relative" as const,
    height: "220px",
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
    padding: "20px",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: "8px",
    lineHeight: "1.3",
  },
  shortDescription: {
    fontSize: "13px",
    color: "#666",
    lineHeight: "1.5",
    marginBottom: "10px",
  },
  ratingContainer: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    marginBottom: "10px",
  },
  stars: {
    color: "#f39c12",
    fontSize: "12px",
    letterSpacing: "1px",
  },
  ratingText: {
    fontSize: "12px",
    fontWeight: "bold",
    color: "#2c3e50",
  },
  reviewCount: {
    fontSize: "11px",
    color: "#7f8c8d",
  },
  priceRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  priceLabel: {
    fontSize: "12px",
    color: "#7f8c8d",
  },
  priceContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  originalPrice: {
    fontSize: "13px",
    color: "#95a5a6",
    textDecoration: "line-through",
  },
  discountedPrice: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#e67e22",
  },
  viewDetails: {
    fontSize: "13px",
    color: "#e67e22",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    marginTop: "10px",
  },
  arrow: {
    fontSize: "14px",
    transition: "transform 0.2s",
  },
  premiumSection: {
    backgroundColor: "#fff3e0",
    padding: "60px 20px",
    borderTop: "1px solid #ffe0b3",
    borderBottom: "1px solid #ffe0b3",
  },
  premiumContent: {
    maxWidth: "1000px",
    margin: "0 auto",
    textAlign: "center" as const,
  },
  premiumBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#e67e22",
    color: "white",
    padding: "8px 20px",
    borderRadius: "50px",
    marginBottom: "20px",
  },
  premiumIcon: {
    fontSize: "20px",
  },
  premiumText: {
    fontSize: "14px",
    fontWeight: "bold",
  },
  premiumTitle: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: "20px",
  },
  featuresList: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    marginTop: "30px",
  },
  featureItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontSize: "14px",
    color: "#2c3e50",
    padding: "10px",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  featureIcon: {
    fontSize: "18px",
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

export default TopTenTreks;
