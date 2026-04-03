"use client";

import React, { useState } from "react";
import Link from "next/link";

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
    <>
      <style jsx>{`
        footer {
          background-color: #0a2b3e;
          color: #fff;
          font-family: Arial, sans-serif;
          margin-top: 60px;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .footer-main {
          padding: 60px 0 40px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .footer-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 40px;
          align-items: start;
        }

        .footer-column {
          min-width: 0;
        }

        .footer-logo {
          font-size: 22px;
          font-weight: bold;
          margin-bottom: 15px;
          color: #e67e22;
        }

        .company-description {
          font-size: 13px;
          line-height: 1.6;
          color: #b0c4de;
          margin-bottom: 15px;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .contact-icon {
          font-size: 16px;
          min-width: 24px;
        }

        .contact-link {
          color: #e67e22;
          text-decoration: none;
          font-size: 12px;
        }

        .contact-link:hover {
          text-decoration: underline;
        }

        .contact-text {
          font-size: 12px;
          color: #b0c4de;
        }

        .footer-heading {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 15px;
          color: #fff;
          position: relative;
          padding-bottom: 8px;
        }

        .footer-heading::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          width: 30px;
          height: 2px;
          background-color: #e67e22;
        }

        .link-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .link-item {
          margin-bottom: 8px;
        }

        .link {
          color: #b0c4de;
          text-decoration: none;
          font-size: 12px;
          transition: color 0.2s;
        }

        .link:hover {
          color: #e67e22;
        }

        .newsletter-text {
          font-size: 12px;
          line-height: 1.5;
          color: #b0c4de;
          margin-bottom: 12px;
        }

        .newsletter-form {
          display: flex;
          margin-bottom: 12px;
        }

        .newsletter-input {
          flex: 1;
          padding: 8px 10px;
          border: none;
          border-radius: 4px 0 0 4px;
          font-size: 12px;
          outline: none;
        }

        .newsletter-button {
          padding: 8px 15px;
          background-color: #e67e22;
          color: #fff;
          border: none;
          border-radius: 0 4px 4px 0;
          cursor: pointer;
          font-size: 12px;
          font-weight: bold;
          transition: background-color 0.2s;
        }

        .newsletter-button:hover {
          background-color: #d35400;
        }

        .subscription-message {
          font-size: 11px;
          padding: 6px;
          border-radius: 4px;
          margin-bottom: 12px;
          text-align: center;
          color: #fff;
        }

        .subscription-message.success {
          background-color: #27ae60;
        }

        .subscription-message.error {
          background-color: #e74c3c;
        }

        .social-links {
          display: flex;
          gap: 12px;
          margin-top: 15px;
        }

        .social-link {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          font-size: 16px;
          transition: all 0.2s;
        }

        .social-link:hover {
          background-color: #e67e22;
          transform: translateY(-2px);
        }

        .trust-section {
          padding: 30px 0;
          background-color: rgba(0, 0, 0, 0.2);
        }

        .trust-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 30px;
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .trust-icon {
          font-size: 24px;
        }

        .trust-title {
          font-size: 13px;
          font-weight: bold;
          margin-bottom: 3px;
          color: #fff;
        }

        .trust-text {
          font-size: 11px;
          color: #b0c4de;
          margin: 0;
        }

        .bottom-bar {
          padding: 15px 0;
          background-color: #06212f;
        }

        .bottom-content {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .copyright {
          text-align: center;
        }

        .copyright-text {
          font-size: 11px;
          color: #b0c4de;
          margin-bottom: 5px;
        }

        .legal-links {
          display: flex;
          gap: 8px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .legal-link {
          font-size: 11px;
          color: #b0c4de;
          text-decoration: none;
        }

        .legal-link:hover {
          color: #e67e22;
        }

        .legal-separator {
          font-size: 11px;
          color: #b0c4de;
        }

        /* Responsive Styles */
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
      `}</style>

      <footer>
        {/* Main Footer Content - Single Row */}
        <div className="footer-main">
          <div className="container">
            <div className="footer-grid">
              {/* Column 1: Company Info */}
              <div className="footer-column">
                <h3 className="footer-logo">{companyName}</h3>
                <p className="company-description">{companyDescription}</p>
                <div className="contact-info">
                  <div className="contact-item">
                    <span className="contact-icon">📞</span>
                    <div>
                      <strong>24/7 Support</strong>
                      <br />
                      <a href={`tel:${phone}`} className="contact-link">
                        {phone}
                      </a>
                    </div>
                  </div>
                  <div className="contact-item">
                    <span className="contact-icon">✉️</span>
                    <div>
                      <strong>Email Us</strong>
                      <br />
                      <a href={`mailto:${email}`} className="contact-link">
                        {email}
                      </a>
                    </div>
                  </div>
                  <div className="contact-item">
                    <span className="contact-icon">📍</span>
                    <div>
                      <strong>Office Address</strong>
                      <br />
                      <span className="contact-text">{address}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 2: Quick Links */}
              <div className="footer-column">
                <h4 className="footer-heading">Quick Links</h4>
                <ul className="link-list">
                  {quickLinks.map((link) => (
                    <li key={link.name} className="link-item">
                      <Link href={link.path} className="link">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 3: Popular Treks */}
              <div className="footer-column">
                <h4 className="footer-heading">Popular Treks</h4>
                <ul className="link-list">
                  {popularTours.map((tour) => (
                    <li key={tour.name} className="link-item">
                      <Link href={tour.path} className="link">
                        {tour.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 4: Newsletter & Social */}
              <div className="footer-column">
                <h4 className="footer-heading">Stay Updated</h4>
                <p className="newsletter-text">
                  Subscribe for exclusive deals and travel tips.
                </p>
                <form onSubmit={handleSubscribe} className="newsletter-form">
                  <input
                    type="email"
                    placeholder="Your email"
                    value={emailSubscriber}
                    onChange={(e) => setEmailSubscriber(e.target.value)}
                    className="newsletter-input"
                  />
                  <button type="submit" className="newsletter-button">
                    Subscribe
                  </button>
                </form>
                {subscriptionStatus.show && (
                  <div
                    className={`subscription-message ${subscriptionStatus.type}`}
                  >
                    {subscriptionStatus.message}
                  </div>
                )}
                <div className="social-links">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
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
        <div className="trust-section">
          <div className="container">
            <div className="trust-grid">
              <div className="trust-item">
                <span className="trust-icon">🏔️</span>
                <div>
                  <h4 className="trust-title">Local Experts</h4>
                  <p className="trust-text">True locals who know the trails</p>
                </div>
              </div>
              <div className="trust-item">
                <span className="trust-icon">🛡️</span>
                <div>
                  <h4 className="trust-title">Safety Prioritized</h4>
                  <p className="trust-text">Fully trained guides</p>
                </div>
              </div>
              <div className="trust-item">
                <span className="trust-icon">💰</span>
                <div>
                  <h4 className="trust-title">Best Value</h4>
                  <p className="trust-text">Quality at unbeatable prices</p>
                </div>
              </div>
              <div className="trust-item">
                <span className="trust-icon">✓</span>
                <div>
                  <h4 className="trust-title">Guaranteed Departures</h4>
                  <p className="trust-text">Always confirmed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="bottom-bar">
          <div className="container">
            <div className="bottom-content">
              <div className="copyright">
                <p className="copyright-text">
                  © {year} {companyName}. All rights reserved.
                </p>
                <div className="legal-links">
                  <Link href="/privacy" className="legal-link">
                    Privacy Policy
                  </Link>
                  <span className="legal-separator">|</span>
                  <Link href="/terms" className="legal-link">
                    Terms & Conditions
                  </Link>
                  <span className="legal-separator">|</span>
                  <Link href="/sitemap" className="legal-link">
                    Sitemap
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
