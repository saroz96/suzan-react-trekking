// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import { useParams, useRouter } from "next/navigation";
// import Link from "next/link";
// import Image from "next/image";
// import Footer from "@/pages/Footer";

// // Types remain the same...
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
//   const params = useParams();
//   const router = useRouter();
//   const slug = params.slug as string;

//   const [loading, setLoading] = useState(true);
//   const [tripData, setTripData] = useState<TrekPackage | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [activeNav, setActiveNav] = useState("overview");
//   const [isNavSticky, setIsNavSticky] = useState(false);
//   const [showGroupDiscount, setShowGroupDiscount] = useState(false);
//   const [isPricingCardSticky, setIsPricingCardSticky] = useState(false);
//   const [navHeight, setNavHeight] = useState(0);
//   const [openItineraryDays, setOpenItineraryDays] = useState<number[]>([]);
//   const [showGalleryModal, setShowGalleryModal] = useState(false);
//   const [currentModalImageIndex, setCurrentModalImageIndex] = useState(0);
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
//   const [windowWidth, setWindowWidth] = useState(0);

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
//     process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5232";

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

//   // Handle window resize
//   useEffect(() => {
//     const handleResize = () => setWindowWidth(window.innerWidth);
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const openGalleryModal = (index: number) => {
//     setCurrentModalImageIndex(index);
//     setShowGalleryModal(true);
//     document.body.style.overflow = "hidden";
//   };

//   const closeGalleryModal = () => {
//     setShowGalleryModal(false);
//     document.body.style.overflow = "auto";
//   };

//   const nextImage = () => {
//     if (tripData?.galleryImages) {
//       setCurrentModalImageIndex((prev) =>
//         prev === tripData.galleryImages.length - 1 ? 0 : prev + 1,
//       );
//     }
//   };

//   const prevImage = () => {
//     if (tripData?.galleryImages) {
//       setCurrentModalImageIndex((prev) =>
//         prev === 0 ? tripData.galleryImages.length - 1 : prev - 1,
//       );
//     }
//   };

//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (showGalleryModal) {
//         if (e.key === "ArrowLeft") prevImage();
//         else if (e.key === "ArrowRight") nextImage();
//         else if (e.key === "Escape") closeGalleryModal();
//       }
//     };
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [showGalleryModal, tripData?.galleryImages]);

//   const generateMockReviews = (packageId: number): Review[] => {
//     return [
//       {
//         id: 1,
//         userName: "Sarah Johnson",
//         userAvatar: "https://randomuser.me/api/portraits/women/1.jpg",
//         rating: 5,
//         title: "Absolutely incredible experience!",
//         comment:
//           "This trek exceeded all expectations. The views were breathtaking, the guides were knowledgeable and caring, and the overall organization was flawless. Highly recommend!",
//         date: "2024-02-15",
//         verified: true,
//         helpful: 24,
//       },
//       {
//         id: 2,
//         userName: "Michael Chen",
//         userAvatar: "https://randomuser.me/api/portraits/men/2.jpg",
//         rating: 5,
//         title: "Life-changing adventure",
//         comment:
//           "The Everest Base Camp trek was challenging but rewarding. Our guide was fantastic, ensuring we were safe and acclimatized properly. The tea houses were cozy and the food was great.",
//         date: "2024-01-20",
//         verified: true,
//         helpful: 18,
//       },
//       {
//         id: 3,
//         userName: "Emma Wilson",
//         userAvatar: "https://randomuser.me/api/portraits/women/3.jpg",
//         rating: 4,
//         title: "Amazing scenery, great organization",
//         comment:
//           "Everything was well organized from pickup to dropoff. The only reason for 4 stars is that the weather was cloudy on the main day, but that's not the company's fault!",
//         date: "2023-12-10",
//         verified: true,
//         helpful: 12,
//       },
//       {
//         id: 4,
//         userName: "David Thompson",
//         userAvatar: "https://randomuser.me/api/portraits/men/4.jpg",
//         rating: 5,
//         title: "Best decision ever",
//         comment:
//           "I was nervous about doing this trek, but the team made me feel completely at ease. The pre-trip information was thorough, and the support throughout was excellent.",
//         date: "2023-11-05",
//         verified: true,
//         helpful: 9,
//       },
//       {
//         id: 5,
//         userName: "Lisa Anderson",
//         userAvatar: "https://randomuser.me/api/portraits/women/5.jpg",
//         rating: 4,
//         title: "Wonderful experience",
//         comment:
//           "Great trek with beautiful views. The guide was very knowledgeable about the local culture and history. Would definitely book with them again.",
//         date: "2023-10-18",
//         verified: false,
//         helpful: 5,
//       },
//     ];
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
//     const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
//     reviewsList.forEach((rev) => {
//       distribution[rev.rating as keyof typeof distribution]++;
//     });
//     return {
//       averageRating: sum / total,
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

//   const filteredReviews = selectedRating
//     ? reviews.filter((review) => review.rating === selectedRating)
//     : reviews;
//   const displayedReviews = showAllReviews
//     ? filteredReviews
//     : filteredReviews.slice(0, 3);

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
//       window.scrollTo({ top: offsetPosition, behavior: "smooth" });
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
//         setIsPricingCardSticky(window.scrollY > placeholderTop + 100);
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

//       for (const section of sections) {
//         if (section.ref.current) {
//           const rect = section.ref.current.getBoundingClientRect();
//           const offsetTop = rect.top + window.scrollY;
//           if (
//             scrollPosition >= offsetTop - 10 &&
//             scrollPosition < offsetTop + rect.height - 10
//           ) {
//             setActiveNav(section.id);
//             break;
//           }
//         }
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     handleScroll();
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [tripData, isNavSticky]);

//   useEffect(() => {
//     if (slug) fetchTripDetails();
//   }, [slug]);

//   const fetchTripDetails = async () => {
//     try {
//       setLoading(true);
//       const idMatch = slug?.match(/-(\d+)$/);
//       const packageId = idMatch ? parseInt(idMatch[1]) : null;
//       if (!packageId) throw new Error("Invalid package ID");

//       const response = await fetch(
//         `${API_BASE_URL}/api/TrekPackage/${packageId}`,
//       );
//       if (!response.ok) throw new Error("Failed to fetch trip details");
//       const data = await response.json();
//       setTripData(data);
//     } catch (error: any) {
//       console.error("Error fetching trip details:", error);
//       setError(error.message || "Error loading trip details");
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
//   const toggleItineraryDay = (dayId: number) => {
//     setOpenItineraryDays((prev) =>
//       prev.includes(dayId)
//         ? prev.filter((id) => id !== dayId)
//         : [...prev, dayId],
//     );
//   };

//   if (loading) {
//     return (
//       <div className="trip-details-container">
//         <div className="loading-container">
//           <div className="spinner"></div>
//           <p>Loading trip details...</p>
//         </div>
//         <style jsx>{styles}</style>
//       </div>
//     );
//   }

//   if (error || !tripData) {
//     return (
//       <div className="trip-details-container">
//         <div className="error-container">
//           <h2>Error Loading Trip</h2>
//           <p>{error || "Trip not found"}</p>
//           <button onClick={() => router.push("/")} className="home-button">
//             Go Home
//           </button>
//         </div>
//         <style jsx>{styles}</style>
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

//   const displayGalleryImages = tripData.galleryImages?.slice(0, 4) || [];
//   const remainingCount = (tripData.galleryImages?.length || 0) - 4;

//   return (
//     <>
//       <style jsx>{styles}</style>
//       <style jsx global>{`
//         @keyframes spin {
//           0% {
//             transform: rotate(0deg);
//           }
//           100% {
//             transform: rotate(360deg);
//           }
//         }
//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//           }
//           to {
//             opacity: 1;
//           }
//         }
//       `}</style>

//       <div className="trip-details-container">
//         {/* Hero Section */}
//         <div className="hero-section">
//           {heroImage ? (
//             <div className="hero-image-wrapper">
//               <Image
//                 src={heroImage}
//                 alt={tripData.name}
//                 fill
//                 className="hero-image"
//                 priority
//                 unoptimized
//               />
//             </div>
//           ) : (
//             <div className="hero-image-placeholder">🏔️</div>
//           )}
//           <div className="hero-overlay">
//             <div className="hero-content">
//               <h1 className="hero-title">{tripData.name}</h1>
//               <div className="hero-badges">
//                 {tripData.isBestSeller && (
//                   <span className="bestseller-badge">Best Seller</span>
//                 )}
//                 {tripData.isTopSeller && (
//                   <span className="topseller-badge">TOPSELLER</span>
//                 )}
//                 {tripData.hasGuaranteedDeparture && (
//                   <span className="guaranteed-badge">
//                     Guaranteed Departures
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Breadcrumb */}
//         <div className="breadcrumb">
//           <Link href="/" className="breadcrumb-link">
//             Home
//           </Link>
//           <span className="breadcrumb-separator">/</span>
//           <Link
//             href={`/${createSlug(tripData.mainHeadingName)}`}
//             className="breadcrumb-link"
//           >
//             {tripData.mainHeadingName}
//           </Link>
//           <span className="breadcrumb-separator">/</span>
//           <Link
//             href={`/${createSlug(tripData.mainHeadingName)}/${createSlug(tripData.headingName)}`}
//             className="breadcrumb-link"
//           >
//             {tripData.headingName}
//           </Link>
//           {tripData.subHeadingName && (
//             <>
//               <span className="breadcrumb-separator">/</span>
//               <Link
//                 href={`/${createSlug(tripData.mainHeadingName)}/${createSlug(tripData.headingName)}/${createSlug(tripData.subHeadingName)}`}
//                 className="breadcrumb-link"
//               >
//                 {tripData.subHeadingName}
//               </Link>
//             </>
//           )}
//           <span className="breadcrumb-separator">/</span>
//           <span className="breadcrumb-current">{tripData.name}</span>
//         </div>

//         {/* Review Platforms Section */}
//         <div className="review-platforms-section">
//           <div className="platforms-grid">
//             {reviewPlatforms.map((platform) => (
//               <a
//                 key={platform.id}
//                 href={platform.url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="platform-card"
//               >
//                 <span className="platform-icon">{platform.icon}</span>
//                 <span className="platform-count">
//                   {platform.count.toLocaleString()}+
//                 </span>
//                 <span className="platform-text">
//                   reviews in {platform.name}
//                 </span>
//               </a>
//             ))}
//           </div>
//         </div>

//         {/* Sticky Navigation Bar */}
//         <div
//           ref={stickyNavRef}
//           className={`sticky-nav ${isNavSticky ? "sticky" : ""}`}
//         >
//           <div className="nav-container">
//             {navItems.map((item) => (
//               <button
//                 key={item.id}
//                 onClick={() => scrollToSection(item.id)}
//                 className={`nav-button ${activeNav === item.id ? "active" : ""}`}
//               >
//                 <span className="nav-icon">{item.icon}</span>
//                 <span className="nav-label">{item.label}</span>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="main-layout">
//           <div className="main-content">
//             {/* Trip Facts Grid */}
//             <div ref={factsGridRef} className="facts-grid">
//               <div className="fact-item">
//                 <span className="fact-label">Duration</span>
//                 <span className="fact-value">{`${tripData.durationDays} Days${tripData.durationNights ? ` / ${tripData.durationNights} Nights` : ""}`}</span>
//               </div>
//               <div className="fact-item">
//                 <span className="fact-label">Trip Grade</span>
//                 <span className="fact-value">
//                   {tripData.tripGrade || "Moderate"}
//                 </span>
//               </div>
//               <div className="fact-item">
//                 <span className="fact-label">Country</span>
//                 <span className="fact-value">{tripData.countryName}</span>
//               </div>
//               <div className="fact-item">
//                 <span className="fact-label">Maximum Altitude</span>
//                 <span className="fact-value">
//                   {tripData.maximumAltitude || "N/A"}
//                 </span>
//               </div>
//               <div className="fact-item">
//                 <span className="fact-label">Group Size</span>
//                 <span className="fact-value">
//                   {tripData.groupSize || "1-20"}
//                 </span>
//               </div>
//               <div className="fact-item">
//                 <span className="fact-label">Starts</span>
//                 <span className="fact-value">
//                   {tripData.startsAt || "Kathmandu"}
//                 </span>
//               </div>
//               <div className="fact-item">
//                 <span className="fact-label">Ends</span>
//                 <span className="fact-value">
//                   {tripData.endsAt || "Kathmandu"}
//                 </span>
//               </div>
//               <div className="fact-item">
//                 <span className="fact-label">Activities</span>
//                 <span className="fact-value">
//                   {tripData.activities || "Trekking"}
//                 </span>
//               </div>
//               <div className="fact-item">
//                 <span className="fact-label">Best Time</span>
//                 <span className="fact-value">
//                   {tripData.bestTime || "Mar-May, Sep-Nov"}
//                 </span>
//               </div>
//             </div>

//             <div
//               ref={pricingCardPlaceholderRef}
//               className="pricing-card-placeholder"
//             />

//             {/* Overview Section */}
//             <div ref={overviewRef}>
//               <section className="section">
//                 <h2 className="section-title">Overview</h2>
//                 <div
//                   dangerouslySetInnerHTML={{ __html: tripData.overview || "" }}
//                   className="paragraph"
//                 />
//               </section>
//             </div>

