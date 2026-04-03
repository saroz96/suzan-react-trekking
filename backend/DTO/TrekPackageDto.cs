using System.ComponentModel.DataAnnotations;
using System.Text.Json;

namespace backend.DTO
{
    public class CreateTrekPackageDto
    {
        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [StringLength(500)]
        public string? ShortDescription { get; set; }

        public decimal? Price { get; set; }
        public decimal? DiscountedPrice { get; set; }
        public int? DurationDays { get; set; }
        public int? DurationNights { get; set; }

        [StringLength(100)]
        public string? TripGrade { get; set; }

        // Hierarchy IDs
        [Required]
        public int MainHeadingId { get; set; }

        [Required]
        public int HeadingId { get; set; }

        public int? SubHeadingId { get; set; }

        [Required]
        public int CountryId { get; set; }

        [StringLength(50)]
        public string? MaximumAltitude { get; set; }

        [StringLength(50)]
        public string? GroupSize { get; set; }

        [StringLength(200)]
        public string? StartsAt { get; set; }

        [StringLength(200)]
        public string? EndsAt { get; set; }

        [StringLength(200)]
        public string? Activities { get; set; }

        [StringLength(200)]
        public string? BestTime { get; set; }

        public string? Overview { get; set; }
        public string? EssentialInformation { get; set; }
        public string? VideoReviewUrl { get; set; }

        // Images
        public IFormFile? RouteMapImage { get; set; }
        public string? RouteMapImageUrl { get; set; }

        public List<IFormFile>? SliderImages { get; set; }
        public List<string>? SliderTitles { get; set; }
        public List<string>? SliderCaptions { get; set; }
        public List<string>? SliderAltTexts { get; set; }

        public List<IFormFile>? GalleryImages { get; set; }
        public List<string>? GalleryTitles { get; set; }
        public List<string>? GalleryDescriptions { get; set; }
        public List<string>? GalleryAltTexts { get; set; }
        public List<int>? FeaturedImageIndices { get; set; }

        // JSON string properties for collections
        public string? ItineraryJson { get; set; }
        public string? CostIncludesJson { get; set; }
        public string? CostExcludesJson { get; set; }
        public string? FaqsJson { get; set; }
        public string? DepartureDatesJson { get; set; }

        public string? GroupDiscountsJson { get; set; }
        public List<CreateGroupDiscountDto>? GroupDiscounts { get; set; }

        // Related data (populated from JSON)
        public List<CreateItineraryDayDto>? Itinerary { get; set; }
        public List<CreateCostIncludeDto>? CostIncludes { get; set; }
        public List<CreateCostExcludeDto>? CostExcludes { get; set; }
        public List<CreateFaqDto>? Faqs { get; set; }
        public List<CreateDepartureDateDto>? DepartureDates { get; set; }

