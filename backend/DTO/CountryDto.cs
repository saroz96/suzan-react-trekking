using System.ComponentModel.DataAnnotations;

namespace backend.DTO
{
    // Create Country DTO
    public class CreateCountryDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [StringLength(10)]
        public string? Code { get; set; }

        [StringLength(500)]
        public string? Description { get; set; }

        public int DisplayOrder { get; set; } = 0;
    }

    // Update Country DTO
    public class UpdateCountryDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [StringLength(10)]
        public string? Code { get; set; }

        [StringLength(500)]
        public string? Description { get; set; }

        public int DisplayOrder { get; set; } = 0;
        public bool IsActive { get; set; } = true;
    }

    // Country Response DTO
    public class CountryResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Code { get; set; }
        public string? Description { get; set; }
        public string? FlagImageUrl { get; set; }
        public string? CoverImageUrl { get; set; }
        public bool IsActive { get; set; }
        public int DisplayOrder { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        // Statistics
        public int TrekPackageCount { get; set; }
    }

    // Country Detail Response DTO (with packages)
    public class CountryDetailResponseDto : CountryResponseDto
    {
        public List<CountryTrekPackageDto> TrekPackages { get; set; } = new();
    }

    // Simplified Trek Package DTO for Country details
    public class CountryTrekPackageDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? ShortDescription { get; set; }
        public decimal? Price { get; set; }
        public decimal? DiscountedPrice { get; set; }
        public int? DurationDays { get; set; }
        public string? TripGrade { get; set; }
        public string? CoverImageUrl { get; set; }
    }

    // Toggle Status DTO
    public class ToggleCountryStatusDto
    {
        public bool IsActive { get; set; }
    }
}