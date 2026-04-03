import React from "react";
import BestSellersSection from "./BestSellersSection";
import TopSellersSection from "./TopSellersSection";
import Footer from "./Footer";
import FooterImage from "./FooterImage";
import LandingPage from "./LandingPage";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import ImagePage from "./ImagePage";

const Layouts: React.FC = () => {
  return (
    <div>
      <HeroSection />
      <ImagePage />
      <AboutSection />
      {/* Best Sellers Section */}
      <BestSellersSection />

      {/* Top Sellers Section */}
      <TopSellersSection />

      {/* <FooterImage /> */}
      <Footer />
    </div>
  );
};

export default Layouts;
