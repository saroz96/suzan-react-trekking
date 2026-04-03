"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

// Types
interface MainHeading {
  id: number;
  name: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface Heading {
  id: number;
  name: string;
  mainHeadingId: number;
  isActive?: boolean;
}

interface SubHeading {
  id: number;
  name: string;
  mainHeadingId: number;
  headingId: number;
  description?: string;
  packageCount?: number;
  isActive?: boolean;
}

interface TrekPackage {
  id: number;
  name: string;
  shortDescription?: string;
  price?: number;
  discountedPrice?: number;
  durationDays?: number;
  sliderImages?: { imageUrl: string }[];
  routeMapImageUrl?: string;
  isActive?: boolean;
}

interface HeaderProps {
  user?: {
    id: string;
    name: string;
    email?: string;
  } | null;
  onLogout?: () => void;
}

const Header = ({ user, onLogout }: HeaderProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<TrekPackage[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // State for dynamic menu data
  const [mainHeadings, setMainHeadings] = useState<MainHeading[]>([]);
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [subHeadings, setSubHeadings] = useState<SubHeading[]>([]);
  const [loading, setLoading] = useState(true);
  const [allPackages, setAllPackages] = useState<TrekPackage[]>([]);

  // Base URL - use direct backend URL
  const API_BASE_URL = "http://localhost:5232";

  // Create axios instance
  const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Add token interceptor
  api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("trekking_app_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
        setOpenDropdown(null);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Inject media query styles
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.textContent = `
      @media (max-width: 768px) {
        .desktop-search {
          display: none !important;
        }
        .desktop-nav {
          display: none !important;
        }
        .mobile-menu-icon {
          display: flex !important;
        }
        .mobile-search {
          display: block !important;
        }
      }
      
      @media (min-width: 769px) {
        .mobile-menu-icon {
          display: none !important;
        }
        .mobile-search {
          display: none !important;
        }
        .desktop-search {
          display: flex !important;
        }
        .desktop-nav {
          display: block !important;
        }
      }
      
      @keyframes slideIn {
        from {
          transform: translateX(-100%);
        }
        to {
          transform: translateX(0);
        }
      }
    `;
    document.head.appendChild(styleElement);

    return () => {
      if (styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    };
  }, []);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        performSearch();
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchMenuData = async () => {
    try {
      setLoading(true);
      console.log(
        "Fetching menu data from:",
        `${API_BASE_URL}/api/MainHeading`,
      );

      const [mainHeadingsRes, headingsRes, subHeadingsRes] = await Promise.all([
        api.get("/api/MainHeading"),
        api.get("/api/Heading"),
        api.get("/api/SubHeading"),
      ]);

      console.log("Main Headings Response:", mainHeadingsRes.data);
      console.log("Headings Response:", headingsRes.data);
      console.log("SubHeadings Response:", subHeadingsRes.data);

      // Show ALL main headings
      const allMainHeadings = mainHeadingsRes.data || [];

      // For headings and subheadings, keep active ones
      const activeHeadings = (headingsRes.data || []).filter(
        (item: any) => item.isActive !== false,
      );

      const activeSubHeadings = (subHeadingsRes.data || []).filter(
        (item: any) => item.isActive !== false,
      );

      console.log("Setting main headings count:", allMainHeadings.length);
      console.log(
        "Main headings names:",
        allMainHeadings.map((h: any) => h.name),
      );

      setMainHeadings(allMainHeadings);
      setHeadings(activeHeadings);
      setSubHeadings(activeSubHeadings);
    } catch (error: any) {
      console.error("Error fetching menu data:", error);
      console.error("Error message:", error.message);
      if (error.code === "ERR_NETWORK") {
        console.error(
          "Network error - Make sure backend is running on",
          API_BASE_URL,
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch all menu data and packages
  useEffect(() => {
    fetchMenuData();
    fetchAllPackages();
  }, []);

  const fetchAllPackages = async () => {
    try {
      console.log("Fetching packages from:", `${API_BASE_URL}/api/TrekPackage`);
      const response = await api.get("/api/TrekPackage");
      console.log("Packages response:", response.data?.length || 0, "packages");

      // Only include active packages
      const activePackages = (response.data || []).filter(
        (pkg: TrekPackage) => pkg.isActive !== false,
      );
      console.log("Active packages:", activePackages.length);
      setAllPackages(activePackages);
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  };

  const performSearch = () => {
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    const query = searchQuery.toLowerCase().trim();

    const results = allPackages.filter(
      (pkg) =>
        pkg.name.toLowerCase().includes(query) ||
        pkg.shortDescription?.toLowerCase().includes(query),
    );

    setSearchResults(results.slice(0, 10));
    setShowSearchResults(true);
    setSearchLoading(false);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim().length === 0) {
      setShowSearchResults(false);
    }
  };

  const handleSearchResultClick = (pkg: TrekPackage) => {
    const slug = pkg.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    router.push(`/trip/${slug}-${pkg.id}`);
    setShowSearchResults(false);
    setSearchQuery("");
    setIsMobileMenuOpen(false);
  };

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

  const getHeadingPackageCount = (headingId: number): number => {
    return subHeadings
      .filter((sh) => sh.headingId === headingId)
      .reduce((total, sh) => total + (sh.packageCount || 0), 0);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setOpenDropdown(null);
  };

  const handleDropdownHover = (dropdownName: string) => {
    if (!isMobile) {
      setOpenDropdown(dropdownName);
    }
  };

  const handleDropdownLeave = () => {
    if (!isMobile) {
      setOpenDropdown(null);
    }
  };

  const handleMobileDropdownClick = (dropdownName: string) => {
    if (isMobile) {
      setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  const getHeadingsForMain = (mainHeadingId: number) => {
    return headings.filter((h) => h.mainHeadingId === mainHeadingId);
  };

  const getSubHeadingsForHeading = (headingId: number) => {
    return subHeadings.filter((sh) => sh.headingId === headingId);
  };

  const getSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, "-");
  };

  const isAdminRoute = pathname?.startsWith("/admin");

  // If on admin route, don't render anything
  if (isAdminRoute) {
    return null;
  }

  if (loading) {
    return (
      <nav className="navbar" style={navbarStyle}>
        <div style={topBarStyle}>
          <div style={topBarContainerStyle}>
            <div style={contactInfoStyle}>
              <span style={contactItemStyle}>📞 +977 9851175531</span>
              <span style={contactSeparatorStyle}>|</span>
              <span style={contactItemStyle}>📞 +977 9813593530</span>
            </div>
            <div style={excellenceBadgeStyle}>⭐ 16 YEARS OF EXCELLENCE</div>
          </div>
        </div>
        <div style={mainNavStyle}>
          <div style={navContainerStyle}>
            <div style={logoContainerStyle}>
              <Link href="/" style={logoLinkStyle}>
                <Image
                  src="https://www.alpineramble.com/themes/images/new-logo.svg"
                  alt="Alpine Ramble Logo"
                  width={200}
                  height={60}
                  style={logoImageStyle}
                  priority
                  unoptimized
                />
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar" style={navbarStyle}>
      {/* Top Bar with Contact Info */}
      <div style={topBarStyle}>
        <div style={topBarContainerStyle}>
          <div style={contactInfoStyle}>
            <span style={contactItemStyle}>📞 +977 9851175531</span>
            <span style={contactSeparatorStyle}>|</span>
            <span style={contactItemStyle}>📞 +977 9813593530</span>
          </div>
          <div style={excellenceBadgeStyle}>⭐ 16 YEARS OF EXCELLENCE</div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div style={mainNavStyle}>
        <div style={navContainerStyle}>
          {/* Logo Section */}
          <div style={logoContainerStyle}>
            <Link href="/" style={logoLinkStyle}>
              <Image
                src="https://www.alpineramble.com/themes/images/new-logo.svg"
                alt="Alpine Ramble Logo"
                width={200}
                height={60}
                style={logoImageStyle}
                priority
                unoptimized
              />
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div
            className="desktop-search"
            style={searchContainerStyle}
            ref={searchRef}
          >
            <input
              type="text"
              placeholder="Search treks, destinations..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              onFocus={() =>
                searchQuery.trim().length >= 2 && setShowSearchResults(true)
              }
              style={searchInputStyle}
              className="search-input"
            />
            <button style={searchButtonStyle}>🔍</button>

            {/* Search Results Dropdown */}
            {showSearchResults && (
              <div style={searchResultsDropdownStyle}>
                {searchLoading ? (
                  <div style={searchResultItemStyle}>Searching...</div>
                ) : searchResults.length > 0 ? (
                  <>
                    {searchResults.map((pkg) => (
                      <div
                        key={pkg.id}
                        style={searchResultItemStyle}
                        onClick={() => handleSearchResultClick(pkg)}
                      >
                        <div style={searchResultImageContainer}>
                          {pkg.sliderImages && pkg.sliderImages.length > 0 ? (
                            <Image
                              src={getFullImageUrl(
                                pkg.sliderImages[0].imageUrl,
                              )}
                              alt={pkg.name}
                              width={50}
                              height={50}
                              style={searchResultImageStyle}
                              unoptimized
                            />
                          ) : (
                            <div style={searchResultImagePlaceholder}>🏔️</div>
                          )}
                        </div>
                        <div style={searchResultInfoStyle}>
                          <div style={searchResultNameStyle}>{pkg.name}</div>
                          <div style={searchResultDetailStyle}>
                            {pkg.durationDays} Days |
                            {pkg.discountedPrice ? (
                              <>
                                <span style={searchResultOriginalPrice}>
                                  {" "}
                                  US${pkg.price}
                                </span>
                                <span style={searchResultPrice}>
                                  {" "}
                                  US${pkg.discountedPrice}
                                </span>
                              </>
                            ) : (
                              <span style={searchResultPrice}>
                                {" "}
                                US${pkg.price}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div style={searchResultViewAllStyle}>
                      <button
                        onClick={() => {
                          router.push(
                            `/search?q=${encodeURIComponent(searchQuery)}`,
                          );
                          setShowSearchResults(false);
                        }}
                        style={searchResultViewAllButtonStyle}
                      >
                        View all {searchResults.length}+ results
                      </button>
                    </div>
                  </>
                ) : searchQuery.trim().length >= 2 ? (
                  <div style={searchResultItemStyle}>No packages found</div>
                ) : (
                  <div style={searchResultItemStyle}>
                    Type at least 2 characters to search
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Icon - Hamburger */}
          <div
            className="mobile-menu-icon"
            style={mobileMenuIconStyle}
            onClick={toggleMobileMenu}
          >
            <span style={hamburgerLineStyle}></span>
            <span style={hamburgerLineStyle}></span>
            <span style={hamburgerLineStyle}></span>
          </div>
        </div>
      </div>

      {/* Secondary Navigation - Desktop Only */}
      <div className="desktop-nav" style={secondaryNavStyle}>
        <div style={secondaryNavContainerStyle}>
          {/* Left Side - Dynamic Dropdown Menus */}
          <ul style={secondaryMenuStyle}>
            {mainHeadings && mainHeadings.length > 0 ? (
              mainHeadings.map((mainHeading) => (
                <li
                  key={mainHeading.id}
                  style={secondaryMenuItemStyle}
                  onMouseEnter={() =>
                    handleDropdownHover(`main-${mainHeading.id}`)
                  }
                  onMouseLeave={handleDropdownLeave}
                >
                  <Link
                    href={`/${getSlug(mainHeading.name)}`}
                    style={secondaryMenuLinkStyle}
                  >
                    {mainHeading.name} ▼
                  </Link>
                  {openDropdown === `main-${mainHeading.id}` && (
                    <div style={megaDropdownWideStyle}>
                      {getHeadingsForMain(mainHeading.id).length > 0 ? (
                        Array.from({
                          length: Math.ceil(
                            getHeadingsForMain(mainHeading.id).length / 3,
                          ),
                        }).map((_, rowIndex) => (
                          <div key={rowIndex} style={dropdownRowStyle}>
                            {getHeadingsForMain(mainHeading.id)
                              .slice(rowIndex * 3, rowIndex * 3 + 3)
                              .map((heading) => (
                                <div
                                  key={heading.id}
                                  style={dropdownColumnStyle}
                                >
                                  <h3 style={dropdownCategoryStyle}>
                                    {heading.name}
                                  </h3>
                                  {getSubHeadingsForHeading(heading.id).map(
                                    (subHeading) => (
                                      <Link
                                        key={subHeading.id}
                                        href={`/${getSlug(mainHeading.name)}/${getSlug(heading.name)}/${getSlug(subHeading.name)}`}
                                        style={dropdownItemStyle}
                                      >
                                        {subHeading.name}
                                        {subHeading.packageCount ? (
                                          <span style={packageCountStyle}>
                                            {" "}
                                            {subHeading.packageCount} Packages
                                          </span>
                                        ) : null}
                                      </Link>
                                    ),
                                  )}
                                </div>
                              ))}
                          </div>
                        ))
                      ) : (
                        <div style={{ padding: "20px", textAlign: "center" }}>
                          No subcategories available
                        </div>
                      )}
                    </div>
                  )}
                </li>
              ))
            ) : (
              <li style={secondaryMenuItemStyle}>
                <span style={secondaryMenuLinkStyle}>Loading menus...</span>
              </li>
            )}

            <li style={secondaryMenuItemStyle}>
              <Link href="/blog" style={secondaryMenuLinkStyle}>
                Blog
              </Link>
            </li>

            <li style={secondaryMenuItemStyle}>
              <Link href="/contact" style={secondaryMenuLinkStyle}>
                Contact Us
              </Link>
            </li>
          </ul>

          {/* Right Side - Special Buttons */}
          <div style={specialButtonsStyle}>
            <Link href="/top-10-treks" style={topTreksButtonStyle}>
              Top 10 Treks
            </Link>
            <Link href="/plan-trip" style={planTripButtonStyle}>
              Plan Your Trip
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="mobile-search" style={mobileSearchContainerStyle}>
        <input
          type="text"
          placeholder="Search treks, destinations..."
          value={searchQuery}
          onChange={handleSearchInputChange}
          style={mobileSearchInputStyle}
          className="mobile-search-input"
        />
        <button style={mobileSearchButtonStyle}>🔍</button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          <div
            className="mobile-overlay"
            style={mobileOverlayStyle}
            onClick={closeMobileMenu}
          ></div>

          <div className="mobile-menu" style={mobileMenuDropdownStyle}>
            <div style={mobileCloseButtonStyle} onClick={closeMobileMenu}>
              ✕
            </div>

            <div style={mobileMenuHeaderStyle}>
              <Image
                src="https://www.alpineramble.com/themes/images/new-logo.svg"
                alt="Alpine Ramble Logo"
                width={150}
                height={45}
                style={mobileLogoStyle}
                unoptimized
              />
            </div>

            <ul style={mobileMenuListStyle}>
              <li style={mobileNavItemStyle}>
                <Link
                  href="/"
                  style={mobileNavLinkStyle}
                  onClick={closeMobileMenu}
                >
                  Home
                </Link>
              </li>
            </ul>

            {mainHeadings.map((mainHeading) => (
              <div key={mainHeading.id} style={mobileSectionStyle}>
                <div
                  style={mobileSectionHeaderStyle}
                  onClick={() =>
                    handleMobileDropdownClick(`mobile-${mainHeading.id}`)
                  }
                >
                  <span style={mobileSectionTitleStyle}>
                    {mainHeading.name}
                  </span>
                  <span style={mobileArrowStyle}>
                    {openDropdown === `mobile-${mainHeading.id}` ? "−" : "+"}
                  </span>
                </div>
                {openDropdown === `mobile-${mainHeading.id}` && (
                  <div style={mobileDropdownContentStyle}>
                    {getHeadingsForMain(mainHeading.id).map((heading) => (
                      <div key={heading.id}>
                        <Link
                          href={`/${getSlug(mainHeading.name)}/${getSlug(heading.name)}`}
                          style={{
                            ...mobileDropdownLinkStyle,
                            fontWeight: "bold",
                            color: "#e67e22",
                          }}
                          onClick={closeMobileMenu}
                        >
                          {heading.name}
                        </Link>
                        {getSubHeadingsForHeading(heading.id).map(
                          (subHeading) => (
                            <Link
                              key={subHeading.id}
                              href={`/${getSlug(mainHeading.name)}/${getSlug(heading.name)}/${getSlug(subHeading.name)}`}
                              style={{
                                ...mobileDropdownLinkStyle,
                                paddingLeft: "20px",
                                fontSize: "13px",
                              }}
                              onClick={closeMobileMenu}
                            >
                              └ {subHeading.name}
                            </Link>
                          ),
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div style={mobileSectionStyle}>
              <div
                style={mobileSectionHeaderStyle}
                onClick={() => handleMobileDropdownClick("mobile-guides")}
              >
                <span style={mobileSectionTitleStyle}>Travel Guides</span>
                <span style={mobileArrowStyle}>
                  {openDropdown === "mobile-guides" ? "−" : "+"}
                </span>
              </div>
              {openDropdown === "mobile-guides" && (
                <div style={mobileDropdownContentStyle}>
                  <Link
                    href="/guides/altitude-tips"
                    style={mobileDropdownLinkStyle}
                    onClick={closeMobileMenu}
                  >
                    Altitude Tips
                  </Link>
                  <Link
                    href="/guides/when-to-go"
                    style={mobileDropdownLinkStyle}
                    onClick={closeMobileMenu}
                  >
                    When to go Nepal
                  </Link>
                  <Link
                    href="/guides/flight-delay"
                    style={mobileDropdownLinkStyle}
                    onClick={closeMobileMenu}
                  >
                    Flight Delay or Cancellation
                  </Link>
                  <Link
                    href="/guides/how-to-book"
                    style={mobileDropdownLinkStyle}
                    onClick={closeMobileMenu}
                  >
                    How to Book
                  </Link>
                </div>
              )}
            </div>

            <div style={mobileButtonsContainerStyle}>
              <Link
                href="/top-10-treks"
                style={mobileTopTreksButton}
                onClick={closeMobileMenu}
              >
                Top 10 Treks
              </Link>
              <Link
                href="/plan-trip"
                style={mobilePlanTripButton}
                onClick={closeMobileMenu}
              >
                Plan Your Trip
              </Link>
            </div>

            <div style={mobileContactInfoStyle}>
              <div style={mobileContactItemStyle}>📞 +977 9851175531</div>
              <div style={mobileContactItemStyle}>📞 +977 9813593530</div>
              <div style={mobileExcellenceStyle}>⭐ 16 YEARS OF EXCELLENCE</div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

// ==================== STYLES ====================
// Keep all the same styles from your original code...
const navbarStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: "#ffffff",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  fontFamily: "Arial, sans-serif",
  position: "relative",
};

const topBarStyle: React.CSSProperties = {
  backgroundColor: "#2c3e50",
  color: "white",
  padding: "8px 16px",
  fontSize: "clamp(12px, 3vw, 14px)",
};

const topBarContainerStyle: React.CSSProperties = {
  maxWidth: "1400px",
  margin: "0 auto",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "10px",
};

const contactInfoStyle: React.CSSProperties = {
  display: "flex",
  gap: "clamp(5px, 2vw, 10px)",
  alignItems: "center",
  flexWrap: "wrap",
};

const contactItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "5px",
  whiteSpace: "nowrap",
};

const contactSeparatorStyle: React.CSSProperties = {
  color: "#7f8c8d",
};

const excellenceBadgeStyle: React.CSSProperties = {
  backgroundColor: "#e67e22",
  padding: "4px clamp(8px, 2vw, 12px)",
  borderRadius: "20px",
  fontSize: "clamp(10px, 2.5vw, 12px)",
  fontWeight: "bold",
  letterSpacing: "0.5px",
  whiteSpace: "nowrap",
};

const mainNavStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  borderBottom: "1px solid #ecf0f1",
};

const navContainerStyle: React.CSSProperties = {
  maxWidth: "1400px",
  margin: "0 auto",
  padding: "clamp(10px, 3vw, 15px) 16px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "clamp(10px, 3vw, 20px)",
};

const logoContainerStyle: React.CSSProperties = {
  flex: "1",
  minWidth: "clamp(120px, 30vw, 200px)",
};

const logoLinkStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "#2c3e50",
};

const logoImageStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "200px",
  height: "auto",
};

const searchContainerStyle: React.CSSProperties = {
  flex: "2",
  maxWidth: "400px",
  minWidth: "200px",
  display: "flex",
  position: "relative",
};

const searchInputStyle: React.CSSProperties = {
  width: "100%",
  padding: "clamp(8px, 2vw, 10px) 40px clamp(8px, 2vw, 10px) 15px",
  border: "1px solid #bdc3c7",
  borderRadius: "25px",
  fontSize: "clamp(13px, 3vw, 14px)",
  outline: "none",
  transition: "border-color 0.3s",
};

const searchButtonStyle: React.CSSProperties = {
  position: "absolute",
  right: "10px",
  top: "50%",
  transform: "translateY(-50%)",
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: "clamp(14px, 3vw, 16px)",
  color: "#7f8c8d",
};

const searchResultsDropdownStyle: React.CSSProperties = {
  position: "absolute",
  top: "calc(100% + 5px)",
  left: "0",
  right: "0",
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
  zIndex: 1000,
  maxHeight: "400px",
  overflowY: "auto",
};

const searchResultItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  padding: "12px",
  borderBottom: "1px solid #ecf0f1",
  cursor: "pointer",
  transition: "background-color 0.2s",
};

const searchResultImageContainer: React.CSSProperties = {
  width: "50px",
  height: "50px",
  borderRadius: "8px",
  overflow: "hidden",
  marginRight: "12px",
  flexShrink: 0,
};

const searchResultImageStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const searchResultImagePlaceholder: React.CSSProperties = {
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#f0f0f0",
  fontSize: "24px",
};

const searchResultInfoStyle: React.CSSProperties = {
  flex: 1,
};

const searchResultNameStyle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: "bold",
  color: "#2c3e50",
  marginBottom: "4px",
};

const searchResultDetailStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "#7f8c8d",
};

const searchResultOriginalPrice: React.CSSProperties = {
  textDecoration: "line-through",
  marginLeft: "4px",
};

const searchResultPrice: React.CSSProperties = {
  color: "#e67e22",
  fontWeight: "bold",
  marginLeft: "4px",
};

const searchResultViewAllStyle: React.CSSProperties = {
  padding: "12px",
  textAlign: "center",
  borderTop: "1px solid #ecf0f1",
};

const searchResultViewAllButtonStyle: React.CSSProperties = {
  backgroundColor: "#e67e22",
  color: "white",
  border: "none",
  padding: "8px 16px",
  borderRadius: "20px",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "bold",
  width: "100%",
  transition: "background-color 0.2s",
};

const mobileMenuIconStyle: React.CSSProperties = {
  display: "none",
  flexDirection: "column",
  cursor: "pointer",
  padding: "10px",
};

const hamburgerLineStyle: React.CSSProperties = {
  width: "25px",
  height: "3px",
  backgroundColor: "#2c3e50",
  margin: "3px 0",
  borderRadius: "2px",
};

const secondaryNavStyle: React.CSSProperties = {
  backgroundColor: "#1F439C",
  borderBottom: "1px solid #ecf0f1",
};

const secondaryNavContainerStyle: React.CSSProperties = {
  maxWidth: "1400px",
  margin: "0 auto",
  padding: "0 16px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  minHeight: "clamp(40px, 6vw, 50px)",
};

const secondaryMenuStyle: React.CSSProperties = {
  display: "flex",
  listStyle: "none",
  gap: "clamp(10px, 2vw, 20px)",
  margin: "0",
  padding: "0",
};

const secondaryMenuItemStyle: React.CSSProperties = {
  position: "relative",
  margin: "0",
};

const secondaryMenuLinkStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "#ffffff",
  fontSize: "clamp(12px, 2vw, 14px)",
  fontWeight: "bold",
  padding: "clamp(8px, 2vh, 15px) 0",
  display: "block",
  transition: "color 0.3s",
  whiteSpace: "nowrap",
};

const megaDropdownWideStyle: React.CSSProperties = {
  position: "absolute",
  top: "100%",
  left: "0",
  backgroundColor: "#ffffff",
  minWidth: "900px",
  boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
  border: "1px solid #ecf0f1",
  borderRadius: "4px",
  padding: "20px",
  zIndex: 1000,
};

const dropdownRowStyle: React.CSSProperties = {
  display: "flex",
  gap: "30px",
  marginBottom: "20px",
};

const dropdownColumnStyle: React.CSSProperties = {
  flex: 1,
  minWidth: "180px",
};

const dropdownCategoryStyle: React.CSSProperties = {
  color: "#2c3e50",
  fontSize: "14px",
  fontWeight: "bold",
  margin: "0 0 10px 0",
  padding: "0 0 5px 0",
  borderBottom: "2px solid #e67e22",
};

const dropdownItemStyle: React.CSSProperties = {
  display: "block",
  padding: "6px 0",
  textDecoration: "none",
  color: "#34495e",
  fontSize: "13px",
  transition: "color 0.3s",
};

const packageCountStyle: React.CSSProperties = {
  display: "block",
  color: "#7f8c8d",
  fontSize: "11px",
  marginTop: "2px",
  marginBottom: "10px",
  fontStyle: "italic",
};

const specialButtonsStyle: React.CSSProperties = {
  display: "flex",
  gap: "clamp(5px, 2vw, 10px)",
};

const topTreksButtonStyle: React.CSSProperties = {
  backgroundColor: "transparent",
  border: "2px solid #e67e22",
  color: "#e67e22",
  padding: "clamp(4px, 1.5vw, 6px) clamp(10px, 2.5vw, 15px)",
  borderRadius: "25px",
  textDecoration: "none",
  fontSize: "clamp(11px, 2.5vw, 13px)",
  fontWeight: "bold",
  transition: "all 0.3s",
  whiteSpace: "nowrap",
};

const planTripButtonStyle: React.CSSProperties = {
  backgroundColor: "#e67e22",
  border: "2px solid #e67e22",
  color: "white",
  padding: "clamp(4px, 1.5vw, 6px) clamp(10px, 2.5vw, 15px)",
  borderRadius: "25px",
  textDecoration: "none",
  fontSize: "clamp(11px, 2.5vw, 13px)",
  fontWeight: "bold",
  transition: "all 0.3s",
  whiteSpace: "nowrap",
};

const mobileSearchContainerStyle: React.CSSProperties = {
  display: "none",
  padding: "10px 16px",
  backgroundColor: "#f8f9fa",
  position: "relative",
};

const mobileSearchInputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 40px 12px 15px",
  border: "1px solid #bdc3c7",
  borderRadius: "25px",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
};

const mobileSearchButtonStyle: React.CSSProperties = {
  position: "absolute",
  right: "26px",
  top: "50%",
  transform: "translateY(-50%)",
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: "16px",
  color: "#7f8c8d",
};

const mobileOverlayStyle: React.CSSProperties = {
  position: "fixed",
  top: "0",
  left: "0",
  right: "0",
  bottom: "0",
  backgroundColor: "rgba(0,0,0,0.5)",
  zIndex: 999,
};

const mobileMenuDropdownStyle: React.CSSProperties = {
  position: "fixed",
  top: "0",
  left: "0",
  width: "85%",
  maxWidth: "400px",
  height: "100vh",
  backgroundColor: "#ffffff",
  boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
  padding: "20px",
  overflowY: "auto",
  zIndex: 1000,
  animation: "slideIn 0.3s ease",
};

const mobileCloseButtonStyle: React.CSSProperties = {
  position: "absolute",
  top: "15px",
  right: "15px",
  fontSize: "24px",
  cursor: "pointer",
  color: "#2c3e50",
  width: "30px",
  height: "30px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  backgroundColor: "#f8f9fa",
  fontWeight: "bold",
};

const mobileMenuHeaderStyle: React.CSSProperties = {
  marginTop: "20px",
  marginBottom: "20px",
  paddingBottom: "10px",
  borderBottom: "1px solid #ecf0f1",
};

const mobileLogoStyle: React.CSSProperties = {
  width: "150px",
  height: "auto",
};

const mobileMenuListStyle: React.CSSProperties = {
  listStyle: "none",
  margin: "0",
  padding: "0",
};

const mobileNavItemStyle: React.CSSProperties = {
  padding: "12px 0",
  borderBottom: "1px solid #ecf0f1",
};

const mobileNavLinkStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "#2c3e50",
  fontSize: "16px",
  fontWeight: "500",
  display: "block",
};

const mobileSectionStyle: React.CSSProperties = {
  marginTop: "5px",
};

const mobileSectionHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 0",
  borderBottom: "1px solid #ecf0f1",
  cursor: "pointer",
};

const mobileSectionTitleStyle: React.CSSProperties = {
  color: "#2c3e50",
  fontSize: "16px",
  fontWeight: "500",
};

const mobileArrowStyle: React.CSSProperties = {
  color: "#e67e22",
  fontSize: "20px",
  fontWeight: "bold",
};

const mobileDropdownContentStyle: React.CSSProperties = {
  padding: "10px 0 10px 15px",
  backgroundColor: "#f8f9fa",
  borderRadius: "4px",
  marginTop: "5px",
};

const mobileDropdownLinkStyle: React.CSSProperties = {
  display: "block",
  padding: "10px 0",
  textDecoration: "none",
  color: "#34495e",
  fontSize: "14px",
  borderBottom: "1px solid #ecf0f1",
};

const mobileButtonsContainerStyle: React.CSSProperties = {
  display: "flex",
  gap: "10px",
  marginTop: "20px",
  paddingTop: "20px",
  borderTop: "2px solid #ecf0f1",
};

const mobileTopTreksButton: React.CSSProperties = {
  flex: "1",
  textAlign: "center",
  padding: "12px",
  border: "2px solid #e67e22",
  color: "#e67e22",
  textDecoration: "none",
  borderRadius: "25px",
  fontSize: "14px",
  fontWeight: "bold",
};

const mobilePlanTripButton: React.CSSProperties = {
  flex: "1",
  textAlign: "center",
  padding: "12px",
  backgroundColor: "#e67e22",
  border: "2px solid #e67e22",
  color: "white",
  textDecoration: "none",
  borderRadius: "25px",
  fontSize: "14px",
  fontWeight: "bold",
};

const mobileContactInfoStyle: React.CSSProperties = {
  marginTop: "20px",
  paddingTop: "20px",
  borderTop: "2px solid #ecf0f1",
};

const mobileContactItemStyle: React.CSSProperties = {
  padding: "8px 0",
  color: "#2c3e50",
  fontSize: "14px",
};

const mobileExcellenceStyle: React.CSSProperties = {
  marginTop: "10px",
  padding: "8px 0",
  color: "#e67e22",
  fontWeight: "bold",
  fontSize: "14px",
};

export default Header;
