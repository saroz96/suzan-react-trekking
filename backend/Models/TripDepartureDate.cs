using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class TripDepartureDate
    {
        public int Id { get; set; }
        public int TrekPackageId { get; set; }
        [ForeignKey("TrekPackageId")]
        public virtual TrekPackage? TrekPackage { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Column(TypeName = "decimal(18,2)")] // FIXED: Added closing parenthesis
        public decimal Price { get; set; }

        [Column(TypeName = "decimal(18,2)")] // FIXED: Added closing parenthesis
        public decimal? DiscountedPrice { get; set; }

        public bool IsGuaranteed { get; set; } = true;
        public bool IsAvailable { get; set; } = true;

        [StringLength(500)]
        public string? Notes { get; set; } // Additional notes about this departure

        public bool IsBestSeller { get; set; } = false;
        public bool IsTopSeller { get; set; } = false;
        public int BookingCount { get; set; } = 0;
    }
}