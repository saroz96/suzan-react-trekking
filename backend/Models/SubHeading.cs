using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class SubHeading
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [Required]
        public int MainHeadingId { get; set; }

        [ForeignKey("MainHeadingId")]
        public virtual MainHeading? MainHeading { get; set; }

        [Required]
        public int HeadingId { get; set; }

        [ForeignKey("HeadingId")]
        public virtual Heading? Heading { get; set; }

        [StringLength(500)]
        public string? Description { get; set; }

        // Optional content/body for the subheading
        public string? Content { get; set; }

        // For ordering subheadings within a heading
        public int DisplayOrder { get; set; } = 0;

        // For soft delete
        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Additional optional fields
        [StringLength(255)]
        public string? IconUrl { get; set; }

        [StringLength(255)]
        public string? ImageUrl { get; set; }

        // Meta information for SEO
        [StringLength(160)]
        public string? MetaDescription { get; set; }

        [StringLength(100)]
        public string? MetaKeywords { get; set; }
    }
}