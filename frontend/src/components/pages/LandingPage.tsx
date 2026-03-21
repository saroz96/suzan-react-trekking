// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// interface LandingPageProps {
//   onKnowMoreClick?: () => void;
// }

// const LandingPage: React.FC<LandingPageProps> = () => {
//   const navigate = useNavigate();
//   const [searchQuery, setSearchQuery] = useState("");

//   // Handle search
//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
//     }
//   };

//   // Hero images - one large, two smaller in a single row
//   const heroImages = [
//     {
//       url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&h=800&fit=crop",
//       alt: "Everest Base Camp Trek",
//     },
//     {
//       url: "https://t3.ftcdn.net/jpg/03/09/46/88/360_F_309468860_TWLq9Bi0wtVcuJEtQHiXtg1eCRlHcVyv.jpg",
//       alt: "Annapurna Circuit Trek",
//     },
//     {
//       url: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=800&fit=crop",
//       alt: "Langtang Valley Trek",
//     },
//   ];

//   return (
//     <div style={styles.landingPage}>
//       {/* Hero Section */}
//       <div style={styles.heroSection}>
//         <div style={styles.heroContainer}>
//           {/* Left Side - Text Content */}
//           <div style={styles.heroLeftContent}>
//             <span>Expert Guidance & Custom Plans</span>
//             <h1 style={styles.heroTitle}>
//               Discover Your Path in the Himalayas
//             </h1>
//             {/* Search Input */}
//             <form onSubmit={handleSearch} style={styles.searchForm}>
//               <div style={styles.searchWrapper}>
//                 <input
//                   type="text"
//                   placeholder="Search treks, destinations, or activities..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   style={styles.searchInput}
//                 />
//                 <button type="submit" style={styles.searchButton}>
//                   <svg
//                     width="20"
//                     height="20"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                   >
//                     <circle cx="11" cy="11" r="8" />
//                     <line x1="21" y1="21" x2="16.65" y2="16.65" />
//                   </svg>
//                 </button>
//               </div>
//             </form>
//           </div>

//           {/* Right Side - 3 Images in a Single Row */}
//           <div style={styles.heroImagesRow}>
//             {/* Two Small Images - Side by Side in a Row */}
//             <div style={styles.smallImagesRow}>
//               {heroImages.slice(1).map((image, index) => (
//                 <div key={index} style={styles.heroImageCardSmall}>
//                   <img
//                     src={image.url}
//                     alt={image.alt}
//                     style={styles.heroImage}
//                   />
//                   <div style={styles.heroImageOverlay}>
//                     <span style={styles.heroImageTitle}>{image.title}</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             {/* Large Image */}
//             <div style={styles.largeImageWrapper}>
//               <div style={styles.heroImageCard}>
//                 <img
//                   src={heroImages[0].url}
//                   alt={heroImages[0].alt}
//                   style={styles.heroImage}
//                 />
//                 <div style={styles.heroImageOverlay}>
//                   <span style={styles.heroImageTitle}>
//                     {heroImages[0].title}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* About & Why Choose Us Section */}
//       <div style={styles.aboutWhySection}>
//         <div style={styles.container}>
//           <div style={styles.twoColumnGrid}>
//             {/* Left Column - About Alpine Ramble */}
//             <div style={styles.aboutColumn}>
//               <h2 style={styles.aboutTitle}>About Alpine Ramble</h2>
//               <p style={styles.aboutDescription}>
//                 Alpine Ramble Treks prides itself on being the leading trekking
//                 and adventure company in Nepal's travel and tourism industry. We
//                 are a Kathmandu-based team of passionate trekking enthusiasts
//                 who have been operating exciting and rewarding tours in Nepal,
//                 Tibet, and Bhutan for more than a decade. We can also arrange
//                 jungle safaris, mountaineering expeditions, paragliding
//                 excursions, and private tours of colorful cities like Kathmandu,
//                 Lhasa, and Thimphu.
//               </p>
//               <p style={styles.aboutDescription}>
//                 No matter where you choose to go, Alpine Ramble Treks is
//                 committed to ensuring that you receive the best service in the
//                 field. Our management team, guides, and porters are trained
//                 according to the highest principles of safety, and our
//                 organization is fully registered with both the Nepali government
//                 and a range of respected local and international trekking
//                 associations. Ensuring that each of our guests enjoys a fun,
//                 safe, and unforgettable adventure.
//               </p>
//             </div>

