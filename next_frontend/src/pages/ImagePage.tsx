"use client";

import React from "react";
import Image from "next/image";

const ImagePage: React.FC = () => {
  return (
    <div className="relative w-full overflow-hidden">
      {/* Responsive height based on screen size */}
      <div className="relative w-full h-[60vh] md:h-[70vh] lg:h-[80">
        <Image
          src="/ImagePage.png"
          alt="Nepal Trekking Adventure - Himalayan Landscape"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={90}
        />
      </div>
    </div>
  );
};

export default ImagePage;