        public void DeserializeJsonCollections()
        {
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            // Deserialize Itinerary
            if (!string.IsNullOrEmpty(ItineraryJson))
            {
                try
                {
                    Itinerary = JsonSerializer.Deserialize<List<CreateItineraryDayDto>>(ItineraryJson, options);
                }
                catch (JsonException ex)
                {
                    Console.WriteLine($"Error deserializing ItineraryJson: {ex.Message}");
                    Itinerary = new List<CreateItineraryDayDto>();
                }
            }
            else
            {
                Itinerary = new List<CreateItineraryDayDto>();
            }

            // Deserialize Cost Includes
            if (!string.IsNullOrEmpty(CostIncludesJson))
            {
                try
                {
                    CostIncludes = JsonSerializer.Deserialize<List<CreateCostIncludeDto>>(CostIncludesJson, options);
                }
                catch (JsonException ex)
                {
                    Console.WriteLine($"Error deserializing CostIncludesJson: {ex.Message}");
                    CostIncludes = new List<CreateCostIncludeDto>();
                }
            }
            else
            {
                CostIncludes = new List<CreateCostIncludeDto>();
            }

            // Deserialize Cost Excludes
            if (!string.IsNullOrEmpty(CostExcludesJson))
            {
                try
                {
                    CostExcludes = JsonSerializer.Deserialize<List<CreateCostExcludeDto>>(CostExcludesJson, options);
                }
                catch (JsonException ex)
                {
                    Console.WriteLine($"Error deserializing CostExcludesJson: {ex.Message}");
                    CostExcludes = new List<CreateCostExcludeDto>();
                }
            }
            else
            {
                CostExcludes = new List<CreateCostExcludeDto>();
            }

            // Deserialize FAQs
            if (!string.IsNullOrEmpty(FaqsJson))
            {
                try
                {
                    Faqs = JsonSerializer.Deserialize<List<CreateFaqDto>>(FaqsJson, options);
                }
                catch (JsonException ex)
                {
                    Console.WriteLine($"Error deserializing FaqsJson: {ex.Message}");
                    Faqs = new List<CreateFaqDto>();
                }
            }
            else
            {
                Faqs = new List<CreateFaqDto>();
            }

            // Deserialize Departure Dates
            if (!string.IsNullOrEmpty(DepartureDatesJson))
            {
                try
                {
                    DepartureDates = JsonSerializer.Deserialize<List<CreateDepartureDateDto>>(DepartureDatesJson, options);
                }
                catch (JsonException ex)
                {
                    Console.WriteLine($"Error deserializing DepartureDatesJson: {ex.Message}");
                    DepartureDates = new List<CreateDepartureDateDto>();
                }
            }
            else
            {
                DepartureDates = new List<CreateDepartureDateDto>();
            }

            if (!string.IsNullOrEmpty(GroupDiscountsJson))
            {
                try
                {
                    GroupDiscounts = JsonSerializer.Deserialize<List<CreateGroupDiscountDto>>(GroupDiscountsJson, options);
                }
                catch (JsonException ex)
                {
                    Console.WriteLine($"Error deserializing GroupDiscountsJson: {ex.Message}");
                    GroupDiscounts = new List<CreateGroupDiscountDto>();
                }
            }
            else
            {
                GroupDiscounts = new List<CreateGroupDiscountDto>();
            }
        }
    }

    public class UpdateTrekPackageDto
    {
        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [StringLength(500)]
        public string? ShortDescription { get; set; }

        public decimal? Price { get; set; }
        public decimal? DiscountedPrice { get; set; }
        public int? DurationDays { get; set; }
        public int? DurationNights { get; set; }

        [StringLength(100)]
        public string? TripGrade { get; set; }

        // Hierarchy IDs
        [Required]
        public int MainHeadingId { get; set; }

        [Required]
        public int HeadingId { get; set; }

        public int? SubHeadingId { get; set; }

        [Required]
        public int CountryId { get; set; }

        [StringLength(50)]
        public string? MaximumAltitude { get; set; }

        [StringLength(50)]
        public string? GroupSize { get; set; }

        [StringLength(200)]
        public string? StartsAt { get; set; }

        [StringLength(200)]
        public string? EndsAt { get; set; }

        [StringLength(200)]
        public string? Activities { get; set; }

        [StringLength(200)]
        public string? BestTime { get; set; }

        public string? Overview { get; set; }
        public string? EssentialInformation { get; set; }
        public string? VideoReviewUrl { get; set; }

        // Images
        public IFormFile? RouteMapImage { get; set; }

        // Slider images with IDs for existing images
        public List<IFormFile>? SliderImages { get; set; }
        public List<string>? SliderImageIds { get; set; }  // IDs of existing slider images
        public List<string>? SliderTitles { get; set; }
        public List<string>? SliderCaptions { get; set; }
        public List<string>? SliderAltTexts { get; set; }

        // Gallery images with IDs for existing images
        public List<IFormFile>? GalleryImages { get; set; }
        public List<string>? GalleryImageIds { get; set; }  // IDs of existing gallery images
        public List<string>? GalleryTitles { get; set; }
        public List<string>? GalleryDescriptions { get; set; }
        public List<string>? GalleryAltTexts { get; set; }
        public List<int>? FeaturedImageIndices { get; set; }

        // JSON string properties for collections
        public string? ItineraryJson { get; set; }
        public string? CostIncludesJson { get; set; }
        public string? CostExcludesJson { get; set; }
        public string? FaqsJson { get; set; }
        public string? DepartureDatesJson { get; set; }
        public string? GroupDiscountsJson { get; set; }

