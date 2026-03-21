using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class TrekPackage
    {
        [Key]
        public int Id { get; set; }

        // --- Core Information ---
        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [StringLength(500)]
        public string? ShortDescription { get; set; }

        // --- Pricing & Booking ---
        [Column(TypeName = "decimal(18,2)")]
        public decimal? Price { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? DiscountedPrice { get; set; }

        // --- Trip Facts ---
        public int? DurationDays { get; set; }
        public int? DurationNights { get; set; }

        [StringLength(100)]
        public string? TripGrade { get; set; }

        // --- Hierarchy Relationships ---
        [Required]
        public int MainHeadingId { get; set; }

        [ForeignKey("MainHeadingId")]
        public virtual MainHeading? MainHeading { get; set; }

        [Required]
        public int HeadingId { get; set; }

        [ForeignKey("HeadingId")]
        public virtual Heading? Heading { get; set; }

        public int? SubHeadingId { get; set; }

        [ForeignKey("SubHeadingId")]
        public virtual SubHeading? SubHeading { get; set; }

        // --- Country Relationship ---
        [Required]
        public int CountryId { get; set; }

        [ForeignKey("CountryId")]
        public virtual Country? Country { get; set; }

        // --- Trip Details ---
        [StringLength(50)]
        public string? MaximumAltitude { get; set; }

        [StringLength(50)]
        public string? GroupSize { get; set; }

        [StringLength(200)]
        public string? StartsAt { get; set; }

        [StringLength(200)]
        public string? EndsAt { get; set; }

        [StringLength(200)]
        public string? Activities { get; set; }

        [StringLength(200)]
        public string? BestTime { get; set; }

        // --- Rich Content ---
        public string? Overview { get; set; }

        public string? EssentialInformation { get; set; }

        public string? VideoReviewUrl { get; set; }

        // --- Collections ---
        public virtual ICollection<TripSliderImage> SliderImages { get; set; } = new List<TripSliderImage>();
        public virtual ICollection<TripGalleryImage> GalleryImages { get; set; } = new List<TripGalleryImage>();
        public virtual ICollection<TripItineraryDay> Itinerary { get; set; } = new List<TripItineraryDay>();
        public virtual ICollection<TripCostInclude> CostIncludes { get; set; } = new List<TripCostInclude>();
        public virtual ICollection<TripCostExclude> CostExcludes { get; set; } = new List<TripCostExclude>();
        public virtual ICollection<TripFAQ> Faqs { get; set; } = new List<TripFAQ>();
        public virtual ICollection<TripDepartureDate> DepartureDates { get; set; } = new List<TripDepartureDate>();
        public virtual ICollection<TripGroupDiscount> GroupDiscounts { get; set; } = new List<TripGroupDiscount>();
        // --- Route Map ---
        public string? RouteMapImageUrl { get; set; }

        // --- Audit Fields ---
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public bool IsActive { get; set; } = true;
    }
}