//             {/* Right Column - Why Choose Us Header */}
//             <div style={styles.whyChooseColumn}>
//               <div style={styles.whyChooseHeader}>
//                 <span style={styles.whyChooseBadge}>
//                   Trusted, experienced, and dedicated
//                 </span>
//                 <h2 style={styles.whyChooseTitle}>
//                   Here's why millions of travelers choose us with confidence:
//                 </h2>
//                 <p style={styles.whyChooseSubtitle}>
//                   We turn journeys into unforgettable memories.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   landingPage: {
//     fontFamily: "Arial, sans-serif",
//     backgroundColor: "#DDF4FC", // Updated background color
//   },
//   container: {
//     maxWidth: "1200px",
//     margin: "0 auto",
//     padding: "0 20px",
//   },
//   // Hero Section
//   heroSection: {
//     minHeight: "85vh",
//     backgroundColor: "#DDF4FC", // Updated background color
//   },
//   // Hero Container
//   heroContainer: {
//     display: "flex",
//     maxWidth: "1400px",
//     margin: "0 auto",
//     minHeight: "85vh",
//     alignItems: "center",
//     gap: "50px",
//   },
//   // Left Side Content
//   heroLeftContent: {
//     flex: "0 0 10%",
//     padding: "10px",
//     paddingLeft: "20px",
//     zIndex: 2,
//   },
//   heroBadge: {
//     display: "inline-block",
//     backgroundColor: "rgba(230, 126, 34, 0.9)",
//     padding: "6px 18px",
//     borderRadius: "40px",
//     fontSize: "12px",
//     fontWeight: "500",
//     letterSpacing: "1px",
//     marginBottom: "20px",
//     color: "white",
//   },
//   heroTitle: {
//     fontSize: "52px",
//     fontWeight: "bold",
//     color: "#2c3e50", // Changed from white to dark color for better contrast on light background
//     marginBottom: "15px",
//     lineHeight: "1.2",
//     textShadow: "none",
//   },
//   heroSubtitle: {
//     fontSize: "18px",
//     color: "#555", // Changed from white to dark color for better contrast
//     marginBottom: "35px",
//   },
//   // Search Form
//   searchForm: {
//     width: "100%",
//   },
//   searchWrapper: {
//     display: "flex",
//     backgroundColor: "white",
//     borderRadius: "50px",
//     overflow: "hidden",
//     boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
//     width: "100%",
//   },
//   searchInput: {
//     flex: 1,
//     padding: "16px 24px",
//     border: "none",
//     fontSize: "15px",
//     outline: "none",
//     borderRadius: "50px 0 0 50px",
//     "::placeholder": {
//       color: "#999",
//     },
//   },
//   searchButton: {
//     padding: "16px 32px",
//     backgroundColor: "#e67e22",
//     color: "white",
//     border: "none",
//     fontSize: "15px",
//     fontWeight: "bold",
//     cursor: "pointer",
//     transition: "background-color 0.2s",
//     borderRadius: "0 50px 50px 0",
//     whiteSpace: "nowrap" as const,
//     ":hover": {
//       backgroundColor: "#d35400",
//     },
//   },
//   // Right Side - 3 Images in a Single Row
//   heroImagesRow: {
//     flex: "0 0 60%",
//     display: "flex",
//     gap: "10px",
//     alignItems: "stretch",
//   },
//   // Large Image Wrapper (takes 50% of the row)
//   largeImageWrapper: {
//     flex: "0 0 48%",
//   },
//   heroImageCard: {
//     position: "relative" as const,
//     borderRadius: "16px",
//     overflow: "hidden",
//     boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
//     height: "100%",
//     minHeight: "450px",
//   },
//   // Small Images Row - Side by Side Horizontally
//   smallImagesRow: {
//     flex: "0 0 65%",
//     display: "flex",
//     gap: "10px",
//     flexDirection: "row" as const,
//   },
//   heroImageCardSmall: {
//     position: "relative" as const,
//     borderRadius: "16px",
//     overflow: "hidden",
//     boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
//     flex: 1,
//     minHeight: "450px",
//   },
//   heroImage: {
//     width: "100%",
//     height: "100%",
//     objectFit: "cover" as const,
//     transition: "transform 0.4s ease",
//     ":hover": {
//       transform: "scale(1.05)",
//     },
//   },
//   heroImageOverlay: {
//     position: "absolute" as const,
//     bottom: 0,
//     left: 0,
//     right: 0,
//     background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
//     padding: "15px",
//   },
//   heroImageTitle: {
//     color: "white",
//     fontSize: "14px",
//     fontWeight: "bold",
//     textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
//   },
//   // About & Why Choose Section
//   aboutWhySection: {
//     padding: "80px 0",
//     backgroundColor: "#DDF4FC", // Updated background color
//   },
//   twoColumnGrid: {
//     display: "grid",
//     gridTemplateColumns: "1fr 1fr",
//     gap: "50px",
//     alignItems: "start",
//   },
//   aboutColumn: {
//     paddingRight: "20px",
//   },
//   aboutTitle: {
//     fontSize: "32px",
//     fontWeight: "bold",
//     color: "#2c3e50",
//     marginBottom: "25px",
//     position: "relative" as const,
//     paddingBottom: "12px",
//     ":after": {
//       content: "''",
//       position: "absolute",
//       bottom: 0,
//       left: 0,
//       width: "60px",
//       height: "3px",
//       backgroundColor: "#e67e22",
//     },
//   },
//   aboutDescription: {
//     fontSize: "15px",
//     lineHeight: "1.7",
//     color: "#555",
//     marginBottom: "18px",
//   },
//   whyChooseColumn: {
//     paddingLeft: "20px",
//     borderLeft: "2px solid #f0f0f0",
//   },
//   whyChooseHeader: {
//     textAlign: "left" as const,
//   },
//   whyChooseBadge: {
//     display: "inline-block",
//     color: "#e67e22",
//     fontSize: "13px",
//     fontWeight: "600",
//     textTransform: "uppercase" as const,
//     letterSpacing: "1px",
//     marginBottom: "15px",
//   },
//   whyChooseTitle: {
//     fontSize: "32px",
//     fontWeight: "bold",
//     color: "#2c3e50",
//     marginBottom: "15px",
//     lineHeight: "1.3",
//   },
//   whyChooseSubtitle: {
//     fontSize: "17px",
//     color: "#666",
//     fontStyle: "italic",
//   },
// };

