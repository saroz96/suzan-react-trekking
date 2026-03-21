using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class TripItineraryDay
    {
        public int Id { get; set; }
        public int TrekPackageId { get; set; }
        [ForeignKey("TrekPackageId")]
        public virtual TrekPackage? TrekPackage { get; set; }

        public int DayNumber { get; set; }

        [StringLength(200)]
        public string? Title { get; set; } // e.g., "Namche Bazaar → Tengboche"

        public string? Description { get; set; }

        public string? MaxAltitude { get; set; } // "3,860 m"
        public string? Accommodation { get; set; } // "Himalaya Lodge"
        public string? Meals { get; set; } // "Breakfast, Lunch, and Dinner"
        public string? Duration { get; set; } // "5-6 hours"
        public string? Distance { get; set; } // "9.2 kilometers"

        public int DisplayOrder { get; set; }
    }
}