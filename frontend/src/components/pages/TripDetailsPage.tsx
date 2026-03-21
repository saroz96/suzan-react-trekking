// import React, { useState, useEffect, useRef } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import axios from "axios";

// // Types
// interface TripSliderImage {
//   id: number;
//   imageUrl: string;
//   title?: string;
//   caption?: string;
//   altText?: string;
//   displayOrder: number;
// }

// interface TripGalleryImage {
//   id: number;
//   imageUrl: string;
//   title?: string;
//   description?: string;
//   altText?: string;
//   displayOrder: number;
//   isFeatured: boolean;
// }

// interface TripItineraryDay {
//   id: number;
//   dayNumber: number;
//   title?: string;
//   description?: string;
//   maxAltitude?: string;
//   accommodation?: string;
//   meals?: string;
//   duration?: string;
//   distance?: string;
// }

// interface TripCostInclude {
//   id: number;
//   description: string;
//   category?: string;
//   displayOrder: number;
// }

// interface TripCostExclude {
//   id: number;
//   description: string;
//   category?: string;
//   displayOrder: number;
// }

// interface TripFaq {
//   id: number;
//   question: string;
//   answer: string;
//   displayOrder: number;
// }

// interface TripDepartureDate {
//   id: number;
//   startDate: string;
//   endDate: string;
//   price: number;
//   discountedPrice?: number;
//   isGuaranteed: boolean;
//   isAvailable: boolean;
//   notes?: string;
//   isBestSeller: boolean;
//   isTopSeller: boolean;
//   bookingCount: number;
// }

// interface GroupDiscount {
//   id: number;
//   minTravelers: number;
//   maxTravelers: number;
//   pricePerPerson: number;
//   discountPercentage?: number;
//   description?: string;
//   displayOrder: number;
//   isActive: boolean;
//   totalPrice: number;
// }

// interface Review {
//   id: number;
//   userName: string;
//   userAvatar?: string;
//   rating: number;
//   title: string;
//   comment: string;
//   date: string;
//   verified: boolean;
//   helpful?: number;
// }

// interface ReviewStats {
//   averageRating: number;
//   totalReviews: number;
//   ratingDistribution: {
//     5: number;
//     4: number;
//     3: number;
//     2: number;
//     1: number;
//   };
// }

// interface ReviewPlatform {
//   id: string;
//   name: string;
//   icon: string;
//   count: number;
//   rating?: number;
//   color: string;
//   url?: string;
// }

// interface TrekPackage {
//   id: number;
//   name: string;
//   shortDescription?: string;
//   price?: number;
//   discountedPrice?: number;
//   durationDays?: number;
//   durationNights?: number;
//   tripGrade?: string;
//   mainHeadingId: number;
//   mainHeadingName: string;
//   headingId: number;
//   headingName: string;
//   subHeadingId?: number;
//   subHeadingName?: string;
//   countryId: number;
//   countryName: string;
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
//   sliderImages: TripSliderImage[];
//   galleryImages: TripGalleryImage[];
//   itinerary: TripItineraryDay[];
//   costIncludes: TripCostInclude[];
//   costExcludes: TripCostExclude[];
//   faqs: TripFaq[];
//   departureDates: TripDepartureDate[];
//   groupDiscounts?: GroupDiscount[];
//   isBestSeller?: boolean;
//   isTopSeller?: boolean;
//   hasGuaranteedDeparture?: boolean;
// }

// interface NavItem {
//   id: string;
//   label: string;
//   icon: string;
// }

// const TripDetailsPage: React.FC = () => {
//   const { slug } = useParams<{ slug: string }>();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [tripData, setTripData] = useState<TrekPackage | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [activeImageIndex, setActiveImageIndex] = useState(0);
//   const [activeNav, setActiveNav] = useState("overview");
//   const [isNavSticky, setIsNavSticky] = useState(false);
//   const [showGroupDiscount, setShowGroupDiscount] = useState(false);
//   const [isPricingCardSticky, setIsPricingCardSticky] = useState(false);
//   const [navHeight, setNavHeight] = useState(0);

//   const [reviews, setReviews] = useState<Review[]>([]);
//   const [reviewStats, setReviewStats] = useState<ReviewStats>({
//     averageRating: 0,
//     totalReviews: 0,
//     ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
//   });
//   const [reviewPlatforms] = useState<ReviewPlatform[]>([
//     {
//       id: "tripadvisor",
//       name: "TripAdvisor",
//       icon: "🌐",
//       count: 1520,
//       color: "#00aa6c",
//       url: "https://www.tripadvisor.com",
//     },
//     {
//       id: "google",
//       name: "Google",
//       icon: "🔍",
//       count: 400,
//       color: "#4285f4",
//       url: "https://www.google.com/maps",
//     },
//     {
//       id: "trustpilot",
//       name: "TrustPilot",
//       icon: "⭐",
//       count: 106,
//       color: "#00b67a",
//       url: "https://www.trustpilot.com",
//     },
//   ]);
//   const [showAllReviews, setShowAllReviews] = useState(false);
//   const [selectedRating, setSelectedRating] = useState<number | null>(null);

//   const pricingCardRef = useRef<HTMLDivElement>(null);
//   const pricingCardPlaceholderRef = useRef<HTMLDivElement>(null);
//   const stickyNavRef = useRef<HTMLDivElement>(null);

//   // Refs for sections
//   const overviewRef = useRef<HTMLDivElement>(null);
//   const galleryRef = useRef<HTMLDivElement>(null);
//   const itineraryRef = useRef<HTMLDivElement>(null);
//   const routeMapRef = useRef<HTMLDivElement>(null);
//   const costDetailsRef = useRef<HTMLDivElement>(null);
//   const datesRef = useRef<HTMLDivElement>(null);
//   const essentialInfoRef = useRef<HTMLDivElement>(null);
//   const faqsRef = useRef<HTMLDivElement>(null);
//   const videoRef = useRef<HTMLDivElement>(null);
//   const factsGridRef = useRef<HTMLDivElement>(null);

//   const API_BASE_URL =
//     import.meta.env.VITE_API_BASE_URL || "http://localhost:5232";

//   const api = axios.create({
//     baseURL: API_BASE_URL,
//     withCredentials: true,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   const createSlug = (name: string): string => {
//     return name
//       .toLowerCase()
//       .replace(/[^\w\s-]/g, "")
//       .replace(/\s+/g, "-")
//       .replace(/-+/g, "-");
//   };

//   const generateMockReviews = (packageId: number): Review[] => {
//     const mockReviews: Review[] = [
//       {
//         id: 1,
//         userName: "Sarah Johnson",
//         userAvatar: "https://randomuser.me/api/portraits/women/1.jpg",
//         rating: 5,
//         title: "Absolutely incredible experience!",
//         comment:
//           "This trek exceeded all expectations. The guides were professional, the scenery breathtaking, and the organization flawless. Highly recommended for anyone seeking adventure!",
//         date: "2024-02-15",
//         verified: true,
//         helpful: 24,
//       },
//       {
//         id: 2,
//         userName: "Michael Chen",
//         userAvatar: "https://randomuser.me/api/portraits/men/2.jpg",
//         rating: 5,
//         title: "Life-changing journey",
//         comment:
//           "From start to finish, everything was perfectly arranged. The accommodations were comfortable and the food was surprisingly good. Will definitely book again!",
//         date: "2024-01-20",
//         verified: true,
//         helpful: 18,
//       },
//       {
//         id: 3,
//         userName: "Emma Williams",
//         userAvatar: "https://randomuser.me/api/portraits/women/3.jpg",
//         rating: 4,
//         title: "Great adventure, minor weather issues",
//         comment:
//           "Overall fantastic experience. The only downside was some unexpected weather, but the guides handled it professionally. Would recommend!",
//         date: "2024-01-05",
//         verified: true,
//         helpful: 12,
//       },
//       {
//         id: 4,
//         userName: "David Kumar",
//         userAvatar: "https://randomuser.me/api/portraits/men/4.jpg",
//         rating: 5,
//         title: "Best decision I ever made",
//         comment:
//           "The views were spectacular, and the team went above and beyond to ensure everyone was safe and comfortable. Worth every penny!",
//         date: "2023-12-10",
//         verified: true,
//         helpful: 31,
//       },
//       {
//         id: 5,
//         userName: "Lisa Anderson",
//         userAvatar: "https://randomuser.me/api/portraits/women/5.jpg",
//         rating: 5,
//         title: "Unforgettable memories",
//         comment:
//           "Amazing organization, knowledgeable guides, and incredible scenery. The attention to detail was impressive. Highly recommended!",
//         date: "2023-11-28",
//         verified: true,
//         helpful: 15,
//       },
//       {
//         id: 6,
//         userName: "James Wilson",
//         userAvatar: "https://randomuser.me/api/portraits/men/6.jpg",
//         rating: 4,
//         title: "Very good experience",
//         comment:
//           "Everything was well organized. The only suggestion would be to have more vegetarian options, but overall excellent.",
//         date: "2023-11-15",
//         verified: false,
//         helpful: 8,
//       },
//     ];
//     return mockReviews;
//   };

//   const calculateReviewStats = (reviewsList: Review[]): ReviewStats => {
//     const total = reviewsList.length;
//     if (total === 0)
//       return {
//         averageRating: 0,
//         totalReviews: 0,
//         ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
//       };

//     const sum = reviewsList.reduce((acc, rev) => acc + rev.rating, 0);
//     const average = sum / total;

//     const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
//     reviewsList.forEach((rev) => {
//       distribution[rev.rating as keyof typeof distribution]++;
//     });

//     return {
//       averageRating: average,
//       totalReviews: total,
//       ratingDistribution: distribution,
//     };
//   };

//   useEffect(() => {
//     if (tripData) {
//       const mockReviews = generateMockReviews(tripData.id);
//       setReviews(mockReviews);
//       setReviewStats(calculateReviewStats(mockReviews));
//     }
//   }, [tripData]);

//   // Filter reviews by rating
//   const filteredReviews = selectedRating
//     ? reviews.filter((review) => review.rating === selectedRating)
//     : reviews;

//   const displayedReviews = showAllReviews
//     ? filteredReviews
//     : filteredReviews.slice(0, 3);

//   // Navigation items based on available content
//   const getNavItems = (): NavItem[] => {
//     const items: NavItem[] = [
//       { id: "overview", label: "Overview", icon: "📖" },
//     ];

//     if (
//       tripData?.sliderImages?.length > 0 ||
//       tripData?.galleryImages?.length > 0
//     ) {
//       items.push({ id: "gallery", label: "Gallery", icon: "🖼️" });
//     }

//     if (tripData?.itinerary?.length > 0) {
//       items.push({ id: "itinerary", label: "Itinerary", icon: "📅" });
//     }

//     if (tripData?.routeMapImageUrl) {
//       items.push({ id: "routeMap", label: "Route Map", icon: "🗺️" });
//     }

//     if (
//       tripData?.costIncludes?.length > 0 ||
//       tripData?.costExcludes?.length > 0
//     ) {
//       items.push({ id: "costDetails", label: "Cost Details", icon: "💰" });
//     }

//     if (tripData?.departureDates?.length > 0) {
//       items.push({ id: "dates", label: "Dates & Price", icon: "📆" });
//     }

//     if (tripData?.essentialInformation) {
//       items.push({ id: "essentialInfo", label: "Essential Info", icon: "ℹ️" });
//     }

//     if (tripData?.faqs?.length > 0) {
//       items.push({ id: "faqs", label: "FAQs", icon: "❓" });
//     }

//     if (tripData?.videoReviewUrl) {
//       items.push({ id: "video", label: "Video Reviews", icon: "🎥" });
//     }

//     return items;
//   };

//   // Helper function to get full image URL
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

//   // Scroll to section function
//   const scrollToSection = (sectionId: string) => {
//     const sectionRefs: { [key: string]: React.RefObject<HTMLDivElement> } = {
//       overview: overviewRef,
//       gallery: galleryRef,
//       itinerary: itineraryRef,
//       routeMap: routeMapRef,
//       costDetails: costDetailsRef,
//       dates: datesRef,
//       essentialInfo: essentialInfoRef,
//       faqs: faqsRef,
//       video: videoRef,
//     };

//     const ref = sectionRefs[sectionId];
//     if (ref?.current) {
//       const navElement = stickyNavRef.current;
//       const currentNavHeight = navElement?.getBoundingClientRect().height || 0;
//       const offset = currentNavHeight + 20;

//       const elementPosition = ref.current.getBoundingClientRect().top;
//       const offsetPosition = elementPosition + window.pageYOffset - offset;

//       window.scrollTo({
//         top: offsetPosition,
//         behavior: "smooth",
//       });
//       setActiveNav(sectionId);
//     }
//   };

//   useEffect(() => {
//     const handleScroll = () => {
//       const navElement = stickyNavRef.current;
//       const currentNavHeight = navElement?.getBoundingClientRect().height || 0;
//       setNavHeight(currentNavHeight);

//       setIsNavSticky(window.scrollY > 300);

//       if (pricingCardPlaceholderRef.current && pricingCardRef.current) {
//         const placeholderTop =
//           pricingCardPlaceholderRef.current.getBoundingClientRect().top;
//         const scrollPosition = window.scrollY;
//         const offset = 100;

//         if (scrollPosition > placeholderTop + offset) {
//           setIsPricingCardSticky(true);
//         } else {
//           setIsPricingCardSticky(false);
//         }
//       }

//       const sections = [
//         { id: "overview", ref: overviewRef },
//         { id: "gallery", ref: galleryRef },
//         { id: "itinerary", ref: itineraryRef },
//         { id: "routeMap", ref: routeMapRef },
//         { id: "costDetails", ref: costDetailsRef },
//         { id: "dates", ref: datesRef },
//         { id: "essentialInfo", ref: essentialInfoRef },
//         { id: "faqs", ref: faqsRef },
//         { id: "video", ref: videoRef },
//       ];

//       const stickyNavHeight = isNavSticky ? currentNavHeight : 0;
//       const scrollPosition = window.scrollY + stickyNavHeight + 100;

//       let activeSection = null;

//       for (const section of sections) {
//         if (section.ref.current) {
//           const rect = section.ref.current.getBoundingClientRect();
//           const offsetTop = rect.top + window.scrollY;
//           const offsetHeight = section.ref.current.offsetHeight;
//           const buffer = 10;

//           if (
//             scrollPosition >= offsetTop - buffer &&
//             scrollPosition < offsetTop + offsetHeight - buffer
//           ) {
//             activeSection = section.id;
//             break;
//           }
//         }
//       }

//       if (activeSection) {
//         setActiveNav(activeSection);
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     handleScroll();

//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [tripData, isNavSticky]);

//   useEffect(() => {
//     if (slug) {
//       fetchTripDetails();
//     }
//   }, [slug]);

//   const fetchTripDetails = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const idMatch = slug?.match(/-(\d+)$/);
//       const packageId = idMatch ? parseInt(idMatch[1]) : null;

//       if (!packageId) {
//         throw new Error("Invalid package ID");
//       }

//       const response = await api.get(`/api/TrekPackage/${packageId}`);
//       setTripData(response.data);
//     } catch (error: any) {
//       console.error("Error fetching trip details:", error);
//       setError(error.response?.data?.message || "Error loading trip details");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatPrice = (price?: number): string => {
//     if (!price) return "Contact Us";
//     return `US$${price.toLocaleString()}`;
//   };

