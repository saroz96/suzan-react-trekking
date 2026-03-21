using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class TripSliderImage
    {
        public int Id { get; set; }

        [Required]
        public int TrekPackageId { get; set; }

        [ForeignKey("TrekPackageId")]
        public virtual TrekPackage? TrekPackage { get; set; }

        [Required]
        public string ImageUrl { get; set; } = string.Empty; // Path to the uploaded image

        [StringLength(200)]
        public string? Title { get; set; } // Optional title to display on the slider

        [StringLength(500)]
        public string? Caption { get; set; } // Optional caption for the slider image

        [StringLength(200)]
        public string? AltText { get; set; } // For SEO and accessibility

        public int DisplayOrder { get; set; } // Controls the order in the slider

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}