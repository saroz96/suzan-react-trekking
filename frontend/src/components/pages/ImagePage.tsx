import React from "react";

const ImagePage: React.FC = () => {
  return (
    <div
      style={{
        backgroundImage: `url('/ImagePage.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "99vw",
        height: "80vh",
      }}
    />
  );
};

export default ImagePage;