//             {/* Gallery Section */}
//             {tripData.galleryImages && tripData.galleryImages.length > 0 && (
//               <div ref={galleryRef}>
//                 <section className="section">
//                   <h2 className="section-title">Gallery</h2>
//                   <div className="gallery-grid">
//                     {displayGalleryImages.map((img, idx) => (
//                       <div
//                         key={img.id}
//                         className="gallery-item"
//                         onClick={() => openGalleryModal(idx)}
//                       >
//                         <div className="gallery-image-wrapper">
//                           <Image
//                             src={getFullImageUrl(img.imageUrl)}
//                             alt={img.title || "Gallery image"}
//                             fill
//                             className="gallery-image"
//                             unoptimized
//                           />
//                         </div>
//                         {img.isFeatured && (
//                           <span className="gallery-featured-badge">
//                             Featured
//                           </span>
//                         )}
//                         {img.title && (
//                           <div className="gallery-overlay">
//                             <p className="gallery-title">{img.title}</p>
//                             {img.description && (
//                               <p className="gallery-description">
//                                 {img.description}
//                               </p>
//                             )}
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                     {remainingCount > 0 && (
//                       <div
//                         className="gallery-more-item"
//                         onClick={() => openGalleryModal(4)}
//                       >
//                         <div className="gallery-more-overlay">
//                           <span className="gallery-more-text">
//                             +{remainingCount}
//                           </span>
//                           <span className="gallery-more-sub-text">
//                             More Photos
//                           </span>
//                         </div>
//                         <div className="gallery-image-wrapper">
//                           <Image
//                             src={getFullImageUrl(
//                               displayGalleryImages[3]?.imageUrl,
//                             )}
//                             alt="More images"
//                             fill
//                             className="gallery-more-image"
//                             unoptimized
//                           />
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                   {tripData.galleryImages.length > 4 && (
//                     <button
//                       className="view-all-button"
//                       onClick={() => openGalleryModal(0)}
//                     >
//                       View All {tripData.galleryImages.length} Photos
//                     </button>
//                   )}
//                 </section>
//               </div>
//             )}

//             {/* Itinerary Section */}
//             {tripData.itinerary && tripData.itinerary.length > 0 && (
//               <div ref={itineraryRef}>
//                 <section className="section">
//                   <h2 className="section-title">Itinerary</h2>
//                   <div className="itinerary-container">
//                     {tripData.itinerary.map((day) => {
//                       const isOpen = openItineraryDays.includes(day.id);
//                       return (
//                         <div key={day.id} className="itinerary-day">
//                           <div
//                             className="itinerary-day-header"
//                             onClick={() => toggleItineraryDay(day.id)}
//                           >
//                             <span className="itinerary-day-number">
//                               Day {day.dayNumber}
//                             </span>
//                             {day.title && (
//                               <h3 className="itinerary-day-title">
//                                 {day.title}
//                               </h3>
//                             )}
//                             <span
//                               className={`itinerary-toggle-icon ${isOpen ? "open" : ""}`}
//                             >
//                               {isOpen ? "−" : "+"}
//                             </span>
//                           </div>
//                           {isOpen && (
//                             <div className="itinerary-day-content">
//                               {day.description && (
//                                 <div
//                                   dangerouslySetInnerHTML={{
//                                     __html: day.description,
//                                   }}
//                                   className="itinerary-day-description"
//                                 />
//                               )}
//                               <div className="itinerary-details">
//                                 {day.maxAltitude && (
//                                   <span className="itinerary-detail">
//                                     🏔️ {day.maxAltitude}
//                                   </span>
//                                 )}
//                                 {day.accommodation && (
//                                   <span className="itinerary-detail">
//                                     🏨 {day.accommodation}
//                                   </span>
//                                 )}
//                                 {day.meals && (
//                                   <span className="itinerary-detail">
//                                     🍽️ {day.meals}
//                                   </span>
//                                 )}
//                                 {day.duration && (
//                                   <span className="itinerary-detail">
//                                     ⏱️ {day.duration}
//                                   </span>
//                                 )}
//                                 {day.distance && (
//                                   <span className="itinerary-detail">
//                                     📏 {day.distance}
//                                   </span>
//                                 )}
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </section>
//               </div>
//             )}

//             {/* Route Map Section - Fixed Layout */}
//             {tripData.routeMapImageUrl && (
//               <div ref={routeMapRef}>
//                 <section className="section">
//                   <h2 className="section-title">Route Map</h2>
//                   <div className="map-container">
//                     <Image
//                       src={getFullImageUrl(tripData.routeMapImageUrl)}
//                       alt={`Route map for ${tripData.name}`}
//                       width={1200}
//                       height={600}
//                       className="map-image"
//                       unoptimized
//                     />
//                   </div>
//                 </section>
//               </div>
//             )}

//             {/* Cost Details Section */}
//             {(tripData.costIncludes?.length > 0 ||
//               tripData.costExcludes?.length > 0) && (
//               <div ref={costDetailsRef}>
//                 <section className="section">
//                   <h2 className="section-title">Cost Details</h2>
//                   <div className="cost-grid">
//                     {tripData.costIncludes?.length > 0 && (
//                       <div>
//                         <h3 className="sub-title">✓ What's Included</h3>
//                         <ul className="list">
//                           {tripData.costIncludes.map((item) => (
//                             <li key={item.id} className="list-item">
//                               <span className="include-icon">✓</span>{" "}
//                               {item.description}
//                               {item.category && (
//                                 <span className="category-badge">
//                                   {item.category}
//                                 </span>
//                               )}
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     )}
//                     {tripData.costExcludes?.length > 0 && (
//                       <div>
//                         <h3 className="sub-title">✗ What's Not Included</h3>
//                         <ul className="list">
//                           {tripData.costExcludes.map((item) => (
//                             <li key={item.id} className="list-item">
//                               <span className="exclude-icon">✗</span>{" "}
//                               {item.description}
//                               {item.category && (
//                                 <span className="category-badge">
//                                   {item.category}
//                                 </span>
//                               )}
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     )}
//                   </div>
//                 </section>
//               </div>
//             )}

//             {/* Dates & Price Section - Alternative Card Design */}
//             {tripData.departureDates && tripData.departureDates.length > 0 && (
//               <div ref={datesRef}>
//                 <section className="section">
//                   <h2 className="section-title">Dates & Price</h2>
//                   <div className="dates-cards-grid">
//                     {tripData.departureDates
//                       .filter((d) => new Date(d.startDate) > new Date())
//                       .slice(0, 6)
//                       .map((date) => (
//                         <div key={date.id} className="date-card">
//                           <div className="date-card-header">
//                             <div className="date-month">
//                               {new Date(date.startDate).toLocaleDateString(
//                                 "en-US",
//                                 { month: "short" },
//                               )}
//                             </div>
//                             <div className="date-day">
//                               {new Date(date.startDate).getDate()}
//                             </div>
//                             <div className="date-year">
//                               {new Date(date.startDate).getFullYear()}
//                             </div>
//                             <div className="date-badges">
//                               {date.isGuaranteed && (
//                                 <span className="guaranteed-badge-card">
//                                   ✓ Guaranteed
//                                 </span>
//                               )}
//                               {date.isBestSeller && (
//                                 <span className="bestseller-badge-card">
//                                   ⭐ Best Seller
//                                 </span>
//                               )}
//                             </div>
//                           </div>
//                           <div className="date-card-body">
//                             <div className="date-range">
//                               <span>📅</span>
//                               {new Date(date.startDate).toLocaleDateString(
//                                 "en-US",
//                                 { month: "short", day: "numeric" },
//                               )}{" "}
//                               -
//                               {new Date(date.endDate).toLocaleDateString(
//                                 "en-US",
//                                 { month: "short", day: "numeric" },
//                               )}
//                             </div>
//                             <div className="date-price">
//                               {date.discountedPrice ? (
//                                 <>
//                                   <span className="original-price-small">
//                                     US${date.price.toLocaleString()}
//                                   </span>
//                                   <span className="discounted-price-large">
//                                     US${date.discountedPrice.toLocaleString()}
//                                   </span>
//                                 </>
//                               ) : (
//                                 <span className="discounted-price-large">
//                                   US${date.price.toLocaleString()}
//                                 </span>
//                               )}
//                             </div>
//                             <button className="book-now-btn-small">
//                               Book Now
//                             </button>
//                           </div>
//                         </div>
//                       ))}
//                   </div>
//                   {tripData.departureDates.filter(
//                     (d) => new Date(d.startDate) > new Date(),
//                   ).length > 6 && (
//                     <button className="view-all-dates-btn">
//                       View All Dates →
//                     </button>
//                   )}
//                 </section>
//               </div>
//             )}

//             {/* Essential Information Section */}
//             {tripData.essentialInformation && (
//               <div ref={essentialInfoRef}>
//                 <section className="section">
//                   <h2 className="section-title">Essential Information</h2>
//                   <div
//                     dangerouslySetInnerHTML={{
//                       __html: tripData.essentialInformation,
//                     }}
//                     className="paragraph"
//                   />
//                 </section>
//               </div>
//             )}

//             {/* FAQs Section */}
//             {tripData.faqs?.length > 0 && (
//               <div ref={faqsRef}>
//                 <section className="section">
//                   <h2 className="section-title">FAQs</h2>
//                   <div className="faq-container">
//                     {tripData.faqs.map((faq) => (
//                       <details key={faq.id} className="faq-item">
//                         <summary className="faq-question">
//                           ❓ {faq.question}
//                         </summary>
//                         <div
//                           dangerouslySetInnerHTML={{ __html: faq.answer }}
//                           className="faq-answer"
//                         />
//                       </details>
//                     ))}
//                   </div>
//                 </section>
//               </div>
//             )}

//             {/* Video Reviews Section */}
//             {tripData.videoReviewUrl && (
//               <div ref={videoRef}>
//                 <section className="section">
//                   <h2 className="section-title">Video Reviews</h2>
//                   <div className="video-container">
//                     <iframe
//                       width="100%"
//                       height="500"
//                       src={tripData.videoReviewUrl.replace(
//                         "watch?v=",
//                         "embed/",
//                       )}
//                       title={`${tripData.name} Video`}
//                       frameBorder="0"
//                       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                       allowFullScreen
//                       className="video-iframe"
//                     ></iframe>
//                   </div>
//                 </section>
//               </div>
//             )}

//             {/* Customer Reviews Section - Improved Styling */}
//             <div className="reviews-section">
//               <div className="reviews-header">
//                 <h2 className="reviews-title">Customer Reviews</h2>
//                 <p className="reviews-subtitle">
//                   What our travelers say about their experience
//                 </p>
//               </div>
//               <div className="reviews-summary">
//                 <div className="rating-summary">
//                   <div className="average-rating">
//                     {reviewStats.averageRating.toFixed(1)}
//                   </div>
//                   <div className="review-stars">
//                     {"★".repeat(Math.floor(reviewStats.averageRating))}
//                     {reviewStats.averageRating % 1 !== 0 && "½"}
//                     {"☆".repeat(5 - Math.ceil(reviewStats.averageRating))}
//                   </div>
//                   <div className="total-reviews">
//                     Based on {reviewStats.totalReviews} verified reviews
//                   </div>
//                 </div>
//                 <div className="rating-distribution">
//                   {[5, 4, 3, 2, 1].map((rating) => {
//                     const count =
//                       reviewStats.ratingDistribution[
//                         rating as keyof typeof reviewStats.ratingDistribution
//                       ];
//                     const percentage =
//                       reviewStats.totalReviews > 0
//                         ? (count / reviewStats.totalReviews) * 100
//                         : 0;
//                     return (
//                       <div
//                         key={rating}
//                         className="distribution-bar"
//                         onClick={() =>
//                           setSelectedRating(
//                             selectedRating === rating ? null : rating,
//                           )
//                         }
//                       >
//                         <span className="rating-label">{rating} ★</span>
//                         <div className="bar-container">
//                           <div
//                             className="bar-fill"
//                             style={{ width: `${percentage}%` }}
//                           />
//                         </div>
//                         <span className="rating-count">{count}</span>
//                         <span className="rating-percentage">
//                           {percentage.toFixed(0)}%
//                         </span>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//               <div className="filter-chips">
//                 <button
//                   onClick={() => setSelectedRating(null)}
//                   className={`filter-chip ${!selectedRating ? "active" : ""}`}
//                 >
//                   All Reviews
//                 </button>
//                 {[5, 4, 3, 2, 1].map((rating) => (
//                   <button
//                     key={rating}
//                     onClick={() =>
//                       setSelectedRating(
//                         selectedRating === rating ? null : rating,
//                       )
//                     }
//                     className={`filter-chip ${selectedRating === rating ? "active" : ""}`}
//                   >
//                     {rating} ★ (
//                     {
//                       reviewStats.ratingDistribution[
//                         rating as keyof typeof reviewStats.ratingDistribution
//                       ]
//                     }
//                     )
//                   </button>
//                 ))}
//               </div>
//               {displayedReviews.length > 0 ? (
//                 <>
//                   <div className="reviews-list">
//                     {displayedReviews.map((review) => (
//                       <div key={review.id} className="review-card">
//                         <div className="review-header">
//                           <div className="reviewer-avatar">
//                             {review.userAvatar ? (
//                               <img
//                                 src={review.userAvatar}
//                                 alt={review.userName}
//                                 className="user-avatar-img"
//                               />
//                             ) : (
//                               <div className="user-avatar-placeholder">
//                                 {review.userName.charAt(0)}
//                               </div>
//                             )}
//                           </div>
//                           <div className="reviewer-info">
//                             <div className="reviewer-name">
//                               {review.userName}
//                               {review.verified && (
//                                 <span className="verified-badge">
//                                   ✓ Verified Traveler
//                                 </span>
//                               )}
//                             </div>
//                             <div className="review-date">
//                               {new Date(review.date).toLocaleDateString(
//                                 "en-US",
//                                 {
//                                   year: "numeric",
//                                   month: "long",
//                                   day: "numeric",
//                                 },
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                         <div className="review-rating">
//                           {[1, 2, 3, 4, 5].map((star) => (
//                             <span
//                               key={star}
//                               className={`star ${star <= review.rating ? "filled" : "empty"}`}
//                             >
//                               ★
//                             </span>
//                           ))}
//                         </div>
//                         <h3 className="review-title">{review.title}</h3>
//                         <p className="review-comment">{review.comment}</p>
//                         <div className="review-footer">
//                           <button
//                             className="helpful-button"
//                             onClick={() =>
//                               alert("Thank you for your feedback!")
//                             }
//                           >
//                             👍 Helpful ({review.helpful || 0})
//                           </button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                   {filteredReviews.length > 3 && (
//                     <button
//                       onClick={() => setShowAllReviews(!showAllReviews)}
//                       className="show-more-button"
//                     >
//                       {showAllReviews
//                         ? "Show Less Reviews"
//                         : `Show All ${filteredReviews.length} Reviews`}
//                     </button>
//                   )}
//                 </>
//               ) : (
//                 <div className="no-reviews">
//                   <p>No reviews available for this rating.</p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Right Column - Sticky Pricing Card */}
//           <div className="right-column">
//             <div
//               ref={pricingCardRef}
//               className={`pricing-card ${isPricingCardSticky ? "sticky" : ""}`}
//               style={{
//                 top:
//                   isPricingCardSticky && isNavSticky
//                     ? `${navHeight + 20}px`
//                     : "20px",
//               }}
//             >
//               <div className="price-header">
//                 <span className="price-label">Price From</span>
//                 <div className="price-container">
//                   {tripData.discountedPrice ? (
//                     <>
//                       <span className="original-price">
//                         {formatPrice(tripData.price)}
//                       </span>
//                       <span className="discounted-price">
//                         {formatPrice(tripData.discountedPrice)}
//                       </span>
//                     </>
//                   ) : (
//                     <span className="discounted-price">
//                       {formatPrice(tripData.price)}
//                     </span>
//                   )}
//                 </div>
//               </div>
//               {savings && savings > 0 && (
//                 <div className="savings-container">
//                   <span className="savings-label">You Save</span>
//                   <span className="savings-amount">{formatPrice(savings)}</span>
//                 </div>
//               )}
//               {tripData.groupDiscounts &&
//                 tripData.groupDiscounts.length > 0 && (
//                   <div className="group-discount-toggle">
//                     <button
//                       onClick={() => setShowGroupDiscount(!showGroupDiscount)}
//                       className="group-discount-button"
//                     >
//                       GROUP DISCOUNT PRICE {showGroupDiscount ? "−" : "+"}
//                     </button>
//                     {showGroupDiscount && (
//                       <div className="group-discount-content">
//                         {tripData.groupDiscounts
//                           .sort((a, b) => a.minTravelers - b.minTravelers)
//                           .map((discount) => (
//                             <div
//                               key={discount.id}
//                               className="group-discount-item"
//                             >
//                               <span className="group-size-text">
//                                 {discount.minTravelers}-{discount.maxTravelers}{" "}
//                                 pax
//                               </span>
//                               <span className="group-price-text">
//                                 {formatPrice(discount.pricePerPerson)}/pax
//                               </span>
//                             </div>
//                           ))}
//                       </div>
//                     )}
//                   </div>
//                 )}
//               <div className="button-group">
//                 <button className="book-now-button">Book This Trip</button>
//                 <button
//                   className="check-availability-button"
//                   onClick={() => scrollToSection("dates")}
//                 >
//                   Check Availability
//                 </button>
//                 <button className="send-inquiry-button">Send Inquiry</button>
//                 <button className="customize-button">Customize a Trip</button>
//                 <button className="download-button">Download a Brochure</button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Gallery Modal - Fixed for better display */}
//         {showGalleryModal && tripData.galleryImages && (
//           <div className="modal-overlay" onClick={closeGalleryModal}>
//             <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//               <button className="modal-close" onClick={closeGalleryModal}>
//                 ✕
//               </button>
//               <button className="modal-prev" onClick={prevImage}>
//                 ❮
//               </button>
//               <button className="modal-next" onClick={nextImage}>
//                 ❯
//               </button>
//               <div className="modal-image-wrapper">
//                 {tripData.galleryImages[currentModalImageIndex] && (
//                   <Image
//                     src={getFullImageUrl(
//                       tripData.galleryImages[currentModalImageIndex].imageUrl,
//                     )}
//                     alt={
//                       tripData.galleryImages[currentModalImageIndex]?.title ||
//                       "Gallery image"
//                     }
//                     fill
//                     className="modal-image"
//                     unoptimized
//                   />
//                 )}
//               </div>
//               <div className="modal-caption">
//                 {tripData.galleryImages[currentModalImageIndex]?.title && (
//                   <h3 className="modal-title">
//                     {tripData.galleryImages[currentModalImageIndex].title}
//                   </h3>
//                 )}
//                 {tripData.galleryImages[currentModalImageIndex]
//                   ?.description && (
//                   <p className="modal-description">
//                     {tripData.galleryImages[currentModalImageIndex].description}
//                   </p>
//                 )}
//                 <div className="modal-counter">
//                   {currentModalImageIndex + 1} / {tripData.galleryImages.length}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         <Footer />
//       </div>
//     </>
//   );
// };