//   const getSavings = () => {
//     if (
//       tripData?.price &&
//       tripData?.discountedPrice &&
//       tripData.discountedPrice < tripData.price
//     ) {
//       return tripData.price - tripData.discountedPrice;
//     }
//     return null;
//   };

//   const savings = getSavings();

//   if (loading) {
//     return (
//       <div style={styles.loadingContainer}>
//         <div style={styles.spinner}></div>
//         <p>Loading trip details...</p>
//       </div>
//     );
//   }

//   if (error || !tripData) {
//     return (
//       <div style={styles.errorContainer}>
//         <h2>Error Loading Trip</h2>
//         <p>{error || "Trip not found"}</p>
//         <button onClick={() => navigate("/")} style={styles.homeButton}>
//           Go Home
//         </button>
//       </div>
//     );
//   }

//   const navItems = getNavItems();
//   const heroImage =
//     tripData.sliderImages && tripData.sliderImages.length > 0
//       ? getFullImageUrl(tripData.sliderImages[0].imageUrl)
//       : tripData.routeMapImageUrl
//         ? getFullImageUrl(tripData.routeMapImageUrl)
//         : "";

//   return (
//     <div style={styles.pageContainer}>
//       {/* Hero Section */}
//       <div style={styles.heroSection}>
//         {heroImage ? (
//           <img src={heroImage} alt={tripData.name} style={styles.heroImage} />
//         ) : (
//           <div style={styles.heroImagePlaceholder}>🏔️</div>
//         )}
//         <div style={styles.heroOverlay}>
//           <div style={styles.heroContent}>
//             <h1 style={styles.heroTitle}>{tripData.name}</h1>
//             <div style={styles.heroBadges}>
//               {tripData.isBestSeller && (
//                 <span style={styles.bestsellerBadge}>Best Seller</span>
//               )}
//               {tripData.isTopSeller && (
//                 <span style={styles.topsellerBadge}>TOPSELLER</span>
//               )}
//               {tripData.hasGuaranteedDeparture && (
//                 <span style={styles.guaranteedBadge}>
//                   Guaranteed Departures
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Breadcrumb */}
//       <div style={styles.breadcrumb}>
//         <Link to="/" style={styles.breadcrumbLink}>
//           Home
//         </Link>
//         <span style={styles.breadcrumbSeparator}>/</span>
//         <Link
//           to={`/${createSlug(tripData.mainHeadingName)}`}
//           style={styles.breadcrumbLink}
//         >
//           {tripData.mainHeadingName}
//         </Link>
//         <span style={styles.breadcrumbSeparator}>/</span>
//         <Link
//           to={`/${createSlug(tripData.mainHeadingName)}/${createSlug(tripData.headingName)}`}
//           style={styles.breadcrumbLink}
//         >
//           {tripData.headingName}
//         </Link>
//         {tripData.subHeadingName && (
//           <>
//             <span style={styles.breadcrumbSeparator}>/</span>
//             <Link
//               to={`/${createSlug(tripData.mainHeadingName)}/${createSlug(tripData.headingName)}/${createSlug(tripData.subHeadingName)}`}
//               style={styles.breadcrumbLink}
//             >
//               {tripData.subHeadingName}
//             </Link>
//           </>
//         )}
//         <span style={styles.breadcrumbSeparator}>/</span>
//         <span style={styles.breadcrumbCurrent}>{tripData.name}</span>
//       </div>

//       {/* Minimized Review Platforms Section - Like the image */}
//       <div style={styles.reviewPlatformsSection}>
//         <div style={styles.platformsGrid}>
//           {reviewPlatforms.map((platform) => (
//             <a
//               key={platform.id}
//               href={platform.url}
//               target="_blank"
//               rel="noopener noreferrer"
//               style={styles.platformCard}
//             >
//               <span style={styles.platformIcon}>{platform.icon}</span>
//               <span style={styles.platformCount}>
//                 {platform.count.toLocaleString()}+
//               </span>
//               <span style={styles.platformText}>
//                 reviews in {platform.name}
//               </span>
//             </a>
//           ))}
//         </div>
//       </div>

//       {/* Sticky Navigation Bar */}
//       <div
//         ref={stickyNavRef}
//         style={{
//           ...styles.stickyNav,
//           top: isNavSticky ? 0 : -100,
//           position: isNavSticky ? "sticky" : "relative",
//         }}
//       >
//         <div style={styles.navContainer}>
//           {navItems.map((item) => (
//             <button
//               key={item.id}
//               onClick={() => scrollToSection(item.id)}
//               style={{
//                 ...styles.navButton,
//                 ...(activeNav === item.id ? styles.navButtonActive : {}),
//               }}
//             >
//               <span style={styles.navIcon}>{item.icon}</span>
//               <span style={styles.navLabel}>{item.label}</span>
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Main Content with Sidebar Layout */}
//       <div style={styles.mainLayout}>
//         {/* Left Column - Main Content */}
//         <div style={styles.mainContent}>
//           {/* Trip Facts Grid */}
//           <div ref={factsGridRef} style={styles.factsGrid}>
//             <FactItem
//               label="Duration"
//               value={`${tripData.durationDays} Days${tripData.durationNights ? ` / ${tripData.durationNights} Nights` : ""}`}
//             />
//             <FactItem
//               label="Trip Grade"
//               value={tripData.tripGrade || "Moderate"}
//             />
//             <FactItem label="Country" value={tripData.countryName} />
//             <FactItem
//               label="Maximum Altitude"
//               value={tripData.maximumAltitude || "N/A"}
//             />
//             <FactItem label="Group Size" value={tripData.groupSize || "1-20"} />
//             <FactItem label="Starts" value={tripData.startsAt || "Kathmandu"} />
//             <FactItem label="Ends" value={tripData.endsAt || "Kathmandu"} />
//             <FactItem
//               label="Activities"
//               value={tripData.activities || "Trekking"}
//             />
//             <FactItem
//               label="Best Time"
//               value={tripData.bestTime || "Mar-May, Sep-Nov"}
//             />
//           </div>

//           {/* Pricing Card Placeholder */}
//           <div
//             ref={pricingCardPlaceholderRef}
//             style={styles.pricingCardPlaceholder}
//           />

//           {/* Overview Section */}
//           <div ref={overviewRef}>
//             <section style={styles.section}>
//               <h2 style={styles.sectionTitle}>Overview</h2>
//               <div
//                 dangerouslySetInnerHTML={{ __html: tripData.overview || "" }}
//                 style={styles.paragraph}
//               />
//             </section>
//           </div>

//           {/* Gallery Section - ONLY DISPLAY GALLERY IMAGES */}
//           {tripData.galleryImages && tripData.galleryImages.length > 0 && (
//             <div ref={galleryRef}>
//               <section style={styles.section}>
//                 <h2 style={styles.sectionTitle}>Gallery</h2>

//                 {/* Gallery Images Grid - Only Gallery Images */}
//                 <div style={styles.galleryGrid}>
//                   {tripData.galleryImages.map((img) => (
//                     <div key={img.id} style={styles.galleryItem}>
//                       <img
//                         src={getFullImageUrl(img.imageUrl)}
//                         alt={img.title || "Gallery image"}
//                         style={styles.galleryImage}
//                         onClick={() => {
//                           // Optional: Open modal with full-size image
//                           window.open(getFullImageUrl(img.imageUrl), "_blank");
//                         }}
//                       />
//                       {img.isFeatured && (
//                         <span style={styles.galleryFeaturedBadge}>
//                           Featured
//                         </span>
//                       )}
//                       {img.title && (
//                         <div style={styles.galleryOverlay}>
//                           <p style={styles.galleryTitle}>{img.title}</p>
//                           {img.description && (
//                             <p style={styles.galleryDescription}>
//                               {img.description}
//                             </p>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </section>
//             </div>
//           )}

//           {/* Itinerary Section */}
//           {tripData.itinerary && tripData.itinerary.length > 0 && (
//             <div ref={itineraryRef}>
//               <section style={styles.section}>
//                 <h2 style={styles.sectionTitle}>Itinerary</h2>
//                 <div style={styles.itineraryContainer}>
//                   {tripData.itinerary.map((day) => (
//                     <details key={day.id} style={styles.itineraryDay}>
//                       <summary style={styles.itineraryDayHeader}>
//                         <span style={styles.itineraryDayNumber}>
//                           Day {day.dayNumber}
//                         </span>
//                         {day.title && (
//                           <h3 style={styles.itineraryDayTitle}>{day.title}</h3>
//                         )}
//                       </summary>
//                       {day.description && (
//                         <div
//                           dangerouslySetInnerHTML={{ __html: day.description }}
//                           style={styles.itineraryDayDescription}
//                         />
//                       )}
//                       <div style={styles.itineraryDetails}>
//                         {day.maxAltitude && (
//                           <span style={styles.itineraryDetail}>
//                             🏔️ {day.maxAltitude}
//                           </span>
//                         )}
//                         {day.accommodation && (
//                           <span style={styles.itineraryDetail}>
//                             🏨 {day.accommodation}
//                           </span>
//                         )}
//                         {day.meals && (
//                           <span style={styles.itineraryDetail}>
//                             🍽️ {day.meals}
//                           </span>
//                         )}
//                         {day.duration && (
//                           <span style={styles.itineraryDetail}>
//                             ⏱️ {day.duration}
//                           </span>
//                         )}
//                         {day.distance && (
//                           <span style={styles.itineraryDetail}>
//                             📏 {day.distance}
//                           </span>
//                         )}
//                       </div>
//                     </details>
//                   ))}
//                 </div>
//               </section>
//             </div>
//           )}

//           {/* Route Map Section */}
//           {tripData.routeMapImageUrl && (
//             <div ref={routeMapRef}>
//               <section style={styles.section}>
//                 <h2 style={styles.sectionTitle}>Route Map</h2>
//                 <div style={styles.mapContainer}>
//                   <img
//                     src={getFullImageUrl(tripData.routeMapImageUrl)}
//                     alt={`Route map for ${tripData.name}`}
//                     style={styles.mapImage}
//                   />
//                 </div>
//               </section>
//             </div>
//           )}

//           {/* Cost Details Section */}
//           {(tripData.costIncludes?.length > 0 ||
//             tripData.costExcludes?.length > 0) && (
//             <div ref={costDetailsRef}>
//               <section style={styles.section}>
//                 <h2 style={styles.sectionTitle}>Cost Details</h2>
//                 <div style={styles.costGrid}>
//                   {tripData.costIncludes?.length > 0 && (
//                     <div>
//                       <h3 style={styles.subTitle}>✓ What's Included</h3>
//                       <ul style={styles.list}>
//                         {tripData.costIncludes.map((item) => (
//                           <li key={item.id} style={styles.listItem}>
//                             <span style={styles.includeIcon}>✓</span>{" "}
//                             {item.description}
//                             {item.category && (
//                               <span style={styles.categoryBadge}>
//                                 {item.category}
//                               </span>
//                             )}
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   )}
//                   {tripData.costExcludes?.length > 0 && (
//                     <div>
//                       <h3 style={styles.subTitle}>✗ What's Not Included</h3>
//                       <ul style={styles.list}>
//                         {tripData.costExcludes.map((item) => (
//                           <li key={item.id} style={styles.listItem}>
//                             <span style={styles.excludeIcon}>✗</span>{" "}
//                             {item.description}
//                             {item.category && (
//                               <span style={styles.categoryBadge}>
//                                 {item.category}
//                               </span>
//                             )}
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   )}
//                 </div>
//               </section>
//             </div>
//           )}

//           {/* Dates & Price Section */}
//           {tripData.departureDates && tripData.departureDates.length > 0 && (
//             <div ref={datesRef}>
//               <section style={styles.section}>
//                 <h2 style={styles.sectionTitle}>Dates & Price</h2>
//                 <div style={styles.departuresTable}>
//                   <table style={styles.table}>
//                     <thead>
//                       <tr>
//                         <th style={styles.th}>Start Date</th>
//                         <th style={styles.th}>End Date</th>
//                         <th style={styles.th}>Price</th>
//                         <th style={styles.th}>Status</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {tripData.departureDates
//                         .filter((d) => new Date(d.startDate) > new Date())
//                         .slice(0, 10)
//                         .map((date) => (
//                           <tr key={date.id} style={styles.tr}>
//                             <td style={styles.td}>
//                               {new Date(date.startDate).toLocaleDateString()}
//                             </td>
//                             <td style={styles.td}>
//                               {new Date(date.endDate).toLocaleDateString()}
//                             </td>
//                             <td style={styles.td}>
//                               {date.discountedPrice ? (
//                                 <>
//                                   <span style={styles.originalPriceTd}>
//                                     US${date.price}
//                                   </span>
//                                   <span style={styles.discountedPriceTd}>
//                                     {" "}
//                                     US${date.discountedPrice}
//                                   </span>
//                                 </>
//                               ) : (
//                                 `US$${date.price}`
//                               )}
//                             </td>
//                             <td style={styles.td}>
//                               {date.isGuaranteed && (
//                                 <span style={styles.guaranteedBadgeSmall}>
//                                   Guaranteed
//                                 </span>
//                               )}
//                               {date.isBestSeller && (
//                                 <span style={styles.bestsellerBadgeSmall}>
//                                   Best Seller
//                                 </span>
//                               )}
//                             </td>
//                           </tr>
//                         ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </section>
//             </div>
//           )}

//           {/* Essential Information Section */}
//           {tripData.essentialInformation && (
//             <div ref={essentialInfoRef}>
//               <section style={styles.section}>
//                 <h2 style={styles.sectionTitle}>Essential Information</h2>
//                 <div
//                   dangerouslySetInnerHTML={{
//                     __html: tripData.essentialInformation,
//                   }}
//                   style={styles.paragraph}
//                 />
//               </section>
//             </div>
//           )}

//           {/* FAQs Section */}
//           {tripData.faqs?.length > 0 && (
//             <div ref={faqsRef}>
//               <section style={styles.section}>
//                 <h2 style={styles.sectionTitle}>FAQs</h2>
//                 <div style={styles.faqContainer}>
//                   {tripData.faqs.map((faq) => (
//                     <details key={faq.id} style={styles.faqItem}>
//                       <summary style={styles.faqQuestion}>
//                         ❓ {faq.question}
//                       </summary>
//                       <div
//                         dangerouslySetInnerHTML={{ __html: faq.answer }}
//                         style={styles.faqAnswer}
//                       />
//                     </details>
//                   ))}
//                 </div>
//               </section>
//             </div>
//           )}

//           {/* Video Reviews Section */}
//           {tripData.videoReviewUrl && (
//             <div ref={videoRef}>
//               <section style={styles.section}>
//                 <h2 style={styles.sectionTitle}>Video Reviews</h2>
//                 <div style={styles.videoContainer}>
//                   <iframe
//                     width="100%"
//                     height="500"
//                     src={tripData.videoReviewUrl.replace("watch?v=", "embed/")}
//                     title={`${tripData.name} Video`}
//                     frameBorder="0"
//                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                     allowFullScreen
//                     style={styles.videoIframe}
//                   ></iframe>
//                 </div>
//               </section>
//             </div>
//           )}