// // Add responsive styles
// const styleSheet = document.createElement("style");
// styleSheet.textContent = `
//   @keyframes spin {
//     0% { transform: rotate(0deg); }
//     100% { transform: rotate(360deg); }
//   }

//   @media (max-width: 1024px) {
//     .hero-container {
//       flex-direction: column !important;
//       padding: 40px 0 !important;
//       gap: 30px !important;
//     }
//     .hero-left-content {
//       flex: 0 0 100% !important;
//       text-align: center !important;
//       padding: 40px !important;
//       width: 100% !important;
//     }
//     .hero-title {
//       font-size: 42px !important;
//     }
//     .hero-subtitle {
//       font-size: 16px !important;
//     }
//     .search-form {
//       margin: 0 auto !important;
//       max-width: 90% !important;
//     }
//     .hero-images-row {
//       flex: 0 0 100% !important;
//       flex-direction: column !important;
//       padding: 0 20px !important;
//     }
//     .large-image-wrapper {
//       flex: 0 0 100% !important;
//     }
//     .hero-image-card {
//       min-height: 350px !important;
//     }
//     .small-images-row {
//       flex: 0 0 100% !important;
//       flex-direction: row !important;
//     }
//     .hero-image-card-small {
//       min-height: 250px !important;
//     }
//     .two-column-grid {
//       grid-template-columns: 1fr !important;
//       gap: 40px !important;
//     }
//     .about-column {
//       padding-right: 0 !important;
//     }
//     .why-choose-column {
//       padding-left: 0 !important;
//       border-left: none !important;
//       border-top: 2px solid #f0f0f0 !important;
//       padding-top: 35px !important;
//     }
//   }