// const styles = `
//   .trip-details-container {
//     width: 100%;
//     margin: 0 auto;
//     padding: 20px;
//     font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
//     color: #333;
//   }

//   /* Loading and Error States */
//   .loading-container {
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     justify-content: center;
//     height: 400px;
//     gap: 20px;
//   }

//   .spinner {
//     width: 40px;
//     height: 40px;
//     border: 3px solid #f3f3f3;
//     border-top: 3px solid #e67e22;
//     border-radius: 50%;
//     animation: spin 1s linear infinite;
//   }

//   .error-container {
//     text-align: center;
//     padding: 100px 20px;
//   }

//   .home-button {
//     display: inline-block;
//     background-color: #e67e22;
//     color: white;
//     text-decoration: none;
//     padding: 12px 24px;
//     border-radius: 6px;
//     margin-top: 20px;
//     font-size: 16px;
//     font-weight: bold;
//     cursor: pointer;
//     border: none;
//   }

//   /* Hero Section */
//   .hero-section {
//     position: relative;
//     margin-bottom: 30px;
//     border-radius: 12px;
//     overflow: hidden;
//     box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
//     height: 500px;
//   }

//   .hero-image-wrapper {
//     position: relative;
//     width: 100%;
//     height: 100%;
//   }

//   .hero-image {
//     object-fit: cover;
//   }

//   .hero-image-placeholder {
//     width: 100%;
//     height: 500px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     background-color: #f0f0f0;
//     font-size: 64px;
//   }

//   .hero-overlay {
//     position: absolute;
//     bottom: 0;
//     left: 0;
//     right: 0;
//     background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
//     color: white;
//     padding: 30px 30px 20px;
//   }

//   .hero-content {
//     max-width: 800px;
//   }

//   .hero-title {
//     font-size: 2.5rem;
//     font-weight: bold;
//     margin: 0 0 10px 0;
//     text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
//   }

//   .hero-badges {
//     display: flex;
//     gap: 10px;
//     margin-bottom: 15px;
//     flex-wrap: wrap;
//   }

//   .bestseller-badge {
//     background-color: #e67e22;
//     color: white;
//     padding: 5px 12px;
//     border-radius: 20px;
//     font-size: 12px;
//     font-weight: bold;
//   }

//   .topseller-badge {
//     background-color: #27ae60;
//     color: white;
//     padding: 5px 12px;
//     border-radius: 20px;
//     font-size: 12px;
//     font-weight: bold;
//   }

//   .guaranteed-badge {
//     background-color: #3498db;
//     color: white;
//     padding: 5px 12px;
//     border-radius: 20px;
//     font-size: 12px;
//     font-weight: bold;
//   }

//   /* Breadcrumb */
//   .breadcrumb {
//     max-width: 1200px;
//     margin: 20px auto;
//     padding: 0 20px;
//     font-size: 14px;
//   }

//   .breadcrumb-link {
//     color: #e67e22;
//     text-decoration: none;
//   }

//   .breadcrumb-link:hover {
//     text-decoration: underline;
//   }

//   .breadcrumb-separator {
//     margin: 0 8px;
//     color: #999;
//   }

//   .breadcrumb-current {
//     color: #666;
//   }

//   /* Review Platforms Section */
//   .review-platforms-section {
//     margin-bottom: 30px;
//     background-color: #fff;
//     border-radius: 8px;
//     padding: 12px 20px;
//     box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
//   }

//   .platforms-grid {
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     gap: 24px;
//     flex-wrap: wrap;
//   }

//   .platform-card {
//     display: inline-flex;
//     align-items: center;
//     gap: 6px;
//     text-decoration: none;
//     color: #333;
//     font-size: 13px;
//     transition: color 0.2s;
//   }

//   .platform-card:hover {
//     color: #e67e22;
//   }

//   .platform-icon {
//     font-size: 14px;
//   }

//   .platform-count {
//     font-weight: bold;
//     color: #e67e22;
//     font-size: 14px;
//   }

//   .platform-text {
//     color: #666;
//   }

//   /* Sticky Navigation */
//   .sticky-nav {
//     background-color: white;
//     box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
//     z-index: 100;
//     transition: top 0.3s ease;
//     border-radius: 8px;
//     margin-bottom: 30px;
//     width: 100%;
//     position: relative;
//     top: -100px;
//   }

//   .sticky-nav.sticky {
//     position: sticky;
//     top: 0;
//   }

//   .nav-container {
//     display: flex;
//     flex-wrap: wrap;
//     gap: 5px;
//     padding: 12px 16px;
//     justify-content: center;
//     align-items: center;
//   }

//   .nav-button {
//     display: flex;
//     align-items: center;
//     gap: 8px;
//     padding: 8px 12px;
//     background-color: transparent;
//     border: none;
//     border-radius: 30px;
//     font-size: 13px;
//     font-weight: 500;
//     color: #666;
//     cursor: pointer;
//     transition: all 0.2s;
//     white-space: nowrap;
//     flex: 0 0 auto;
//   }

//   .nav-button:hover {
//     background-color: #f5f5f5;
//     color: #e67e22;
//   }

//   .nav-button.active {
//     background-color: #e67e22;
//     color: white;
//   }

//   .nav-button.active:hover {
//     background-color: #d35400;
//   }

//   .nav-icon {
//     font-size: 16px;
//   }

//   .nav-label {
//     font-size: 14px;
//   }

//   /* Main Layout */
//   .main-layout {
//     display: flex;
//     gap: 30px;
//     position: relative;
//     max-width: 1400px;
//     margin: 0 auto;
//   }

//   .main-content {
//     flex: 1;
//     min-width: 0;
//   }

//   .right-column {
//     width: 320px;
//     flex-shrink: 0;
//   }

//   /* Facts Grid */
//   .facts-grid {
//     display: grid;
//     grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
//     gap: 15px;
//     background-color: #f8f9fa;
//     padding: 25px;
//     border-radius: 12px;
//     margin-bottom: 40px;
//   }

//   .fact-item {
//     display: flex;
//     flex-direction: column;
//   }

//   .fact-label {
//     font-size: 0.8rem;
//     color: #7f8c8d;
//     text-transform: uppercase;
//     letter-spacing: 0.5px;
//     margin-bottom: 5px;
//   }

//   .fact-value {
//     font-size: 1rem;
//     font-weight: bold;
//     color: #2c3e50;
//   }

//   /* Pricing Card */
//   .pricing-card-placeholder {
//     height: auto;
//   }

//   .pricing-card {
//     background-color: white;
//     border-radius: 12px;
//     box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
//     padding: 20px;
//     margin-bottom: 20px;
//     transition: all 0.3s ease;
//   }

//   .pricing-card.sticky {
//     position: sticky;
//   }

//   .price-header {
//     margin-bottom: 15px;
//   }

//   .price-label {
//     font-size: 14px;
//     color: #7f8c8d;
//     display: block;
//     margin-bottom: 5px;
//   }

//   .price-container {
//     display: flex;
//     align-items: baseline;
//     gap: 10px;
//   }

//   .original-price {
//     font-size: 18px;
//     color: #95a5a6;
//     text-decoration: line-through;
//   }

//   .discounted-price {
//     font-size: 28px;
//     font-weight: bold;
//     color: #e67e22;
//   }

//   .savings-container {
//     background-color: #f0f9f0;
//     padding: 10px;
//     border-radius: 8px;
//     margin-bottom: 15px;
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//   }

//   .savings-label {
//     font-size: 14px;
//     color: #27ae60;
//     font-weight: 500;
//   }

//   .savings-amount {
//     font-size: 18px;
//     font-weight: bold;
//     color: #27ae60;
//   }

//   .group-discount-toggle {
//     margin-bottom: 20px;
//     border-top: 1px solid #e0e0e0;
//     padding-top: 15px;
//   }

//   .group-discount-button {
//     width: 100%;
//     padding: 12px;
//     background-color: #f8f9fa;
//     border: 1px solid #e0e0e0;
//     border-radius: 8px;
//     font-size: 14px;
//     font-weight: bold;
//     color: #2c3e50;
//     cursor: pointer;
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     transition: all 0.2s;
//   }

//   .group-discount-button:hover {
//     background-color: #e67e22;
//     color: white;
//     border-color: #e67e22;
//   }

//   .group-discount-content {
//     margin-top: 10px;
//     padding: 10px;
//     background-color: #f8f9fa;
//     border-radius: 8px;
//   }

//   .group-discount-item {
//     display: flex;
//     justify-content: space-between;
//     padding: 8px 0;
//     border-bottom: 1px solid #e0e0e0;
//   }

//   .group-discount-item:last-child {
//     border-bottom: none;
//   }

//   .group-size-text {
//     font-size: 13px;
//     color: #2c3e50;
//   }

//   .group-price-text {
//     font-size: 14px;
//     font-weight: bold;
//     color: #e67e22;
//   }

//   .button-group {
//     display: flex;
//     flex-direction: column;
//     gap: 10px;
//   }

//   .book-now-button {
//     padding: 12px;
//     background-color: #e67e22;
//     color: white;
//     border: none;
//     border-radius: 8px;
//     font-size: 16px;
//     font-weight: bold;
//     cursor: pointer;
//     transition: background-color 0.2s;
//   }

//   .book-now-button:hover {
//     background-color: #d35400;
//   }

//   .check-availability-button {
//     padding: 12px;
//     background-color: white;
//     color: #e67e22;
//     border: 1px solid #e67e22;
//     border-radius: 8px;
//     font-size: 14px;
//     font-weight: 500;
//     cursor: pointer;
//     transition: all 0.2s;
//   }

//   .check-availability-button:hover {
//     background-color: #e67e22;
//     color: white;
//   }

//   .send-inquiry-button,
//   .customize-button,
//   .download-button {
//     padding: 12px;
//     background-color: white;
//     color: #2c3e50;
//     border: 1px solid #bdc3c7;
//     border-radius: 8px;
//     font-size: 14px;
//     font-weight: 500;
//     cursor: pointer;
//     transition: all 0.2s;
//   }

//   .send-inquiry-button:hover,
//   .customize-button:hover,
//   .download-button:hover {
//     border-color: #e67e22;
//     color: #e67e22;
//   }

//   /* Sections */
//   .section {
//     margin-bottom: 50px;
//     scroll-margin-top: 80px;
//   }

//   .section-title {
//     font-size: 1.8rem;
//     font-weight: bold;
//     color: #2c3e50;
//     border-bottom: 3px solid #e67e22;
//     padding-bottom: 10px;
//     margin-bottom: 25px;
//   }

//   .paragraph {
//     line-height: 1.8;
//     font-size: 1rem;
//     color: #444;
//   }

//   /* Gallery */
//   .gallery-grid {
//     display: grid;
//     grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
//     gap: 20px;
//     margin-top: 20px;
//   }

//   .gallery-item {
//     position: relative;
//     border-radius: 12px;
//     overflow: hidden;
//     box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
//     transition: transform 0.2s, box-shadow 0.2s;
//     background-color: #fff;
//     cursor: pointer;
//     aspect-ratio: 4/3;
//   }

//   .gallery-item:hover {
//     transform: translateY(-4px);
//     box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
//   }

//   .gallery-image-wrapper {
//     position: relative;
//     width: 100%;
//     height: 100%;
//   }

//   .gallery-image {
//     object-fit: cover;
//     transition: transform 0.3s;
//   }

//   .gallery-item:hover .gallery-image {
//     transform: scale(1.05);
//   }

//   .gallery-featured-badge {
//     position: absolute;
//     top: 12px;
//     right: 12px;
//     background-color: #e67e22;
//     color: white;
//     padding: 4px 10px;
//     border-radius: 20px;
//     font-size: 11px;
//     font-weight: bold;
//     z-index: 2;
//     box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
//   }

//   .gallery-overlay {
//     position: absolute;
//     bottom: 0;
//     left: 0;
//     right: 0;
//     background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
//     padding: 15px;
//     opacity: 0;
//     transition: opacity 0.3s;
//   }

//   .gallery-item:hover .gallery-overlay {
//     opacity: 1;
//   }

//   .gallery-title {
//     margin: 0;
//     font-size: 14px;
//     font-weight: bold;
//     color: white;
//     margin-bottom: 5px;
//   }

//   .gallery-description {
//     margin: 0;
//     font-size: 12px;
//     color: #f0f0f0;
//     line-height: 1.4;
//   }

//   .gallery-more-item {
//     position: relative;
//     border-radius: 12px;
//     overflow: hidden;
//     box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
//     cursor: pointer;
//     aspect-ratio: 4/3;
//     transition: transform 0.2s;
//   }

//   .gallery-more-item:hover {
//     transform: translateY(-4px);
//     box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
//   }

//   .gallery-more-overlay {
//     position: absolute;
//     top: 0;
//     left: 0;
//     right: 0;
//     bottom: 0;
//     background-color: rgba(0, 0, 0, 0.6);
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     justify-content: center;
//     z-index: 2;
//   }

//   .gallery-more-text {
//     font-size: 36px;
//     font-weight: bold;
//     color: white;
//     margin-bottom: 8px;
//   }

//   .gallery-more-sub-text {
//     font-size: 14px;
//     color: white;
//     opacity: 0.9;
//   }

//   .gallery-more-image {
//     object-fit: cover;
//     filter: brightness(0.7);
//   }