//           {/* Customer Reviews Section */}
//           <div style={styles.reviewsSection}>
//             <div style={styles.reviewsHeader}>
//               <h2 style={styles.reviewsTitle}>Customer Reviews</h2>
//             </div>

//             <div style={styles.reviewsSummary}>
//               <div style={styles.ratingSummary}>
//                 <div style={styles.averageRating}>
//                   {reviewStats.averageRating.toFixed(1)}
//                 </div>
//                 <div style={styles.reviewStars}>
//                   {"★".repeat(Math.floor(reviewStats.averageRating))}
//                   {reviewStats.averageRating % 1 !== 0 && "½"}
//                 </div>
//                 <div style={styles.totalReviews}>
//                   Based on {reviewStats.totalReviews} reviews
//                 </div>
//               </div>

//               <div style={styles.ratingDistribution}>
//                 {[5, 4, 3, 2, 1].map((rating) => {
//                   const count =
//                     reviewStats.ratingDistribution[
//                       rating as keyof typeof reviewStats.ratingDistribution
//                     ];
//                   const percentage =
//                     reviewStats.totalReviews > 0
//                       ? (count / reviewStats.totalReviews) * 100
//                       : 0;
//                   return (
//                     <div
//                       key={rating}
//                       style={styles.distributionBar}
//                       onClick={() =>
//                         setSelectedRating(
//                           selectedRating === rating ? null : rating,
//                         )
//                       }
//                     >
//                       <span style={styles.ratingLabel}>{rating} ★</span>
//                       <div style={styles.barContainer}>
//                         <div
//                           style={{
//                             ...styles.barFill,
//                             width: `${percentage}%`,
//                           }}
//                         />
//                       </div>
//                       <span style={styles.ratingCount}>{count}</span>
//                       <span style={styles.ratingPercentage}>
//                         {percentage.toFixed(0)}%
//                       </span>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             <div style={styles.filterChips}>
//               <button
//                 onClick={() => setSelectedRating(null)}
//                 style={{
//                   ...styles.filterChip,
//                   ...(!selectedRating ? styles.filterChipActive : {}),
//                 }}
//               >
//                 All Reviews
//               </button>
//               {[5, 4, 3, 2, 1].map((rating) => (
//                 <button
//                   key={rating}
//                   onClick={() =>
//                     setSelectedRating(selectedRating === rating ? null : rating)
//                   }
//                   style={{
//                     ...styles.filterChip,
//                     ...(selectedRating === rating
//                       ? styles.filterChipActive
//                       : {}),
//                   }}
//                 >
//                   {rating} ★ (
//                   {
//                     reviewStats.ratingDistribution[
//                       rating as keyof typeof reviewStats.ratingDistribution
//                     ]
//                   }
//                   )
//                 </button>
//               ))}
//             </div>

