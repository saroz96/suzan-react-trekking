"use client";

import React from "react";
import HeroSection from "./HeroSection";
import ImagePage from "./ImagePage";
import Header from "../app/components/Header";
import BestSellersSection from "./BestSellerSection";
import TopSellersSection from "./TopSellersSection";
import Footer from "./Footer";

interface PageLayoutProps {
  children?: React.ReactNode;
  showHero?: boolean;
  showImagePage?: boolean;
  showBestSellersSection?: boolean;
  showBestSellers?: boolean;
  showTopSellers?: boolean;
  showFooter?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  showHero = true,
  showImagePage = true,
  showBestSellersSection = true,
  showTopSellers = true,
  showFooter = true,
}) => {
  return (
    <div className="w-full">
      {children}
      {/* {showHeader && <Header />} */}
      {showHero && <HeroSection />}
      {/* {showImagePage && <ImagePage />} */}
      {showBestSellersSection && <BestSellersSection />}
      {showTopSellers && <TopSellersSection />}
      {showFooter && <Footer />}
    </div>
  );
};

export default PageLayout;