//   .view-all-button {
//     margin-top: 20px;
//     padding: 10px 24px;
//     background-color: transparent;
//     border: 2px solid #e67e22;
//     border-radius: 8px;
//     color: #e67e22;
//     font-size: 14px;
//     font-weight: bold;
//     cursor: pointer;
//     transition: all 0.2s;
//     width: 100%;
//     max-width: 200px;
//     display: block;
//     margin-left: auto;
//     margin-right: auto;
//   }

//   .view-all-button:hover {
//     background-color: #e67e22;
//     color: white;
//   }

//   /* Itinerary */
//   .itinerary-container {
//     display: flex;
//     flex-direction: column;
//     gap: 15px;
//   }

//   .itinerary-day {
//     background-color: #f9f9f9;
//     border-radius: 12px;
//     padding: 0;
//     transition: all 0.3s;
//     cursor: pointer;
//     border: 1px solid #e0e0e0;
//     overflow: hidden;
//   }

//   .itinerary-day-header {
//     display: flex;
//     align-items: center;
//     gap: 15px;
//     padding: 18px 20px;
//     background-color: #fff;
//     transition: background-color 0.2s;
//     cursor: pointer;
//     position: relative;
//   }

//   .itinerary-day-header:hover {
//     background-color: #f8f9fa;
//   }

//   .itinerary-day-number {
//     display: inline-block;
//     background-color: #e67e22;
//     color: white;
//     padding: 5px 14px;
//     border-radius: 25px;
//     font-size: 14px;
//     font-weight: bold;
//     min-width: 70px;
//     text-align: center;
//   }

//   .itinerary-day-title {
//     font-size: 1.1rem;
//     font-weight: bold;
//     color: #2c3e50;
//     margin: 0;
//     flex: 1;
//   }

//   .itinerary-toggle-icon {
//     font-size: 20px;
//     font-weight: bold;
//     color: #e67e22;
//     transition: transform 0.3s ease;
//     width: 24px;
//     height: 24px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//   }

//   .itinerary-toggle-icon.open {
//     transform: rotate(45deg);
//   }

//   .itinerary-day-content {
//     padding: 0 20px 20px 20px;
//     border-top: 1px solid #e0e0e0;
//     background-color: #fff;
//   }

//   .itinerary-day-description {
//     line-height: 1.8;
//     color: #666;
//     margin-bottom: 15px;
//     margin-top: 15px;
//   }

//   .itinerary-details {
//     display: flex;
//     flex-wrap: wrap;
//     gap: 15px;
//     margin-top: 10px;
//     padding-top: 10px;
//     border-top: 1px dashed #e0e0e0;
//   }

//   .itinerary-detail {
//     font-size: 0.85rem;
//     color: #888;
//     display: flex;
//     align-items: center;
//     gap: 5px;
//   }

//   /* Route Map - Fixed */
//   .map-container {
//     width: 100%;
//     background-color: #f8f9fa;
//     border-radius: 12px;
//     overflow: hidden;
//     box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
//   }

//   .map-image {
//     width: 100%;
//     height: auto;
//     object-fit: contain;
//   }

//   /* Cost Details */
//   .cost-grid {
//     display: grid;
//     grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
//     gap: 30px;
//   }

//   .sub-title {
//     font-size: 1.3rem;
//     font-weight: bold;
//     color: #2c3e50;
//     margin-bottom: 15px;
//   }

//   .list {
//     list-style: none;
//     padding: 0;
//     margin: 0;
//   }

//   .list-item {
//     padding: 8px 0;
//     display: flex;
//     align-items: flex-start;
//     gap: 10px;
//     font-size: 14px;
//     color: #555;
//     border-bottom: 1px solid #f0f0f0;
//   }

//   .include-icon {
//     color: #27ae60;
//     font-weight: bold;
//     flex-shrink: 0;
//   }

//   .exclude-icon {
//     color: #e74c3c;
//     font-weight: bold;
//     flex-shrink: 0;
//   }

//   .category-badge {
//     display: inline-block;
//     background-color: #f0f0f0;
//     padding: 2px 8px;
//     border-radius: 12px;
//     font-size: 11px;
//     margin-left: 8px;
//     color: #666;
//   }

//   /* Dates Cards */
//   .dates-cards-grid {
//     display: grid;
//     grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
//     gap: 20px;
//     margin-top: 20px;
//   }

//   .date-card {
//     background: white;
//     border-radius: 16px;
//     overflow: hidden;
//     box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
//     transition: all 0.3s ease;
//     border: 1px solid #f0f0f0;
//   }

//   .date-card:hover {
//     transform: translateY(-4px);
//     box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
//   }

//   .date-card-header {
//     background: linear-gradient(135deg, #e67e22 0%, #f39c12 100%);
//     padding: 20px;
//     text-align: center;
//     color: white;
//     display: flex;
//     justify-content: center;
//     align-items: baseline;
//     gap: 8px;
//   }

//   .date-month {
//     font-size: 18px;
//     font-weight: 600;
//     text-transform: uppercase;
//     letter-spacing: 1px;
//   }

//   .date-day {
//     font-size: 36px;
//     font-weight: bold;
//     line-height: 1;
//   }

//   .date-year {
//     font-size: 14px;
//     opacity: 0.9;
//   }

//   .date-card-body {
//     padding: 20px;
//   }

//   .date-range {
//     display: flex;
//     align-items: center;
//     gap: 8px;
//     font-size: 14px;
//     color: #2c3e50;
//     margin-bottom: 15px;
//     padding-bottom: 10px;
//     border-bottom: 1px dashed #e0e0e0;
//   }

//   .date-price {
//     margin-bottom: 15px;
//   }

//   .original-price-small {
//     text-decoration: line-through;
//     color: #95a5a6;
//     font-size: 13px;
//     margin-right: 10px;
//   }

//   .discounted-price-large {
//     font-size: 24px;
//     font-weight: bold;
//     color: #e67e22;
//   }

//   .date-badges {
//     display: flex;
//     gap: 8px;
//     margin-bottom: 20px;
//     flex-wrap: wrap;
//   }

//   .guaranteed-badge-card {
//     background-color: #3498db;
//     color: white;
//     padding: 4px 10px;
//     border-radius: 20px;
//     font-size: 11px;
//     font-weight: 600;
//   }

//   .bestseller-badge-card {
//     background-color: #e67e22;
//     color: white;
//     padding: 4px 10px;
//     border-radius: 20px;
//     font-size: 11px;
//     font-weight: 600;
//   }

//   .book-now-btn-small {
//     width: 100%;
//     padding: 10px;
//     background-color: #e67e22;
//     color: white;
//     border: none;
//     border-radius: 8px;
//     font-size: 14px;
//     font-weight: 600;
//     cursor: pointer;
//     transition: all 0.2s;
//   }

//   .book-now-btn-small:hover {
//     background-color: #d35400;
//     transform: translateY(-2px);
//   }

//   .view-all-dates-btn {
//     margin-top: 20px;
//     padding: 12px 24px;
//     background-color: transparent;
//     border: 2px solid #e67e22;
//     border-radius: 30px;
//     color: #e67e22;
//     font-size: 14px;
//     font-weight: 600;
//     cursor: pointer;
//     transition: all 0.2s;
//     display: block;
//     margin-left: auto;
//     margin-right: auto;
//   }

//   .view-all-dates-btn:hover {
//     background-color: #e67e22;
//     color: white;
//   }

//   /* FAQ */
//   .faq-container {
//     display: flex;
//     flex-direction: column;
//     gap: 15px;
//   }

//   .faq-item {
//     background-color: #f9f9f9;
//     border-radius: 12px;
//     border: 1px solid #e0e0e0;
//     overflow: hidden;
//   }

//   .faq-question {
//     padding: 18px 20px;
//     font-weight: bold;
//     color: #2c3e50;
//     cursor: pointer;
//     transition: background-color 0.2s;
//     font-size: 16px;
//   }

//   .faq-question:hover {
//     background-color: #f0f0f0;
//   }

//   .faq-answer {
//     padding: 0 20px 20px 20px;
//     color: #666;
//     line-height: 1.6;
//     border-top: 1px solid #e0e0e0;
//   }

//   /* Video */
//   .video-container {
//     position: relative;
//     width: 100%;
//     padding-bottom: 56.25%;
//     height: 0;
//     overflow: hidden;
//     border-radius: 12px;
//     box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
//   }

//   .video-iframe {
//     position: absolute;
//     top: 0;
//     left: 0;
//     width: 100%;
//     height: 100%;
//   }

//   /* Customer Reviews - Improved */
//   .reviews-section {
//     margin-top: 50px;
//     padding: 30px;
//     background-color: #f8f9fa;
//     border-radius: 16px;
//   }

//   .reviews-header {
//     text-align: center;
//     margin-bottom: 30px;
//   }

//   .reviews-title {
//     font-size: 1.8rem;
//     font-weight: bold;
//     color: #2c3e50;
//     margin-bottom: 10px;
//   }

//   .reviews-subtitle {
//     color: #7f8c8d;
//     font-size: 14px;
//   }

//   .reviews-summary {
//     display: grid;
//     grid-template-columns: 300px 1fr;
//     gap: 30px;
//     background-color: white;
//     padding: 25px;
//     border-radius: 12px;
//     margin-bottom: 30px;
//   }

//   .rating-summary {
//     text-align: center;
//     padding: 20px;
//     border-right: 1px solid #e0e0e0;
//   }

//   .average-rating {
//     font-size: 48px;
//     font-weight: bold;
//     color: #e67e22;
//     margin-bottom: 10px;
//   }

//   .review-stars {
//     color: #f39c12;
//     font-size: 20px;
//     margin-bottom: 10px;
//   }

//   .total-reviews {
//     color: #7f8c8d;
//     font-size: 13px;
//   }

//   .rating-distribution {
//     padding: 10px;
//   }

//   .distribution-bar {
//     display: flex;
//     align-items: center;
//     gap: 12px;
//     margin-bottom: 12px;
//     cursor: pointer;
//     transition: opacity 0.2s;
//   }

//   .distribution-bar:hover {
//     opacity: 0.8;
//   }

//   .rating-label {
//     width: 45px;
//     font-size: 14px;
//     font-weight: 500;
//     color: #2c3e50;
//   }

//   .bar-container {
//     flex: 1;
//     height: 8px;
//     background-color: #e0e0e0;
//     border-radius: 4px;
//     overflow: hidden;
//   }

//   .bar-fill {
//     height: 100%;
//     background-color: #e67e22;
//     border-radius: 4px;
//     transition: width 0.3s ease;
//   }

//   .rating-count {
//     width: 40px;
//     font-size: 13px;
//     color: #7f8c8d;
//   }

//   .rating-percentage {
//     width: 45px;
//     font-size: 13px;
//     font-weight: 500;
//     color: #2c3e50;
//   }

//   .filter-chips {
//     display: flex;
//     gap: 10px;
//     margin-bottom: 25px;
//     flex-wrap: wrap;
//   }

//   .filter-chip {
//     padding: 6px 14px;
//     background-color: white;
//     border: 1px solid #e0e0e0;
//     border-radius: 20px;
//     font-size: 13px;
//     cursor: pointer;
//     transition: all 0.2s;
//     color: #666;
//   }

//   .filter-chip:hover {
//     border-color: #e67e22;
//     color: #e67e22;
//   }

//   .filter-chip.active {
//     background-color: #e67e22;
//     color: white;
//     border-color: #e67e22;
//   }

//   .reviews-list {
//     display: flex;
//     flex-direction: column;
//     gap: 20px;
//     margin-bottom: 25px;
//   }

//   .review-card {
//     background-color: white;
//     padding: 25px;
//     border-radius: 12px;
//     box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
//     transition: transform 0.2s, box-shadow 0.2s;
//   }

//   .review-card:hover {
//     transform: translateY(-2px);
//     box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
//   }

//   .review-header {
//     display: flex;
//     gap: 15px;
//     margin-bottom: 15px;
//   }

//   .reviewer-avatar {
//     flex-shrink: 0;
//   }

//   .user-avatar-img {
//     width: 50px;
//     height: 50px;
//     border-radius: 50%;
//     object-fit: cover;
//   }

//   .user-avatar-placeholder {
//     width: 50px;
//     height: 50px;
//     border-radius: 50%;
//     background-color: #e67e22;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     color: white;
//     font-size: 20px;
//     font-weight: bold;
//   }

//   .reviewer-info {
//     flex: 1;
//   }

//   .reviewer-name {
//     font-weight: bold;
//     color: #2c3e50;
//     margin-bottom: 5px;
//     display: flex;
//     align-items: center;
//     gap: 8px;
//     flex-wrap: wrap;
//   }

//   .verified-badge {
//     background-color: #27ae60;
//     color: white;
//     padding: 2px 8px;
//     border-radius: 12px;
//     font-size: 11px;
//     font-weight: normal;
//   }

//   .review-date {
//     color: #95a5a6;
//     font-size: 12px;
//   }

//   .review-rating {
//     margin-bottom: 12px;
//   }

//   .star {
//     font-size: 18px;
//     margin-right: 2px;
//   }

//   .star.filled {
//     color: #f39c12;
//   }

//   .star.empty {
//     color: #e0e0e0;
//   }

//   .review-title {
//     font-size: 18px;
//     font-weight: bold;
//     color: #2c3e50;
//     margin-bottom: 12px;
//   }

//   .review-comment {
//     color: #666;
//     line-height: 1.6;
//     margin-bottom: 15px;
//   }

//   .review-footer {
//     display: flex;
//     justify-content: flex-end;
//   }

//   .helpful-button {
//     background: none;
//     border: none;
//     color: #7f8c8d;
//     font-size: 13px;
//     cursor: pointer;
//     padding: 5px 10px;
//     border-radius: 6px;
//     transition: all 0.2s;
//   }

//   .helpful-button:hover {
//     background-color: #f0f0f0;
//     color: #e67e22;
//   }

//   .show-more-button {
//     width: 100%;
//     padding: 12px;
//     background-color: transparent;
//     border: 2px solid #e67e22;
//     border-radius: 8px;
//     color: #e67e22;
//     font-size: 14px;
//     font-weight: bold;
//     cursor: pointer;
//     transition: all 0.2s;
//   }

//   .show-more-button:hover {
//     background-color: #e67e22;
//     color: white;
//   }

//   .no-reviews {
//     text-align: center;
//     padding: 40px;
//     color: #95a5a6;
//   }

//   /* Gallery Modal - Fixed */
//   .modal-overlay {
//     position: fixed;
//     top: 0;
//     left: 0;
//     right: 0;
//     bottom: 0;
//     background-color: rgba(0, 0, 0, 0.95);
//     z-index: 2000;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     animation: fadeIn 0.3s ease;
//   }

//   .modal-content {
//     position: relative;
//     max-width: 90vw;
//     max-height: 90vh;
//     background-color: #000;
//     border-radius: 12px;
//     overflow: hidden;
//   }

//   .modal-image-wrapper {
//     position: relative;
//     width: 80vw;
//     height: 70vh;
//   }

//   .modal-image {
//     object-fit: contain;
//   }