//   @media (max-width: 768px) {
//     .hero-section {
//       min-height: auto !important;
//     }
//     .hero-title {
//       font-size: 32px !important;
//     }
//     .hero-badge {
//       font-size: 10px !important;
//       padding: 5px 12px !important;
//     }
//     .hero-left-content {
//       padding: 30px 20px !important;
//     }
//     .hero-image-card {
//       min-height: 280px !important;
//     }
//     .small-images-row {
//       flex-direction: column !important;
//     }
//     .hero-image-card-small {
//       min-height: 200px !important;
//     }
//     .search-wrapper {
//       flex-direction: column !important;
//       border-radius: 12px !important;
//     }
//     .search-input {
//       border-radius: 12px 12px 0 0 !important;
//       text-align: center !important;
//       padding: 12px 18px !important;
//     }
//     .search-button {
//       border-radius: 0 0 12px 12px !important;
//       padding: 12px !important;
//     }
//     .about-title {
//       font-size: 26px !important;
//     }
//     .why-choose-title {
//       font-size: 26px !important;
//     }
//   }
// `;
// document.head.appendChild(styleSheet);

// export default LandingPage;

//----------------------------------------------------end

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface LandingPageProps {
  onKnowMoreClick?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Hero images - one large, two smaller in a single row
  const heroImages = [
    {
      url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&h=800&fit=crop",
      alt: "Everest Base Camp Trek",
      title: "Everest Region",
    },
    {
      url: "https://t3.ftcdn.net/jpg/03/09/46/88/360_F_309468860_TWLq9Bi0wtVcuJEtQHiXtg1eCRlHcVyv.jpg",
      alt: "Annapurna Circuit Trek",
      title: "Annapurna Region",
    },
    {
      url: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=800&fit=crop",
      alt: "Langtang Valley Trek",
      title: "Langtang Region",
    },
  ];

  return (
    <div style={styles.landingPage}>
      {/* Hero Section */}
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
              Join thousands of adventurers who have experienced the magic of
              the Himalayas with our expert local guides. From Everest Base Camp
              to hidden mountain valleys, we craft unforgettable journeys
              tailored just for you.
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
              {heroImages.slice(1).map((image, index) => (
                <div key={index} style={styles.heroImageCardSmall}>
                  <img
                    src={image.url}
                    alt={image.alt}
                    style={styles.heroImage}
                  />
                  <div style={styles.heroImageOverlay}>
                    <span style={styles.heroImageTitle}>{image.title}</span>
                    <span style={styles.heroImageSubtitle}>View Treks →</span>
                  </div>
                </div>
              ))}
            </div>
            {/* Large Image */}
            <div style={styles.largeImageWrapper}>
              <div style={styles.heroImageCard}>
                <img
                  src={heroImages[0].url}
                  alt={heroImages[0].alt}
                  style={styles.heroImage}
                />
                <div style={styles.heroImageOverlay}>
                  <span style={styles.heroImageTitle}>
                    {heroImages[0].title}
                  </span>
                  <span style={styles.heroImageSubtitle}>Most Popular →</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About & Why Choose Us Section */}
      <div style={styles.aboutWhySection}>
        <div style={styles.container}>
          <div style={styles.twoColumnGrid}>
            {/* Left Column - About Alpine Ramble */}
            <div style={styles.aboutColumn}>
              <h2 style={styles.aboutTitle}>About Alpine Ramble</h2>
              <p style={styles.aboutDescription}>
                Alpine Ramble Treks prides itself on being the leading trekking
                and adventure company in Nepal's travel and tourism industry. We
                are a Kathmandu-based team of passionate trekking enthusiasts
                who have been operating exciting and rewarding tours in Nepal,
                Tibet, and Bhutan for more than a decade. We can also arrange
                jungle safaris, mountaineering expeditions, paragliding
                excursions, and private tours of colorful cities like Kathmandu,
                Lhasa, and Thimphu.
              </p>
              <p style={styles.aboutDescription}>
                No matter where you choose to go, Alpine Ramble Treks is
                committed to ensuring that you receive the best service in the
                field. Our management team, guides, and porters are trained
                according to the highest principles of safety, and our
                organization is fully registered with both the Nepali government
                and a range of respected local and international trekking
                associations. Ensuring that each of our guests enjoys a fun,
                safe, and unforgettable adventure.
              </p>
            </div>

            {/* Right Column - Why Choose Us Header */}
            <div style={styles.whyChooseColumn}>
              <div style={styles.whyChooseHeader}>
                <span style={styles.whyChooseBadge}>
                  Trusted, experienced, and dedicated
                </span>
                <h2 style={styles.whyChooseTitle}>
                  Here's why millions of travelers choose us with confidence:
                </h2>
                <p style={styles.whyChooseSubtitle}>
                  We turn journeys into unforgettable memories.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  landingPage: {
    fontFamily: "'Poppins', 'Segoe UI', 'Arial', sans-serif",
    backgroundColor: "#DDF4FC",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
  },
  // Hero Section
  heroSection: {
    minHeight: "90vh",
    backgroundColor: "#DDF4FC",
    position: "relative" as const,
    overflow: "hidden" as const,
  },
  heroOverlay: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "radial-gradient(circle at 20% 50%, rgba(221, 244, 252, 0.95), rgba(221, 244, 252, 0.98))",
    zIndex: 1,
  },
  // Hero Container
  heroContainer: {
    display: "flex",
    maxWidth: "1400px",
    margin: "0 auto",
    minHeight: "90vh",
    alignItems: "center",
    gap: "60px",
    position: "relative" as const,
    zIndex: 2,
    padding: "0 40px",
  },
  // Left Side Content
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
  // Search Form
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
    "::placeholder": {
      color: "#bbb",
      fontWeight: "400",
    },
  },
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
    whiteSpace: "nowrap" as const,
    ":hover": {
      backgroundColor: "#d35400",
      transform: "translateY(-2px)",
    },
  },
  // Trust Indicators
  trustIndicators: {
    display: "flex",
    gap: "24px",
    marginTop: "24px",
    flexWrap: "wrap" as const,
  },
  trustItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    color: "#5a6e7a",
    fontWeight: "500",
  },
  // Right Side - 3 Images in a Single Row
  heroImagesRow: {
    flex: "0 0 50%",
    display: "flex",
    gap: "20px",
    alignItems: "stretch",
  },
  largeImageWrapper: {
    flex: "0 0 55%",
  },
  heroImageCard: {
    position: "relative" as const,
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
    height: "100%",
    minHeight: "500px",
    cursor: "pointer",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    ":hover": {
      transform: "translateY(-8px)",
      boxShadow: "0 30px 60px -12px rgba(0,0,0,0.3)",
    },
  },
  smallImagesRow: {
    flex: "0 0 45%",
    display: "flex",
    gap: "20px",
    flexDirection: "column" as const,
  },
  heroImageCardSmall: {
    position: "relative" as const,
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 20px 40px -12px rgba(0,0,0,0.2)",
    flex: 1,
    minHeight: "240px",
    cursor: "pointer",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    ":hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
    },
  },
  heroImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
    transition: "transform 0.5s ease",
  },
  heroImageOverlay: {
    position: "absolute" as const,
    bottom: 0,
    left: 0,
    right: 0,
    background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
    padding: "24px",
    display: "flex",
    flexDirection: "column" as const,
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
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
  },
  // About & Why Choose Section
  aboutWhySection: {
    padding: "80px 0",
    backgroundColor: "#DDF4FC",
  },
  twoColumnGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "50px",
    alignItems: "start",
  },
  aboutColumn: {
    paddingRight: "20px",
  },
  aboutTitle: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: "25px",
    position: "relative" as const,
    paddingBottom: "12px",
    ":after": {
      content: "''",
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "60px",
      height: "3px",
      backgroundColor: "#e67e22",
    },
  },
  aboutDescription: {
    fontSize: "15px",
    lineHeight: "1.7",
    color: "#555",
    marginBottom: "18px",
  },
  whyChooseColumn: {
    paddingLeft: "20px",
    borderLeft: "2px solid #f0f0f0",
  },
  whyChooseHeader: {
    textAlign: "left" as const,
  },
  whyChooseBadge: {
    display: "inline-block",
    color: "#e67e22",
    fontSize: "13px",
    fontWeight: "600",
    textTransform: "uppercase" as const,
    letterSpacing: "1px",
    marginBottom: "15px",
  },
  whyChooseTitle: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: "15px",
    lineHeight: "1.3",
  },
  whyChooseSubtitle: {
    fontSize: "17px",
    color: "#666",
    fontStyle: "italic",
  },
};

