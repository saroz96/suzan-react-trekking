import React, { useState } from "react";
import { Link } from "react-router-dom";

interface FooterProps {
  companyName?: string;
  companyDescription?: string;
  phone?: string;
  email?: string;
  address?: string;
  year?: number;
}

const Footer: React.FC<FooterProps> = ({
  companyName = "Alpine Ramble",
  companyDescription = "We are a Kathmandu-based team of passionate trekking enthusiasts who have been operating exciting and rewarding tours in Nepal, Tibet, and Bhutan for more than a decade.",
  phone = "+977 9851175531",
  email = "info@alpineramble.com",
  address = "Kathmandu, Nepal",
  year = new Date().getFullYear(),
}) => {
  const [emailSubscriber, setEmailSubscriber] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSubscriber || !emailSubscriber.includes("@")) {
      setSubscriptionStatus({
        show: true,
        message: "Please enter a valid email address",
        type: "error",
      });
      setTimeout(() => {
        setSubscriptionStatus({ show: false, message: "", type: "success" });
      }, 3000);
      return;
    }

    setSubscriptionStatus({
      show: true,
      message: "Thank you for subscribing! We'll keep you updated.",
      type: "success",
    });
    setEmailSubscriber("");
    setTimeout(() => {
      setSubscriptionStatus({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const quickLinks = [
    { name: "About Us", path: "/about" },
    { name: "Trekking in Nepal", path: "/trekking/nepal" },
    { name: "Trekking in Tibet", path: "/trekking/tibet" },
    { name: "Trekking in Bhutan", path: "/trekking/bhutan" },
    { name: "Travel Guide", path: "/guide" },
    { name: "FAQs", path: "/faqs" },
    { name: "Contact Us", path: "/contact" },
    { name: "Blog", path: "/blog" },
  ];

  const popularTours = [
    { name: "Everest Base Camp Trek", path: "/trip/everest-base-camp-trek" },
    { name: "Annapurna Circuit Trek", path: "/trip/annapurna-circuit-trek" },
    { name: "Langtang Valley Trek", path: "/trip/langtang-valley-trek" },
    { name: "Manaslu Circuit Trek", path: "/trip/manaslu-circuit-trek" },
    {
      name: "Ghorepani Poon Hill Trek",
      path: "/trip/ghorepani-poon-hill-trek",
    },
  ];

  const socialLinks = [
    { name: "Facebook", icon: "📘", url: "https://facebook.com" },
    { name: "Instagram", icon: "📷", url: "https://instagram.com" },
    { name: "Twitter", icon: "🐦", url: "https://twitter.com" },
    { name: "YouTube", icon: "▶️", url: "https://youtube.com" },
    { name: "TripAdvisor", icon: "🌐", url: "https://tripadvisor.com" },
  ];

  return (
    <footer style={styles.footer}>
      {/* Main Footer Content - Single Row */}
      <div style={styles.footerMain}>
        <div style={styles.container}>
          <div style={styles.footerGrid}>
            {/* Column 1: Company Info */}
            <div style={styles.footerColumn}>
              <h3 style={styles.footerLogo}>{companyName}</h3>
              <p style={styles.companyDescription}>{companyDescription}</p>
              <div style={styles.contactInfo}>
                <div style={styles.contactItem}>
                  <span style={styles.contactIcon}>📞</span>
                  <div>
                    <strong>24/7 Support</strong>
                    <br />
                    <a href={`tel:${phone}`} style={styles.contactLink}>
                      {phone}
                    </a>
                  </div>
                </div>
                <div style={styles.contactItem}>
                  <span style={styles.contactIcon}>✉️</span>
                  <div>
                    <strong>Email Us</strong>
                    <br />
                    <a href={`mailto:${email}`} style={styles.contactLink}>
                      {email}
                    </a>
                  </div>
                </div>
                <div style={styles.contactItem}>
                  <span style={styles.contactIcon}>📍</span>
                  <div>
                    <strong>Office Address</strong>
                    <br />
                    <span style={styles.contactText}>{address}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div style={styles.footerColumn}>
              <h4 style={styles.footerHeading}>Quick Links</h4>
              <ul style={styles.linkList}>
                {quickLinks.map((link) => (
                  <li key={link.name} style={styles.linkItem}>
                    <Link to={link.path} style={styles.link}>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Popular Treks */}
            <div style={styles.footerColumn}>
              <h4 style={styles.footerHeading}>Popular Treks</h4>
              <ul style={styles.linkList}>
                {popularTours.map((tour) => (
                  <li key={tour.name} style={styles.linkItem}>
                    <Link to={tour.path} style={styles.link}>
                      {tour.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Newsletter & Social */}
            <div style={styles.footerColumn}>
              <h4 style={styles.footerHeading}>Stay Updated</h4>
              <p style={styles.newsletterText}>
                Subscribe for exclusive deals and travel tips.
              </p>
              <form onSubmit={handleSubscribe} style={styles.newsletterForm}>
                <input
                  type="email"
                  placeholder="Your email"
                  value={emailSubscriber}
                  onChange={(e) => setEmailSubscriber(e.target.value)}
                  style={styles.newsletterInput}
                />
                <button type="submit" style={styles.newsletterButton}>
                  Subscribe
                </button>
              </form>
              {subscriptionStatus.show && (
                <div
                  style={{
                    ...styles.subscriptionMessage,
                    backgroundColor:
                      subscriptionStatus.type === "success"
                        ? "#27ae60"
                        : "#e74c3c",
                  }}
                >
                  {subscriptionStatus.message}
                </div>
              )}
              <div style={styles.socialLinks}>
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.socialLink}
                    title={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges Section */}
      <div style={styles.trustSection}>
        <div style={styles.container}>
          <div style={styles.trustGrid}>
            <div style={styles.trustItem}>
              <span style={styles.trustIcon}>🏔️</span>
              <div>
                <h4 style={styles.trustTitle}>Local Experts</h4>
                <p style={styles.trustText}>True locals who know the trails</p>
              </div>
            </div>
            <div style={styles.trustItem}>
              <span style={styles.trustIcon}>🛡️</span>
              <div>
                <h4 style={styles.trustTitle}>Safety Prioritized</h4>
                <p style={styles.trustText}>Fully trained guides</p>
              </div>
            </div>
            <div style={styles.trustItem}>
              <span style={styles.trustIcon}>💰</span>
              <div>
                <h4 style={styles.trustTitle}>Best Value</h4>
                <p style={styles.trustText}>Quality at unbeatable prices</p>
              </div>
            </div>
            <div style={styles.trustItem}>
              <span style={styles.trustIcon}>✓</span>
              <div>
                <h4 style={styles.trustTitle}>Guaranteed Departures</h4>
                <p style={styles.trustText}>Always confirmed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div style={styles.bottomBar}>
        <div style={styles.container}>
          <div style={styles.bottomContent}>
            <div style={styles.copyright}>
              <p style={styles.copyrightText}>
                © {year} {companyName}. All rights reserved.
              </p>
              <div style={styles.legalLinks}>
                <Link to="/privacy" style={styles.legalLink}>
                  Privacy Policy
                </Link>
                <span style={styles.legalSeparator}>|</span>
                <Link to="/terms" style={styles.legalLink}>
                  Terms & Conditions
                </Link>
                <span style={styles.legalSeparator}>|</span>
                <Link to="/sitemap" style={styles.legalLink}>
                  Sitemap
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: "#0a2b3e",
    color: "#fff",
    fontFamily: "Arial, sans-serif",
    marginTop: "60px",
  },
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 20px",
  },
  footerMain: {
    padding: "60px 0 40px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  footerGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "40px",
    alignItems: "start",
  },
  footerColumn: {
    minWidth: 0,
  },
  footerLogo: {
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "15px",
    color: "#e67e22",
  },
  companyDescription: {
    fontSize: "13px",
    lineHeight: "1.6",
    color: "#b0c4de",
    marginBottom: "15px",
  },
  contactInfo: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
  },
  contactItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
  },
  contactIcon: {
    fontSize: "16px",
    minWidth: "24px",
  },
  contactLink: {
    color: "#e67e22",
    textDecoration: "none",
    fontSize: "12px",
    ":hover": {
      textDecoration: "underline",
    },
  },
  contactText: {
    fontSize: "12px",
    color: "#b0c4de",
  },
  footerHeading: {
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "15px",
    color: "#fff",
    position: "relative" as const,
    paddingBottom: "8px",
    ":after": {
      content: "''",
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "30px",
      height: "2px",
      backgroundColor: "#e67e22",
    },
  },
  linkList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  linkItem: {
    marginBottom: "8px",
  },
  link: {
    color: "#b0c4de",
    textDecoration: "none",
    fontSize: "12px",
    transition: "color 0.2s",
    ":hover": {
      color: "#e67e22",
    },
  },
  newsletterText: {
    fontSize: "12px",
    lineHeight: "1.5",
    color: "#b0c4de",
    marginBottom: "12px",
  },
  newsletterForm: {
    display: "flex",
    marginBottom: "12px",
  },
  newsletterInput: {
    flex: 1,
    padding: "8px 10px",
    border: "none",
    borderRadius: "4px 0 0 4px",
    fontSize: "12px",
    outline: "none",
  },
  newsletterButton: {
    padding: "8px 15px",
    backgroundColor: "#e67e22",
    color: "#fff",
    border: "none",
    borderRadius: "0 4px 4px 0",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "bold",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#d35400",
    },
  },
  subscriptionMessage: {
    fontSize: "11px",
    padding: "6px",
    borderRadius: "4px",
    marginBottom: "12px",
    textAlign: "center" as const,
    color: "#fff",
  },
  socialLinks: {
    display: "flex",
    gap: "12px",
    marginTop: "15px",
  },
  socialLink: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: "rgba(255,255,255,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    fontSize: "16px",
    transition: "all 0.2s",
    ":hover": {
      backgroundColor: "#e67e22",
      transform: "translateY(-2px)",
    },
  },
  trustSection: {
    padding: "30px 0",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  trustGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "30px",
  },
  trustItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  trustIcon: {
    fontSize: "24px",
  },
  trustTitle: {
    fontSize: "13px",
    fontWeight: "bold",
    marginBottom: "3px",
    color: "#fff",
  },
  trustText: {
    fontSize: "11px",
    color: "#b0c4de",
    margin: 0,
  },
  bottomBar: {
    padding: "15px 0",
    backgroundColor: "#06212f",
  },
  bottomContent: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  copyright: {
    textAlign: "center" as const,
  },
  copyrightText: {
    fontSize: "11px",
    color: "#b0c4de",
    marginBottom: "5px",
  },
  legalLinks: {
    display: "flex",
    gap: "8px",
    justifyContent: "center",
    flexWrap: "wrap" as const,
  },
  legalLink: {
    fontSize: "11px",
    color: "#b0c4de",
    textDecoration: "none",
    ":hover": {
      color: "#e67e22",
    },
  },
  legalSeparator: {
    fontSize: "11px",
    color: "#b0c4de",
  },
};

// Responsive styles
const responsiveStyles = `
  @media (max-width: 1024px) {
    .footer-grid {
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 30px !important;
    }
    .trust-grid {
      grid-template-columns: repeat(2, 1fr) !important;
    }
  }
  
  @media (max-width: 768px) {
    .footer-grid {
      grid-template-columns: 1fr !important;
      gap: 30px !important;
    }
    .trust-grid {
      grid-template-columns: 1fr !important;
    }
    .trust-item {
      justify-content: center;
      text-align: center;
    }
  }
`;

// Add responsive styles
const styleSheet = document.createElement("style");
styleSheet.textContent = responsiveStyles;
document.head.appendChild(styleSheet);

export default Footer;