//   .modal-close,
//   .modal-prev,
//   .modal-next {
//     position: absolute;
//     background-color: rgba(0, 0, 0, 0.6);
//     color: white;
//     border: none;
//     border-radius: 50%;
//     width: 44px;
//     height: 44px;
//     font-size: 24px;
//     cursor: pointer;
//     z-index: 10;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     transition: background-color 0.2s;
//   }

//   .modal-close {
//     top: 20px;
//     right: 20px;
//   }

//   .modal-prev {
//     top: 50%;
//     left: 20px;
//     transform: translateY(-50%);
//   }

//   .modal-next {
//     top: 50%;
//     right: 20px;
//     transform: translateY(-50%);
//   }

//   .modal-close:hover,
//   .modal-prev:hover,
//   .modal-next:hover {
//     background-color: #e67e22;
//   }

//   .modal-caption {
//     position: absolute;
//     bottom: 0;
//     left: 0;
//     right: 0;
//     background-color: rgba(0, 0, 0, 0.8);
//     color: white;
//     padding: 15px;
//     text-align: center;
//   }

//   .modal-title {
//     font-size: 16px;
//     font-weight: bold;
//     margin: 0 0 5px 0;
//   }

//   .modal-description {
//     font-size: 14px;
//     margin: 0 0 5px 0;
//     opacity: 0.9;
//   }

//   .modal-counter {
//     font-size: 12px;
//     opacity: 0.7;
//     margin-top: 5px;
//   }

//   /* Responsive */
//   @media (max-width: 1024px) {
//     .main-layout {
//       flex-direction: column;
//     }

//     .right-column {
//       width: 100%;
//     }

//     .pricing-card {
//       position: relative;
//       top: auto !important;
//     }

//     .reviews-summary {
//       grid-template-columns: 1fr;
//     }

//     .rating-summary {
//       border-right: none;
//       border-bottom: 1px solid #e0e0e0;
//     }
//   }

//   @media (max-width: 768px) {
//     .trip-details-container {
//       padding: 10px;
//     }

//     .hero-title {
//       font-size: 1.8rem;
//     }

//     .hero-section {
//       height: 300px;
//     }

//     .nav-container {
//       overflow-x: auto;
//       justify-content: flex-start;
//       padding: 10px;
//     }

//     .nav-button {
//       padding: 6px 10px;
//       font-size: 12px;
//     }

//     .nav-label {
//       font-size: 12px;
//     }

//     .facts-grid {
//       grid-template-columns: repeat(2, 1fr);
//     }

//     .section-title {
//       font-size: 1.5rem;
//     }

//     .gallery-grid {
//       grid-template-columns: repeat(2, 1fr);
//     }

//     .dates-cards-grid {
//       grid-template-columns: 1fr;
//     }

//     .discounted-price-large {
//       font-size: 20px;
//     }

//     .modal-image-wrapper {
//       width: 95vw;
//       height: 60vh;
//     }
//   }
// `;

// export default TripDetailsPage;

//----------------------------------------------------------------end

"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/pages/Footer";
import axios from "axios";

// Types remain the same...
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
  createdAt: string;
  verified: boolean;
  helpful: number;
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
  reviewStats?: ReviewStats;
  recentReviews?: Review[];
}

interface NavItem {
  id: string;
  label: string;
  icon: string;
}

const TripDetailsPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  if (!params) {
    return (
      <div className="trip-details-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
        <style jsx>{styles}</style>
      </div>
    );
  }
  const slug = params.slug as string;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tripData, setTripData] = useState<TrekPackage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeNav, setActiveNav] = useState("overview");
  const [isNavSticky, setIsNavSticky] = useState(false);
  const [showGroupDiscount, setShowGroupDiscount] = useState(false);
  const [isPricingCardSticky, setIsPricingCardSticky] = useState(false);
  const [navHeight, setNavHeight] = useState(0);
  const [openItineraryDays, setOpenItineraryDays] = useState<number[]>([]);
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
  const [windowWidth, setWindowWidth] = useState(0);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  // const [newReview, setNewReview] = useState({
  //   rating: 5,
  //   title: "",
  //   comment: "",
  // });

  const [newReview, setNewReview] = useState({
    rating: 5,
    title: "",
    comment: "",
    email: "",
    userName: "",
  });

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
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5232";

  const api = axios.create({
    baseURL: API_BASE_URL,
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
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showGalleryModal) {
        if (e.key === "ArrowLeft") prevImage();
        else if (e.key === "ArrowRight") nextImage();
        else if (e.key === "Escape") closeGalleryModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showGalleryModal, tripData?.galleryImages]);

  const getNavItems = (): NavItem[] => {
    if (!tripData) {
      return [];
    }
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

  const scrollToSection = (sectionId: string) => {
    const sectionRefs: { [key: string]: React.RefObject<HTMLDivElement | null> } = {
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
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
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
        setIsPricingCardSticky(window.scrollY > placeholderTop + 100);
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

      for (const section of sections) {
        if (section.ref.current) {
          const rect = section.ref.current.getBoundingClientRect();
          const offsetTop = rect.top + window.scrollY;
          if (
            scrollPosition >= offsetTop - 10 &&
            scrollPosition < offsetTop + rect.height - 10
          ) {
            setActiveNav(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [tripData, isNavSticky]);

  useEffect(() => {
    if (slug) fetchTripDetails();
  }, [slug]);

  // const fetchTripDetails = async () => {
  //   try {
  //     setLoading(true);
  //     const idMatch = slug?.match(/-(\d+)$/);
  //     const packageId = idMatch ? parseInt(idMatch[1]) : null;
  //     if (!packageId) throw new Error("Invalid package ID");

  //     const response = await api.get(`/api/TrekPackage/${packageId}`);
  //     const data = response.data;
  //     setTripData(data);

  //     // Set reviews from API response
  //     if (data.recentReviews && data.recentReviews.length > 0) {
  //       setReviews(data.recentReviews);
  //     }

  //     // Set review stats from API response
  //     if (data.reviewStats) {
  //       setReviewStats(data.reviewStats);
  //     }
  //   } catch (error: any) {
  //     console.error("Error fetching trip details:", error);
  //     setError(error.message || "Error loading trip details");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchTripDetails = async () => {
    try {
      setLoading(true);
      const idMatch = slug?.match(/-(\d+)$/);
      const packageId = idMatch ? parseInt(idMatch[1]) : null;
      if (!packageId) throw new Error("Invalid package ID");

      // Fetch trip details
      const response = await api.get(`/api/TrekPackage/${packageId}`);
      const data = response.data;
      setTripData(data);

      // Fetch reviews separately from the review endpoint
      console.log("Fetching reviews for package:", packageId);
      const reviewsResponse = await api.get(`/api/Review/package/${packageId}`);
      console.log("Reviews response:", reviewsResponse.data);

      if (reviewsResponse.data && reviewsResponse.data.length > 0) {
        // Transform the reviews to match your Review interface
        const formattedReviews = reviewsResponse.data.map((review: any) => ({
          id: review.id,
          userName: review.userName,
          userAvatar: review.userAvatar,
          rating: review.rating,
          title: review.title,
          comment: review.comment,
          createdAt: review.createdAt,
          verified: review.isVerified,
          helpful: review.helpful,
        }));
        setReviews(formattedReviews);
      } else {
        setReviews([]);
      }

      // Fetch review stats
      const statsResponse = await api.get(
        `/api/Review/package/${packageId}/stats`,
      );
      console.log("Stats response:", statsResponse.data);

      if (statsResponse.data) {
        setReviewStats({
          averageRating: statsResponse.data.averageRating,
          totalReviews: statsResponse.data.totalReviews,
          ratingDistribution: statsResponse.data.ratingDistribution,
        });
      }
    } catch (error: any) {
      console.error("Error fetching trip details:", error);
      setError(error.message || "Error loading trip details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  // const handleSubmitReview = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   // Check if user is logged in
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     // Store the current URL to redirect back after login
  //     const currentUrl = window.location.pathname;
  //     router.push(`/user-login?redirect=${encodeURIComponent(currentUrl)}`);
  //     return;
  //   }

  //   setIsSubmittingReview(true);

  //   try {
  //     const idMatch = slug?.match(/-(\d+)$/);
  //     const packageId = idMatch ? parseInt(idMatch[1]) : null;

  //     const response = await api.post(
  //       "/api/Review",
  //       {
  //         trekPackageId: packageId,
  //         rating: newReview.rating,
  //         title: newReview.title,
  //         comment: newReview.comment,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       },
  //     );

  //     // Refresh reviews after submission
  //     await fetchTripDetails();

  //     // Reset form
  //     setNewReview({ rating: 5, title: "", comment: "" });
  //     setShowReviewForm(false);
  //     alert("Review submitted successfully!");
  //   } catch (error: any) {
  //     console.error("Error submitting review:", error);

  //     // If unauthorized (token expired), redirect to login
  //     if (error.response?.status === 401) {
  //       localStorage.removeItem("token");
  //       localStorage.removeItem("user");
  //       const currentUrl = window.location.pathname;
  //       router.push(`/user-login?redirect=${encodeURIComponent(currentUrl)}`);
  //     } else {
  //       alert(error.response?.data?.message || "Error submitting review");
  //     }
  //   } finally {
  //     setIsSubmittingReview(false);
  //   }
  // };

  // const handleSubmitReview = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsSubmittingReview(true);

  //   try {
  //     const idMatch = slug?.match(/-(\d+)$/);
  //     const packageId = idMatch ? parseInt(idMatch[1]) : null;

  //     if (!packageId) {
  //       throw new Error("Invalid package ID");
  //     }

  //     console.log("📤 Submitting review:", {
  //       trekPackageId: packageId,
  //       rating: newReview.rating,
  //       title: newReview.title,
  //       comment: newReview.comment,
  //       email: newReview.email,
  //       userName: newReview.userName,
  //     });

  //     // Send review without token
  //     const response = await api.post("/api/Review", {
  //       trekPackageId: packageId,
  //       rating: newReview.rating,
  //       title: newReview.title,
  //       comment: newReview.comment,
  //       email: newReview.email,
  //       userName: newReview.userName || newReview.email.split("@")[0], // Use name or email prefix
  //     });

  //     console.log("✅ Review submitted:", response.data);

  //     // Refresh reviews after submission
  //     await fetchTripDetails();

  //     // Reset form
  //     setNewReview({
  //       rating: 5,
  //       title: "",
  //       comment: "",
  //       email: "",
  //       userName: "",
  //     });
  //     setShowReviewForm(false);

  //     alert("Thank you for your review! It has been submitted successfully.");
  //   } catch (error: any) {
  //     console.error("Error submitting review:", error);
  //     console.error("Error response:", error.response?.data);

  //     if (error.response?.status === 409) {
  //       alert("You have already reviewed this package.");
  //     } else if (error.response?.status === 400) {
  //       const errorMessage =
  //         error.response?.data?.message ||
  //         "Please check your input. Email is required.";
  //       alert(errorMessage);
  //     } else {
  //       alert(
  //         error.response?.data?.message ||
  //           "Error submitting review. Please try again.",
  //       );
  //     }
  //   } finally {
  //     setIsSubmittingReview(false);
  //   }
  // };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReview(true);

    try {
      const idMatch = slug?.match(/-(\d+)$/);
      const packageId = idMatch ? parseInt(idMatch[1]) : null;

      if (!packageId) {
        throw new Error("Invalid package ID");
      }

      console.log("📤 Submitting review:", {
        trekPackageId: packageId,
        rating: newReview.rating,
        title: newReview.title,
        comment: newReview.comment,
        email: newReview.email,
        userName: newReview.userName,
      });

      // Send review
      const response = await api.post("/api/Review", {
        trekPackageId: packageId,
        rating: newReview.rating,
        title: newReview.title,
        comment: newReview.comment,
        email: newReview.email,
        userName: newReview.userName || newReview.email.split("@")[0],
      });

      console.log("✅ Review submitted:", response.data);

      // IMPORTANT: Refresh reviews after submission
      // Fetch updated reviews and stats
      const reviewsResponse = await api.get(`/api/Review/package/${packageId}`);
      if (reviewsResponse.data) {
        const formattedReviews = reviewsResponse.data.map((review: any) => ({
          id: review.id,
          userName: review.userName,
          userAvatar: review.userAvatar,
          rating: review.rating,
          title: review.title,
          comment: review.comment,
          createdAt: review.createdAt,
          verified: review.isVerified,
          helpful: review.helpful,
        }));
        setReviews(formattedReviews);
      }

      // Fetch updated stats
      const statsResponse = await api.get(
        `/api/Review/package/${packageId}/stats`,
      );
      if (statsResponse.data) {
        setReviewStats({
          averageRating: statsResponse.data.averageRating,
          totalReviews: statsResponse.data.totalReviews,
          ratingDistribution: statsResponse.data.ratingDistribution,
        });
      }

      // Reset form
      setNewReview({
        rating: 5,
        title: "",
        comment: "",
        email: "",
        userName: "",
      });
      setShowReviewForm(false);

      alert("Thank you for your review! It has been submitted successfully.");
    } catch (error: any) {
      console.error("Error submitting review:", error);
      console.error("Error response:", error.response?.data);

      if (error.response?.status === 409) {
        alert("You have already reviewed this package.");
      } else if (error.response?.status === 400) {
        const errorMessage =
          error.response?.data?.message ||
          "Please check your input. Email is required.";
        alert(errorMessage);
      } else {
        alert(
          error.response?.data?.message ||
          "Error submitting review. Please try again.",
        );
      }
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleMarkHelpful = async (reviewId: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      const currentUrl = window.location.pathname;
      router.push(`/user-login?redirect=${encodeURIComponent(currentUrl)}`);
      return;
    }

    try {
      await api.post(
        `/api/Review/${reviewId}/helpful`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Refresh reviews to update helpful count
      await fetchTripDetails();
    } catch (error: any) {
      console.error("Error marking review as helpful:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        const currentUrl = window.location.pathname;
        router.push(`/user-login?redirect=${encodeURIComponent(currentUrl)}`);
      }
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
  const toggleItineraryDay = (dayId: number) => {
    setOpenItineraryDays((prev) =>
      prev.includes(dayId)
        ? prev.filter((id) => id !== dayId)
        : [...prev, dayId],
    );
  };

  const filteredReviews = selectedRating
    ? reviews.filter((review) => review.rating === selectedRating)
    : reviews;
  const displayedReviews = showAllReviews
    ? filteredReviews
    : filteredReviews.slice(0, 3);

  if (loading) {
    return (
      <div className="trip-details-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading trip details...</p>
        </div>
        <style jsx>{styles}</style>
      </div>
    );
  }

  if (error || !tripData) {
    return (
      <div className="trip-details-container">
        <div className="error-container">
          <h2>Error Loading Trip</h2>
          <p>{error || "Trip not found"}</p>
          <button onClick={() => router.push("/")} className="home-button">
            Go Home
          </button>
        </div>
        <style jsx>{styles}</style>
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

  const displayGalleryImages = tripData.galleryImages?.slice(0, 4) || [];
  const remainingCount = (tripData.galleryImages?.length || 0) - 4;

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
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>

      <div className="trip-details-container">
        {/* Hero Section */}
        <div className="hero-section">
          {heroImage ? (
            <div className="hero-image-wrapper">
              <Image
                src={heroImage}
                alt={tripData.name}
                fill
                className="hero-image"
                priority
                unoptimized
              />
            </div>
          ) : (
            <div className="hero-image-placeholder">🏔️</div>
          )}
          <div className="hero-overlay">
            <div className="hero-content">
              <h1 className="hero-title">{tripData.name}</h1>
              <div className="hero-badges">
                {tripData.isBestSeller && (
                  <span className="bestseller-badge">Best Seller</span>
                )}
                {tripData.isTopSeller && (
                  <span className="topseller-badge">TOPSELLER</span>
                )}
                {tripData.hasGuaranteedDeparture && (
                  <span className="guaranteed-badge">
                    Guaranteed Departures
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link href="/" className="breadcrumb-link">
            Home
          </Link>
          <span className="breadcrumb-separator">/</span>
          <Link
            href={`/${createSlug(tripData.mainHeadingName)}`}
            className="breadcrumb-link"
          >
            {tripData.mainHeadingName}
          </Link>
          <span className="breadcrumb-separator">/</span>
          <Link
            href={`/${createSlug(tripData.mainHeadingName)}/${createSlug(tripData.headingName)}`}
            className="breadcrumb-link"
          >
            {tripData.headingName}
          </Link>
          {tripData.subHeadingName && (
            <>
              <span className="breadcrumb-separator">/</span>
              <Link
                href={`/${createSlug(tripData.mainHeadingName)}/${createSlug(tripData.headingName)}/${createSlug(tripData.subHeadingName)}`}
                className="breadcrumb-link"
              >
                {tripData.subHeadingName}
              </Link>
            </>
          )}
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{tripData.name}</span>
        </div>

        {/* Review Platforms Section */}
        <div className="review-platforms-section">
          <div className="platforms-grid">
            {reviewPlatforms.map((platform) => (
              <a
                key={platform.id}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="platform-card"
              >
                <span className="platform-icon">{platform.icon}</span>
                <span className="platform-count">
                  {platform.count.toLocaleString()}+
                </span>
                <span className="platform-text">
                  reviews in {platform.name}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Sticky Navigation Bar */}
        <div
          ref={stickyNavRef}
          className={`sticky-nav ${isNavSticky ? "sticky" : ""}`}
        >
          <div className="nav-container">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`nav-button ${activeNav === item.id ? "active" : ""}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="main-layout">
          <div className="main-content">
            {/* Trip Facts Grid */}
            <div ref={factsGridRef} className="facts-grid">
              <div className="fact-item">
                <span className="fact-label">Duration</span>
                <span className="fact-value">{`${tripData.durationDays} Days${tripData.durationNights ? ` / ${tripData.durationNights} Nights` : ""}`}</span>
              </div>
              <div className="fact-item">
                <span className="fact-label">Trip Grade</span>
                <span className="fact-value">
                  {tripData.tripGrade || "Moderate"}
                </span>
              </div>
              <div className="fact-item">
                <span className="fact-label">Country</span>
                <span className="fact-value">{tripData.countryName}</span>
              </div>
              <div className="fact-item">
                <span className="fact-label">Maximum Altitude</span>
                <span className="fact-value">
                  {tripData.maximumAltitude || "N/A"}
                </span>
              </div>
              <div className="fact-item">
                <span className="fact-label">Group Size</span>
                <span className="fact-value">
                  {tripData.groupSize || "1-20"}
                </span>
              </div>
              <div className="fact-item">
                <span className="fact-label">Starts</span>
                <span className="fact-value">
                  {tripData.startsAt || "Kathmandu"}
                </span>
              </div>
              <div className="fact-item">
                <span className="fact-label">Ends</span>
                <span className="fact-value">
                  {tripData.endsAt || "Kathmandu"}
                </span>
              </div>
              <div className="fact-item">
                <span className="fact-label">Activities</span>
                <span className="fact-value">
                  {tripData.activities || "Trekking"}
                </span>
              </div>
              <div className="fact-item">
                <span className="fact-label">Best Time</span>
                <span className="fact-value">
                  {tripData.bestTime || "Mar-May, Sep-Nov"}
                </span>
              </div>
            </div>

            <div
              ref={pricingCardPlaceholderRef}
              className="pricing-card-placeholder"
            />

            {/* Overview Section */}
            <div ref={overviewRef}>
              <section className="section">
                <h2 className="section-title">Overview</h2>
                <div
                  dangerouslySetInnerHTML={{ __html: tripData.overview || "" }}
                  className="paragraph"
                />
              </section>
            </div>

            {/* Gallery Section */}
            {tripData.galleryImages && tripData.galleryImages.length > 0 && (
              <div ref={galleryRef}>
                <section className="section">
                  <h2 className="section-title">Gallery</h2>
                  <div className="gallery-grid">
                    {displayGalleryImages.map((img, idx) => (
                      <div
                        key={img.id}
                        className="gallery-item"
                        onClick={() => openGalleryModal(idx)}
                      >
                        <div className="gallery-image-wrapper">
                          <Image
                            src={getFullImageUrl(img.imageUrl)}
                            alt={img.title || "Gallery image"}
                            fill
                            className="gallery-image"
                            unoptimized
                          />
                        </div>
                        {img.isFeatured && (
                          <span className="gallery-featured-badge">
                            Featured
                          </span>
                        )}
                        {img.title && (
                          <div className="gallery-overlay">
                            <p className="gallery-title">{img.title}</p>
                            {img.description && (
                              <p className="gallery-description">
                                {img.description}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                    {remainingCount > 0 && (
                      <div
                        className="gallery-more-item"
                        onClick={() => openGalleryModal(4)}
                      >
                        <div className="gallery-more-overlay">
                          <span className="gallery-more-text">
                            +{remainingCount}
                          </span>
                          <span className="gallery-more-sub-text">
                            More Photos
                          </span>
                        </div>
                        <div className="gallery-image-wrapper">
                          <Image
                            src={getFullImageUrl(
                              displayGalleryImages[3]?.imageUrl,
                            )}
                            alt="More images"
                            fill
                            className="gallery-more-image"
                            unoptimized
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  {tripData.galleryImages.length > 4 && (
                    <button
                      className="view-all-button"
                      onClick={() => openGalleryModal(0)}
                    >
                      View All {tripData.galleryImages.length} Photos
                    </button>
                  )}
                </section>
              </div>
            )}

            {/* Itinerary Section */}
            {tripData.itinerary && tripData.itinerary.length > 0 && (
              <div ref={itineraryRef}>
                <section className="section">
                  <h2 className="section-title">Itinerary</h2>
                  <div className="itinerary-container">
                    {tripData.itinerary.map((day) => {
                      const isOpen = openItineraryDays.includes(day.id);
                      return (
                        <div key={day.id} className="itinerary-day">
                          <div
                            className="itinerary-day-header"
                            onClick={() => toggleItineraryDay(day.id)}
                          >
                            <span className="itinerary-day-number">
                              Day {day.dayNumber}
                            </span>
                            {day.title && (
                              <h3 className="itinerary-day-title">
                                {day.title}
                              </h3>
                            )}
                            <span
                              className={`itinerary-toggle-icon ${isOpen ? "open" : ""}`}
                            >
                              {isOpen ? "−" : "+"}
                            </span>
                          </div>
                          {isOpen && (
                            <div className="itinerary-day-content">
                              {day.description && (
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: day.description,
                                  }}
                                  className="itinerary-day-description"
                                />
                              )}
                              <div className="itinerary-details">
                                {day.maxAltitude && (
                                  <span className="itinerary-detail">
                                    🏔️ {day.maxAltitude}
                                  </span>
                                )}
                                {day.accommodation && (
                                  <span className="itinerary-detail">
                                    🏨 {day.accommodation}
                                  </span>
                                )}
                                {day.meals && (
                                  <span className="itinerary-detail">
                                    🍽️ {day.meals}
                                  </span>
                                )}
                                {day.duration && (
                                  <span className="itinerary-detail">
                                    ⏱️ {day.duration}
                                  </span>
                                )}
                                {day.distance && (
                                  <span className="itinerary-detail">
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

            {/* Route Map Section - Fixed Layout */}
            {tripData.routeMapImageUrl && (
              <div ref={routeMapRef}>
                <section className="section">
                  <h2 className="section-title">Route Map</h2>
                  <div className="map-container">
                    <Image
                      src={getFullImageUrl(tripData.routeMapImageUrl)}
                      alt={`Route map for ${tripData.name}`}
                      width={1200}
                      height={600}
                      className="map-image"
                      unoptimized
                    />
                  </div>
                </section>
              </div>
            )}

            {/* Cost Details Section */}
            {(tripData.costIncludes?.length > 0 ||
              tripData.costExcludes?.length > 0) && (
                <div ref={costDetailsRef}>
                  <section className="section">
                    <h2 className="section-title">Cost Details</h2>
                    <div className="cost-grid">
                      {tripData.costIncludes?.length > 0 && (
                        <div>
                          <h3 className="sub-title">✓ What's Included</h3>
                          <ul className="list">
                            {tripData.costIncludes.map((item) => (
                              <li key={item.id} className="list-item">
                                <span className="include-icon">✓</span>{" "}
                                {item.description}
                                {item.category && (
                                  <span className="category-badge">
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
                          <h3 className="sub-title">✗ What's Not Included</h3>
                          <ul className="list">
                            {tripData.costExcludes.map((item) => (
                              <li key={item.id} className="list-item">
                                <span className="exclude-icon">✗</span>{" "}
                                {item.description}
                                {item.category && (
                                  <span className="category-badge">
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

            {/* Dates & Price Section - Alternative Card Design */}
            {tripData.departureDates && tripData.departureDates.length > 0 && (
              <div ref={datesRef}>
                <section className="section">
                  <h2 className="section-title">Dates & Price</h2>
                  <div className="dates-cards-grid">
                    {tripData.departureDates
                      .filter((d) => new Date(d.startDate) > new Date())
                      .slice(0, 6)
                      .map((date) => (
                        <div key={date.id} className="date-card">
                          <div className="date-card-header">
                            <div className="date-month">
                              {new Date(date.startDate).toLocaleDateString(
                                "en-US",
                                { month: "short" },
                              )}
                            </div>
                            <div className="date-day">
                              {new Date(date.startDate).getDate()}
                            </div>
                            <div className="date-year">
                              {new Date(date.startDate).getFullYear()}
                            </div>
                            <div className="date-badges">
                              {date.isGuaranteed && (
                                <span className="guaranteed-badge-card">
                                  ✓ Guaranteed
                                </span>
                              )}
                              {date.isBestSeller && (
                                <span className="bestseller-badge-card">
                                  ⭐ Best Seller
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="date-card-body">
                            <div className="date-range">
                              <span>📅</span>
                              {new Date(date.startDate).toLocaleDateString(
                                "en-US",
                                { month: "short", day: "numeric" },
                              )}{" "}
                              -
                              {new Date(date.endDate).toLocaleDateString(
                                "en-US",
                                { month: "short", day: "numeric" },
                              )}
                            </div>
                            <div className="date-price">
                              {date.discountedPrice ? (
                                <>
                                  <span className="original-price-small">
                                    US${date.price.toLocaleString()}
                                  </span>
                                  <span className="discounted-price-large">
                                    US${date.discountedPrice.toLocaleString()}
                                  </span>
                                </>
                              ) : (
                                <span className="discounted-price-large">
                                  US${date.price.toLocaleString()}
                                </span>
                              )}
                            </div>
                            <button className="book-now-btn-small">
                              Book Now
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                  {tripData.departureDates.filter(
                    (d) => new Date(d.startDate) > new Date(),
                  ).length > 6 && (
                      <button className="view-all-dates-btn">
                        View All Dates →
                      </button>
                    )}
                </section>
              </div>
            )}

            {/* Essential Information Section */}
            {tripData.essentialInformation && (
              <div ref={essentialInfoRef}>
                <section className="section">
                  <h2 className="section-title">Essential Information</h2>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: tripData.essentialInformation,
                    }}
                    className="paragraph"
                  />
                </section>
              </div>
            )}

            {/* FAQs Section */}
            {tripData.faqs?.length > 0 && (
              <div ref={faqsRef}>
                <section className="section">
                  <h2 className="section-title">FAQs</h2>
                  <div className="faq-container">
                    {tripData.faqs.map((faq) => (
                      <details key={faq.id} className="faq-item">
                        <summary className="faq-question">
                          ❓ {faq.question}
                        </summary>
                        <div
                          dangerouslySetInnerHTML={{ __html: faq.answer }}
                          className="faq-answer"
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
                <section className="section">
                  <h2 className="section-title">Video Reviews</h2>
                  <div className="video-container">
                    <iframe
                      width="100%"
                      height="500"
                      src={tripData.videoReviewUrl.replace(
                        "watch?v=",
                        "embed/",
                      )}
                      title={`${tripData.name} Video`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="video-iframe"
                    ></iframe>
                  </div>
                </section>
              </div>
            )}

            {/* Customer Reviews Section - With Real Reviews from Backend */}
            <div className="reviews-section">
              <div className="reviews-header">
                <h2 className="reviews-title">Customer Reviews</h2>
                <p className="reviews-subtitle">
                  What our travelers say about their experience
                </p>
              </div>

              <div className="reviews-summary">
                <div className="rating-summary">
                  <div className="average-rating">
                    {reviewStats.averageRating.toFixed(1)}
                  </div>
                  <div className="review-stars">
                    {"★".repeat(Math.floor(reviewStats.averageRating))}
                    {reviewStats.averageRating % 1 !== 0 && "½"}
                    {"☆".repeat(5 - Math.ceil(reviewStats.averageRating))}
                  </div>
                  <div className="total-reviews">
                    Based on {reviewStats.totalReviews} verified reviews
                  </div>
                </div>
                <div className="rating-distribution">
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
                        className="distribution-bar"
                        onClick={() =>
                          setSelectedRating(
                            selectedRating === rating ? null : rating,
                          )
                        }
                      >
                        <span className="rating-label">{rating} ★</span>
                        <div className="bar-container">
                          <div
                            className="bar-fill"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="rating-count">{count}</span>
                        <span className="rating-percentage">
                          {percentage.toFixed(0)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="filter-chips">
                <button
                  onClick={() => setSelectedRating(null)}
                  className={`filter-chip ${!selectedRating ? "active" : ""}`}
                >
                  All Reviews
                </button>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <button
                    key={rating}
                    onClick={() =>
                      setSelectedRating(
                        selectedRating === rating ? null : rating,
                      )
                    }
                    className={`filter-chip ${selectedRating === rating ? "active" : ""}`}
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

              {/* Write a Review Button */}
              {/* <button
                className="write-review-button"
                // onClick={() => setShowReviewForm(!showReviewForm)}
                onClick={() => {
                  const token = localStorage.getItem("token");
                  if (!token) {
                    const currentUrl = window.location.pathname;
                    router.push(
                      `/user-login?redirect=${encodeURIComponent(currentUrl)}`,
                    );
                  } else {
                    setShowReviewForm(!showReviewForm);
                  }
                }}
              >
                ✍️ Write a Review
              </button>
              {!isAuthenticated && (
                <div className="login-prompt">
                  <p>
                    ✨ Want to share your experience?{" "}
                    <Link
                      href={`/user-login?redirect=${encodeURIComponent(window.location.pathname)}`}
                    >
                      Login to write a review
                    </Link>
                  </p>
                </div>
              )} */}

              <button
                className="write-review-button"
                onClick={() => setShowReviewForm(!showReviewForm)}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#e67e22",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  marginBottom: "20px",
                }}
              >
                ✍️ Write a Review
              </button>

              {/* Review Form */}
              {/* {showReviewForm && (
                <div className="review-form-container">
                  <h3>Share Your Experience</h3>
                  <form onSubmit={handleSubmitReview}>
                    <div className="form-group">
                      <label>Rating</label>
                      <div className="rating-input">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className={`star-btn ${star <= newReview.rating ? "active" : ""}`}
                            onClick={() =>
                              setNewReview({ ...newReview, rating: star })
                            }
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Title</label>
                      <input
                        type="text"
                        value={newReview.title}
                        onChange={(e) =>
                          setNewReview({ ...newReview, title: e.target.value })
                        }
                        placeholder="Summarize your experience"
                        required
                        maxLength={200}
                      />
                    </div>
                    <div className="form-group">
                      <label>Review</label>
                      <textarea
                        value={newReview.comment}
                        onChange={(e) =>
                          setNewReview({
                            ...newReview,
                            comment: e.target.value,
                          })
                        }
                        placeholder="Share your experience with this trek..."
                        rows={5}
                        required
                        maxLength={2000}
                      />
                    </div>
                    <div className="form-actions">
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                      >
                        Cancel
                      </button>
                      <button type="submit" disabled={isSubmittingReview}>
                        {isSubmittingReview ? "Submitting..." : "Submit Review"}
                      </button>
                    </div>
                  </form>
                </div>
              )} */}

              {showReviewForm && (
                <div className="review-form-container">
                  <h3>Share Your Experience</h3>
                  <form onSubmit={handleSubmitReview}>
                    <div className="form-group">
                      <label>Your Name (optional)</label>
                      <input
                        type="text"
                        value={newReview.userName}
                        onChange={(e) =>
                          setNewReview({
                            ...newReview,
                            userName: e.target.value,
                          })
                        }
                        placeholder="Enter your name"
                      />
                    </div>

                    <div className="form-group">
                      <label>Email Address *</label>
                      <input
                        type="email"
                        value={newReview.email}
                        onChange={(e) =>
                          setNewReview({ ...newReview, email: e.target.value })
                        }
                        placeholder="Enter your email"
                        required
                      />
                      <small
                        style={{
                          fontSize: "12px",
                          color: "#666",
                          marginTop: "4px",
                          display: "block",
                        }}
                      >
                        Your email won't be shared publicly
                      </small>
                    </div>

                    <div className="form-group">
                      <label>Rating *</label>
                      <div className="rating-input">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className={`star-btn ${star <= newReview.rating ? "active" : ""}`}
                            onClick={() =>
                              setNewReview({ ...newReview, rating: star })
                            }
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Title *</label>
                      <input
                        type="text"
                        value={newReview.title}
                        onChange={(e) =>
                          setNewReview({ ...newReview, title: e.target.value })
                        }
                        placeholder="Summarize your experience"
                        required
                        maxLength={200}
                      />
                    </div>

                    <div className="form-group">
                      <label>Your Review *</label>
                      <textarea
                        value={newReview.comment}
                        onChange={(e) =>
                          setNewReview({
                            ...newReview,
                            comment: e.target.value,
                          })
                        }
                        placeholder="Share your experience with this trek..."
                        rows={5}
                        required
                        maxLength={2000}
                      />
                    </div>

                    <div className="form-actions">
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        style={{
                          padding: "10px 20px",
                          backgroundColor: "#f0f0f0",
                          border: "1px solid #e0e0e0",
                          borderRadius: "6px",
                          cursor: "pointer",
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmittingReview}
                        style={{
                          padding: "10px 20px",
                          backgroundColor: "#e67e22",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          opacity: isSubmittingReview ? 0.7 : 1,
                        }}
                      >
                        {isSubmittingReview ? "Submitting..." : "Submit Review"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {displayedReviews.length > 0 ? (
                <>
                  <div className="reviews-list">
                    {displayedReviews.map((review) => (
                      <div key={review.id} className="review-card">
                        <div className="review-header">
                          <div className="reviewer-avatar">
                            {review.userAvatar ? (
                              <img
                                src={review.userAvatar}
                                alt={review.userName}
                                className="user-avatar-img"
                              />
                            ) : (
                              <div className="user-avatar-placeholder">
                                {review.userName.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="reviewer-info">
                            <div className="reviewer-name">
                              {review.userName}
                              {review.verified && (
                                <span className="verified-badge">
                                  ✓ Verified Traveler
                                </span>
                              )}
                            </div>
                            <div className="review-date">
                              {new Date(review.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                },
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="review-rating">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={`star ${star <= review.rating ? "filled" : "empty"}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <h3 className="review-title">{review.title}</h3>
                        <p className="review-comment">{review.comment}</p>
                        <div className="review-footer">
                          <button
                            className="helpful-button"
                            onClick={() => handleMarkHelpful(review.id)}
                          >
                            👍 Helpful ({review.helpful || 0})
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {filteredReviews.length > 3 && (
                    <button
                      onClick={() => setShowAllReviews(!showAllReviews)}
                      className="show-more-button"
                    >
                      {showAllReviews
                        ? "Show Less Reviews"
                        : `Show All ${filteredReviews.length} Reviews`}
                    </button>
                  )}
                </>
              ) : (
                <div className="no-reviews">
                  <p>No reviews yet. Be the first to share your experience!</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sticky Pricing Card */}
          <div className="right-column">
            <div
              ref={pricingCardRef}
              className={`pricing-card ${isPricingCardSticky ? "sticky" : ""}`}
              style={{
                top:
                  isPricingCardSticky && isNavSticky
                    ? `${navHeight + 20}px`
                    : "20px",
              }}
            >
              <div className="price-header">
                <span className="price-label">Price From</span>
                <div className="price-container">
                  {tripData.discountedPrice ? (
                    <>
                      <span className="original-price">
                        {formatPrice(tripData.price)}
                      </span>
                      <span className="discounted-price">
                        {formatPrice(tripData.discountedPrice)}
                      </span>
                    </>
                  ) : (
                    <span className="discounted-price">
                      {formatPrice(tripData.price)}
                    </span>
                  )}
                </div>
              </div>
              {savings && savings > 0 && (
                <div className="savings-container">
                  <span className="savings-label">You Save</span>
                  <span className="savings-amount">{formatPrice(savings)}</span>
                </div>
              )}
              {tripData.groupDiscounts &&
                tripData.groupDiscounts.length > 0 && (
                  <div className="group-discount-toggle">
                    <button
                      onClick={() => setShowGroupDiscount(!showGroupDiscount)}
                      className="group-discount-button"
                    >
                      GROUP DISCOUNT PRICE {showGroupDiscount ? "−" : "+"}
                    </button>
                    {showGroupDiscount && (
                      <div className="group-discount-content">
                        {tripData.groupDiscounts
                          .sort((a, b) => a.minTravelers - b.minTravelers)
                          .map((discount) => (
                            <div
                              key={discount.id}
                              className="group-discount-item"
                            >
                              <span className="group-size-text">
                                {discount.minTravelers}-{discount.maxTravelers}{" "}
                                pax
                              </span>
                              <span className="group-price-text">
                                {formatPrice(discount.pricePerPerson)}/pax
                              </span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                )}
              <div className="button-group">
                <button className="book-now-button">Book This Trip</button>
                <button
                  className="check-availability-button"
                  onClick={() => scrollToSection("dates")}
                >
                  Check Availability
                </button>
                <button className="send-inquiry-button">Send Inquiry</button>
                <button className="customize-button">Customize a Trip</button>
                <button className="download-button">Download a Brochure</button>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Modal */}
        {showGalleryModal && tripData.galleryImages && (
          <div className="modal-overlay" onClick={closeGalleryModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={closeGalleryModal}>
                ✕
              </button>
              <button className="modal-prev" onClick={prevImage}>
                ❮
              </button>
              <button className="modal-next" onClick={nextImage}>
                ❯
              </button>
              <div className="modal-image-wrapper">
                {tripData.galleryImages[currentModalImageIndex] && (
                  <Image
                    src={getFullImageUrl(
                      tripData.galleryImages[currentModalImageIndex].imageUrl,
                    )}
                    alt={
                      tripData.galleryImages[currentModalImageIndex]?.title ||
                      "Gallery image"
                    }
                    fill
                    className="modal-image"
                    unoptimized
                  />
                )}
              </div>
              <div className="modal-caption">
                {tripData.galleryImages[currentModalImageIndex]?.title && (
                  <h3 className="modal-title">
                    {tripData.galleryImages[currentModalImageIndex].title}
                  </h3>
                )}
                {tripData.galleryImages[currentModalImageIndex]
                  ?.description && (
                    <p className="modal-description">
                      {tripData.galleryImages[currentModalImageIndex].description}
                    </p>
                  )}
                <div className="modal-counter">
                  {currentModalImageIndex + 1} / {tripData.galleryImages.length}
                </div>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </>
  );
};

const styles = `
  .trip-details-container {
    width: 100%;
    margin: 0 auto;
    padding: 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    color: #333;
  }

  /* Loading and Error States */
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

  .error-container {
    text-align: center;
    padding: 100px 20px;
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
    cursor: pointer;
    border: none;
  }

  /* Hero Section */
  .hero-section {
    position: relative;
    margin-bottom: 30px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    height: 500px;
  }

  .hero-image-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .hero-image {
    object-fit: cover;
  }

  .hero-image-placeholder {
    width: 100%;
    height: 500px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f0f0f0;
    font-size: 64px;
  }

  .hero-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
    color: white;
    padding: 30px 30px 20px;
  }

  .hero-content {
    max-width: 800px;
  }

  .hero-title {
    font-size: 2.5rem;
    font-weight: bold;
    margin: 0 0 10px 0;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }

  .hero-badges {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
    flex-wrap: wrap;
  }

  .bestseller-badge {
    background-color: #e67e22;
    color: white;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: bold;
  }

  .topseller-badge {
    background-color: #27ae60;
    color: white;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: bold;
  }

  .guaranteed-badge {
    background-color: #3498db;
    color: white;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: bold;
  }

  /* Breadcrumb */
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

  /* Review Platforms Section */
  .review-platforms-section {
    margin-bottom: 30px;
    background-color: #fff;
    border-radius: 8px;
    padding: 12px 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  }

  .platforms-grid {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 24px;
    flex-wrap: wrap;
  }

  .platform-card {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    text-decoration: none;
    color: #333;
    font-size: 13px;
    transition: color 0.2s;
  }

  .platform-card:hover {
    color: #e67e22;
  }

  .platform-icon {
    font-size: 14px;
  }

  .platform-count {
    font-weight: bold;
    color: #e67e22;
    font-size: 14px;
  }

  .platform-text {
    color: #666;
  }

  /* Sticky Navigation */
  .sticky-nav {
    background-color: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 100;
    transition: top 0.3s ease;
    border-radius: 8px;
    margin-bottom: 30px;
    width: 100%;
    position: relative;
    top: -100px;
  }

  .sticky-nav.sticky {
    position: sticky;
    top: 0;
  }

  .nav-container {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    padding: 12px 16px;
    justify-content: center;
    align-items: center;
  }

  .nav-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background-color: transparent;
    border: none;
    border-radius: 30px;
    font-size: 13px;
    font-weight: 500;
    color: #666;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    flex: 0 0 auto;
  }

  .nav-button:hover {
    background-color: #f5f5f5;
    color: #e67e22;
  }

  .nav-button.active {
    background-color: #e67e22;
    color: white;
  }

  .nav-button.active:hover {
    background-color: #d35400;
  }

  .nav-icon {
    font-size: 16px;
  }

  .nav-label {
    font-size: 14px;
  }

  /* Main Layout */
  .main-layout {
    display: flex;
    gap: 30px;
    position: relative;
    max-width: 1400px;
    margin: 0 auto;
  }

  .main-content {
    flex: 1;
    min-width: 0;
  }

  .right-column {
    width: 320px;
    flex-shrink: 0;
  }

  /* Facts Grid */
  .facts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 15px;
    background-color: #f8f9fa;
    padding: 25px;
    border-radius: 12px;
    margin-bottom: 40px;
  }

  .fact-item {
    display: flex;
    flex-direction: column;
  }

  .fact-label {
    font-size: 0.8rem;
    color: #7f8c8d;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 5px;
  }

  .fact-value {
    font-size: 1rem;
    font-weight: bold;
    color: #2c3e50;
  }

  /* Pricing Card */
  .pricing-card-placeholder {
    height: auto;
  }

  .pricing-card {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    padding: 20px;
    margin-bottom: 20px;
    transition: all 0.3s ease;
  }

  .pricing-card.sticky {
    position: sticky;
  }

  .price-header {
    margin-bottom: 15px;
  }

  .price-label {
    font-size: 14px;
    color: #7f8c8d;
    display: block;
    margin-bottom: 5px;
  }

  .price-container {
    display: flex;
    align-items: baseline;
    gap: 10px;
  }

  .original-price {
    font-size: 18px;
    color: #95a5a6;
    text-decoration: line-through;
  }

  .discounted-price {
    font-size: 28px;
    font-weight: bold;
    color: #e67e22;
  }

  .savings-container {
    background-color: #f0f9f0;
    padding: 10px;
    border-radius: 8px;
    margin-bottom: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .savings-label {
    font-size: 14px;
    color: #27ae60;
    font-weight: 500;
  }

  .savings-amount {
    font-size: 18px;
    font-weight: bold;
    color: #27ae60;
  }

  .group-discount-toggle {
    margin-bottom: 20px;
    border-top: 1px solid #e0e0e0;
    padding-top: 15px;
  }

  .group-discount-button {
    width: 100%;
    padding: 12px;
    background-color: #f8f9fa;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
    font-weight: bold;
    color: #2c3e50;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.2s;
  }

  .group-discount-button:hover {
    background-color: #e67e22;
    color: white;
    border-color: #e67e22;
  }

  .group-discount-content {
    margin-top: 10px;
    padding: 10px;
    background-color: #f8f9fa;
    border-radius: 8px;
  }

  .group-discount-item {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #e0e0e0;
  }

  .group-discount-item:last-child {
    border-bottom: none;
  }

  .group-size-text {
    font-size: 13px;
    color: #2c3e50;
  }

  .group-price-text {
    font-size: 14px;
    font-weight: bold;
    color: #e67e22;
  }

  .button-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .book-now-button {
    padding: 12px;
    background-color: #e67e22;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .book-now-button:hover {
    background-color: #d35400;
  }

  .check-availability-button {
    padding: 12px;
    background-color: white;
    color: #e67e22;
    border: 1px solid #e67e22;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .check-availability-button:hover {
    background-color: #e67e22;
    color: white;
  }

  .send-inquiry-button,
  .customize-button,
  .download-button {
    padding: 12px;
    background-color: white;
    color: #2c3e50;
    border: 1px solid #bdc3c7;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .send-inquiry-button:hover,
  .customize-button:hover,
  .download-button:hover {
    border-color: #e67e22;
    color: #e67e22;
  }

  /* Sections */
  .section {
    margin-bottom: 50px;
    scroll-margin-top: 80px;
  }

  .section-title {
    font-size: 1.8rem;
    font-weight: bold;
    color: #2c3e50;
    border-bottom: 3px solid #e67e22;
    padding-bottom: 10px;
    margin-bottom: 25px;
  }

  .paragraph {
    line-height: 1.8;
    font-size: 1rem;
    color: #444;
  }

  /* Gallery */
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
    margin-top: 20px;
  }

  .gallery-item {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s, box-shadow 0.2s;
    background-color: #fff;
    cursor: pointer;
    aspect-ratio: 4/3;
  }

  .gallery-item:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }

  .gallery-image-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .gallery-image {
    object-fit: cover;
    transition: transform 0.3s;
  }

  .gallery-item:hover .gallery-image {
    transform: scale(1.05);
  }

  .gallery-featured-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    background-color: #e67e22;
    color: white;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: bold;
    z-index: 2;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .gallery-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
    padding: 15px;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .gallery-item:hover .gallery-overlay {
    opacity: 1;
  }

  .gallery-title {
    margin: 0;
    font-size: 14px;
    font-weight: bold;
    color: white;
    margin-bottom: 5px;
  }

  .gallery-description {
    margin: 0;
    font-size: 12px;
    color: #f0f0f0;
    line-height: 1.4;
  }

  .gallery-more-item {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    aspect-ratio: 4/3;
    transition: transform 0.2s;
  }

  .gallery-more-item:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }

  .gallery-more-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 2;
  }

  .gallery-more-text {
    font-size: 36px;
    font-weight: bold;
    color: white;
    margin-bottom: 8px;
  }

  .gallery-more-sub-text {
    font-size: 14px;
    color: white;
    opacity: 0.9;
  }

  .gallery-more-image {
    object-fit: cover;
    filter: brightness(0.7);
  }

  .view-all-button {
    margin-top: 20px;
    padding: 10px 24px;
    background-color: transparent;
    border: 2px solid #e67e22;
    border-radius: 8px;
    color: #e67e22;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;
    width: 100%;
    max-width: 200px;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }

  .view-all-button:hover {
    background-color: #e67e22;
    color: white;
  }

  /* Itinerary */
  .itinerary-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .itinerary-day {
    background-color: #f9f9f9;
    border-radius: 12px;
    padding: 0;
    transition: all 0.3s;
    cursor: pointer;
    border: 1px solid #e0e0e0;
    overflow: hidden;
  }

  .itinerary-day-header {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 18px 20px;
    background-color: #fff;
    transition: background-color 0.2s;
    cursor: pointer;
    position: relative;
  }

  .itinerary-day-header:hover {
    background-color: #f8f9fa;
  }

  .itinerary-day-number {
    display: inline-block;
    background-color: #e67e22;
    color: white;
    padding: 5px 14px;
    border-radius: 25px;
    font-size: 14px;
    font-weight: bold;
    min-width: 70px;
    text-align: center;
  }

  .itinerary-day-title {
    font-size: 1.1rem;
    font-weight: bold;
    color: #2c3e50;
    margin: 0;
    flex: 1;
  }

  .itinerary-toggle-icon {
    font-size: 20px;
    font-weight: bold;
    color: #e67e22;
    transition: transform 0.3s ease;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .itinerary-toggle-icon.open {
    transform: rotate(45deg);
  }

  .itinerary-day-content {
    padding: 0 20px 20px 20px;
    border-top: 1px solid #e0e0e0;
    background-color: #fff;
  }

  .itinerary-day-description {
    line-height: 1.8;
    color: #666;
    margin-bottom: 15px;
    margin-top: 15px;
  }

  .itinerary-details {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px dashed #e0e0e0;
  }

  .itinerary-detail {
    font-size: 0.85rem;
    color: #888;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  /* Route Map - Fixed */
  .map-container {
    width: 100%;
    background-color: #f8f9fa;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .map-image {
    width: 100%;
    height: auto;
    object-fit: contain;
  }

  /* Cost Details */
  .cost-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
  }

  .sub-title {
    font-size: 1.3rem;
    font-weight: bold;
    color: #2c3e50;
    margin-bottom: 15px;
  }

  .list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .list-item {
    padding: 8px 0;
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 14px;
    color: #555;
    border-bottom: 1px solid #f0f0f0;
  }

  .include-icon {
    color: #27ae60;
    font-weight: bold;
    flex-shrink: 0;
  }

  .exclude-icon {
    color: #e74c3c;
    font-weight: bold;
    flex-shrink: 0;
  }

  .category-badge {
    display: inline-block;
    background-color: #f0f0f0;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 11px;
    margin-left: 8px;
    color: #666;
  }

  /* Dates Cards */
  .dates-cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
    margin-top: 20px;
  }

  .date-card {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    border: 1px solid #f0f0f0;
  }

  .date-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  }

  .date-card-header {
    background: linear-gradient(135deg, #e67e22 0%, #f39c12 100%);
    padding: 20px;
    text-align: center;
    color: white;
    display: flex;
    justify-content: center;
    align-items: baseline;
    gap: 8px;
  }

  .date-month {
    font-size: 18px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .date-day {
    font-size: 36px;
    font-weight: bold;
    line-height: 1;
  }

  .date-year {
    font-size: 14px;
    opacity: 0.9;
  }

  .date-card-body {
    padding: 20px;
  }

  .date-range {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #2c3e50;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px dashed #e0e0e0;
  }

  .date-price {
    margin-bottom: 15px;
  }

  .original-price-small {
    text-decoration: line-through;
    color: #95a5a6;
    font-size: 13px;
    margin-right: 10px;
  }

  .discounted-price-large {
    font-size: 24px;
    font-weight: bold;
    color: #e67e22;
  }

  .date-badges {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }

  .guaranteed-badge-card {
    background-color: #3498db;
    color: white;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
  }

  .bestseller-badge-card {
    background-color: #e67e22;
    color: white;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
  }

  .book-now-btn-small {
    width: 100%;
    padding: 10px;
    background-color: #e67e22;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .book-now-btn-small:hover {
    background-color: #d35400;
    transform: translateY(-2px);
  }

  .view-all-dates-btn {
    margin-top: 20px;
    padding: 12px 24px;
    background-color: transparent;
    border: 2px solid #e67e22;
    border-radius: 30px;
    color: #e67e22;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }

  .view-all-dates-btn:hover {
    background-color: #e67e22;
    color: white;
  }

  /* FAQ */
  .faq-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .faq-item {
    background-color: #f9f9f9;
    border-radius: 12px;
    border: 1px solid #e0e0e0;
    overflow: hidden;
  }

  .faq-question {
    padding: 18px 20px;
    font-weight: bold;
    color: #2c3e50;
    cursor: pointer;
    transition: background-color 0.2s;
    font-size: 16px;
  }

  .faq-question:hover {
    background-color: #f0f0f0;
  }

  .faq-answer {
    padding: 0 20px 20px 20px;
    color: #666;
    line-height: 1.6;
    border-top: 1px solid #e0e0e0;
  }

  /* Video */
  .video-container {
    position: relative;
    width: 100%;
    padding-bottom: 56.25%;
    height: 0;
    overflow: hidden;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .video-iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  /* Customer Reviews - Improved */
  .reviews-section {
    margin-top: 50px;
    padding: 30px;
    background-color: #f8f9fa;
    border-radius: 16px;
  }

  .reviews-header {
    text-align: center;
    margin-bottom: 30px;
  }

  .reviews-title {
    font-size: 1.8rem;
    font-weight: bold;
    color: #2c3e50;
    margin-bottom: 10px;
  }

  .reviews-subtitle {
    color: #7f8c8d;
    font-size: 14px;
  }

  .reviews-summary {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 30px;
    background-color: white;
    padding: 25px;
    border-radius: 12px;
    margin-bottom: 30px;
  }

  .rating-summary {
    text-align: center;
    padding: 20px;
    border-right: 1px solid #e0e0e0;
  }

  .average-rating {
    font-size: 48px;
    font-weight: bold;
    color: #e67e22;
    margin-bottom: 10px;
  }

  .review-stars {
    color: #f39c12;
    font-size: 20px;
    margin-bottom: 10px;
  }

  .total-reviews {
    color: #7f8c8d;
    font-size: 13px;
  }

  .rating-distribution {
    padding: 10px;
  }

  .distribution-bar {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .distribution-bar:hover {
    opacity: 0.8;
  }

  .rating-label {
    width: 45px;
    font-size: 14px;
    font-weight: 500;
    color: #2c3e50;
  }

  .bar-container {
    flex: 1;
    height: 8px;
    background-color: #e0e0e0;
    border-radius: 4px;
    overflow: hidden;
  }

  .bar-fill {
    height: 100%;
    background-color: #e67e22;
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  .rating-count {
    width: 40px;
    font-size: 13px;
    color: #7f8c8d;
  }

  .rating-percentage {
    width: 45px;
    font-size: 13px;
    font-weight: 500;
    color: #2c3e50;
  }

  .filter-chips {
    display: flex;
    gap: 10px;
    margin-bottom: 25px;
    flex-wrap: wrap;
  }

  .filter-chip {
    padding: 6px 14px;
    background-color: white;
    border: 1px solid #e0e0e0;
    border-radius: 20px;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
    color: #666;
  }

  .filter-chip:hover {
    border-color: #e67e22;
    color: #e67e22;
  }

  .filter-chip.active {
    background-color: #e67e22;
    color: white;
    border-color: #e67e22;
  }

  .reviews-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 25px;
  }

  .review-card {
    background-color: white;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .review-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }

  .review-header {
    display: flex;
    gap: 15px;
    margin-bottom: 15px;
  }

  .reviewer-avatar {
    flex-shrink: 0;
  }

  .user-avatar-img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
  }

  .user-avatar-placeholder {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #e67e22;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 20px;
    font-weight: bold;
  }

  .reviewer-info {
    flex: 1;
  }

  .reviewer-name {
    font-weight: bold;
    color: #2c3e50;
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .verified-badge {
    background-color: #27ae60;
    color: white;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: normal;
  }

  .review-date {
    color: #95a5a6;
    font-size: 12px;
  }

  .review-rating {
    margin-bottom: 12px;
  }

  .star {
    font-size: 18px;
    margin-right: 2px;
  }

  .star.filled {
    color: #f39c12;
  }

  .star.empty {
    color: #e0e0e0;
  }

  .review-title {
    font-size: 18px;
    font-weight: bold;
    color: #2c3e50;
    margin-bottom: 12px;
  }

  .review-comment {
    color: #666;
    line-height: 1.6;
    margin-bottom: 15px;
  }

  .review-footer {
    display: flex;
    justify-content: flex-end;
  }

  .helpful-button {
    background: none;
    border: none;
    color: #7f8c8d;
    font-size: 13px;
    cursor: pointer;
    padding: 5px 10px;
    border-radius: 6px;
    transition: all 0.2s;
  }

  .helpful-button:hover {
    background-color: #f0f0f0;
    color: #e67e22;
  }

  .show-more-button {
    width: 100%;
    padding: 12px;
    background-color: transparent;
    border: 2px solid #e67e22;
    border-radius: 8px;
    color: #e67e22;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;
  }

  .show-more-button:hover {
    background-color: #e67e22;
    color: white;
  }

  .no-reviews {
    text-align: center;
    padding: 40px;
    color: #95a5a6;
  }

  /* Gallery Modal - Fixed */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.95);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.3s ease;
  }

  .modal-content {
    position: relative;
    max-width: 90vw;
    max-height: 90vh;
    background-color: #000;
    border-radius: 12px;
    overflow: hidden;
  }

  .modal-image-wrapper {
    position: relative;
    width: 80vw;
    height: 70vh;
  }

  .modal-image {
    object-fit: contain;
  }

  .modal-close,
  .modal-prev,
  .modal-next {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    border: none;
    border-radius: 50%;
    width: 44px;
    height: 44px;
    font-size: 24px;
    cursor: pointer;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
  }

  .modal-close {
    top: 20px;
    right: 20px;
  }

  .modal-prev {
    top: 50%;
    left: 20px;
    transform: translateY(-50%);
  }

  .modal-next {
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
  }

  .modal-close:hover,
  .modal-prev:hover,
  .modal-next:hover {
    background-color: #e67e22;
  }

  .modal-caption {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 15px;
    text-align: center;
  }

  .modal-title {
    font-size: 16px;
    font-weight: bold;
    margin: 0 0 5px 0;
  }

  .modal-description {
    font-size: 14px;
    margin: 0 0 5px 0;
    opacity: 0.9;
  }

  .modal-counter {
    font-size: 12px;
    opacity: 0.7;
    margin-top: 5px;
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .main-layout {
      flex-direction: column;
    }

    .right-column {
      width: 100%;
    }

    .pricing-card {
      position: relative;
      top: auto !important;
    }

    .reviews-summary {
      grid-template-columns: 1fr;
    }

    .rating-summary {
      border-right: none;
      border-bottom: 1px solid #e0e0e0;
    }
  }

  @media (max-width: 768px) {
    .trip-details-container {
      padding: 10px;
    }

    .hero-title {
      font-size: 1.8rem;
    }

    .hero-section {
      height: 300px;
    }

    .nav-container {
      overflow-x: auto;
      justify-content: flex-start;
      padding: 10px;
    }

    .nav-button {
      padding: 6px 10px;
      font-size: 12px;
    }

    .nav-label {
      font-size: 12px;
    }

    .facts-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .section-title {
      font-size: 1.5rem;
    }

    .gallery-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .dates-cards-grid {
      grid-template-columns: 1fr;
    }

    .discounted-price-large {
      font-size: 20px;
    }

    .modal-image-wrapper {
      width: 95vw;
      height: 60vh;
    }
  }
    /* Write Review Button */
  .write-review-button {
    width: 100%;
    padding: 12px;
    background-color: #e67e22;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 20px;
    transition: all 0.2s;
  }
  
  .write-review-button:hover {
    background-color: #d35400;
  }
  
  /* Review Form */
  .review-form-container {
    background-color: white;
    padding: 25px;
    border-radius: 12px;
    margin-bottom: 30px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
  
  .review-form-container h3 {
    margin-bottom: 20px;
    color: #2c3e50;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #2c3e50;
  }
  
  .rating-input {
    display: flex;
    gap: 10px;
  }
  
  .star-btn {
    font-size: 24px;
    background: none;
    border: none;
    cursor: pointer;
    color: #e0e0e0;
    transition: color 0.2s;
  }
  
  .star-btn.active {
    color: #f39c12;
  }
  
  .star-btn:hover {
    color: #f39c12;
  }
  
  .form-group input,
  .form-group textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    font-size: 14px;
    font-family: inherit;
  }
  
  .form-group input:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #e67e22;
  }
  
  .form-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }
  
  .form-actions button {
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
  }
  
  .form-actions button:first-child {
    background-color: #f0f0f0;
    border: 1px solid #e0e0e0;
    color: #666;
  }
  
  .form-actions button:first-child:hover {
    background-color: #e0e0e0;
  }
  
  .form-actions button:last-child {
    background-color: #e67e22;
    border: none;
    color: white;
  }
  
  .form-actions button:last-child:hover {
    background-color: #d35400;
  }
  
  .form-actions button:last-child:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export default TripDetailsPage;