        // Related data (populated from JSON)
        public List<UpdateItineraryDayDto>? Itinerary { get; set; }
        public List<UpdateCostIncludeDto>? CostIncludes { get; set; }
        public List<UpdateCostExcludeDto>? CostExcludes { get; set; }
        public List<UpdateFaqDto>? Faqs { get; set; }
        public List<UpdateDepartureDateDto>? DepartureDates { get; set; }
        public List<CreateGroupDiscountDto>? GroupDiscounts { get; set; }

        public void DeserializeJsonCollections()
        {
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            if (!string.IsNullOrEmpty(ItineraryJson))
            {
                try
                {
                    Itinerary = JsonSerializer.Deserialize<List<UpdateItineraryDayDto>>(ItineraryJson, options);
                }
                catch (JsonException ex)
                {
                    Console.WriteLine($"Error deserializing ItineraryJson: {ex.Message}");
                    Itinerary = new List<UpdateItineraryDayDto>();
                }
            }
            else
            {
                Itinerary = new List<UpdateItineraryDayDto>();
            }

            if (!string.IsNullOrEmpty(CostIncludesJson))
            {
                try
                {
                    CostIncludes = JsonSerializer.Deserialize<List<UpdateCostIncludeDto>>(CostIncludesJson, options);
                }
                catch (JsonException ex)
                {
                    Console.WriteLine($"Error deserializing CostIncludesJson: {ex.Message}");
                    CostIncludes = new List<UpdateCostIncludeDto>();
                }
            }
            else
            {
                CostIncludes = new List<UpdateCostIncludeDto>();
            }

            if (!string.IsNullOrEmpty(CostExcludesJson))
            {
                try
                {
                    CostExcludes = JsonSerializer.Deserialize<List<UpdateCostExcludeDto>>(CostExcludesJson, options);
                }
                catch (JsonException ex)
                {
                    Console.WriteLine($"Error deserializing CostExcludesJson: {ex.Message}");
                    CostExcludes = new List<UpdateCostExcludeDto>();
                }
            }
            else
            {
                CostExcludes = new List<UpdateCostExcludeDto>();
            }

            if (!string.IsNullOrEmpty(FaqsJson))
            {
                try
                {
                    Faqs = JsonSerializer.Deserialize<List<UpdateFaqDto>>(FaqsJson, options);
                }
                catch (JsonException ex)
                {
                    Console.WriteLine($"Error deserializing FaqsJson: {ex.Message}");
                    Faqs = new List<UpdateFaqDto>();
                }
            }
            else
            {
                Faqs = new List<UpdateFaqDto>();
            }

            if (!string.IsNullOrEmpty(DepartureDatesJson))
            {
                try
                {
                    DepartureDates = JsonSerializer.Deserialize<List<UpdateDepartureDateDto>>(DepartureDatesJson, options);
                }
                catch (JsonException ex)
                {
                    Console.WriteLine($"Error deserializing DepartureDatesJson: {ex.Message}");
                    DepartureDates = new List<UpdateDepartureDateDto>();
                }
            }
            else
            {
                DepartureDates = new List<UpdateDepartureDateDto>();
            }

            if (!string.IsNullOrEmpty(GroupDiscountsJson))
            {
                try
                {
                    GroupDiscounts = JsonSerializer.Deserialize<List<CreateGroupDiscountDto>>(GroupDiscountsJson, options);
                }
                catch (JsonException ex)
                {
                    Console.WriteLine($"Error deserializing GroupDiscountsJson: {ex.Message}");
                    GroupDiscounts = new List<CreateGroupDiscountDto>();
                }
            }
            else
            {
                GroupDiscounts = new List<CreateGroupDiscountDto>();
            }
        }
    }

    public class CreateItineraryDayDto
    {
        [Required]
        public int DayNumber { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? MaxAltitude { get; set; }
        public string? Accommodation { get; set; }
        public string? Meals { get; set; }
        public string? Duration { get; set; }
        public string? Distance { get; set; }
    }

    public class UpdateItineraryDayDto : CreateItineraryDayDto
    {
        public int Id { get; set; }
    }

    public class TripItineraryDayDto : UpdateItineraryDayDto { }

    public class CreateCostIncludeDto
    {
        [Required]
        public string Description { get; set; } = string.Empty;
        public string? Category { get; set; }
        public int DisplayOrder { get; set; }
    }

    public class UpdateCostIncludeDto : CreateCostIncludeDto
    {
        public int Id { get; set; }
    }

    public class TripCostIncludeDto : UpdateCostIncludeDto { }

