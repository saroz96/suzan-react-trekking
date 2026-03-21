import React from "react";
import { Link } from "react-router-dom";

interface FooterImageProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  imageUrl?: string;
  associateLogos?: Array<{ name: string; logoUrl: string; link?: string }>;
}

const FooterImage: React.FC<FooterImageProps> = ({
  title = "EXPLORE MORE",
  subtitle = "Start Your Adventure Today",
  buttonText = "View All Trips",
  buttonLink = "/trips",
  imageUrl = "https://media.istockphoto.com/id/2190142767/vector/vector-autumn-mountains-in-the-foreground-is-a-grassy-meadow-withriver-and-shepherds-houses.jpg?s=612x612&w=0&k=20&c=EaPhyPw1ZX62RGBv7uUmLWb__GJHbJE58nDCzn8pLNk=",
  associateLogos = [
    { name: "TAAN", logoUrl: "/images/taan-logo.png", link: "#" },
    { name: "NTB", logoUrl: "/images/ntb-logo.png", link: "#" },
    { name: "NMA", logoUrl: "/images/nma-logo.png", link: "#" },
    { name: "KEEP", logoUrl: "/images/keep-logo.png", link: "#" },
    { name: "PAC", logoUrl: "/images/pac-logo.png", link: "#" },
  ],
}) => {
  return (
    <div style={styles.container}>
      {/* Background Image with Overlay */}
      <div style={styles.imageWrapper}>
        <img
          src={imageUrl}
          alt="Mountain Adventure"
          style={styles.backgroundImage}
        />
        <div style={styles.overlay}></div>

        {/* Content */}
        <div style={styles.content}>
          {/* "EXPLORE MORE" Text */}
          <div style={styles.exploreSection}>
            <span style={styles.exploreBadge}>✦ ADVENTURE AWAITS ✦</span>
            <h2 style={styles.exploreTitle}>{title}</h2>
            <p style={styles.exploreSubtitle}>{subtitle}</p>
            <Link to={buttonLink} style={styles.exploreButton}>
              {buttonText} <span style={styles.buttonArrow}>→</span>
            </Link>
          </div>

          {/* Associate Logos Section */}
          <div style={styles.associateSection}>
            <div style={styles.divider}>
              <span style={styles.dividerLine}></span>
              <span style={styles.dividerText}>We are Associate With</span>
              <span style={styles.dividerLine}></span>
            </div>
            <div style={styles.logosGrid}>
              {associateLogos.map((logo, index) => (
                <a
                  key={index}
                  href={logo.link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.logoLink}
                >
                  <div style={styles.logoItem}>
                    {logo.logoUrl ? (
                      <img
                        src={logo.logoUrl}
                        alt={logo.name}
                        style={styles.logoImage}
                      />
                    ) : (
                      <div style={styles.logoPlaceholder}>
                        <span style={styles.logoPlaceholderText}>
                          {logo.name}
                        </span>
                      </div>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
    position: "relative" as const,
    marginTop: "60px",
  },
  imageWrapper: {
    position: "relative" as const,
    width: "100%",
    height: "500px",
    overflow: "hidden",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
    display: "block",
  },
  overlay: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%)",
  },
  content: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    textAlign: "center" as const,
  },
  exploreSection: {
    marginBottom: "60px",
  },
  exploreBadge: {
    display: "inline-block",
    backgroundColor: "rgba(230, 126, 34, 0.9)",
    color: "white",
    padding: "6px 16px",
    borderRadius: "30px",
    fontSize: "12px",
    fontWeight: "600",
    letterSpacing: "1px",
    marginBottom: "20px",
  },
  exploreTitle: {
    fontSize: "56px",
    fontWeight: "bold",
    color: "white",
    marginBottom: "15px",
    textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
    letterSpacing: "2px",
  },
  exploreSubtitle: {
    fontSize: "18px",
    color: "rgba(255,255,255,0.9)",
    marginBottom: "30px",
    maxWidth: "600px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  exploreButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "#e67e22",
    color: "white",
    padding: "14px 32px",
    borderRadius: "50px",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "all 0.3s ease",
    ":hover": {
      backgroundColor: "#d35400",
      transform: "translateY(-2px)",
      boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
    },
  },
  buttonArrow: {
    fontSize: "18px",
    transition: "transform 0.3s ease",
    display: "inline-block",
  },
  associateSection: {
    width: "100%",
    maxWidth: "800px",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "15px",
    marginBottom: "30px",
  },
  dividerLine: {
    width: "80px",
    height: "1px",
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  dividerText: {
    color: "white",
    fontSize: "14px",
    fontWeight: "500",
    letterSpacing: "1px",
    textTransform: "uppercase" as const,
  },
  logosGrid: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "40px",
    flexWrap: "wrap" as const,
  },
  logoLink: {
    textDecoration: "none",
    transition: "transform 0.3s ease",
    ":hover": {
      transform: "translateY(-5px)",
    },
  },
  logoItem: {
    width: "100px",
    height: "80px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: "12px",
    backdropFilter: "blur(5px)",
    transition: "all 0.3s ease",
    ":hover": {
      backgroundColor: "rgba(255,255,255,0.25)",
    },
  },
  logoImage: {
    maxWidth: "80px",
    maxHeight: "60px",
    objectFit: "contain" as const,
  },
  logoPlaceholder: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoPlaceholderText: {
    color: "white",
    fontSize: "14px",
    fontWeight: "bold",
    textAlign: "center" as const,
  },
};

// Responsive styles
const responsiveStyles = `
  @media (max-width: 768px) {
    .footer-image-title {
      font-size: 36px !important;
    }
    .footer-image-subtitle {
      font-size: 14px !important;
    }
    .explore-button {
      padding: 10px 24px !important;
      font-size: 14px !important;
    }
    .logos-grid {
      gap: 20px !important;
    }
    .logo-item {
      width: 70px !important;
      height: 60px !important;
    }
    .divider-line {
      width: 40px !important;
    }
  }
`;

// Add responsive styles
const styleSheet = document.createElement("style");
styleSheet.textContent = responsiveStyles;
document.head.appendChild(styleSheet);

export default FooterImage;
