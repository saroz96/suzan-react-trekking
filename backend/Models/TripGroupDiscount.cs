// backend/Models/TripGroupDiscount.cs
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class TripGroupDiscount
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int TrekPackageId { get; set; }

        [ForeignKey("TrekPackageId")]
        public virtual TrekPackage? TrekPackage { get; set; }

        [Required]
        public int MinTravelers { get; set; }

        [Required]
        public int MaxTravelers { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal PricePerPerson { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? DiscountPercentage { get; set; }

        [StringLength(200)]
        public string? Description { get; set; }

        public int DisplayOrder { get; set; } = 0;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}