    public class CreateCostExcludeDto
    {
        [Required]
        public string Description { get; set; } = string.Empty;
        public string? Category { get; set; }
        public int DisplayOrder { get; set; }
    }

    public class UpdateCostExcludeDto : CreateCostExcludeDto
    {
        public int Id { get; set; }
    }

    public class TripCostExcludeDto : UpdateCostExcludeDto { }

    public class CreateFaqDto
    {
        [Required]
        public string Question { get; set; } = string.Empty;
        [Required]
        public string Answer { get; set; } = string.Empty;
        public int DisplayOrder { get; set; }
    }

    public class UpdateFaqDto : CreateFaqDto
    {
        public int Id { get; set; }
    }

    public class TripFaqDto : UpdateFaqDto { }

    public class CreateDepartureDateDto
    {
        [Required]
        public DateTime StartDate { get; set; }
        [Required]
        public DateTime EndDate { get; set; }
        [Required]
        public decimal Price { get; set; }
        public decimal? DiscountedPrice { get; set; }
        public bool IsGuaranteed { get; set; } = true;
        public string? Notes { get; set; }
        public bool IsBestSeller { get; set; } = false;
        public bool IsTopSeller { get; set; } = false;
        public int BookingCount { get; set; } = 0;

        public void ConvertToUtc()
        {
            if (StartDate.Kind != DateTimeKind.Utc)
            {
                StartDate = DateTime.SpecifyKind(StartDate, DateTimeKind.Utc);
            }

            if (EndDate.Kind != DateTimeKind.Utc)
            {
                EndDate = DateTime.SpecifyKind(EndDate, DateTimeKind.Utc);
            }
        }
    }

    public class UpdateDepartureDateDto : CreateDepartureDateDto
    {
        public int Id { get; set; }
    }

    public class TripDepartureDateDto : UpdateDepartureDateDto
    {
        public bool IsAvailable { get; set; }
    }

    // Image DTOs
    public class TripSliderImageDto
    {
        public int Id { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string? Title { get; set; }
        public string? Caption { get; set; }
        public string? AltText { get; set; }
        public int DisplayOrder { get; set; }
    }

    public class TripGalleryImageDto
    {
        public int Id { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? AltText { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsFeatured { get; set; }
    }

    public class TrekPackageResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? ShortDescription { get; set; }
        public decimal? Price { get; set; }
        public decimal? DiscountedPrice { get; set; }
        public int? DurationDays { get; set; }
        public int? DurationNights { get; set; }
        public string? TripGrade { get; set; }

        public int MainHeadingId { get; set; }
        public string MainHeadingName { get; set; } = string.Empty;
        public int HeadingId { get; set; }
        public string HeadingName { get; set; } = string.Empty;
        public int? SubHeadingId { get; set; }
        public string? SubHeadingName { get; set; }
        public int CountryId { get; set; }
        public string CountryName { get; set; } = string.Empty;
        public string? MaximumAltitude { get; set; }
        public string? GroupSize { get; set; }
        public string? StartsAt { get; set; }
        public string? EndsAt { get; set; }
        public string? Activities { get; set; }
        public string? BestTime { get; set; }
        public string? Overview { get; set; }
        public string? EssentialInformation { get; set; }
        public string? VideoReviewUrl { get; set; }
        public string? RouteMapImageUrl { get; set; }
        public bool IsActive { get; set; }
        public bool IsBestSeller { get; set; } = false;
        public bool IsTopSeller { get; set; } = false;
        public bool HasGuaranteedDeparture { get; set; } = false;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public List<TripSliderImageDto> SliderImages { get; set; } = new();
        public List<TripGalleryImageDto> GalleryImages { get; set; } = new();
        public List<TripItineraryDayDto> Itinerary { get; set; } = new();
        public List<TripCostIncludeDto> CostIncludes { get; set; } = new();
        public List<TripCostExcludeDto> CostExcludes { get; set; } = new();
        public List<TripFaqDto> Faqs { get; set; } = new();
        public List<TripDepartureDateDto> DepartureDates { get; set; } = new();
        public List<GroupDiscountDto> GroupDiscounts { get; set; } = new();

        public ReviewStatsDto? ReviewStats { get; set; }
        public List<ReviewResponseDto>? RecentReviews { get; set; }
    }
}