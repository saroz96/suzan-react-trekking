using System.ComponentModel.DataAnnotations;

namespace backend.DTO
{
    public class CreateHeadingDto
    {
        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [Required]
        public int MainHeadingId { get; set; }

        [StringLength(500)]
        public string? Description { get; set; }

        public int DisplayOrder { get; set; } = 0;
    }

    public class UpdateHeadingDto
    {
        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }

        public int DisplayOrder { get; set; } = 0;
        public bool IsActive { get; set; } = true;
    }

    public class HeadingResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int MainHeadingId { get; set; }
        public string? MainHeadingName { get; set; } // Include parent name for convenience
        public string? Description { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    // DTO for headings grouped by main heading
    public class MainHeadingWithHeadingsDto
    {
        public int MainHeadingId { get; set; }
        public string MainHeadingName { get; set; } = string.Empty;
        public List<HeadingResponseDto> Headings { get; set; } = new();
    }
}