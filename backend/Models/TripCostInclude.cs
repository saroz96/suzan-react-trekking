using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class TripCostInclude
    {
        public int Id { get; set; }
        public int TrekPackageId { get; set; }
        [ForeignKey("TrekPackageId")]
        public virtual TrekPackage? TrekPackage { get; set; }

        [Required]
        public string Description { get; set; } = string.Empty;

        [StringLength(100)]
        public string? Category { get; set; } // e.g., "Food", "Transportation", "Guides"

        public int DisplayOrder { get; set; }
    }
}