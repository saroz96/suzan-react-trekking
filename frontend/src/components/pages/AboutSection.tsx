import React from "react";

interface AboutSectionProps {
  className?: string;
}

const AboutSection: React.FC<AboutSectionProps> = ({ className }) => {
  return (
    <div style={styles.aboutWhySection} className={className}>
      <div style={styles.container}>
        <div style={styles.twoColumnGrid}>
          {/* Left Column - About Alpine Ramble */}
          <div style={styles.aboutColumn}>
            <h2 style={styles.aboutTitle}>About Alpine Ramble</h2>
            <p style={styles.aboutDescription}>
              Alpine Ramble Treks prides itself on being the leading trekking
              and adventure company in Nepal's travel and tourism industry. We
              are a Kathmandu-based team of passionate trekking enthusiasts who
              have been operating exciting and rewarding tours in Nepal, Tibet,
              and Bhutan for more than a decade. We can also arrange jungle
              safaris, mountaineering expeditions, paragliding excursions, and
              private tours of colorful cities like Kathmandu, Lhasa, and
              Thimphu.
            </p>
            <p style={styles.aboutDescription}>
              No matter where you choose to go, Alpine Ramble Treks is committed
              to ensuring that you receive the best service in the field. Our
              management team, guides, and porters are trained according to the
              highest principles of safety, and our organization is fully
              registered with both the Nepali government and a range of
              respected local and international trekking associations. Ensuring
              that each of our guests enjoys a fun, safe, and unforgettable
              adventure.
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
  );
};

const styles = {
  aboutWhySection: {
    padding: "80px 0",
    backgroundColor: "#1F439C", // Updated background color
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
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
    color: "#ffffff", // Changed to white for better contrast on dark background
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
    color: "#e0e0e0", // Changed to light gray for better readability
    marginBottom: "18px",
  },
  whyChooseColumn: {
    paddingLeft: "20px",
    borderLeft: "2px solid rgba(255, 255, 255, 0.2)", // Changed to semi-transparent white
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
    color: "#ffffff", // Changed to white for better contrast
    marginBottom: "15px",
    lineHeight: "1.3",
  },
  whyChooseSubtitle: {
    fontSize: "17px",
    color: "#e0e0e0", // Changed to light gray
    fontStyle: "italic",
  },
};

export default AboutSection;
