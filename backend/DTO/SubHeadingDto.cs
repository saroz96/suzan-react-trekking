
using System.ComponentModel.DataAnnotations;

namespace backend.DTO
{
    public class CreateSubHeadingDto
    {
        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [Required]
        public int MainHeadingId { get; set; }

        [Required]
        public int HeadingId { get; set; }

        [StringLength(500)]
        public string? Description { get; set; }

        public string? Content { get; set; }

        public int DisplayOrder { get; set; } = 0;

        [StringLength(255)]
        public string? IconUrl { get; set; }

        [StringLength(255)]
        public string? ImageUrl { get; set; }

        [StringLength(160)]
        public string? MetaDescription { get; set; }

        [StringLength(100)]
        public string? MetaKeywords { get; set; }
    }

    public class UpdateSubHeadingDto
    {
        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }

        public string? Content { get; set; }

        public int DisplayOrder { get; set; } = 0;

        public bool IsActive { get; set; } = true;

        [StringLength(255)]
        public string? IconUrl { get; set; }

        [StringLength(255)]
        public string? ImageUrl { get; set; }

        [StringLength(160)]
        public string? MetaDescription { get; set; }

        [StringLength(100)]
        public string? MetaKeywords { get; set; }
    }

    public class SubHeadingResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;

        public int MainHeadingId { get; set; }
        public string MainHeadingName { get; set; } = string.Empty;

        public int HeadingId { get; set; }
        public string HeadingName { get; set; } = string.Empty;

        public string? Description { get; set; }
        public string? Content { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsActive { get; set; }
        public string? IconUrl { get; set; }
        public string? ImageUrl { get; set; }
        public string? MetaDescription { get; set; }
        public string? MetaKeywords { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int PackageCount { get; set; }

        // New seller status statistics
        public int BestSellerCount { get; set; } = 0;
        public int TopSellerCount { get; set; } = 0;
        public int GuaranteedCount { get; set; } = 0;
    }

    // DTO for subheading statistics
    public class SubHeadingStatisticsDto
    {
        public int SubHeadingId { get; set; }
        public string SubHeadingName { get; set; } = string.Empty;
        public int TotalPackages { get; set; }
        public int ActivePackages { get; set; }
        public int TotalBestSellerPackages { get; set; }
        public int TotalTopSellerPackages { get; set; }
        public int TotalGuaranteedDepartures { get; set; }
        public int TotalBookings { get; set; }
        public int UpcomingDepartures { get; set; }
        public decimal MinPrice { get; set; }
        public decimal MaxPrice { get; set; }
        public double AveragePrice { get; set; }
        public int MinDuration { get; set; }
        public int MaxDuration { get; set; }
        public double AverageDuration { get; set; }
    }

    // DTO for packages with seller status
    public class PackageWithSellerStatusDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? ShortDescription { get; set; }
        public decimal? Price { get; set; }
        public decimal? DiscountedPrice { get; set; }
        public int? DurationDays { get; set; }
        public string? TripGrade { get; set; }
        public string MainHeadingName { get; set; } = string.Empty;
        public string HeadingName { get; set; } = string.Empty;
        public string SubHeadingName { get; set; } = string.Empty;
        public string CountryName { get; set; } = string.Empty;
        public string? SliderImageUrl { get; set; }

        // Seller status
        public bool IsBestSeller { get; set; }
        public bool IsTopSeller { get; set; }
        public bool HasGuaranteedDeparture { get; set; }

        public DateTime? NextDepartureDate { get; set; }
        public int TotalBookings { get; set; }
    }

    // DTO for best seller subheadings
    public class SubHeadingBestSellerDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string MainHeadingName { get; set; } = string.Empty;
        public string HeadingName { get; set; } = string.Empty;
        public int TotalPackages { get; set; }
        public int BestSellerPackages { get; set; }
        public int TopSellerPackages { get; set; }
        public int TotalBookings { get; set; }
        public string? ImageUrl { get; set; }
    }

    // DTO for nested hierarchy
    public class MainHeadingWithHeadingsAndSubHeadingsDto
    {
        public int MainHeadingId { get; set; }
        public string MainHeadingName { get; set; } = string.Empty;
        public List<HeadingWithSubHeadingsDto> Headings { get; set; } = new();
    }

    public class HeadingWithSubHeadingsDto
    {
        public int HeadingId { get; set; }
        public string HeadingName { get; set; } = string.Empty;
        public List<SubHeadingResponseDto> SubHeadings { get; set; } = new();
    }

    // DTO for reordering
    public class SubHeadingOrderDto
    {
        public int Id { get; set; }
        public int DisplayOrder { get; set; }
    }

    // DTO for bulk operations
    public class BulkSubHeadingCreateDto
    {
        [Required]
        public int MainHeadingId { get; set; }

        [Required]
        public int HeadingId { get; set; }

        public List<CreateSubHeadingDto> SubHeadings { get; set; } = new();
    }
}