//             {displayedReviews.length > 0 ? (
//               <>
//                 <div style={styles.reviewsList}>
//                   {displayedReviews.map((review) => (
//                     <div key={review.id} style={styles.reviewCard}>
//                       <div style={styles.reviewHeader}>
//                         {review.userAvatar ? (
//                           <img
//                             src={review.userAvatar}
//                             alt={review.userName}
//                             style={styles.userAvatar}
//                           />
//                         ) : (
//                           <div
//                             style={{
//                               ...styles.userAvatar,
//                               backgroundColor: "#e67e22",
//                               display: "flex",
//                               alignItems: "center",
//                               justifyContent: "center",
//                               color: "white",
//                             }}
//                           >
//                             {review.userName.charAt(0)}
//                           </div>
//                         )}
//                         <div style={styles.userInfo}>
//                           <div style={styles.userName}>
//                             {review.userName}
//                             {review.verified && (
//                               <span style={styles.verifiedBadge}>
//                                 ✓ Verified
//                               </span>
//                             )}
//                           </div>
//                           <div style={styles.reviewDate}>
//                             {new Date(review.date).toLocaleDateString("en-US", {
//                               year: "numeric",
//                               month: "long",
//                               day: "numeric",
//                             })}
//                           </div>
//                         </div>
//                       </div>
//                       <div style={styles.reviewStars}>
//                         {"★".repeat(review.rating)}
//                         {"☆".repeat(5 - review.rating)}
//                       </div>
//                       <h3 style={styles.reviewTitle}>{review.title}</h3>
//                       <p style={styles.reviewComment}>{review.comment}</p>
//                       <div style={styles.reviewHelpful}>
//                         <span>
//                           👍 {review.helpful || 0} people found this helpful
//                         </span>
//                         <button
//                           style={styles.helpfulButton}
//                           onClick={() => {
//                             alert("Thank you for your feedback!");
//                           }}
//                         >
//                           Was this helpful?
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {filteredReviews.length > 3 && (
//                   <button
//                     onClick={() => setShowAllReviews(!showAllReviews)}
//                     style={styles.showMoreButton}
//                   >
//                     {showAllReviews
//                       ? "Show Less Reviews"
//                       : `Show All ${filteredReviews.length} Reviews`}
//                   </button>
//                 )}
//               </>
//             ) : (
//               <div style={styles.noReviews}>
//                 <p>No reviews available for this rating.</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Right Column - Sticky Pricing Card */}
//         <div style={styles.rightColumn}>
//           <div
//             ref={pricingCardRef}
//             style={{
//               ...styles.pricingCard,
//               ...(isPricingCardSticky
//                 ? {
//                     ...styles.pricingCardSticky,
//                     top: isNavSticky ? `${navHeight + 20}px` : "20px",
//                   }
//                 : {}),
//             }}
//           >
//             <div style={styles.priceHeader}>
//               <span style={styles.priceLabel}>Price From</span>
//               <div style={styles.priceContainer}>
//                 {tripData.discountedPrice ? (
//                   <>
//                     <span style={styles.originalPrice}>
//                       {formatPrice(tripData.price)}
//                     </span>
//                     <span style={styles.discountedPrice}>
//                       {formatPrice(tripData.discountedPrice)}
//                     </span>
//                   </>
//                 ) : (
//                   <span style={styles.discountedPrice}>
//                     {formatPrice(tripData.price)}
//                   </span>
//                 )}
//               </div>
//             </div>

//             {savings && savings > 0 && (
//               <div style={styles.savingsContainer}>
//                 <span style={styles.savingsLabel}>You Save</span>
//                 <span style={styles.savingsAmount}>{formatPrice(savings)}</span>
//               </div>
//             )}

//             {tripData.groupDiscounts && tripData.groupDiscounts.length > 0 && (
//               <div style={styles.groupDiscountToggle}>
//                 <button
//                   onClick={() => setShowGroupDiscount(!showGroupDiscount)}
//                   style={styles.groupDiscountButton}
//                 >
//                   GROUP DISCOUNT PRICE {showGroupDiscount ? "−" : "+"}
//                 </button>
//                 {showGroupDiscount && (
//                   <div style={styles.groupDiscountContent}>
//                     {tripData.groupDiscounts
//                       .sort((a, b) => a.minTravelers - b.minTravelers)
//                       .map((discount) => (
//                         <div key={discount.id} style={styles.groupDiscountItem}>
//                           <span style={styles.groupSizeText}>
//                             {discount.minTravelers}-{discount.maxTravelers} pax
//                           </span>
//                           <span style={styles.groupPriceText}>
//                             {formatPrice(discount.pricePerPerson)}/pax
//                           </span>
//                         </div>
//                       ))}
//                   </div>
//                 )}
//               </div>
//             )}

//             <div style={styles.buttonGroup}>
//               <button style={styles.bookNowButton}>Book This Trip</button>
//               <button style={styles.checkAvailabilityButton}>
//                 Check Availability
//               </button>
//               <button style={styles.sendInquiryButton}>Send Inquiry</button>
//               <button style={styles.customizeButton}>Customize a Trip</button>
//               <button style={styles.downloadButton}>Download a Brochure</button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <style>{`
//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }

//         details > summary {
//           cursor: pointer;
//           list-style: none;
//         }

//         details > summary::-webkit-details-marker {
//           display: none;
//         }

//         details[open] > summary {
//           margin-bottom: 15px;
//         }
//       `}</style>
//     </div>
//   );
// };

// // Helper component for Trip Facts
// const FactItem = ({ label, value }: { label: string; value: string }) => (
//   <div style={styles.factItem}>
//     <span style={styles.factLabel}>{label}</span>
//     <span style={styles.factValue}>{value}</span>
//   </div>
// );

// // ==================== STYLES ====================
// const styles = {
//   pageContainer: {
//     maxWidth: "1200px",
//     margin: "0 auto",
//     padding: "20px",
//     fontFamily: "Arial, sans-serif",
//     color: "#333",
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
//   errorContainer: {
//     textAlign: "center" as const,
//     padding: "100px 20px",
//   },
//   homeButton: {
//     display: "inline-block",
//     backgroundColor: "#e67e22",
//     color: "white",
//     textDecoration: "none",
//     padding: "12px 24px",
//     borderRadius: "6px",
//     marginTop: "20px",
//     fontSize: "16px",
//     fontWeight: "bold",
//     cursor: "pointer",
//     border: "none",
//   },
//   heroSection: {
//     position: "relative" as const,
//     marginBottom: "30px",
//     borderRadius: "12px",
//     overflow: "hidden",
//     boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//   },
//   heroImage: {
//     width: "100%",
//     height: "500px",
//     objectFit: "cover" as const,
//     display: "block",
//   },
//   heroImagePlaceholder: {
//     width: "100%",
//     height: "500px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#f0f0f0",
//     fontSize: "64px",
//   },
//   heroOverlay: {
//     position: "absolute" as const,
//     bottom: 0,
//     left: 0,
//     right: 0,
//     background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
//     color: "white",
//     padding: "30px 30px 20px",
//   },
//   heroContent: {
//     maxWidth: "800px",
//   },
//   heroTitle: {
//     fontSize: "2.5rem",
//     fontWeight: "bold",
//     margin: "0 0 10px 0",
//     textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
//   },
//   heroBadges: {
//     display: "flex",
//     gap: "10px",
//     marginBottom: "15px",
//     flexWrap: "wrap" as const,
//   },
//   bestsellerBadge: {
//     backgroundColor: "#e67e22",
//     color: "white",
//     padding: "5px 12px",
//     borderRadius: "20px",
//     fontSize: "12px",
//     fontWeight: "bold",
//   },
//   topsellerBadge: {
//     backgroundColor: "#27ae60",
//     color: "white",
//     padding: "5px 12px",
//     borderRadius: "20px",
//     fontSize: "12px",
//     fontWeight: "bold",
//   },
//   guaranteedBadge: {
//     backgroundColor: "#3498db",
//     color: "white",
//     padding: "5px 12px",
//     borderRadius: "20px",
//     fontSize: "12px",
//     fontWeight: "bold",
//   },
//   stickyNav: {
//     backgroundColor: "white",
//     boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//     zIndex: 100,
//     transition: "top 0.3s ease",
//     borderRadius: "8px",
//     marginBottom: "30px",
//     width: "100%",
//   },
//   navContainer: {
//     display: "flex",
//     flexWrap: "wrap" as const,
//     gap: "5px",
//     padding: "12px 16px",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   navButton: {
//     display: "flex",
//     alignItems: "center",
//     gap: "8px",
//     padding: "8px 12px",
//     backgroundColor: "transparent",
//     border: "none",
//     borderRadius: "30px",
//     fontSize: "13px",
//     fontWeight: "500",
//     color: "#666",
//     cursor: "pointer",
//     transition: "all 0.2s",
//     whiteSpace: "nowrap" as const,
//     flex: "0 0 auto",
//     ":hover": {
//       backgroundColor: "#f5f5f5",
//       color: "#e67e22",
//     },
//   },
//   navButtonActive: {
//     backgroundColor: "#e67e22",
//     color: "white",
//     ":hover": {
//       backgroundColor: "#d35400",
//       color: "white",
//     },
//   },
//   navIcon: {
//     fontSize: "16px",
//   },
//   navLabel: {
//     fontSize: "14px",
//   },
//   mainLayout: {
//     display: "flex",
//     gap: "30px",
//     position: "relative" as const,
//   },
//   mainContent: {
//     flex: 1,
//     minWidth: 0,
//   },
//   rightColumn: {
//     width: "320px",
//     flexShrink: 0,
//   },
//   factsGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
//     gap: "15px",
//     backgroundColor: "#f8f9fa",
//     padding: "25px",
//     borderRadius: "12px",
//     marginBottom: "40px",
//   },
//   factItem: {
//     display: "flex",
//     flexDirection: "column" as const,
//   },
//   factLabel: {
//     fontSize: "0.8rem",
//     color: "#7f8c8d",
//     textTransform: "uppercase" as const,
//     letterSpacing: "0.5px",
//     marginBottom: "5px",
//   },
//   factValue: {
//     fontSize: "1rem",
//     fontWeight: "bold",
//     color: "#2c3e50",
//   },
//   pricingCardPlaceholder: {
//     height: "auto",
//   },
//   pricingCard: {
//     backgroundColor: "white",
//     borderRadius: "12px",
//     boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
//     padding: "20px",
//     marginBottom: "20px",
//     transition: "all 0.3s ease",
//   },
//   pricingCardSticky: {
//     position: "sticky" as const,
//   },
//   priceHeader: {
//     marginBottom: "15px",
//   },
//   priceLabel: {
//     fontSize: "14px",
//     color: "#7f8c8d",
//     display: "block",
//     marginBottom: "5px",
//   },
//   priceContainer: {
//     display: "flex",
//     alignItems: "baseline",
//     gap: "10px",
//   },
//   originalPrice: {
//     fontSize: "18px",
//     color: "#95a5a6",
//     textDecoration: "line-through",
//   },
//   discountedPrice: {
//     fontSize: "28px",
//     fontWeight: "bold",
//     color: "#e67e22",
//   },
//   savingsContainer: {
//     backgroundColor: "#f0f9f0",
//     padding: "10px",
//     borderRadius: "8px",
//     marginBottom: "15px",
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   savingsLabel: {
//     fontSize: "14px",
//     color: "#27ae60",
//     fontWeight: "500",
//   },
//   savingsAmount: {
//     fontSize: "18px",
//     fontWeight: "bold",
//     color: "#27ae60",
//   },
//   groupDiscountToggle: {
//     marginBottom: "20px",
//     borderTop: "1px solid #e0e0e0",
//     paddingTop: "15px",
//   },
//   groupDiscountButton: {
//     width: "100%",
//     padding: "12px",
//     backgroundColor: "#f8f9fa",
//     border: "1px solid #e0e0e0",
//     borderRadius: "8px",
//     fontSize: "14px",
//     fontWeight: "bold",
//     color: "#2c3e50",
//     cursor: "pointer",
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     transition: "all 0.2s",
//     ":hover": {
//       backgroundColor: "#e67e22",
//       color: "white",
//       borderColor: "#e67e22",
//     },
//   },
//   groupDiscountContent: {
//     marginTop: "10px",
//     padding: "10px",
//     backgroundColor: "#f8f9fa",
//     borderRadius: "8px",
//   },
//   groupDiscountItem: {
//     display: "flex",
//     justifyContent: "space-between",
//     padding: "8px 0",
//     borderBottom: "1px solid #e0e0e0",
//     ":last-child": {
//       borderBottom: "none",
//     },
//   },
//   groupSizeText: {
//     fontSize: "13px",
//     color: "#2c3e50",
//   },
//   groupPriceText: {
//     fontSize: "14px",
//     fontWeight: "bold",
//     color: "#e67e22",
//   },
//   buttonGroup: {
//     display: "flex",
//     flexDirection: "column" as const,
//     gap: "10px",
//   },
//   bookNowButton: {
//     padding: "12px",
//     backgroundColor: "#e67e22",
//     color: "white",
//     border: "none",
//     borderRadius: "8px",
//     fontSize: "16px",
//     fontWeight: "bold",
//     cursor: "pointer",
//     transition: "background-color 0.2s",
//     ":hover": {
//       backgroundColor: "#d35400",
//     },
//   },
//   checkAvailabilityButton: {
//     padding: "12px",
//     backgroundColor: "white",
//     color: "#e67e22",
//     border: "1px solid #e67e22",
//     borderRadius: "8px",
//     fontSize: "14px",
//     fontWeight: "500",
//     cursor: "pointer",
//     transition: "all 0.2s",
//     ":hover": {
//       backgroundColor: "#e67e22",
//       color: "white",
//     },
//   },
//   sendInquiryButton: {
//     padding: "12px",
//     backgroundColor: "white",
//     color: "#2c3e50",
//     border: "1px solid #bdc3c7",
//     borderRadius: "8px",
//     fontSize: "14px",
//     fontWeight: "500",
//     cursor: "pointer",
//     transition: "all 0.2s",
//     ":hover": {
//       borderColor: "#e67e22",
//       color: "#e67e22",
//     },
//   },
//   customizeButton: {
//     padding: "12px",
//     backgroundColor: "white",
//     color: "#2c3e50",
//     border: "1px solid #bdc3c7",
//     borderRadius: "8px",
//     fontSize: "14px",
//     fontWeight: "500",
//     cursor: "pointer",
//     transition: "all 0.2s",
//     ":hover": {
//       borderColor: "#e67e22",
//       color: "#e67e22",
//     },
//   },
//   downloadButton: {
//     padding: "12px",
//     backgroundColor: "white",
//     color: "#2c3e50",
//     border: "1px solid #bdc3c7",
//     borderRadius: "8px",
//     fontSize: "14px",
//     fontWeight: "500",
//     cursor: "pointer",
//     transition: "all 0.2s",
//     ":hover": {
//       borderColor: "#e67e22",
//       color: "#e67e22",
//     },
//   },
//   section: {
//     marginBottom: "50px",
//     scrollMarginTop: "80px",
//   },
//   sectionTitle: {
//     fontSize: "1.8rem",
//     fontWeight: "bold",
//     color: "#2c3e50",
//     borderBottom: "3px solid #e67e22",
//     paddingBottom: "10px",
//     marginBottom: "25px",
//   },
//   subTitle: {
//     fontSize: "1.3rem",
//     fontWeight: "bold",
//     color: "#2c3e50",
//     marginBottom: "20px",
//   },
//   paragraph: {
//     lineHeight: "1.8",
//     fontSize: "1rem",
//     color: "#444",
//   },
//   gallerySection: {
//     marginBottom: "40px",
//   },
//   galleryMain: {
//     position: "relative" as const,
//     marginBottom: "15px",
//   },
//   galleryMainImage: {
//     width: "100%",
//     height: "400px",
//     objectFit: "cover" as const,
//     borderRadius: "8px",
//   },
//   imageCaption: {
//     position: "absolute" as const,
//     bottom: "10px",
//     left: "10px",
//     backgroundColor: "rgba(0,0,0,0.7)",
//     color: "white",
//     padding: "5px 15px",
//     borderRadius: "20px",
//     fontSize: "14px",
//   },
//   galleryThumbs: {
//     display: "flex",
//     gap: "10px",
//     overflowX: "auto" as const,
//     padding: "10px 0",
//   },
//   galleryThumb: {
//     width: "80px",
//     height: "60px",
//     borderRadius: "4px",
//     overflow: "hidden",
//     cursor: "pointer",
//     flexShrink: 0,
//   },
//   galleryThumbImage: {
//     width: "100%",
//     height: "100%",
//     objectFit: "cover" as const,
//   },
//   featuredGallery: {
//     marginTop: "30px",
//   },
//   featuredGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
//     gap: "20px",
//   },
//   featuredItem: {
//     borderRadius: "8px",
//     overflow: "hidden",
//     boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//   },
//   featuredImage: {
//     width: "100%",
//     height: "200px",
//     objectFit: "cover" as const,
//   },
//   featuredCaption: {
//     padding: "10px",
//     fontSize: "14px",
//     color: "#666",
//     textAlign: "center" as const,
//   },
//   itineraryContainer: {
//     display: "flex",
//     flexDirection: "column" as const,
//     gap: "15px",
//   },
//   itineraryDay: {
//     backgroundColor: "#f9f9f9",
//     borderRadius: "8px",
//     padding: "15px 20px",
//     transition: "all 0.3s",
//     cursor: "pointer",
//   },
//   itineraryDayHeader: {
//     display: "flex",
//     alignItems: "center",
//     gap: "15px",
//     flexWrap: "wrap" as const,
//   },
//   itineraryDayNumber: {
//     display: "inline-block",
//     backgroundColor: "#e67e22",
//     color: "white",
//     padding: "4px 12px",
//     borderRadius: "20px",
//     fontSize: "14px",
//     fontWeight: "bold",
//   },
//   itineraryDayTitle: {
//     fontSize: "1.1rem",
//     fontWeight: "bold",
//     color: "#2c3e50",
//     margin: 0,
//   },
//   itineraryDayDescription: {
//     lineHeight: "1.6",
//     color: "#666",
//     marginTop: "15px",
//     marginBottom: "15px",
//   },
//   itineraryDetails: {
//     display: "flex",
//     flexWrap: "wrap" as const,
//     gap: "15px",
//     marginTop: "10px",
//   },
//   itineraryDetail: {
//     fontSize: "0.85rem",
//     color: "#888",
//   },
//   costGrid: {
//     display: "grid",
//     gridTemplateColumns: "1fr 1fr",
//     gap: "30px",
//   },
//   list: {
//     listStyle: "none",
//     padding: 0,
//     margin: 0,
//   },
//   listItem: {
//     padding: "10px 0",
//     borderBottom: "1px solid #ecf0f1",
//     display: "flex",
//     alignItems: "center",
//     gap: "8px",
//     flexWrap: "wrap" as const,
//   },
//   includeIcon: {
//     color: "#27ae60",
//     fontWeight: "bold",
//     fontSize: "16px",
//   },
//   excludeIcon: {
//     color: "#e74c3c",
//     fontWeight: "bold",
//     fontSize: "16px",
//   },
//   categoryBadge: {
//     backgroundColor: "#ecf0f1",
//     color: "#7f8c8d",
//     padding: "2px 8px",
//     borderRadius: "12px",
//     fontSize: "11px",
//   },
//   mapContainer: {
//     borderRadius: "8px",
//     overflow: "hidden",
//     boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//   },
//   mapImage: {
//     width: "100%",
//     height: "auto",
//     display: "block",
//   },
//   videoContainer: {
//     position: "relative" as const,
//     paddingBottom: "56.25%",
//     height: 0,
//     overflow: "hidden",
//     borderRadius: "8px",
//   },
//   videoIframe: {
//     position: "absolute" as const,
//     top: 0,
//     left: 0,
//     width: "100%",
//     height: "100%",
//   },
//   faqContainer: {
//     display: "flex",
//     flexDirection: "column" as const,
//     gap: "15px",
//   },
//   faqItem: {
//     backgroundColor: "#f9f9f9",
//     borderRadius: "8px",
//     padding: "15px",
//     cursor: "pointer",
//   },
//   faqQuestion: {
//     fontSize: "1.1rem",
//     fontWeight: "bold",
//     color: "#2c3e50",
//   },
//   faqAnswer: {
//     lineHeight: "1.6",
//     color: "#666",
//     marginTop: "15px",
//     paddingTop: "15px",
//     borderTop: "1px solid #e0e0e0",
//   },
//   departuresTable: {
//     overflowX: "auto" as const,
//   },
//   table: {
//     width: "100%",
//     borderCollapse: "collapse" as const,
//   },
//   th: {
//     textAlign: "left" as const,
//     padding: "12px",
//     backgroundColor: "#f8f9fa",
//     borderBottom: "2px solid #e0e0e0",
//     fontWeight: "bold",
//   },
//   tr: {
//     borderBottom: "1px solid #e0e0e0",
//   },
//   td: {
//     padding: "12px",
//   },
//   originalPriceTd: {
//     textDecoration: "line-through",
//     color: "#999",
//     marginRight: "5px",
//   },
//   discountedPriceTd: {
//     color: "#e67e22",
//     fontWeight: "bold",
//   },
//   guaranteedBadgeSmall: {
//     backgroundColor: "#3498db",
//     color: "white",
//     padding: "2px 8px",
//     borderRadius: "12px",
//     fontSize: "11px",
//     display: "inline-block",
//   },
//   bestsellerBadgeSmall: {
//     backgroundColor: "#e67e22",
//     color: "white",
//     padding: "2px 8px",
//     borderRadius: "12px",
//     fontSize: "11px",
//     display: "inline-block",
//     marginLeft: "5px",
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
//     ":hover": {
//       textDecoration: "underline",
//     },
//   },
//   breadcrumbSeparator: {
//     margin: "0 8px",
//     color: "#999",
//   },
//   breadcrumbCurrent: {
//     color: "#666",
//   },

//   // Minimized Review Platforms Section - Like the image
//   reviewPlatformsSection: {
//     marginBottom: "30px",
//     backgroundColor: "#fff",
//     borderRadius: "8px",
//     padding: "12px 20px",
//     boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
//   },
//   platformsGrid: {
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     gap: "24px",
//     flexWrap: "wrap" as const,
//   },
//   platformCard: {
//     display: "inline-flex",
//     alignItems: "center",
//     gap: "6px",
//     textDecoration: "none",
//     color: "#333",
//     fontSize: "13px",
//     transition: "color 0.2s",
//     ":hover": {
//       color: "#e67e22",
//     },
//   },
//   platformIcon: {
//     fontSize: "14px",
//   },
//   platformCount: {
//     fontWeight: "bold",
//     color: "#e67e22",
//     fontSize: "14px",
//   },
//   platformText: {
//     color: "#666",
//   },

//   // Customer Reviews Section
//   reviewsSection: {
//     marginBottom: "40px",
//     backgroundColor: "#fff",
//     borderRadius: "12px",
//     padding: "30px",
//     boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
//   },
//   reviewsHeader: {
//     marginBottom: "25px",
//     borderBottom: "2px solid #f0f0f0",
//     paddingBottom: "15px",
//   },
//   reviewsTitle: {
//     fontSize: "24px",
//     fontWeight: "bold",
//     color: "#2c3e50",
//     marginBottom: "10px",
//   },
//   reviewsSummary: {
//     display: "flex",
//     alignItems: "center",
//     gap: "20px",
//     flexWrap: "wrap" as const,
//     marginBottom: "30px",
//     padding: "20px",
//     backgroundColor: "#f8f9fa",
//     borderRadius: "12px",
//   },
//   ratingSummary: {
//     textAlign: "center" as const,
//     padding: "0 20px",
//   },
//   averageRating: {
//     fontSize: "48px",
//     fontWeight: "bold",
//     color: "#e67e22",
//     lineHeight: 1,
//   },
//   totalReviews: {
//     fontSize: "14px",
//     color: "#7f8c8d",
//     marginTop: "5px",
//   },
//   ratingDistribution: {
//     flex: 1,
//     minWidth: "200px",
//   },
//   distributionBar: {
//     display: "flex",
//     alignItems: "center",
//     gap: "10px",
//     marginBottom: "8px",
//     cursor: "pointer",
//   },
//   ratingLabel: {
//     width: "30px",
//     fontSize: "14px",
//     fontWeight: "500",
//     color: "#2c3e50",
//   },
//   barContainer: {
//     flex: 1,
//     height: "8px",
//     backgroundColor: "#e0e0e0",
//     borderRadius: "4px",
//     overflow: "hidden",
//   },
//   barFill: {
//     height: "100%",
//     backgroundColor: "#e67e22",
//     transition: "width 0.3s ease",
//   },
//   ratingCount: {
//     width: "40px",
//     fontSize: "12px",
//     color: "#7f8c8d",
//   },
//   ratingPercentage: {
//     width: "40px",
//     fontSize: "12px",
//     color: "#2c3e50",
//     fontWeight: "500",
//   },
//   filterChips: {
//     display: "flex",
//     gap: "10px",
//     flexWrap: "wrap" as const,
//     marginBottom: "25px",
//   },
//   filterChip: {
//     padding: "8px 16px",
//     backgroundColor: "#f8f9fa",
//     border: "1px solid #e0e0e0",
//     borderRadius: "20px",
//     fontSize: "14px",
//     cursor: "pointer",
//     transition: "all 0.2s",
//     color: "#666",
//     ":hover": {
//       backgroundColor: "#e67e22",
//       color: "white",
//       borderColor: "#e67e22",
//     },
//   },
//   filterChipActive: {
//     backgroundColor: "#e67e22",
//     color: "white",
//     borderColor: "#e67e22",
//   },
//   reviewsList: {
//     display: "flex",
//     flexDirection: "column" as const,
//     gap: "20px",
//   },
//   reviewCard: {
//     backgroundColor: "#fff",
//     border: "1px solid #f0f0f0",
//     borderRadius: "12px",
//     padding: "20px",
//     transition: "box-shadow 0.2s",
//     ":hover": {
//       boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
//     },
//   },
//   reviewHeader: {
//     display: "flex",
//     alignItems: "center",
//     gap: "15px",
//     marginBottom: "15px",
//   },
//   userAvatar: {
//     width: "50px",
//     height: "50px",
//     borderRadius: "50%",
//     objectFit: "cover" as const,
//   },
//   userInfo: {
//     flex: 1,
//   },
//   userName: {
//     fontSize: "16px",
//     fontWeight: "bold",
//     color: "#2c3e50",
//     marginBottom: "4px",
//   },
//   reviewDate: {
//     fontSize: "12px",
//     color: "#7f8c8d",
//   },
//   verifiedBadge: {
//     display: "inline-block",
//     backgroundColor: "#27ae60",
//     color: "white",
//     fontSize: "10px",
//     padding: "2px 6px",
//     borderRadius: "12px",
//     marginLeft: "8px",
//   },
//   reviewStars: {
//     color: "#f39c12",
//     fontSize: "14px",
//     marginBottom: "10px",
//   },
//   reviewTitle: {
//     fontSize: "18px",
//     fontWeight: "bold",
//     color: "#2c3e50",
//     marginBottom: "10px",
//   },
//   reviewComment: {
//     fontSize: "14px",
//     lineHeight: "1.6",
//     color: "#666",
//     marginBottom: "15px",
//   },
//   reviewHelpful: {
//     fontSize: "12px",
//     color: "#7f8c8d",
//     display: "flex",
//     alignItems: "center",
//     gap: "5px",
//   },
//   helpfulButton: {
//     backgroundColor: "transparent",
//     border: "none",
//     color: "#e67e22",
//     cursor: "pointer",
//     fontSize: "12px",
//     padding: "0",
//     marginLeft: "10px",
//     ":hover": {
//       textDecoration: "underline",
//     },
//   },
//   showMoreButton: {
//     marginTop: "20px",
//     padding: "12px 24px",
//     backgroundColor: "transparent",
//     border: "2px solid #e67e22",
//     borderRadius: "8px",
//     color: "#e67e22",
//     fontSize: "14px",
//     fontWeight: "bold",
//     cursor: "pointer",
//     transition: "all 0.2s",
//     width: "100%",
//     ":hover": {
//       backgroundColor: "#e67e22",
//       color: "white",
//     },
//   },
//   noReviews: {
//     textAlign: "center" as const,
//     padding: "40px",
//     color: "#7f8c8d",
//   },

//   galleryGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
//     gap: "25px",
//     marginTop: "20px",
//   },

//   galleryItem: {
//     position: "relative" as const,
//     borderRadius: "12px",
//     overflow: "hidden",
//     boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//     transition: "transform 0.2s, boxShadow 0.2s",
//     backgroundColor: "#fff",
//     cursor: "pointer",
//     ":hover": {
//       transform: "translateY(-4px)",
//       boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
//     },
//   },

//   galleryImage: {
//     width: "100%",
//     height: "250px",
//     objectFit: "cover" as const,
//     display: "block",
//     transition: "transform 0.3s",
//     ":hover": {
//       transform: "scale(1.05)",
//     },
//   },

//   galleryOverlay: {
//     position: "absolute" as const,
//     bottom: 0,
//     left: 0,
//     right: 0,
//     background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
//     padding: "15px",
//     opacity: 0,
//     transition: "opacity 0.3s",
//     ":hover": {
//       opacity: 1,
//     },
//   },

//   galleryTitle: {
//     margin: 0,
//     fontSize: "14px",
//     fontWeight: "bold",
//     color: "white",
//     marginBottom: "5px",
//   },

//   galleryDescription: {
//     margin: 0,
//     fontSize: "12px",
//     color: "#f0f0f0",
//     lineHeight: "1.4",
//   },

//   galleryFeaturedBadge: {
//     position: "absolute" as const,
//     top: "12px",
//     right: "12px",
//     backgroundColor: "#e67e22",
//     color: "white",
//     padding: "4px 10px",
//     borderRadius: "20px",
//     fontSize: "11px",
//     fontWeight: "bold",
//     zIndex: 2,
//     boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
//   },
// };

// export default TripDetailsPage;

//-----------------------------------------------------------------------end

import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

// Types
interface TripSliderImage {
  id: number;
  imageUrl: string;
  title?: string;
  caption?: string;
  altText?: string;
  displayOrder: number;
}

interface TripGalleryImage {
  id: number;
  imageUrl: string;
  title?: string;
  description?: string;
  altText?: string;
  displayOrder: number;
  isFeatured: boolean;
}

interface TripItineraryDay {
  id: number;
  dayNumber: number;
  title?: string;
  description?: string;
  maxAltitude?: string;
  accommodation?: string;
  meals?: string;
  duration?: string;
  distance?: string;
}

interface TripCostInclude {
  id: number;
  description: string;
  category?: string;
  displayOrder: number;
}

interface TripCostExclude {
  id: number;
  description: string;
  category?: string;
  displayOrder: number;
}

interface TripFaq {
  id: number;
  question: string;
  answer: string;
  displayOrder: number;
}

interface TripDepartureDate {
  id: number;
  startDate: string;
  endDate: string;
  price: number;
  discountedPrice?: number;
  isGuaranteed: boolean;
  isAvailable: boolean;
  notes?: string;
  isBestSeller: boolean;
  isTopSeller: boolean;
  bookingCount: number;
}

interface GroupDiscount {
  id: number;
  minTravelers: number;
  maxTravelers: number;
  pricePerPerson: number;
  discountPercentage?: number;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  totalPrice: number;
}

interface Review {
  id: number;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
  helpful?: number;
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

interface ReviewPlatform {
  id: string;
  name: string;
  icon: string;
  count: number;
  rating?: number;
  color: string;
  url?: string;
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
  mainHeadingId: number;
  mainHeadingName: string;
  headingId: number;
  headingName: string;
  subHeadingId?: number;
  subHeadingName?: string;
  countryId: number;
  countryName: string;
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
  sliderImages: TripSliderImage[];
  galleryImages: TripGalleryImage[];
  itinerary: TripItineraryDay[];
  costIncludes: TripCostInclude[];
  costExcludes: TripCostExclude[];
  faqs: TripFaq[];
  departureDates: TripDepartureDate[];
  groupDiscounts?: GroupDiscount[];
  isBestSeller?: boolean;
  isTopSeller?: boolean;
  hasGuaranteedDeparture?: boolean;
}

interface NavItem {
  id: string;
  label: string;
  icon: string;
}

const TripDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tripData, setTripData] = useState<TrekPackage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeNav, setActiveNav] = useState("overview");
  const [isNavSticky, setIsNavSticky] = useState(false);
  const [showGroupDiscount, setShowGroupDiscount] = useState(false);
  const [isPricingCardSticky, setIsPricingCardSticky] = useState(false);
  const [navHeight, setNavHeight] = useState(0);
  const [openItineraryDays, setOpenItineraryDays] = useState<number[]>([]);
  // Gallery Modal State
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [currentModalImageIndex, setCurrentModalImageIndex] = useState(0);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewStats, setReviewStats] = useState<ReviewStats>({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });
  const [reviewPlatforms] = useState<ReviewPlatform[]>([
    {
      id: "tripadvisor",
      name: "TripAdvisor",
      icon: "🌐",
      count: 1520,
      color: "#00aa6c",
      url: "https://www.tripadvisor.com",
    },
    {
      id: "google",
      name: "Google",
      icon: "🔍",
      count: 400,
      color: "#4285f4",
      url: "https://www.google.com/maps",
    },
    {
      id: "trustpilot",
      name: "TrustPilot",
      icon: "⭐",
      count: 106,
      color: "#00b67a",
      url: "https://www.trustpilot.com",
    },
  ]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const pricingCardRef = useRef<HTMLDivElement>(null);
  const pricingCardPlaceholderRef = useRef<HTMLDivElement>(null);
  const stickyNavRef = useRef<HTMLDivElement>(null);

  // Refs for sections
  const overviewRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const itineraryRef = useRef<HTMLDivElement>(null);
  const routeMapRef = useRef<HTMLDivElement>(null);
  const costDetailsRef = useRef<HTMLDivElement>(null);
  const datesRef = useRef<HTMLDivElement>(null);
  const essentialInfoRef = useRef<HTMLDivElement>(null);
  const faqsRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const factsGridRef = useRef<HTMLDivElement>(null);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5232";

  const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const createSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  // Modal Functions
  const openGalleryModal = (index: number) => {
    setCurrentModalImageIndex(index);
    setShowGalleryModal(true);
    document.body.style.overflow = "hidden";
  };

  const closeGalleryModal = () => {
    setShowGalleryModal(false);
    document.body.style.overflow = "auto";
  };

  const nextImage = () => {
    if (tripData?.galleryImages) {
      setCurrentModalImageIndex((prev) =>
        prev === tripData.galleryImages.length - 1 ? 0 : prev + 1,
      );
    }
  };

  const prevImage = () => {
    if (tripData?.galleryImages) {
      setCurrentModalImageIndex((prev) =>
        prev === 0 ? tripData.galleryImages.length - 1 : prev - 1,
      );
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showGalleryModal) {
        if (e.key === "ArrowLeft") {
          prevImage();
        } else if (e.key === "ArrowRight") {
          nextImage();
        } else if (e.key === "Escape") {
          closeGalleryModal();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showGalleryModal, tripData?.galleryImages]);

  const generateMockReviews = (packageId: number): Review[] => {
    const mockReviews: Review[] = [
      {
        id: 1,
        userName: "Sarah Johnson",
        userAvatar: "https://randomuser.me/api/portraits/women/1.jpg",
        rating: 5,
        title: "Absolutely incredible experience!",
        comment:
          "This trek exceeded all expectations. The guides were professional, the scenery breathtaking, and the organization flawless. Highly recommended for anyone seeking adventure!",
        date: "2024-02-15",
        verified: true,
        helpful: 24,
      },
      {
        id: 2,
        userName: "Michael Chen",
        userAvatar: "https://randomuser.me/api/portraits/men/2.jpg",
        rating: 5,
        title: "Life-changing journey",
        comment:
          "From start to finish, everything was perfectly arranged. The accommodations were comfortable and the food was surprisingly good. Will definitely book again!",
        date: "2024-01-20",
        verified: true,
        helpful: 18,
      },
      {
        id: 3,
        userName: "Emma Williams",
        userAvatar: "https://randomuser.me/api/portraits/women/3.jpg",
        rating: 4,
        title: "Great adventure, minor weather issues",
        comment:
          "Overall fantastic experience. The only downside was some unexpected weather, but the guides handled it professionally. Would recommend!",
        date: "2024-01-05",
        verified: true,
        helpful: 12,
      },
      {
        id: 4,
        userName: "David Kumar",
        userAvatar: "https://randomuser.me/api/portraits/men/4.jpg",
        rating: 5,
        title: "Best decision I ever made",
        comment:
          "The views were spectacular, and the team went above and beyond to ensure everyone was safe and comfortable. Worth every penny!",
        date: "2023-12-10",
        verified: true,
        helpful: 31,
      },
      {
        id: 5,
        userName: "Lisa Anderson",
        userAvatar: "https://randomuser.me/api/portraits/women/5.jpg",
        rating: 5,
        title: "Unforgettable memories",
        comment:
          "Amazing organization, knowledgeable guides, and incredible scenery. The attention to detail was impressive. Highly recommended!",
        date: "2023-11-28",
        verified: true,
        helpful: 15,
      },
      {
        id: 6,
        userName: "James Wilson",
        userAvatar: "https://randomuser.me/api/portraits/men/6.jpg",
        rating: 4,
        title: "Very good experience",
        comment:
          "Everything was well organized. The only suggestion would be to have more vegetarian options, but overall excellent.",
        date: "2023-11-15",
        verified: false,
        helpful: 8,
      },
    ];
    return mockReviews;
  };

  const calculateReviewStats = (reviewsList: Review[]): ReviewStats => {
    const total = reviewsList.length;
    if (total === 0)
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };

    const sum = reviewsList.reduce((acc, rev) => acc + rev.rating, 0);
    const average = sum / total;

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviewsList.forEach((rev) => {
      distribution[rev.rating as keyof typeof distribution]++;
    });

    return {
      averageRating: average,
      totalReviews: total,
      ratingDistribution: distribution,
    };
  };

  useEffect(() => {
    if (tripData) {
      const mockReviews = generateMockReviews(tripData.id);
      setReviews(mockReviews);
      setReviewStats(calculateReviewStats(mockReviews));
    }
  }, [tripData]);

  // Filter reviews by rating
  const filteredReviews = selectedRating
    ? reviews.filter((review) => review.rating === selectedRating)
    : reviews;

  const displayedReviews = showAllReviews
    ? filteredReviews
    : filteredReviews.slice(0, 3);

  // Navigation items based on available content
  const getNavItems = (): NavItem[] => {
    const items: NavItem[] = [
      { id: "overview", label: "Overview", icon: "📖" },
    ];

    if (
      tripData?.sliderImages?.length > 0 ||
      tripData?.galleryImages?.length > 0
    ) {
      items.push({ id: "gallery", label: "Gallery", icon: "🖼️" });
    }

    if (tripData?.itinerary?.length > 0) {
      items.push({ id: "itinerary", label: "Itinerary", icon: "📅" });
    }

    if (tripData?.routeMapImageUrl) {
      items.push({ id: "routeMap", label: "Route Map", icon: "🗺️" });
    }

    if (
      tripData?.costIncludes?.length > 0 ||
      tripData?.costExcludes?.length > 0
    ) {
      items.push({ id: "costDetails", label: "Cost Details", icon: "💰" });
    }

    if (tripData?.departureDates?.length > 0) {
      items.push({ id: "dates", label: "Dates & Price", icon: "📆" });
    }

    if (tripData?.essentialInformation) {
      items.push({ id: "essentialInfo", label: "Essential Info", icon: "ℹ️" });
    }

    if (tripData?.faqs?.length > 0) {
      items.push({ id: "faqs", label: "FAQs", icon: "❓" });
    }

    if (tripData?.videoReviewUrl) {
      items.push({ id: "video", label: "Video Reviews", icon: "🎥" });
    }

    return items;
  };

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

  // Scroll to section function
  const scrollToSection = (sectionId: string) => {
    const sectionRefs: { [key: string]: React.RefObject<HTMLDivElement> } = {
      overview: overviewRef,
      gallery: galleryRef,
      itinerary: itineraryRef,
      routeMap: routeMapRef,
      costDetails: costDetailsRef,
      dates: datesRef,
      essentialInfo: essentialInfoRef,
      faqs: faqsRef,
      video: videoRef,
    };

    const ref = sectionRefs[sectionId];
    if (ref?.current) {
      const navElement = stickyNavRef.current;
      const currentNavHeight = navElement?.getBoundingClientRect().height || 0;
      const offset = currentNavHeight + 20;

      const elementPosition = ref.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveNav(sectionId);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const navElement = stickyNavRef.current;
      const currentNavHeight = navElement?.getBoundingClientRect().height || 0;
      setNavHeight(currentNavHeight);

      setIsNavSticky(window.scrollY > 300);

      if (pricingCardPlaceholderRef.current && pricingCardRef.current) {
        const placeholderTop =
          pricingCardPlaceholderRef.current.getBoundingClientRect().top;
        const scrollPosition = window.scrollY;
        const offset = 100;

        if (scrollPosition > placeholderTop + offset) {
          setIsPricingCardSticky(true);
        } else {
          setIsPricingCardSticky(false);
        }
      }

      const sections = [
        { id: "overview", ref: overviewRef },
        { id: "gallery", ref: galleryRef },
        { id: "itinerary", ref: itineraryRef },
        { id: "routeMap", ref: routeMapRef },
        { id: "costDetails", ref: costDetailsRef },
        { id: "dates", ref: datesRef },
        { id: "essentialInfo", ref: essentialInfoRef },
        { id: "faqs", ref: faqsRef },
        { id: "video", ref: videoRef },
      ];

      const stickyNavHeight = isNavSticky ? currentNavHeight : 0;
      const scrollPosition = window.scrollY + stickyNavHeight + 100;

      let activeSection = null;

      for (const section of sections) {
        if (section.ref.current) {
          const rect = section.ref.current.getBoundingClientRect();
          const offsetTop = rect.top + window.scrollY;
          const offsetHeight = section.ref.current.offsetHeight;
          const buffer = 10;

          if (
            scrollPosition >= offsetTop - buffer &&
            scrollPosition < offsetTop + offsetHeight - buffer
          ) {
            activeSection = section.id;
            break;
          }
        }
      }

      if (activeSection) {
        setActiveNav(activeSection);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [tripData, isNavSticky]);

  useEffect(() => {
    if (slug) {
      fetchTripDetails();
    }
  }, [slug]);

  const fetchTripDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const idMatch = slug?.match(/-(\d+)$/);
      const packageId = idMatch ? parseInt(idMatch[1]) : null;

      if (!packageId) {
        throw new Error("Invalid package ID");
      }

      const response = await api.get(`/api/TrekPackage/${packageId}`);
      setTripData(response.data);
    } catch (error: any) {
      console.error("Error fetching trip details:", error);
      setError(error.response?.data?.message || "Error loading trip details");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price?: number): string => {
    if (!price) return "Contact Us";
    return `US$${price.toLocaleString()}`;
  };

  const getSavings = () => {
    if (
      tripData?.price &&
      tripData?.discountedPrice &&
      tripData.discountedPrice < tripData.price
    ) {
      return tripData.price - tripData.discountedPrice;
    }
    return null;
  };

  const savings = getSavings();

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading trip details...</p>
      </div>
    );
  }

  if (error || !tripData) {
    return (
      <div style={styles.errorContainer}>
        <h2>Error Loading Trip</h2>
        <p>{error || "Trip not found"}</p>
        <button onClick={() => navigate("/")} style={styles.homeButton}>
          Go Home
        </button>
      </div>
    );
  }

  const navItems = getNavItems();
  const heroImage =
    tripData.sliderImages && tripData.sliderImages.length > 0
      ? getFullImageUrl(tripData.sliderImages[0].imageUrl)
      : tripData.routeMapImageUrl
        ? getFullImageUrl(tripData.routeMapImageUrl)
        : "";

  // Display first 4 images, and show "+X" for remaining
  const displayGalleryImages = tripData.galleryImages?.slice(0, 4) || [];
  const remainingCount = (tripData.galleryImages?.length || 0) - 4;

  const toggleItineraryDay = (dayId: number) => {
    setOpenItineraryDays((prev) =>
      prev.includes(dayId)
        ? prev.filter((id) => id !== dayId)
        : [...prev, dayId],
    );
  };

  return (
    <div style={styles.pageContainer}>
      {/* Hero Section */}
      <div style={styles.heroSection}>
        {heroImage ? (
          <img src={heroImage} alt={tripData.name} style={styles.heroImage} />
        ) : (
          <div style={styles.heroImagePlaceholder}>🏔️</div>
        )}
        <div style={styles.heroOverlay}>
          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>{tripData.name}</h1>
            <div style={styles.heroBadges}>
              {tripData.isBestSeller && (
                <span style={styles.bestsellerBadge}>Best Seller</span>
              )}
              {tripData.isTopSeller && (
                <span style={styles.topsellerBadge}>TOPSELLER</span>
              )}
              {tripData.hasGuaranteedDeparture && (
                <span style={styles.guaranteedBadge}>
                  Guaranteed Departures
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div style={styles.breadcrumb}>
        <Link to="/" style={styles.breadcrumbLink}>
          Home
        </Link>
        <span style={styles.breadcrumbSeparator}>/</span>
        <Link
          to={`/${createSlug(tripData.mainHeadingName)}`}
          style={styles.breadcrumbLink}
        >
          {tripData.mainHeadingName}
        </Link>
        <span style={styles.breadcrumbSeparator}>/</span>
        <Link
          to={`/${createSlug(tripData.mainHeadingName)}/${createSlug(tripData.headingName)}`}
          style={styles.breadcrumbLink}
        >
          {tripData.headingName}
        </Link>
        {tripData.subHeadingName && (
          <>
            <span style={styles.breadcrumbSeparator}>/</span>
            <Link
              to={`/${createSlug(tripData.mainHeadingName)}/${createSlug(tripData.headingName)}/${createSlug(tripData.subHeadingName)}`}
              style={styles.breadcrumbLink}
            >
              {tripData.subHeadingName}
            </Link>
          </>
        )}
        <span style={styles.breadcrumbSeparator}>/</span>
        <span style={styles.breadcrumbCurrent}>{tripData.name}</span>
      </div>

      {/* Minimized Review Platforms Section */}
      <div style={styles.reviewPlatformsSection}>
        <div style={styles.platformsGrid}>
          {reviewPlatforms.map((platform) => (
            <a
              key={platform.id}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.platformCard}
            >
              <span style={styles.platformIcon}>{platform.icon}</span>
              <span style={styles.platformCount}>
                {platform.count.toLocaleString()}+
              </span>
              <span style={styles.platformText}>
                reviews in {platform.name}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Sticky Navigation Bar */}
      <div
        ref={stickyNavRef}
        style={{
          ...styles.stickyNav,
          top: isNavSticky ? 0 : -100,
          position: isNavSticky ? "sticky" : "relative",
        }}
      >
        <div style={styles.navContainer}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              style={{
                ...styles.navButton,
                ...(activeNav === item.id ? styles.navButtonActive : {}),
              }}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              <span style={styles.navLabel}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content with Sidebar Layout */}
      <div style={styles.mainLayout}>
        {/* Left Column - Main Content */}
        <div style={styles.mainContent}>
          {/* Trip Facts Grid */}
          <div ref={factsGridRef} style={styles.factsGrid}>
            <FactItem
              label="Duration"
              value={`${tripData.durationDays} Days${tripData.durationNights ? ` / ${tripData.durationNights} Nights` : ""}`}
            />
            <FactItem
              label="Trip Grade"
              value={tripData.tripGrade || "Moderate"}
            />
            <FactItem label="Country" value={tripData.countryName} />
            <FactItem
              label="Maximum Altitude"
              value={tripData.maximumAltitude || "N/A"}
            />
            <FactItem label="Group Size" value={tripData.groupSize || "1-20"} />
            <FactItem label="Starts" value={tripData.startsAt || "Kathmandu"} />
            <FactItem label="Ends" value={tripData.endsAt || "Kathmandu"} />
            <FactItem
              label="Activities"
              value={tripData.activities || "Trekking"}
            />
            <FactItem
              label="Best Time"
              value={tripData.bestTime || "Mar-May, Sep-Nov"}
            />
          </div>

          {/* Pricing Card Placeholder */}
          <div
            ref={pricingCardPlaceholderRef}
            style={styles.pricingCardPlaceholder}
          />

          {/* Overview Section */}
          <div ref={overviewRef}>
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>Overview</h2>
              <div
                dangerouslySetInnerHTML={{ __html: tripData.overview || "" }}
                style={styles.paragraph}
              />
            </section>
          </div>

          {/* Gallery Section - ONLY DISPLAY GALLERY IMAGES */}
          {tripData.galleryImages && tripData.galleryImages.length > 0 && (
            <div ref={galleryRef}>
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Gallery</h2>

                {/* Gallery Images Grid - Show first 4 images with + overlay if more than 4 */}
                <div style={styles.galleryGrid}>
                  {displayGalleryImages.map((img, idx) => (
                    <div
                      key={img.id}
                      style={styles.galleryItem}
                      onClick={() => openGalleryModal(idx)}
                    >
                      <img
                        src={getFullImageUrl(img.imageUrl)}
                        alt={img.title || "Gallery image"}
                        style={styles.galleryImage}
                      />
                      {img.isFeatured && (
                        <span style={styles.galleryFeaturedBadge}>
                          Featured
                        </span>
                      )}
                      {img.title && (
                        <div style={styles.galleryOverlay}>
                          <p style={styles.galleryTitle}>{img.title}</p>
                          {img.description && (
                            <p style={styles.galleryDescription}>
                              {img.description}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Show "+X" overlay if more than 4 images */}
                  {remainingCount > 0 && (
                    <div
                      style={styles.galleryMoreItem}
                      onClick={() => openGalleryModal(4)}
                    >
                      <div style={styles.galleryMoreOverlay}>
                        <span style={styles.galleryMoreText}>
                          +{remainingCount}
                        </span>
                        <span style={styles.galleryMoreSubText}>
                          More Photos
                        </span>
                      </div>
                      <img
                        src={getFullImageUrl(displayGalleryImages[3]?.imageUrl)}
                        alt="More images"
                        style={styles.galleryMoreImage}
                      />
                    </div>
                  )}
                </div>

                {/* View All Button (Alternative if you prefer button instead of overlay) */}
                {tripData.galleryImages.length > 4 && (
                  <button
                    style={styles.viewAllButton}
                    onClick={() => openGalleryModal(0)}
                  >
                    View All {tripData.galleryImages.length} Photos
                  </button>
                )}
              </section>
            </div>
          )}

          {/* Itinerary Section */}
          {/* {tripData.itinerary && tripData.itinerary.length > 0 && (
            <div ref={itineraryRef}>
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Itinerary</h2>
                <div style={styles.itineraryContainer}>
                  {tripData.itinerary.map((day) => (
                    <details key={day.id} style={styles.itineraryDay}>
                      <summary style={styles.itineraryDayHeader}>
                        <span style={styles.itineraryDayNumber}>
                          Day {day.dayNumber}
                        </span>
                        {day.title && (
                          <h3 style={styles.itineraryDayTitle}>{day.title}</h3>
                        )}
                      </summary>
                      {day.description && (
                        <div
                          dangerouslySetInnerHTML={{ __html: day.description }}
                          style={styles.itineraryDayDescription}
                        />
                      )}
                      <div style={styles.itineraryDetails}>
                        {day.maxAltitude && (
                          <span style={styles.itineraryDetail}>
                            🏔️ {day.maxAltitude}
                          </span>
                        )}
                        {day.accommodation && (
                          <span style={styles.itineraryDetail}>
                            🏨 {day.accommodation}
                          </span>
                        )}
                        {day.meals && (
                          <span style={styles.itineraryDetail}>
                            🍽️ {day.meals}
                          </span>
                        )}
                        {day.duration && (
                          <span style={styles.itineraryDetail}>
                            ⏱️ {day.duration}
                          </span>
                        )}
                        {day.distance && (
                          <span style={styles.itineraryDetail}>
                            📏 {day.distance}
                          </span>
                        )}
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            </div>
          )} */}

          {/* Itinerary Section - Corrected with state management */}
          {tripData.itinerary && tripData.itinerary.length > 0 && (
            <div ref={itineraryRef}>
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Itinerary</h2>
                <div style={styles.itineraryContainer}>
                  {tripData.itinerary.map((day) => {
                    const isOpen = openItineraryDays.includes(day.id);

                    return (
                      <div key={day.id} style={styles.itineraryDay}>
                        {/* Header - Clickable to toggle */}
                        <div
                          style={styles.itineraryDayHeader}
                          onClick={() => toggleItineraryDay(day.id)}
                        >
                          <span style={styles.itineraryDayNumber}>
                            Day {day.dayNumber}
                          </span>
                          {day.title && (
                            <h3 style={styles.itineraryDayTitle}>
                              {day.title}
                            </h3>
                          )}
                          <span
                            style={{
                              ...styles.itineraryToggleIcon,
                              ...(isOpen ? styles.itineraryToggleIconOpen : {}),
                            }}
                          >
                            {isOpen ? "−" : "+"}
                          </span>
                        </div>

                        {/* Content - Shows when open */}
                        {isOpen && (
                          <div style={styles.itineraryDayContent}>
                            {day.description && (
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: day.description,
                                }}
                                style={styles.itineraryDayDescription}
                              />
                            )}
                            <div style={styles.itineraryDetails}>
                              {day.maxAltitude && (
                                <span style={styles.itineraryDetail}>
                                  🏔️ {day.maxAltitude}
                                </span>
                              )}
                              {day.accommodation && (
                                <span style={styles.itineraryDetail}>
                                  🏨 {day.accommodation}
                                </span>
                              )}
                              {day.meals && (
                                <span style={styles.itineraryDetail}>
                                  🍽️ {day.meals}
                                </span>
                              )}
                              {day.duration && (
                                <span style={styles.itineraryDetail}>
                                  ⏱️ {day.duration}
                                </span>
                              )}
                              {day.distance && (
                                <span style={styles.itineraryDetail}>
                                  📏 {day.distance}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          )}

          {/* Route Map Section */}
          {tripData.routeMapImageUrl && (
            <div ref={routeMapRef}>
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Route Map</h2>
                <div style={styles.mapContainer}>
                  <img
                    src={getFullImageUrl(tripData.routeMapImageUrl)}
                    alt={`Route map for ${tripData.name}`}
                    style={styles.mapImage}
                  />
                </div>
              </section>
            </div>
          )}

          {/* Cost Details Section */}
          {(tripData.costIncludes?.length > 0 ||
            tripData.costExcludes?.length > 0) && (
            <div ref={costDetailsRef}>
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Cost Details</h2>
                <div style={styles.costGrid}>
                  {tripData.costIncludes?.length > 0 && (
                    <div>
                      <h3 style={styles.subTitle}>✓ What's Included</h3>
                      <ul style={styles.list}>
                        {tripData.costIncludes.map((item) => (
                          <li key={item.id} style={styles.listItem}>
                            <span style={styles.includeIcon}>✓</span>{" "}
                            {item.description}
                            {item.category && (
                              <span style={styles.categoryBadge}>
                                {item.category}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {tripData.costExcludes?.length > 0 && (
                    <div>
                      <h3 style={styles.subTitle}>✗ What's Not Included</h3>
                      <ul style={styles.list}>
                        {tripData.costExcludes.map((item) => (
                          <li key={item.id} style={styles.listItem}>
                            <span style={styles.excludeIcon}>✗</span>{" "}
                            {item.description}
                            {item.category && (
                              <span style={styles.categoryBadge}>
                                {item.category}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            </div>
          )}

          {/* Dates & Price Section */}
          {tripData.departureDates && tripData.departureDates.length > 0 && (
            <div ref={datesRef}>
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Dates & Price</h2>
                <div style={styles.departuresTable}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Start Date</th>
                        <th style={styles.th}>End Date</th>
                        <th style={styles.th}>Price</th>
                        <th style={styles.th}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tripData.departureDates
                        .filter((d) => new Date(d.startDate) > new Date())
                        .slice(0, 10)
                        .map((date) => (
                          <tr key={date.id} style={styles.tr}>
                            <td style={styles.td}>
                              {new Date(date.startDate).toLocaleDateString()}
                            </td>
                            <td style={styles.td}>
                              {new Date(date.endDate).toLocaleDateString()}
                            </td>
                            <td style={styles.td}>
                              {date.discountedPrice ? (
                                <>
                                  <span style={styles.originalPriceTd}>
                                    US${date.price}
                                  </span>
                                  <span style={styles.discountedPriceTd}>
                                    {" "}
                                    US${date.discountedPrice}
                                  </span>
                                </>
                              ) : (
                                `US$${date.price}`
                              )}
                            </td>
                            <td style={styles.td}>
                              {date.isGuaranteed && (
                                <span style={styles.guaranteedBadgeSmall}>
                                  Guaranteed
                                </span>
                              )}
                              {date.isBestSeller && (
                                <span style={styles.bestsellerBadgeSmall}>
                                  Best Seller
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {/* Essential Information Section */}
          {tripData.essentialInformation && (
            <div ref={essentialInfoRef}>
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Essential Information</h2>
                <div
                  dangerouslySetInnerHTML={{
                    __html: tripData.essentialInformation,
                  }}
                  style={styles.paragraph}
                />
              </section>
            </div>
          )}

          {/* FAQs Section */}
          {tripData.faqs?.length > 0 && (
            <div ref={faqsRef}>
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>FAQs</h2>
                <div style={styles.faqContainer}>
                  {tripData.faqs.map((faq) => (
                    <details key={faq.id} style={styles.faqItem}>
                      <summary style={styles.faqQuestion}>
                        ❓ {faq.question}
                      </summary>
                      <div
                        dangerouslySetInnerHTML={{ __html: faq.answer }}
                        style={styles.faqAnswer}
                      />
                    </details>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* Video Reviews Section */}
          {tripData.videoReviewUrl && (
            <div ref={videoRef}>
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Video Reviews</h2>
                <div style={styles.videoContainer}>
                  <iframe
                    width="100%"
                    height="500"
                    src={tripData.videoReviewUrl.replace("watch?v=", "embed/")}
                    title={`${tripData.name} Video`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={styles.videoIframe}
                  ></iframe>
                </div>
              </section>
            </div>
          )}

          {/* Customer Reviews Section */}
          <div style={styles.reviewsSection}>
            <div style={styles.reviewsHeader}>
              <h2 style={styles.reviewsTitle}>Customer Reviews</h2>
            </div>

            <div style={styles.reviewsSummary}>
              <div style={styles.ratingSummary}>
                <div style={styles.averageRating}>
                  {reviewStats.averageRating.toFixed(1)}
                </div>
                <div style={styles.reviewStars}>
                  {"★".repeat(Math.floor(reviewStats.averageRating))}
                  {reviewStats.averageRating % 1 !== 0 && "½"}
                </div>
                <div style={styles.totalReviews}>
                  Based on {reviewStats.totalReviews} reviews
                </div>
              </div>

              <div style={styles.ratingDistribution}>
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count =
                    reviewStats.ratingDistribution[
                      rating as keyof typeof reviewStats.ratingDistribution
                    ];
                  const percentage =
                    reviewStats.totalReviews > 0
                      ? (count / reviewStats.totalReviews) * 100
                      : 0;
                  return (
                    <div
                      key={rating}
                      style={styles.distributionBar}
                      onClick={() =>
                        setSelectedRating(
                          selectedRating === rating ? null : rating,
                        )
                      }
                    >
                      <span style={styles.ratingLabel}>{rating} ★</span>
                      <div style={styles.barContainer}>
                        <div
                          style={{
                            ...styles.barFill,
                            width: `${percentage}%`,
                          }}
                        />
                      </div>
                      <span style={styles.ratingCount}>{count}</span>
                      <span style={styles.ratingPercentage}>
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={styles.filterChips}>
              <button
                onClick={() => setSelectedRating(null)}
                style={{
                  ...styles.filterChip,
                  ...(!selectedRating ? styles.filterChipActive : {}),
                }}
              >
                All Reviews
              </button>
              {[5, 4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() =>
                    setSelectedRating(selectedRating === rating ? null : rating)
                  }
                  style={{
                    ...styles.filterChip,
                    ...(selectedRating === rating
                      ? styles.filterChipActive
                      : {}),
                  }}
                >
                  {rating} ★ (
                  {
                    reviewStats.ratingDistribution[
                      rating as keyof typeof reviewStats.ratingDistribution
                    ]
                  }
                  )
                </button>
              ))}
            </div>

            {displayedReviews.length > 0 ? (
              <>
                <div style={styles.reviewsList}>
                  {displayedReviews.map((review) => (
                    <div key={review.id} style={styles.reviewCard}>
                      <div style={styles.reviewHeader}>
                        {review.userAvatar ? (
                          <img
                            src={review.userAvatar}
                            alt={review.userName}
                            style={styles.userAvatar}
                          />
                        ) : (
                          <div
                            style={{
                              ...styles.userAvatar,
                              backgroundColor: "#e67e22",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                            }}
                          >
                            {review.userName.charAt(0)}
                          </div>
                        )}
                        <div style={styles.userInfo}>
                          <div style={styles.userName}>
                            {review.userName}
                            {review.verified && (
                              <span style={styles.verifiedBadge}>
                                ✓ Verified
                              </span>
                            )}
                          </div>
                          <div style={styles.reviewDate}>
                            {new Date(review.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </div>
                        </div>
                      </div>
                      <div style={styles.reviewStars}>
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </div>
                      <h3 style={styles.reviewTitle}>{review.title}</h3>
                      <p style={styles.reviewComment}>{review.comment}</p>
                      <div style={styles.reviewHelpful}>
                        <span>
                          👍 {review.helpful || 0} people found this helpful
                        </span>
                        <button
                          style={styles.helpfulButton}
                          onClick={() => {
                            alert("Thank you for your feedback!");
                          }}
                        >
                          Was this helpful?
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredReviews.length > 3 && (
                  <button
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    style={styles.showMoreButton}
                  >
                    {showAllReviews
                      ? "Show Less Reviews"
                      : `Show All ${filteredReviews.length} Reviews`}
                  </button>
                )}
              </>
            ) : (
              <div style={styles.noReviews}>
                <p>No reviews available for this rating.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Sticky Pricing Card */}
        <div style={styles.rightColumn}>
          <div
            ref={pricingCardRef}
            style={{
              ...styles.pricingCard,
              ...(isPricingCardSticky
                ? {
                    ...styles.pricingCardSticky,
                    top: isNavSticky ? `${navHeight + 20}px` : "20px",
                  }
                : {}),
            }}
          >
            <div style={styles.priceHeader}>
              <span style={styles.priceLabel}>Price From</span>
              <div style={styles.priceContainer}>
                {tripData.discountedPrice ? (
                  <>
                    <span style={styles.originalPrice}>
                      {formatPrice(tripData.price)}
                    </span>
                    <span style={styles.discountedPrice}>
                      {formatPrice(tripData.discountedPrice)}
                    </span>
                  </>
                ) : (
                  <span style={styles.discountedPrice}>
                    {formatPrice(tripData.price)}
                  </span>
                )}
              </div>
            </div>

            {savings && savings > 0 && (
              <div style={styles.savingsContainer}>
                <span style={styles.savingsLabel}>You Save</span>
                <span style={styles.savingsAmount}>{formatPrice(savings)}</span>
              </div>
            )}

            {tripData.groupDiscounts && tripData.groupDiscounts.length > 0 && (
              <div style={styles.groupDiscountToggle}>
                <button
                  onClick={() => setShowGroupDiscount(!showGroupDiscount)}
                  style={styles.groupDiscountButton}
                >
                  GROUP DISCOUNT PRICE {showGroupDiscount ? "−" : "+"}
                </button>
                {showGroupDiscount && (
                  <div style={styles.groupDiscountContent}>
                    {tripData.groupDiscounts
                      .sort((a, b) => a.minTravelers - b.minTravelers)
                      .map((discount) => (
                        <div key={discount.id} style={styles.groupDiscountItem}>
                          <span style={styles.groupSizeText}>
                            {discount.minTravelers}-{discount.maxTravelers} pax
                          </span>
                          <span style={styles.groupPriceText}>
                            {formatPrice(discount.pricePerPerson)}/pax
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            <div style={styles.buttonGroup}>
              <button style={styles.bookNowButton}>Book This Trip</button>
              <button style={styles.checkAvailabilityButton}>
                Check Availability
              </button>
              <button style={styles.sendInquiryButton}>Send Inquiry</button>
              <button style={styles.customizeButton}>Customize a Trip</button>
              <button style={styles.downloadButton}>Download a Brochure</button>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Modal */}
      {showGalleryModal && tripData.galleryImages && (
        <div style={styles.modalOverlay} onClick={closeGalleryModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button style={styles.modalClose} onClick={closeGalleryModal}>
              ✕
            </button>
            <button style={styles.modalPrev} onClick={prevImage}>
              ❮
            </button>
            <button style={styles.modalNext} onClick={nextImage}>
              ❯
            </button>
            <img
              src={getFullImageUrl(
                tripData.galleryImages[currentModalImageIndex]?.imageUrl,
              )}
              alt={
                tripData.galleryImages[currentModalImageIndex]?.title ||
                "Gallery image"
              }
              style={styles.modalImage}
            />
            <div style={styles.modalCaption}>
              {tripData.galleryImages[currentModalImageIndex]?.title && (
                <h3 style={styles.modalTitle}>
                  {tripData.galleryImages[currentModalImageIndex].title}
                </h3>
              )}
              {tripData.galleryImages[currentModalImageIndex]?.description && (
                <p style={styles.modalDescription}>
                  {tripData.galleryImages[currentModalImageIndex].description}
                </p>
              )}
              <div style={styles.modalCounter}>
                {currentModalImageIndex + 1} / {tripData.galleryImages.length}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        details > summary {
          cursor: pointer;
          list-style: none;
        }
        
        details > summary::-webkit-details-marker {
          display: none;
        }
        
        details[open] > summary {
          margin-bottom: 15px;
        }
      `}</style>
    </div>
  );
};

// Helper component for Trip Facts
const FactItem = ({ label, value }: { label: string; value: string }) => (
  <div style={styles.factItem}>
    <span style={styles.factLabel}>{label}</span>
    <span style={styles.factValue}>{value}</span>
  </div>
);

// ==================== STYLES ====================
const styles = {
  pageContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    color: "#333",
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
  errorContainer: {
    textAlign: "center" as const,
    padding: "100px 20px",
  },
  homeButton: {
    display: "inline-block",
    backgroundColor: "#e67e22",
    color: "white",
    textDecoration: "none",
    padding: "12px 24px",
    borderRadius: "6px",
    marginTop: "20px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    border: "none",
  },
  heroSection: {
    position: "relative" as const,
    marginBottom: "30px",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  heroImage: {
    width: "100%",
    height: "500px",
    objectFit: "cover" as const,
    display: "block",
  },
  heroImagePlaceholder: {
    width: "100%",
    height: "500px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    fontSize: "64px",
  },
  heroOverlay: {
    position: "absolute" as const,
    bottom: 0,
    left: 0,
    right: 0,
    background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
    color: "white",
    padding: "30px 30px 20px",
  },
  heroContent: {
    maxWidth: "800px",
  },
  heroTitle: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    margin: "0 0 10px 0",
    textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
  },
  heroBadges: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
    flexWrap: "wrap" as const,
  },
  bestsellerBadge: {
    backgroundColor: "#e67e22",
    color: "white",
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  topsellerBadge: {
    backgroundColor: "#27ae60",
    color: "white",
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  guaranteedBadge: {
    backgroundColor: "#3498db",
    color: "white",
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  stickyNav: {
    backgroundColor: "white",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    zIndex: 100,
    transition: "top 0.3s ease",
    borderRadius: "8px",
    marginBottom: "30px",
    width: "100%",
  },
  navContainer: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "5px",
    padding: "12px 16px",
    justifyContent: "center",
    alignItems: "center",
  },
  navButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 12px",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "30px",
    fontSize: "13px",
    fontWeight: "500",
    color: "#666",
    cursor: "pointer",
    transition: "all 0.2s",
    whiteSpace: "nowrap" as const,
    flex: "0 0 auto",
    ":hover": {
      backgroundColor: "#f5f5f5",
      color: "#e67e22",
    },
  },
  navButtonActive: {
    backgroundColor: "#e67e22",
    color: "white",
    ":hover": {
      backgroundColor: "#d35400",
      color: "white",
    },
  },
  navIcon: {
    fontSize: "16px",
  },
  navLabel: {
    fontSize: "14px",
  },
  mainLayout: {
    display: "flex",
    gap: "30px",
    position: "relative" as const,
  },
  mainContent: {
    flex: 1,
    minWidth: 0,
  },
  rightColumn: {
    width: "320px",
    flexShrink: 0,
  },
  factsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "15px",
    backgroundColor: "#f8f9fa",
    padding: "25px",
    borderRadius: "12px",
    marginBottom: "40px",
  },
  factItem: {
    display: "flex",
    flexDirection: "column" as const,
  },
  factLabel: {
    fontSize: "0.8rem",
    color: "#7f8c8d",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
    marginBottom: "5px",
  },
  factValue: {
    fontSize: "1rem",
    fontWeight: "bold",
    color: "#2c3e50",
  },
  pricingCardPlaceholder: {
    height: "auto",
  },
  pricingCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
    padding: "20px",
    marginBottom: "20px",
    transition: "all 0.3s ease",
  },
  pricingCardSticky: {
    position: "sticky" as const,
  },
  priceHeader: {
    marginBottom: "15px",
  },
  priceLabel: {
    fontSize: "14px",
    color: "#7f8c8d",
    display: "block",
    marginBottom: "5px",
  },
  priceContainer: {
    display: "flex",
    alignItems: "baseline",
    gap: "10px",
  },
  originalPrice: {
    fontSize: "18px",
    color: "#95a5a6",
    textDecoration: "line-through",
  },
  discountedPrice: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#e67e22",
  },
  savingsContainer: {
    backgroundColor: "#f0f9f0",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  savingsLabel: {
    fontSize: "14px",
    color: "#27ae60",
    fontWeight: "500",
  },
  savingsAmount: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#27ae60",
  },
  groupDiscountToggle: {
    marginBottom: "20px",
    borderTop: "1px solid #e0e0e0",
    paddingTop: "15px",
  },
  groupDiscountButton: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#f8f9fa",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "bold",
    color: "#2c3e50",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "all 0.2s",
    ":hover": {
      backgroundColor: "#e67e22",
      color: "white",
      borderColor: "#e67e22",
    },
  },
  groupDiscountContent: {
    marginTop: "10px",
    padding: "10px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
  },
  groupDiscountItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px solid #e0e0e0",
    ":last-child": {
      borderBottom: "none",
    },
  },
  groupSizeText: {
    fontSize: "13px",
    color: "#2c3e50",
  },
  groupPriceText: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#e67e22",
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
  },
  bookNowButton: {
    padding: "12px",
    backgroundColor: "#e67e22",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#d35400",
    },
  },
  checkAvailabilityButton: {
    padding: "12px",
    backgroundColor: "white",
    color: "#e67e22",
    border: "1px solid #e67e22",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
    ":hover": {
      backgroundColor: "#e67e22",
      color: "white",
    },
  },
  sendInquiryButton: {
    padding: "12px",
    backgroundColor: "white",
    color: "#2c3e50",
    border: "1px solid #bdc3c7",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
    ":hover": {
      borderColor: "#e67e22",
      color: "#e67e22",
    },
  },
  customizeButton: {
    padding: "12px",
    backgroundColor: "white",
    color: "#2c3e50",
    border: "1px solid #bdc3c7",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
    ":hover": {
      borderColor: "#e67e22",
      color: "#e67e22",
    },
  },
  downloadButton: {
    padding: "12px",
    backgroundColor: "white",
    color: "#2c3e50",
    border: "1px solid #bdc3c7",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
    ":hover": {
      borderColor: "#e67e22",
      color: "#e67e22",
    },
  },
  section: {
    marginBottom: "50px",
    scrollMarginTop: "80px",
  },
  sectionTitle: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "#2c3e50",
    borderBottom: "3px solid #e67e22",
    paddingBottom: "10px",
    marginBottom: "25px",
  },
  subTitle: {
    fontSize: "1.3rem",
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: "20px",
  },
  paragraph: {
    lineHeight: "1.8",
    fontSize: "1rem",
    color: "#444",
  },
  gallerySection: {
    marginBottom: "40px",
  },
  galleryMain: {
    position: "relative" as const,
    marginBottom: "15px",
  },
  galleryMainImage: {
    width: "100%",
    height: "400px",
    objectFit: "cover" as const,
    borderRadius: "8px",
  },
  imageCaption: {
    position: "absolute" as const,
    bottom: "10px",
    left: "10px",
    backgroundColor: "rgba(0,0,0,0.7)",
    color: "white",
    padding: "5px 15px",
    borderRadius: "20px",
    fontSize: "14px",
  },
  galleryThumbs: {
    display: "flex",
    gap: "10px",
    overflowX: "auto" as const,
    padding: "10px 0",
  },
  galleryThumb: {
    width: "80px",
    height: "60px",
    borderRadius: "4px",
    overflow: "hidden",
    cursor: "pointer",
    flexShrink: 0,
  },
  galleryThumbImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
  },
  featuredGallery: {
    marginTop: "30px",
  },
  featuredGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
  },
  featuredItem: {
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  featuredImage: {
    width: "100%",
    height: "200px",
    objectFit: "cover" as const,
  },
  featuredCaption: {
    padding: "10px",
    fontSize: "14px",
    color: "#666",
    textAlign: "center" as const,
  },

  // itineraryContainer: {
  //   display: "flex",
  //   flexDirection: "column" as const,
  //   gap: "15px",
  // },
  // itineraryDay: {
  //   backgroundColor: "#f9f9f9",
  //   borderRadius: "8px",
  //   padding: "15px 20px",
  //   transition: "all 0.3s",
  //   cursor: "pointer",
  // },
  // itineraryDayHeader: {
  //   display: "flex",
  //   alignItems: "center",
  //   gap: "15px",
  //   flexWrap: "wrap" as const,
  // },
  // itineraryDayNumber: {
  //   display: "inline-block",
  //   backgroundColor: "#e67e22",
  //   color: "white",
  //   padding: "4px 12px",
  //   borderRadius: "20px",
  //   fontSize: "14px",
  //   fontWeight: "bold",
  // },
  // itineraryDayTitle: {
  //   fontSize: "1.1rem",
  //   fontWeight: "bold",
  //   color: "#2c3e50",
  //   margin: 0,
  // },
  // itineraryDayDescription: {
  //   lineHeight: "1.6",
  //   color: "#666",
  //   marginTop: "15px",
  //   marginBottom: "15px",
  // },
  // itineraryDetails: {
  //   display: "flex",
  //   flexWrap: "wrap" as const,
  //   gap: "15px",
  //   marginTop: "10px",
  // },
  // itineraryDetail: {
  //   fontSize: "0.85rem",
  //   color: "#888",
  // },

  itineraryContainer: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "15px",
  },
  itineraryDay: {
    backgroundColor: "#f9f9f9",
    borderRadius: "12px",
    padding: "0",
    transition: "all 0.3s",
    cursor: "pointer",
    border: "1px solid #e0e0e0",
    overflow: "hidden",
  },
  itineraryDayHeader: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "18px 20px",
    backgroundColor: "#fff",
    transition: "background-color 0.2s",
    cursor: "pointer",
    position: "relative" as const,
    ":hover": {
      backgroundColor: "#f8f9fa",
    },
  },
  itineraryDayNumber: {
    display: "inline-block",
    backgroundColor: "#e67e22",
    color: "white",
    padding: "5px 14px",
    borderRadius: "25px",
    fontSize: "14px",
    fontWeight: "bold",
    minWidth: "70px",
    textAlign: "center" as const,
  },
  itineraryDayTitle: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    color: "#2c3e50",
    margin: 0,
    flex: 1,
  },
  itineraryToggleIcon: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#e67e22",
    transition: "transform 0.3s ease",
    width: "24px",
    height: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  itineraryToggleIconOpen: {
    transform: "rotate(45deg)",
  },
  itineraryDayContent: {
    padding: "0 20px 20px 20px",
    borderTop: "1px solid #e0e0e0",
    backgroundColor: "#fff",
  },
  itineraryDayDescription: {
    lineHeight: "1.8",
    color: "#666",
    marginBottom: "15px",
    marginTop: "15px",
  },
  itineraryDetails: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "15px",
    marginTop: "10px",
    paddingTop: "10px",
    borderTop: "1px dashed #e0e0e0",
  },
  itineraryDetail: {
    fontSize: "0.85rem",
    color: "#888",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },

  costGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "30px",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  listItem: {
    padding: "10px 0",
    borderBottom: "1px solid #ecf0f1",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap" as const,
  },
  includeIcon: {
    color: "#27ae60",
    fontWeight: "bold",
    fontSize: "16px",
  },
  excludeIcon: {
    color: "#e74c3c",
    fontWeight: "bold",
    fontSize: "16px",
  },
  categoryBadge: {
    backgroundColor: "#ecf0f1",
    color: "#7f8c8d",
    padding: "2px 8px",
    borderRadius: "12px",
    fontSize: "11px",
  },
  mapContainer: {
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  mapImage: {
    width: "100%",
    height: "auto",
    display: "block",
  },
  videoContainer: {
    position: "relative" as const,
    paddingBottom: "56.25%",
    height: 0,
    overflow: "hidden",
    borderRadius: "8px",
  },
  videoIframe: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  faqContainer: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "15px",
  },
  faqItem: {
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    padding: "15px",
    cursor: "pointer",
  },
  faqQuestion: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    color: "#2c3e50",
  },
  faqAnswer: {
    lineHeight: "1.6",
    color: "#666",
    marginTop: "15px",
    paddingTop: "15px",
    borderTop: "1px solid #e0e0e0",
  },
  departuresTable: {
    overflowX: "auto" as const,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
  },
  th: {
    textAlign: "left" as const,
    padding: "12px",
    backgroundColor: "#f8f9fa",
    borderBottom: "2px solid #e0e0e0",
    fontWeight: "bold",
  },
  tr: {
    borderBottom: "1px solid #e0e0e0",
  },
  td: {
    padding: "12px",
  },
  originalPriceTd: {
    textDecoration: "line-through",
    color: "#999",
    marginRight: "5px",
  },
  discountedPriceTd: {
    color: "#e67e22",
    fontWeight: "bold",
  },
  guaranteedBadgeSmall: {
    backgroundColor: "#3498db",
    color: "white",
    padding: "2px 8px",
    borderRadius: "12px",
    fontSize: "11px",
    display: "inline-block",
  },
  bestsellerBadgeSmall: {
    backgroundColor: "#e67e22",
    color: "white",
    padding: "2px 8px",
    borderRadius: "12px",
    fontSize: "11px",
    display: "inline-block",
    marginLeft: "5px",
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
    ":hover": {
      textDecoration: "underline",
    },
  },
  breadcrumbSeparator: {
    margin: "0 8px",
    color: "#999",
  },
  breadcrumbCurrent: {
    color: "#666",
  },

  // Minimized Review Platforms Section
  reviewPlatformsSection: {
    marginBottom: "30px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "12px 20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  },
  platformsGrid: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "24px",
    flexWrap: "wrap" as const,
  },
  platformCard: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    textDecoration: "none",
    color: "#333",
    fontSize: "13px",
    transition: "color 0.2s",
    ":hover": {
      color: "#e67e22",
    },
  },
  platformIcon: {
    fontSize: "14px",
  },
  platformCount: {
    fontWeight: "bold",
    color: "#e67e22",
    fontSize: "14px",
  },
  platformText: {
    color: "#666",
  },

  // Gallery Grid Styles
  galleryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  galleryItem: {
    position: "relative" as const,
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    transition: "transform 0.2s, boxShadow 0.2s",
    backgroundColor: "#fff",
    cursor: "pointer",
    aspectRatio: "4/3",
    ":hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    },
  },
  galleryImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
    display: "block",
    transition: "transform 0.3s",
    ":hover": {
      transform: "scale(1.05)",
    },
  },
  galleryOverlay: {
    position: "absolute" as const,
    bottom: 0,
    left: 0,
    right: 0,
    background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
    padding: "15px",
    opacity: 0,
    transition: "opacity 0.3s",
    ":hover": {
      opacity: 1,
    },
  },
  galleryTitle: {
    margin: 0,
    fontSize: "14px",
    fontWeight: "bold",
    color: "white",
    marginBottom: "5px",
  },
  galleryDescription: {
    margin: 0,
    fontSize: "12px",
    color: "#f0f0f0",
    lineHeight: "1.4",
  },
  galleryFeaturedBadge: {
    position: "absolute" as const,
    top: "12px",
    right: "12px",
    backgroundColor: "#e67e22",
    color: "white",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "bold",
    zIndex: 2,
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
  },
  galleryMoreItem: {
    position: "relative" as const,
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    cursor: "pointer",
    aspectRatio: "4/3",
    transition: "transform 0.2s",
    ":hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    },
  },
  galleryMoreImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
    filter: "brightness(0.7)",
  },
  galleryMoreOverlay: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  galleryMoreText: {
    fontSize: "36px",
    fontWeight: "bold",
    color: "white",
    marginBottom: "8px",
  },
  galleryMoreSubText: {
    fontSize: "14px",
    color: "white",
    opacity: 0.9,
  },
  viewAllButton: {
    marginTop: "20px",
    padding: "10px 24px",
    backgroundColor: "transparent",
    border: "2px solid #e67e22",
    borderRadius: "8px",
    color: "#e67e22",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.2s",
    width: "100%",
    maxWidth: "200px",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    ":hover": {
      backgroundColor: "#e67e22",
      color: "white",
    },
  },

  // Modal Styles
  modalOverlay: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.9)",
    zIndex: 2000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    animation: "fadeIn 0.3s ease",
  },
  modalContent: {
    position: "relative" as const,
    maxWidth: "90vw",
    maxHeight: "90vh",
    backgroundColor: "#000",
    borderRadius: "12px",
    overflow: "hidden",
  },
  modalImage: {
    maxWidth: "100%",
    maxHeight: "80vh",
    objectFit: "contain" as const,
    display: "block",
  },
  modalClose: {
    position: "absolute" as const,
    top: "15px",
    right: "15px",
    backgroundColor: "rgba(0,0,0,0.5)",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    fontSize: "20px",
    cursor: "pointer",
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#e67e22",
    },
  },
  modalPrev: {
    position: "absolute" as const,
    top: "50%",
    left: "20px",
    transform: "translateY(-50%)",
    backgroundColor: "rgba(0,0,0,0.5)",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    fontSize: "20px",
    cursor: "pointer",
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#e67e22",
    },
  },
  modalNext: {
    position: "absolute" as const,
    top: "50%",
    right: "20px",
    transform: "translateY(-50%)",
    backgroundColor: "rgba(0,0,0,0.5)",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    fontSize: "20px",
    cursor: "pointer",
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#e67e22",
    },
  },
  modalCaption: {
    position: "absolute" as const,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    color: "white",
    padding: "15px",
    textAlign: "center" as const,
  },
  modalTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    margin: "0 0 5px 0",
  },
  modalDescription: {
    fontSize: "14px",
    margin: "0 0 5px 0",
    opacity: 0.9,
  },
  modalCounter: {
    fontSize: "12px",
    opacity: 0.7,
    marginTop: "5px",
  },

  // Customer Reviews Section
  reviewsSection: {
    marginBottom: "40px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "30px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  reviewsHeader: {
    marginBottom: "25px",
    borderBottom: "2px solid #f0f0f0",
    paddingBottom: "15px",
  },
  reviewsTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: "10px",
  },
  reviewsSummary: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap" as const,
    marginBottom: "30px",
    padding: "20px",
    backgroundColor: "#f8f9fa",
    borderRadius: "12px",
  },
  ratingSummary: {
    textAlign: "center" as const,
    padding: "0 20px",
  },
  averageRating: {
    fontSize: "48px",
    fontWeight: "bold",
    color: "#e67e22",
    lineHeight: 1,
  },
  totalReviews: {
    fontSize: "14px",
    color: "#7f8c8d",
    marginTop: "5px",
  },
  ratingDistribution: {
    flex: 1,
    minWidth: "200px",
  },
  distributionBar: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "8px",
    cursor: "pointer",
  },
  ratingLabel: {
    width: "30px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#2c3e50",
  },
  barContainer: {
    flex: 1,
    height: "8px",
    backgroundColor: "#e0e0e0",
    borderRadius: "4px",
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    backgroundColor: "#e67e22",
    transition: "width 0.3s ease",
  },
  ratingCount: {
    width: "40px",
    fontSize: "12px",
    color: "#7f8c8d",
  },
  ratingPercentage: {
    width: "40px",
    fontSize: "12px",
    color: "#2c3e50",
    fontWeight: "500",
  },
  filterChips: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap" as const,
    marginBottom: "25px",
  },
  filterChip: {
    padding: "8px 16px",
    backgroundColor: "#f8f9fa",
    border: "1px solid #e0e0e0",
    borderRadius: "20px",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.2s",
    color: "#666",
    ":hover": {
      backgroundColor: "#e67e22",
      color: "white",
      borderColor: "#e67e22",
    },
  },
  filterChipActive: {
    backgroundColor: "#e67e22",
    color: "white",
    borderColor: "#e67e22",
  },
  reviewsList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "20px",
  },
  reviewCard: {
    backgroundColor: "#fff",
    border: "1px solid #f0f0f0",
    borderRadius: "12px",
    padding: "20px",
    transition: "box-shadow 0.2s",
    ":hover": {
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    },
  },
  reviewHeader: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "15px",
  },
  userAvatar: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    objectFit: "cover" as const,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: "4px",
  },
  reviewDate: {
    fontSize: "12px",
    color: "#7f8c8d",
  },
  verifiedBadge: {
    display: "inline-block",
    backgroundColor: "#27ae60",
    color: "white",
    fontSize: "10px",
    padding: "2px 6px",
    borderRadius: "12px",
    marginLeft: "8px",
  },
  reviewStars: {
    color: "#f39c12",
    fontSize: "14px",
    marginBottom: "10px",
  },
  reviewTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: "10px",
  },
  reviewComment: {
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#666",
    marginBottom: "15px",
  },
  reviewHelpful: {
    fontSize: "12px",
    color: "#7f8c8d",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  helpfulButton: {
    backgroundColor: "transparent",
    border: "none",
    color: "#e67e22",
    cursor: "pointer",
    fontSize: "12px",
    padding: "0",
    marginLeft: "10px",
    ":hover": {
      textDecoration: "underline",
    },
  },
  showMoreButton: {
    marginTop: "20px",
    padding: "12px 24px",
    backgroundColor: "transparent",
    border: "2px solid #e67e22",
    borderRadius: "8px",
    color: "#e67e22",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.2s",
    width: "100%",
    ":hover": {
      backgroundColor: "#e67e22",
      color: "white",
    },
  },
  noReviews: {
    textAlign: "center" as const,
    padding: "40px",
    color: "#7f8c8d",
  },
};

// Add keyframe animation for modal
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;
document.head.appendChild(styleSheet);

export default TripDetailsPage;