// Add responsive styles
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @media (max-width: 1024px) {
    .hero-container {
      flex-direction: column !important;
      padding: 60px 20px !important;
      gap: 40px !important;
    }
    .hero-left-content {
      flex: 0 0 100% !important;
      text-align: center !important;
    }
    .hero-title {
      font-size: 42px !important;
    }
    .hero-description {
      max-width: 100% !important;
      margin-left: auto !important;
      margin-right: auto !important;
    }
    .search-form {
      margin: 0 auto !important;
      max-width: 100% !important;
    }
    .trust-indicators {
      justify-content: center !important;
    }
    .hero-images-row {
      flex: 0 0 100% !important;
      flex-direction: column-reverse !important;
    }
    .large-image-wrapper {
      flex: 0 0 100% !important;
    }
    .hero-image-card {
      min-height: 400px !important;
    }
    .small-images-row {
      flex: 0 0 100% !important;
      flex-direction: row !important;
    }
    .hero-image-card-small {
      min-height: 220px !important;
    }
    .two-column-grid {
      grid-template-columns: 1fr !important;
      gap: 40px !important;
    }
    .about-column {
      padding-right: 0 !important;
    }
    .why-choose-column {
      padding-left: 0 !important;
      border-left: none !important;
      border-top: 2px solid #f0f0f0 !important;
      padding-top: 35px !important;
    }
  }
  
  @media (max-width: 768px) {
    .hero-section {
      min-height: auto !important;
    }
    .hero-title {
      font-size: 32px !important;
    }
    .hero-description {
      font-size: 14px !important;
    }
    .hero-left-content {
      padding: 0 !important;
    }
    .hero-image-card {
      min-height: 300px !important;
    }
    .small-images-row {
      flex-direction: column !important;
    }
    .hero-image-card-small {
      min-height: 200px !important;
    }
    .search-wrapper {
      flex-direction: column !important;
      border-radius: 20px !important;
    }
    .search-icon {
      display: none !important;
    }
    .search-input {
      border-radius: 20px 20px 0 0 !important;
      text-align: center !important;
      padding: 16px 20px !important;
    }
    .search-button {
      border-radius: 0 0 20px 20px !important;
      justify-content: center !important;
      padding: 16px !important;
    }
    .trust-indicators {
      flex-direction: column !important;
      align-items: center !important;
      gap: 12px !important;
    }
    .about-title {
      font-size: 26px !important;
    }
    .why-choose-title {
      font-size: 26px !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export default LandingPage;
