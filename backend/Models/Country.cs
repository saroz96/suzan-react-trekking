using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Country
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [StringLength(10)]
        public string? Code { get; set; } // e.g., "NP" for Nepal, "BT" for Bhutan

        [StringLength(500)]
        public string? Description { get; set; }

        [StringLength(255)]
        public string? FlagImageUrl { get; set; } // URL to country flag image

        [StringLength(255)]
        public string? CoverImageUrl { get; set; } // Cover image for country page

        public bool IsActive { get; set; } = true;

        public int DisplayOrder { get; set; } = 0;

        // Relationship: A country can have many trek packages
        public virtual ICollection<TrekPackage> TrekPackages { get; set; } = new List<TrekPackage>();

        // Audit fields
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}