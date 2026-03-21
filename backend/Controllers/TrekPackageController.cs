// using Microsoft.AspNetCore.Mvc;
// using Microsoft.EntityFrameworkCore;
// using backend.Data;
// using backend.Models;
// using backend.DTO;
// using Microsoft.Extensions.Logging;
// using System.Text.Json;

// namespace backend.Controllers
// {
//     [Route("api/[controller]")]
//     [ApiController]
//     public class TrekPackageController : ControllerBase
//     {
//         private readonly ApplicationDbContext _context;
//         private readonly IWebHostEnvironment _environment;
//         private readonly ILogger<TrekPackageController> _logger;

//         public TrekPackageController(
//             ApplicationDbContext context,
//             IWebHostEnvironment environment,
//             ILogger<TrekPackageController> logger)
//         {
//             _context = context;
//             _environment = environment;
//             _logger = logger;
//         }

//         // GET: api/TrekPackage
//         [HttpGet]
//         public async Task<ActionResult<IEnumerable<TrekPackageResponseDto>>> GetTrekPackages()
//         {
//             try
//             {
//                 var packages = await _context.TrekPackages
//                     .Include(t => t.Country)
//                     .Include(t => t.MainHeading)
//                     .Include(t => t.Heading)
//                     .Include(t => t.SubHeading)
//                     .Include(t => t.SliderImages)
//                     .Include(t => t.GalleryImages)
//                     .Include(t => t.Itinerary)
//                     .Include(t => t.CostIncludes)
//                     .Include(t => t.CostExcludes)
//                     .Include(t => t.Faqs)
//                     .Include(t => t.DepartureDates)
//                     .Include(t => t.GroupDiscounts)
//                     .OrderByDescending(t => t.CreatedAt)
//                     .Select(t => MapToResponseDto(t))
//                     .ToListAsync();

//                 return Ok(packages);
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "Error fetching trek packages");
//                 return StatusCode(500, new { message = "Error fetching packages", error = ex.Message });
//             }
//         }

//         // GET: api/TrekPackage/5
//         [HttpGet("{id}")]
//         public async Task<ActionResult<TrekPackageResponseDto>> GetTrekPackage(int id)
//         {
//             try
//             {
//                 var package = await _context.TrekPackages
//                     .Include(t => t.Country)
//                     .Include(t => t.MainHeading)
//                     .Include(t => t.Heading)
//                     .Include(t => t.SubHeading)
//                     .Include(t => t.SliderImages.OrderBy(s => s.DisplayOrder))
//                     .Include(t => t.GalleryImages.OrderBy(g => g.DisplayOrder))
//                     .Include(t => t.Itinerary.OrderBy(i => i.DayNumber))
//                     .Include(t => t.CostIncludes.OrderBy(c => c.DisplayOrder))
//                     .Include(t => t.CostExcludes.OrderBy(c => c.DisplayOrder))
//                     .Include(t => t.Faqs.OrderBy(f => f.DisplayOrder))
//                     .Include(t => t.DepartureDates.OrderBy(d => d.StartDate))
//                     .Include(t => t.GroupDiscounts.OrderBy(g => g.MinTravelers))
//                     .FirstOrDefaultAsync(t => t.Id == id);

//                 if (package == null)
//                 {
//                     return NotFound(new { message = "Trek package not found" });
//                 }

//                 return Ok(MapToResponseDto(package));
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, $"Error fetching trek package with ID: {id}");
//                 return StatusCode(500, new { message = "Error fetching package", error = ex.Message });
//             }
//         }

//         // GET: api/TrekPackage/by-mainheading/5
//         [HttpGet("by-mainheading/{mainHeadingId}")]
//         public async Task<ActionResult<IEnumerable<TrekPackageResponseDto>>> GetTrekPackagesByMainHeading(int mainHeadingId)
//         {
//             try
//             {
//                 var packages = await _context.TrekPackages
//                     .Include(t => t.Country)
//                     .Include(t => t.MainHeading)
//                     .Include(t => t.Heading)
//                     .Include(t => t.SubHeading)
//                     .Include(t => t.SliderImages)
//                     .Include(t => t.GalleryImages)
//                     .Where(t => t.MainHeadingId == mainHeadingId && t.IsActive)
//                     .OrderByDescending(t => t.CreatedAt)
//                     .Select(t => MapToResponseDto(t))
//                     .ToListAsync();

//                 return Ok(packages);
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, $"Error fetching packages by main heading: {mainHeadingId}");
//                 return StatusCode(500, new { message = "Error fetching packages", error = ex.Message });
//             }
//         }

//         // GET: api/TrekPackage/by-heading/5
//         [HttpGet("by-heading/{headingId}")]
//         public async Task<ActionResult<IEnumerable<TrekPackageResponseDto>>> GetTrekPackagesByHeading(int headingId)
//         {
//             try
//             {
//                 var packages = await _context.TrekPackages
//                     .Include(t => t.Country)
//                     .Include(t => t.MainHeading)
//                     .Include(t => t.Heading)
//                     .Include(t => t.SubHeading)
//                     .Include(t => t.SliderImages)
//                     .Include(t => t.GalleryImages)
//                     .Where(t => t.HeadingId == headingId && t.IsActive)
//                     .OrderByDescending(t => t.CreatedAt)
//                     .Select(t => MapToResponseDto(t))
//                     .ToListAsync();

//                 return Ok(packages);
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, $"Error fetching packages by heading: {headingId}");
//                 return StatusCode(500, new { message = "Error fetching packages", error = ex.Message });
//             }
//         }

//         [HttpGet("by-subheading/{subHeadingId}")]
//         public async Task<ActionResult<IEnumerable<TrekPackageResponseDto>>> GetTrekPackagesBySubHeading(int subHeadingId)
//         {
//             // Load packages with all necessary data
//             var packages = await _context.TrekPackages
//                 .Include(t => t.Country)
//                 .Include(t => t.MainHeading)
//                 .Include(t => t.Heading)
//                 .Include(t => t.SubHeading)
//                 .Include(t => t.SliderImages)
//                 .Include(t => t.GalleryImages)
//                 .Include(t => t.DepartureDates)
//                 .Include(t => t.GroupDiscounts)
//                 .Where(t => t.SubHeadingId == subHeadingId && t.IsActive)
//                 .OrderByDescending(t => t.CreatedAt)
//                 .ToListAsync();

//             // Map to DTO in memory
//             var result = packages.Select(t => new TrekPackageResponseDto
//             {
//                 Id = t.Id,
//                 Name = t.Name,
//                 ShortDescription = t.ShortDescription,
//                 Price = t.Price,
//                 DiscountedPrice = t.DiscountedPrice,
//                 DurationDays = t.DurationDays,
//                 DurationNights = t.DurationNights,
//                 TripGrade = t.TripGrade,
//                 MainHeadingId = t.MainHeadingId,
//                 MainHeadingName = t.MainHeading?.Name ?? string.Empty,
//                 HeadingId = t.HeadingId,
//                 HeadingName = t.Heading?.Name ?? string.Empty,
//                 SubHeadingId = t.SubHeadingId,
//                 SubHeadingName = t.SubHeading?.Name,
//                 CountryId = t.CountryId,
//                 CountryName = t.Country?.Name ?? string.Empty,
//                 MaximumAltitude = t.MaximumAltitude,
//                 GroupSize = t.GroupSize,
//                 StartsAt = t.StartsAt,
//                 EndsAt = t.EndsAt,
//                 Activities = t.Activities,
//                 BestTime = t.BestTime,
//                 Overview = t.Overview,
//                 EssentialInformation = t.EssentialInformation,
//                 VideoReviewUrl = t.VideoReviewUrl,
//                 RouteMapImageUrl = t.RouteMapImageUrl,
//                 IsActive = t.IsActive,
//                 CreatedAt = t.CreatedAt,
//                 UpdatedAt = t.UpdatedAt,

//                 // Map slider images
//                 SliderImages = t.SliderImages?.Select(s => new TripSliderImageDto
//                 {
//                     Id = s.Id,
//                     ImageUrl = s.ImageUrl,
//                     Title = s.Title,
//                     Caption = s.Caption,
//                     AltText = s.AltText,
//                     DisplayOrder = s.DisplayOrder
//                 }).OrderBy(s => s.DisplayOrder).ToList() ?? new List<TripSliderImageDto>(),

//                 // Map gallery images
//                 GalleryImages = t.GalleryImages?.Select(g => new TripGalleryImageDto
//                 {
//                     Id = g.Id,
//                     ImageUrl = g.ImageUrl,
//                     Title = g.Title,
//                     Description = g.Description,
//                     AltText = g.AltText,
//                     DisplayOrder = g.DisplayOrder,
//                     IsFeatured = g.IsFeatured
//                 }).OrderBy(g => g.DisplayOrder).ToList() ?? new List<TripGalleryImageDto>(),

//                 GroupDiscounts = t.GroupDiscounts?.Select(g => new GroupDiscountDto
//                 {
//                     Id = g.Id,
//                     MinTravelers = g.MinTravelers,
//                     MaxTravelers = g.MaxTravelers,
//                     PricePerPerson = g.PricePerPerson,
//                     DiscountPercentage = g.DiscountPercentage,
//                     Description = g.Description,
//                     DisplayOrder = g.DisplayOrder,
//                     IsActive = g.IsActive,
//                     TotalPrice = g.PricePerPerson * g.MaxTravelers
//                 }).OrderBy(g => g.MinTravelers).ToList() ?? new List<GroupDiscountDto>(),

//                 // Empty collections for other data
//                 Itinerary = new List<TripItineraryDayDto>(),
//                 CostIncludes = new List<TripCostIncludeDto>(),
//                 CostExcludes = new List<TripCostExcludeDto>(),
//                 Faqs = new List<TripFaqDto>(),
//                 DepartureDates = new List<TripDepartureDateDto>(),

//                 // FIXED: Check for ANY departure dates with seller status, not just future ones
//                 IsBestSeller = t.DepartureDates != null &&
//                     t.DepartureDates.Any(d => d.IsBestSeller == true),
//                 IsTopSeller = t.DepartureDates != null &&
//                     t.DepartureDates.Any(d => d.IsTopSeller == true),
//                 HasGuaranteedDeparture = t.DepartureDates != null &&
//                     t.DepartureDates.Any(d => d.IsGuaranteed == true)
//             }).ToList();

//             return Ok(result);
//         }

//         // GET: api/TrekPackage/featured
//         [HttpGet("featured")]
//         public async Task<ActionResult<IEnumerable<TrekPackageResponseDto>>> GetFeaturedPackages()
//         {
//             try
//             {
//                 var packages = await _context.TrekPackages
//                     .Include(t => t.Country)
//                     .Include(t => t.MainHeading)
//                     .Include(t => t.Heading)
//                     .Include(t => t.SubHeading)
//                     .Include(t => t.SliderImages.Where(s => s.IsActive))
//                     .Include(t => t.GalleryImages.Where(g => g.IsFeatured && g.IsActive))
//                     .Where(t => t.IsActive)
//                     .OrderBy(t => t.Name)
//                     .Take(6)
//                     .Select(t => MapToResponseDto(t))
//                     .ToListAsync();

//                 return Ok(packages);
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "Error fetching featured packages");
//                 return StatusCode(500, new { message = "Error fetching featured packages", error = ex.Message });
//             }
//         }

//         // POST: api/TrekPackage
//         [HttpPost]
//         public async Task<ActionResult<TrekPackageResponseDto>> CreateTrekPackage([FromForm] CreateTrekPackageDto createDto)
//         {
//             try
//             {
//                 _logger.LogInformation("Starting package creation");

//                 if (!ModelState.IsValid)
//                 {
//                     _logger.LogWarning("Invalid model state");
//                     return BadRequest(ModelState);
//                 }

//                 // Log received JSON data
//                 _logger.LogInformation($"Received ItineraryJson: {createDto.ItineraryJson}");
//                 _logger.LogInformation($"Received CostIncludesJson: {createDto.CostIncludesJson}");
//                 _logger.LogInformation($"Received CostExcludesJson: {createDto.CostExcludesJson}");
//                 _logger.LogInformation($"Received FaqsJson: {createDto.FaqsJson}");
//                 _logger.LogInformation($"Received DepartureDatesJson: {createDto.DepartureDatesJson}");

//                 // Deserialize JSON collections
//                 createDto.DeserializeJsonCollections();

//                 // Log deserialized data
//                 _logger.LogInformation($"Deserialized Itinerary count: {createDto.Itinerary?.Count ?? 0}");
//                 _logger.LogInformation($"Deserialized CostIncludes count: {createDto.CostIncludes?.Count ?? 0}");
//                 _logger.LogInformation($"Deserialized CostExcludes count: {createDto.CostExcludes?.Count ?? 0}");
//                 _logger.LogInformation($"Deserialized Faqs count: {createDto.Faqs?.Count ?? 0}");
//                 _logger.LogInformation($"Deserialized DepartureDates count: {createDto.DepartureDates?.Count ?? 0}");

//                 // Check if main heading exists
//                 var mainHeading = await _context.MainHeadings.FindAsync(createDto.MainHeadingId);
//                 if (mainHeading == null)
//                 {
//                     return NotFound(new { message = "Main heading not found" });
//                 }

//                 // Check if heading exists and belongs to the main heading
//                 var heading = await _context.Headings
//                     .FirstOrDefaultAsync(h => h.Id == createDto.HeadingId && h.MainHeadingId == createDto.MainHeadingId);
//                 if (heading == null)
//                 {
//                     return NotFound(new { message = "Heading not found or does not belong to the selected main heading" });
//                 }

//                 // Check if subheading exists if provided
//                 if (createDto.SubHeadingId.HasValue)
//                 {
//                     var subHeading = await _context.SubHeadings
//                         .FirstOrDefaultAsync(sh => sh.Id == createDto.SubHeadingId &&
//                                                   sh.HeadingId == createDto.HeadingId &&
//                                                   sh.MainHeadingId == createDto.MainHeadingId);
//                     if (subHeading == null)
//                     {
//                         return NotFound(new { message = "Subheading not found or does not belong to the selected heading" });
//                     }
//                 }

//                 // Check if country exists
//                 var country = await _context.Countries.FindAsync(createDto.CountryId);
//                 if (country == null)
//                 {
//                     return NotFound(new { message = "Country not found" });
//                 }

//                 // Check if package with same name exists
//                 var existingPackage = await _context.TrekPackages
//                     .FirstOrDefaultAsync(t => t.Name.ToLower() == createDto.Name.ToLower());

//                 if (existingPackage != null)
//                 {
//                     return Conflict(new { message = "A trek package with this name already exists" });
//                 }

//                 // Create new package
//                 var package = new TrekPackage
//                 {
//                     Name = createDto.Name,
//                     ShortDescription = createDto.ShortDescription,
//                     Price = createDto.Price,
//                     DiscountedPrice = createDto.DiscountedPrice,
//                     DurationDays = createDto.DurationDays,
//                     DurationNights = createDto.DurationNights,
//                     TripGrade = createDto.TripGrade,

//                     // Hierarchy
//                     MainHeadingId = createDto.MainHeadingId,
//                     HeadingId = createDto.HeadingId,
//                     SubHeadingId = createDto.SubHeadingId,

//                     CountryId = createDto.CountryId,
//                     MaximumAltitude = createDto.MaximumAltitude,
//                     GroupSize = createDto.GroupSize,
//                     StartsAt = createDto.StartsAt,
//                     EndsAt = createDto.EndsAt,
//                     Activities = createDto.Activities,
//                     BestTime = createDto.BestTime,
//                     Overview = createDto.Overview,
//                     EssentialInformation = createDto.EssentialInformation,
//                     VideoReviewUrl = createDto.VideoReviewUrl,
//                     CreatedAt = DateTime.UtcNow,
//                     IsActive = true
//                 };

//                 _context.TrekPackages.Add(package);
//                 await _context.SaveChangesAsync();

//                 // Handle Route Map Image if uploaded
//                 if (createDto.RouteMapImage != null)
//                 {
//                     var imageUrl = await SaveImage(createDto.RouteMapImage, "routemaps");
//                     package.RouteMapImageUrl = imageUrl;
//                     await _context.SaveChangesAsync();
//                 }

//                 // Handle Slider Images
//                 if (createDto.SliderImages != null && createDto.SliderImages.Any())
//                 {
//                     for (int i = 0; i < createDto.SliderImages.Count; i++)
//                     {
//                         var image = createDto.SliderImages[i];
//                         var imageUrl = await SaveImage(image, "slider");

//                         _context.TripSliderImages.Add(new TripSliderImage
//                         {
//                             TrekPackageId = package.Id,
//                             ImageUrl = imageUrl,
//                             Title = createDto.SliderTitles?[i],
//                             Caption = createDto.SliderCaptions?[i],
//                             AltText = createDto.SliderAltTexts?[i],
//                             DisplayOrder = i,
//                             IsActive = true
//                         });
//                     }
//                 }

//                 // Handle Gallery Images
//                 // if (createDto.GalleryImages != null && createDto.GalleryImages.Any())
//                 // {
//                 //     for (int i = 0; i < createDto.GalleryImages.Count; i++)
//                 //     {
//                 //         var image = createDto.GalleryImages[i];
//                 //         var imageUrl = await SaveImage(image, "gallery");

//                 //         _context.TripGalleryImages.Add(new TripGalleryImage
//                 //         {
//                 //             TrekPackageId = package.Id,
//                 //             ImageUrl = imageUrl,
//                 //             Title = createDto.GalleryTitles?[i],
//                 //             Description = createDto.GalleryDescriptions?[i],
//                 //             AltText = createDto.GalleryAltTexts?[i],
//                 //             DisplayOrder = i,
//                 //             IsFeatured = createDto.FeaturedImageIndices?.Contains(i) ?? false,
//                 //             IsActive = true
//                 //         });
//                 //     }
//                 // }

//                 // Handle Gallery Images - FIXED
//                 if (createDto.GalleryImages != null && createDto.GalleryImages.Any())
//                 {
//                     for (int i = 0; i < createDto.GalleryImages.Count; i++)
//                     {
//                         var image = createDto.GalleryImages[i];
//                         var imageUrl = await SaveImage(image, "gallery");

//                         // Safe access to metadata arrays - check if index exists
//                         var title = (createDto.GalleryTitles != null && i < createDto.GalleryTitles.Count)
//                             ? createDto.GalleryTitles[i] : null;

//                         var description = (createDto.GalleryDescriptions != null && i < createDto.GalleryDescriptions.Count)
//                             ? createDto.GalleryDescriptions[i] : null;

//                         var altText = (createDto.GalleryAltTexts != null && i < createDto.GalleryAltTexts.Count)
//                             ? createDto.GalleryAltTexts[i] : null;

//                         _context.TripGalleryImages.Add(new TripGalleryImage
//                         {
//                             TrekPackageId = package.Id,
//                             ImageUrl = imageUrl,
//                             Title = title,
//                             Description = description,
//                             AltText = altText,
//                             DisplayOrder = i,
//                             IsFeatured = createDto.FeaturedImageIndices?.Contains(i) ?? false,
//                             IsActive = true
//                         });
//                     }
//                 }
//                 // Handle Itinerary
//                 if (createDto.Itinerary != null && createDto.Itinerary.Any())
//                 {
//                     _logger.LogInformation($"Adding {createDto.Itinerary.Count} itinerary days");
//                     foreach (var item in createDto.Itinerary)
//                     {
//                         _context.TripItineraryDays.Add(new TripItineraryDay
//                         {
//                             TrekPackageId = package.Id,
//                             DayNumber = item.DayNumber,
//                             Title = item.Title,
//                             Description = item.Description,
//                             MaxAltitude = item.MaxAltitude,
//                             Accommodation = item.Accommodation,
//                             Meals = item.Meals,
//                             Duration = item.Duration,
//                             Distance = item.Distance,
//                             DisplayOrder = item.DayNumber
//                         });
//                     }
//                 }

//                 // Handle Cost Includes
//                 if (createDto.CostIncludes != null && createDto.CostIncludes.Any())
//                 {
//                     _logger.LogInformation($"Adding {createDto.CostIncludes.Count} cost includes");
//                     foreach (var item in createDto.CostIncludes)
//                     {
//                         _context.TripCostIncludes.Add(new TripCostInclude
//                         {
//                             TrekPackageId = package.Id,
//                             Description = item.Description,
//                             Category = item.Category,
//                             DisplayOrder = item.DisplayOrder
//                         });
//                     }
//                 }

//                 // Handle Cost Excludes
//                 if (createDto.CostExcludes != null && createDto.CostExcludes.Any())
//                 {
//                     _logger.LogInformation($"Adding {createDto.CostExcludes.Count} cost excludes");
//                     foreach (var item in createDto.CostExcludes)
//                     {
//                         _context.TripCostExcludes.Add(new TripCostExclude
//                         {
//                             TrekPackageId = package.Id,
//                             Description = item.Description,
//                             Category = item.Category,
//                             DisplayOrder = item.DisplayOrder
//                         });
//                     }
//                 }

//                 // Handle FAQs
//                 if (createDto.Faqs != null && createDto.Faqs.Any())
//                 {
//                     _logger.LogInformation($"Adding {createDto.Faqs.Count} FAQs");
//                     foreach (var item in createDto.Faqs)
//                     {
//                         _context.TripFaqs.Add(new TripFAQ
//                         {
//                             TrekPackageId = package.Id,
//                             Question = item.Question,
//                             Answer = item.Answer,
//                             DisplayOrder = item.DisplayOrder
//                         });
//                     }
//                 }

//                 // Handle Departure Dates
//                 if (createDto.DepartureDates != null && createDto.DepartureDates.Any())
//                 {
//                     _logger.LogInformation($"Adding {createDto.DepartureDates.Count} departure dates");
//                     foreach (var item in createDto.DepartureDates)
//                     {
//                         // Convert dates to UTC
//                         item.ConvertToUtc();

//                         _context.TripDepartureDates.Add(new TripDepartureDate
//                         {
//                             TrekPackageId = package.Id,
//                             StartDate = item.StartDate,
//                             EndDate = item.EndDate,
//                             Price = item.Price,
//                             DiscountedPrice = item.DiscountedPrice,
//                             IsGuaranteed = item.IsGuaranteed,
//                             IsAvailable = true,
//                             Notes = item.Notes,
//                             IsBestSeller = item.IsBestSeller,
//                             IsTopSeller = item.IsTopSeller,
//                             BookingCount = item.BookingCount
//                         });
//                     }
//                 }

//                 if (createDto.GroupDiscounts != null && createDto.GroupDiscounts.Any())
//                 {
//                     _logger.LogInformation($"Adding {createDto.GroupDiscounts.Count} group discounts");
//                     foreach (var item in createDto.GroupDiscounts)
//                     {
//                         _context.TripGroupDiscounts.Add(new TripGroupDiscount
//                         {
//                             TrekPackageId = package.Id,
//                             MinTravelers = item.MinTravelers,
//                             MaxTravelers = item.MaxTravelers,
//                             PricePerPerson = item.PricePerPerson,
//                             DiscountPercentage = item.DiscountPercentage,
//                             Description = item.Description,
//                             DisplayOrder = item.DisplayOrder,
//                             IsActive = true,
//                             CreatedAt = DateTime.UtcNow
//                         });
//                     }
//                 }

//                 await _context.SaveChangesAsync();
//                 _logger.LogInformation($"Package created successfully with ID: {package.Id}");

//                 // Load the package with all relations for response
//                 var createdPackage = await _context.TrekPackages
//                     .Include(t => t.Country)
//                     .Include(t => t.MainHeading)
//                     .Include(t => t.Heading)
//                     .Include(t => t.SubHeading)
//                     .Include(t => t.SliderImages)
//                     .Include(t => t.GalleryImages)
//                     .Include(t => t.Itinerary)
//                     .Include(t => t.CostIncludes)
//                     .Include(t => t.CostExcludes)
//                     .Include(t => t.Faqs)
//                     .Include(t => t.DepartureDates)
//                     .FirstOrDefaultAsync(t => t.Id == package.Id);

//                 return CreatedAtAction(nameof(GetTrekPackage), new { id = package.Id }, MapToResponseDto(createdPackage!));
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "Error creating trek package");
//                 return StatusCode(500, new { message = "An error occurred while creating the package", error = ex.Message });
//             }
//         }

//         // PUT: api/TrekPackage/5
//         [HttpPut("{id}")]
//         public async Task<IActionResult> UpdateTrekPackage(int id, [FromForm] UpdateTrekPackageDto updateDto)
//         {
//             try
//             {
//                 _logger.LogInformation($"Starting package update for ID: {id}");

//                 if (!ModelState.IsValid)
//                 {
//                     return BadRequest(ModelState);
//                 }

//                 // Log received JSON data
//                 _logger.LogInformation($"Received ItineraryJson: {updateDto.ItineraryJson}");
//                 _logger.LogInformation($"Received CostIncludesJson: {updateDto.CostIncludesJson}");
//                 _logger.LogInformation($"Received CostExcludesJson: {updateDto.CostExcludesJson}");
//                 _logger.LogInformation($"Received FaqsJson: {updateDto.FaqsJson}");
//                 _logger.LogInformation($"Received DepartureDatesJson: {updateDto.DepartureDatesJson}");

//                 // Deserialize JSON collections
//                 updateDto.DeserializeJsonCollections();

//                 // Log deserialized data
//                 _logger.LogInformation($"Deserialized Itinerary count: {updateDto.Itinerary?.Count ?? 0}");
//                 _logger.LogInformation($"Deserialized CostIncludes count: {updateDto.CostIncludes?.Count ?? 0}");
//                 _logger.LogInformation($"Deserialized CostExcludes count: {updateDto.CostExcludes?.Count ?? 0}");
//                 _logger.LogInformation($"Deserialized Faqs count: {updateDto.Faqs?.Count ?? 0}");
//                 _logger.LogInformation($"Deserialized DepartureDates count: {updateDto.DepartureDates?.Count ?? 0}");

//                 var package = await _context.TrekPackages
//                     .Include(t => t.SliderImages)
//                     .Include(t => t.GalleryImages)
//                     .Include(t => t.Itinerary)
//                     .Include(t => t.CostIncludes)
//                     .Include(t => t.CostExcludes)
//                     .Include(t => t.Faqs)
//                     .Include(t => t.DepartureDates)
//                     .FirstOrDefaultAsync(t => t.Id == id);

//                 if (package == null)
//                 {
//                     return NotFound(new { message = "Trek package not found" });
//                 }

//                 // Validate hierarchy
//                 var mainHeading = await _context.MainHeadings.FindAsync(updateDto.MainHeadingId);
//                 if (mainHeading == null)
//                 {
//                     return NotFound(new { message = "Main heading not found" });
//                 }

//                 var heading = await _context.Headings
//                     .FirstOrDefaultAsync(h => h.Id == updateDto.HeadingId && h.MainHeadingId == updateDto.MainHeadingId);
//                 if (heading == null)
//                 {
//                     return NotFound(new { message = "Heading not found or does not belong to the selected main heading" });
//                 }

//                 if (updateDto.SubHeadingId.HasValue)
//                 {
//                     var subHeading = await _context.SubHeadings
//                         .FirstOrDefaultAsync(sh => sh.Id == updateDto.SubHeadingId &&
//                                                   sh.HeadingId == updateDto.HeadingId &&
//                                                   sh.MainHeadingId == updateDto.MainHeadingId);
//                     if (subHeading == null)
//                     {
//                         return NotFound(new { message = "Subheading not found or does not belong to the selected heading" });
//                     }
//                 }

//                 // Check if another package with the same name exists (excluding current)
//                 var existingPackage = await _context.TrekPackages
//                     .FirstOrDefaultAsync(t => t.Name.ToLower() == updateDto.Name.ToLower() && t.Id != id);

//                 if (existingPackage != null)
//                 {
//                     return Conflict(new { message = "Another trek package with this name already exists" });
//                 }

//                 // Update basic fields
//                 package.Name = updateDto.Name;
//                 package.ShortDescription = updateDto.ShortDescription;
//                 package.Price = updateDto.Price;
//                 package.DiscountedPrice = updateDto.DiscountedPrice;
//                 package.DurationDays = updateDto.DurationDays;
//                 package.DurationNights = updateDto.DurationNights;
//                 package.TripGrade = updateDto.TripGrade;

//                 // Update hierarchy
//                 package.MainHeadingId = updateDto.MainHeadingId;
//                 package.HeadingId = updateDto.HeadingId;
//                 package.SubHeadingId = updateDto.SubHeadingId;

//                 package.CountryId = updateDto.CountryId;
//                 package.MaximumAltitude = updateDto.MaximumAltitude;
//                 package.GroupSize = updateDto.GroupSize;
//                 package.StartsAt = updateDto.StartsAt;
//                 package.EndsAt = updateDto.EndsAt;
//                 package.Activities = updateDto.Activities;
//                 package.BestTime = updateDto.BestTime;
//                 package.Overview = updateDto.Overview;
//                 package.EssentialInformation = updateDto.EssentialInformation;
//                 package.VideoReviewUrl = updateDto.VideoReviewUrl;
//                 package.UpdatedAt = DateTime.UtcNow;

//                 // Update Route Map Image if new one uploaded
//                 if (updateDto.RouteMapImage != null)
//                 {
//                     if (!string.IsNullOrEmpty(package.RouteMapImageUrl))
//                     {
//                         DeleteImage(package.RouteMapImageUrl);
//                     }
//                     package.RouteMapImageUrl = await SaveImage(updateDto.RouteMapImage, "routemaps");
//                 }

//                 // Update Slider Images
//                 if (updateDto.SliderImages != null && updateDto.SliderImages.Any())
//                 {
//                     foreach (var oldImage in package.SliderImages)
//                     {
//                         DeleteImage(oldImage.ImageUrl);
//                     }
//                     _context.TripSliderImages.RemoveRange(package.SliderImages);

//                     for (int i = 0; i < updateDto.SliderImages.Count; i++)
//                     {
//                         var image = updateDto.SliderImages[i];
//                         var imageUrl = await SaveImage(image, "slider");

//                         _context.TripSliderImages.Add(new TripSliderImage
//                         {
//                             TrekPackageId = package.Id,
//                             ImageUrl = imageUrl,
//                             Title = updateDto.SliderTitles?[i],
//                             Caption = updateDto.SliderCaptions?[i],
//                             AltText = updateDto.SliderAltTexts?[i],
//                             DisplayOrder = i,
//                             IsActive = true
//                         });
//                     }
//                 }

//                 // Update Gallery Images
//                 // if (updateDto.GalleryImages != null && updateDto.GalleryImages.Any())
//                 // {
//                 //     foreach (var oldImage in package.GalleryImages)
//                 //     {
//                 //         DeleteImage(oldImage.ImageUrl);
//                 //     }
//                 //     _context.TripGalleryImages.RemoveRange(package.GalleryImages);

//                 //     for (int i = 0; i < updateDto.GalleryImages.Count; i++)
//                 //     {
//                 //         var image = updateDto.GalleryImages[i];
//                 //         var imageUrl = await SaveImage(image, "gallery");

//                 //         _context.TripGalleryImages.Add(new TripGalleryImage
//                 //         {
//                 //             TrekPackageId = package.Id,
//                 //             ImageUrl = imageUrl,
//                 //             Title = updateDto.GalleryTitles?[i],
//                 //             Description = updateDto.GalleryDescriptions?[i],
//                 //             AltText = updateDto.GalleryAltTexts?[i],
//                 //             DisplayOrder = i,
//                 //             IsFeatured = updateDto.FeaturedImageIndices?.Contains(i) ?? false,
//                 //             IsActive = true
//                 //         });
//                 //     }
//                 // }

//                 // Update Gallery Images - FIXED
//                 if (updateDto.GalleryImages != null && updateDto.GalleryImages.Any())
//                 {
//                     foreach (var oldImage in package.GalleryImages)
//                     {
//                         DeleteImage(oldImage.ImageUrl);
//                     }
//                     _context.TripGalleryImages.RemoveRange(package.GalleryImages);

//                     for (int i = 0; i < updateDto.GalleryImages.Count; i++)
//                     {
//                         var image = updateDto.GalleryImages[i];
//                         var imageUrl = await SaveImage(image, "gallery");

//                         // Safe access to metadata arrays - check if index exists
//                         var title = (updateDto.GalleryTitles != null && i < updateDto.GalleryTitles.Count)
//                             ? updateDto.GalleryTitles[i] : null;

//                         var description = (updateDto.GalleryDescriptions != null && i < updateDto.GalleryDescriptions.Count)
//                             ? updateDto.GalleryDescriptions[i] : null;

//                         var altText = (updateDto.GalleryAltTexts != null && i < updateDto.GalleryAltTexts.Count)
//                             ? updateDto.GalleryAltTexts[i] : null;

//                         _context.TripGalleryImages.Add(new TripGalleryImage
//                         {
//                             TrekPackageId = package.Id,
//                             ImageUrl = imageUrl,
//                             Title = title,
//                             Description = description,
//                             AltText = altText,
//                             DisplayOrder = i,
//                             IsFeatured = updateDto.FeaturedImageIndices?.Contains(i) ?? false,
//                             IsActive = true
//                         });
//                     }
//                 }

//                 // Update Itinerary
//                 if (updateDto.Itinerary != null)
//                 {
//                     _logger.LogInformation($"Updating itinerary: removing {package.Itinerary.Count} existing days");
//                     _context.TripItineraryDays.RemoveRange(package.Itinerary);

//                     foreach (var item in updateDto.Itinerary)
//                     {
//                         _logger.LogInformation($"Adding itinerary day {item.DayNumber}: {item.Title}");
//                         _context.TripItineraryDays.Add(new TripItineraryDay
//                         {
//                             TrekPackageId = package.Id,
//                             DayNumber = item.DayNumber,
//                             Title = item.Title,
//                             Description = item.Description,
//                             MaxAltitude = item.MaxAltitude,
//                             Accommodation = item.Accommodation,
//                             Meals = item.Meals,
//                             Duration = item.Duration,
//                             Distance = item.Distance,
//                             DisplayOrder = item.DayNumber
//                         });
//                     }
//                 }

//                 // Update Cost Includes
//                 if (updateDto.CostIncludes != null)
//                 {
//                     _context.TripCostIncludes.RemoveRange(package.CostIncludes);
//                     foreach (var item in updateDto.CostIncludes)
//                     {
//                         _context.TripCostIncludes.Add(new TripCostInclude
//                         {
//                             TrekPackageId = package.Id,
//                             Description = item.Description,
//                             Category = item.Category,
//                             DisplayOrder = item.DisplayOrder
//                         });
//                     }
//                 }

//                 // Update Cost Excludes
//                 if (updateDto.CostExcludes != null)
//                 {
//                     _context.TripCostExcludes.RemoveRange(package.CostExcludes);
//                     foreach (var item in updateDto.CostExcludes)
//                     {
//                         _context.TripCostExcludes.Add(new TripCostExclude
//                         {
//                             TrekPackageId = package.Id,
//                             Description = item.Description,
//                             Category = item.Category,
//                             DisplayOrder = item.DisplayOrder
//                         });
//                     }
//                 }

//                 // Update FAQs
//                 if (updateDto.Faqs != null)
//                 {
//                     _context.TripFaqs.RemoveRange(package.Faqs);
//                     foreach (var item in updateDto.Faqs)
//                     {
//                         _context.TripFaqs.Add(new TripFAQ
//                         {
//                             TrekPackageId = package.Id,
//                             Question = item.Question,
//                             Answer = item.Answer,
//                             DisplayOrder = item.DisplayOrder
//                         });
//                     }
//                 }

//                 // Update Departure Dates
//                 if (updateDto.DepartureDates != null)
//                 {
//                     _context.TripDepartureDates.RemoveRange(package.DepartureDates);
//                     foreach (var item in updateDto.DepartureDates)
//                     {
//                         // Convert dates to UTC
//                         item.ConvertToUtc();

//                         _context.TripDepartureDates.Add(new TripDepartureDate
//                         {
//                             TrekPackageId = package.Id,
//                             StartDate = item.StartDate,
//                             EndDate = item.EndDate,
//                             Price = item.Price,
//                             DiscountedPrice = item.DiscountedPrice,
//                             IsGuaranteed = item.IsGuaranteed,
//                             IsAvailable = true,
//                             Notes = item.Notes,
//                             IsBestSeller = item.IsBestSeller,
//                             IsTopSeller = item.IsTopSeller,
//                             BookingCount = item.BookingCount
//                         });
//                     }
//                 }

//                 if (updateDto.GroupDiscounts != null)
//                 {
//                     _context.TripGroupDiscounts.RemoveRange(package.GroupDiscounts);
//                     foreach (var item in updateDto.GroupDiscounts)
//                     {
//                         _context.TripGroupDiscounts.Add(new TripGroupDiscount
//                         {
//                             TrekPackageId = package.Id,
//                             MinTravelers = item.MinTravelers,
//                             MaxTravelers = item.MaxTravelers,
//                             PricePerPerson = item.PricePerPerson,
//                             DiscountPercentage = item.DiscountPercentage,
//                             Description = item.Description,
//                             DisplayOrder = item.DisplayOrder,
//                             IsActive = true,
//                             CreatedAt = DateTime.UtcNow,
//                             UpdatedAt = DateTime.UtcNow
//                         });
//                     }
//                 }

//                 await _context.SaveChangesAsync();
//                 _logger.LogInformation($"Package updated successfully with ID: {id}");

//                 return Ok(new { message = "Trek package updated successfully" });
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, $"Error updating trek package with ID: {id}");
//                 return StatusCode(500, new { message = "An error occurred while updating the package", error = ex.Message });
//             }
//         }

//         // DELETE: api/TrekPackage/5
//         [HttpDelete("{id}")]
//         public async Task<IActionResult> DeleteTrekPackage(int id)
//         {
//             try
//             {
//                 var package = await _context.TrekPackages
//                     .Include(t => t.SliderImages)
//                     .Include(t => t.GalleryImages)
//                     .FirstOrDefaultAsync(t => t.Id == id);

//                 if (package == null)
//                 {
//                     return NotFound(new { message = "Trek package not found" });
//                 }

//                 // Soft delete
//                 package.IsActive = false;
//                 package.UpdatedAt = DateTime.UtcNow;

//                 await _context.SaveChangesAsync();

//                 return Ok(new { message = "Trek package deleted successfully" });
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, $"Error deleting trek package with ID: {id}");
//                 return StatusCode(500, new { message = "Error deleting package", error = ex.Message });
//             }
//         }

//         // PATCH: api/TrekPackage/5/toggle-status
//         [HttpPatch("{id}/toggle-status")]
//         public async Task<IActionResult> TogglePackageStatus(int id)
//         {
//             try
//             {
//                 var package = await _context.TrekPackages.FindAsync(id);
//                 if (package == null)
//                 {
//                     return NotFound(new { message = "Trek package not found" });
//                 }

//                 package.IsActive = !package.IsActive;
//                 package.UpdatedAt = DateTime.UtcNow;

//                 await _context.SaveChangesAsync();

//                 return Ok(new
//                 {
//                     message = $"Trek package {(package.IsActive ? "activated" : "deactivated")} successfully",
//                     isActive = package.IsActive
//                 });
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, $"Error toggling package status for ID: {id}");
//                 return StatusCode(500, new { message = "Error toggling status", error = ex.Message });
//             }
//         }

//         // GET: api/TrekPackage/search
//         [HttpGet("search")]
//         public async Task<ActionResult<IEnumerable<TrekPackageResponseDto>>> SearchTrekPackages(
//             [FromQuery] string? name,
//             [FromQuery] int? mainHeadingId,
//             [FromQuery] int? headingId,
//             [FromQuery] int? countryId,
//             [FromQuery] int? minDays,
//             [FromQuery] int? maxDays,
//             [FromQuery] string? grade,
//             [FromQuery] decimal? maxPrice,
//             [FromQuery] string? month)
//         {
//             try
//             {
//                 var query = _context.TrekPackages
//                     .Include(t => t.Country)
//                     .Include(t => t.MainHeading)
//                     .Include(t => t.Heading)
//                     .Include(t => t.SubHeading)
//                     .Include(t => t.SliderImages)
//                     .Where(t => t.IsActive)
//                     .AsQueryable();

//                 if (!string.IsNullOrWhiteSpace(name))
//                 {
//                     query = query.Where(t => t.Name.ToLower().Contains(name.ToLower()) ||
//                                             (t.ShortDescription != null && t.ShortDescription.ToLower().Contains(name.ToLower())));
//                 }

//                 if (mainHeadingId.HasValue)
//                 {
//                     query = query.Where(t => t.MainHeadingId == mainHeadingId.Value);
//                 }

//                 if (headingId.HasValue)
//                 {
//                     query = query.Where(t => t.HeadingId == headingId.Value);
//                 }

//                 if (countryId.HasValue)
//                 {
//                     query = query.Where(t => t.CountryId == countryId.Value);
//                 }

//                 if (minDays.HasValue)
//                 {
//                     query = query.Where(t => t.DurationDays >= minDays.Value);
//                 }

//                 if (maxDays.HasValue)
//                 {
//                     query = query.Where(t => t.DurationDays <= maxDays.Value);
//                 }

//                 if (!string.IsNullOrWhiteSpace(grade))
//                 {
//                     query = query.Where(t => t.TripGrade != null && t.TripGrade.ToLower().Contains(grade.ToLower()));
//                 }

//                 if (maxPrice.HasValue)
//                 {
//                     query = query.Where(t => t.DiscountedPrice != null ? t.DiscountedPrice <= maxPrice : t.Price <= maxPrice);
//                 }

//                 if (!string.IsNullOrWhiteSpace(month))
//                 {
//                     query = query.Where(t => t.BestTime != null && t.BestTime.ToLower().Contains(month.ToLower()));
//                 }

//                 var packages = await query
//                     .OrderBy(t => t.Name)
//                     .Select(t => MapToResponseDto(t))
//                     .ToListAsync();

//                 return Ok(packages);
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "Error searching packages");
//                 return StatusCode(500, new { message = "Error searching packages", error = ex.Message });
//             }
//         }

//         // GET: api/TrekPackage/5/similar
//         [HttpGet("{id}/similar")]
//         public async Task<ActionResult<IEnumerable<TrekPackageResponseDto>>> GetSimilarPackages(int id)
//         {
//             try
//             {
//                 var package = await _context.TrekPackages.FindAsync(id);
//                 if (package == null)
//                 {
//                     return NotFound(new { message = "Trek package not found" });
//                 }

//                 var similarPackages = await _context.TrekPackages
//                     .Include(t => t.Country)
//                     .Include(t => t.MainHeading)
//                     .Include(t => t.Heading)
//                     .Include(t => t.SliderImages)
//                     .Where(t => t.Id != id && t.HeadingId == package.HeadingId && t.IsActive)
//                     .OrderBy(t => t.Name)
//                     .Take(4)
//                     .Select(t => MapToResponseDto(t))
//                     .ToListAsync();

//                 return Ok(similarPackages);
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, $"Error fetching similar packages for ID: {id}");
//                 return StatusCode(500, new { message = "Error fetching similar packages", error = ex.Message });
//             }
//         }

//         // Helper method to save images
//         private async Task<string> SaveImage(IFormFile image, string folderName)
//         {
//             if (image == null || image.Length == 0)
//                 return string.Empty;

//             var fileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
//             var folderPath = Path.Combine(_environment.WebRootPath ?? "wwwroot", "uploads", "trekpackages", folderName);

//             if (!Directory.Exists(folderPath))
//             {
//                 Directory.CreateDirectory(folderPath);
//             }

//             var filePath = Path.Combine(folderPath, fileName);

//             using (var stream = new FileStream(filePath, FileMode.Create))
//             {
//                 await image.CopyToAsync(stream);
//             }

//             return $"/uploads/trekpackages/{folderName}/{fileName}";
//         }

//         // Helper method to delete image
//         private void DeleteImage(string imageUrl)
//         {
//             if (string.IsNullOrEmpty(imageUrl))
//                 return;

//             var fileName = Path.GetFileName(imageUrl);
//             var folderName = Path.GetFileName(Path.GetDirectoryName(imageUrl));
//             var filePath = Path.Combine(_environment.WebRootPath ?? "wwwroot", "uploads", "trekpackages", folderName ?? "", fileName ?? "");

//             if (System.IO.File.Exists(filePath))
//             {
//                 System.IO.File.Delete(filePath);
//             }
//         }

//         // Helper method to map TrekPackage to Response DTO
//         private static TrekPackageResponseDto MapToResponseDto(TrekPackage package)
//         {
//             return new TrekPackageResponseDto
//             {
//                 Id = package.Id,
//                 Name = package.Name,
//                 ShortDescription = package.ShortDescription,
//                 Price = package.Price,
//                 DiscountedPrice = package.DiscountedPrice,
//                 DurationDays = package.DurationDays,
//                 DurationNights = package.DurationNights,
//                 TripGrade = package.TripGrade,

//                 // Hierarchy
//                 MainHeadingId = package.MainHeadingId,
//                 MainHeadingName = package.MainHeading?.Name ?? string.Empty,
//                 HeadingId = package.HeadingId,
//                 HeadingName = package.Heading?.Name ?? string.Empty,
//                 SubHeadingId = package.SubHeadingId,
//                 SubHeadingName = package.SubHeading?.Name,

//                 CountryId = package.CountryId,
//                 CountryName = package.Country?.Name ?? string.Empty,
//                 MaximumAltitude = package.MaximumAltitude,
//                 GroupSize = package.GroupSize,
//                 StartsAt = package.StartsAt,
//                 EndsAt = package.EndsAt,
//                 Activities = package.Activities,
//                 BestTime = package.BestTime,
//                 Overview = package.Overview,
//                 EssentialInformation = package.EssentialInformation,
//                 VideoReviewUrl = package.VideoReviewUrl,
//                 RouteMapImageUrl = package.RouteMapImageUrl,
//                 IsActive = package.IsActive,
//                 CreatedAt = package.CreatedAt,
//                 UpdatedAt = package.UpdatedAt,
//                 IsBestSeller = package.DepartureDates != null &&
//             package.DepartureDates.Any(d => d.IsBestSeller == true),
//                 IsTopSeller = package.DepartureDates != null &&
//             package.DepartureDates.Any(d => d.IsTopSeller == true),
//                 HasGuaranteedDeparture = package.DepartureDates != null &&
//             package.DepartureDates.Any(d => d.IsGuaranteed == true),

//                 // Collections
//                 SliderImages = package.SliderImages?.Select(s => new TripSliderImageDto
//                 {
//                     Id = s.Id,
//                     ImageUrl = s.ImageUrl,
//                     Title = s.Title,
//                     Caption = s.Caption,
//                     AltText = s.AltText,
//                     DisplayOrder = s.DisplayOrder
//                 }).OrderBy(s => s.DisplayOrder).ToList() ?? new List<TripSliderImageDto>(),

//                 GalleryImages = package.GalleryImages?.Select(g => new TripGalleryImageDto
//                 {
//                     Id = g.Id,
//                     ImageUrl = g.ImageUrl,
//                     Title = g.Title,
//                     Description = g.Description,
//                     AltText = g.AltText,
//                     DisplayOrder = g.DisplayOrder,
//                     IsFeatured = g.IsFeatured
//                 }).OrderBy(g => g.DisplayOrder).ToList() ?? new List<TripGalleryImageDto>(),

//                 Itinerary = package.Itinerary?.Select(i => new TripItineraryDayDto
//                 {
//                     Id = i.Id,
//                     DayNumber = i.DayNumber,
//                     Title = i.Title,
//                     Description = i.Description,
//                     MaxAltitude = i.MaxAltitude,
//                     Accommodation = i.Accommodation,
//                     Meals = i.Meals,
//                     Duration = i.Duration,
//                     Distance = i.Distance
//                 }).OrderBy(i => i.DayNumber).ToList() ?? new List<TripItineraryDayDto>(),

//                 CostIncludes = package.CostIncludes?.Select(c => new TripCostIncludeDto
//                 {
//                     Id = c.Id,
//                     Description = c.Description,
//                     Category = c.Category,
//                     DisplayOrder = c.DisplayOrder
//                 }).OrderBy(c => c.DisplayOrder).ToList() ?? new List<TripCostIncludeDto>(),

//                 CostExcludes = package.CostExcludes?.Select(c => new TripCostExcludeDto
//                 {
//                     Id = c.Id,
//                     Description = c.Description,
//                     Category = c.Category,
//                     DisplayOrder = c.DisplayOrder
//                 }).OrderBy(c => c.DisplayOrder).ToList() ?? new List<TripCostExcludeDto>(),

//                 Faqs = package.Faqs?.Select(f => new TripFaqDto
//                 {
//                     Id = f.Id,
//                     Question = f.Question,
//                     Answer = f.Answer,
//                     DisplayOrder = f.DisplayOrder
//                 }).OrderBy(f => f.DisplayOrder).ToList() ?? new List<TripFaqDto>(),

//                 DepartureDates = package.DepartureDates?.Select(d => new TripDepartureDateDto
//                 {
//                     Id = d.Id,
//                     StartDate = d.StartDate,
//                     EndDate = d.EndDate,
//                     Price = d.Price,
//                     DiscountedPrice = d.DiscountedPrice,
//                     IsGuaranteed = d.IsGuaranteed,
//                     IsAvailable = d.IsAvailable,
//                     Notes = d.Notes,
//                     IsBestSeller = d.IsBestSeller,
//                     IsTopSeller = d.IsTopSeller,
//                     BookingCount = d.BookingCount
//                 }).OrderBy(d => d.StartDate).ToList() ?? new List<TripDepartureDateDto>(),

//                 GroupDiscounts = package.GroupDiscounts?.Select(g => new GroupDiscountDto
//                 {
//                     Id = g.Id,
//                     MinTravelers = g.MinTravelers,
//                     MaxTravelers = g.MaxTravelers,
//                     PricePerPerson = g.PricePerPerson,
//                     DiscountPercentage = g.DiscountPercentage,
//                     Description = g.Description,
//                     DisplayOrder = g.DisplayOrder,
//                     IsActive = g.IsActive,
//                     TotalPrice = g.PricePerPerson * g.MaxTravelers
//                 }).OrderBy(g => g.MinTravelers).ToList() ?? new List<GroupDiscountDto>()
//             };
//         }
//     }
// }

//----------------------------------------------------end

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.DTO;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TrekPackageController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<TrekPackageController> _logger;

        public TrekPackageController(
            ApplicationDbContext context,
            IWebHostEnvironment environment,
            ILogger<TrekPackageController> logger)
        {
            _context = context;
            _environment = environment;
            _logger = logger;
        }

        // GET: api/TrekPackage
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TrekPackageResponseDto>>> GetTrekPackages()
        {
            try
            {
                var packages = await _context.TrekPackages
                    .Include(t => t.Country)
                    .Include(t => t.MainHeading)
                    .Include(t => t.Heading)
                    .Include(t => t.SubHeading)
                    .Include(t => t.SliderImages)
                    .Include(t => t.GalleryImages)
                    .Include(t => t.Itinerary)
                    .Include(t => t.CostIncludes)
                    .Include(t => t.CostExcludes)
                    .Include(t => t.Faqs)
                    .Include(t => t.DepartureDates)
                    .Include(t => t.GroupDiscounts)
                    .OrderByDescending(t => t.CreatedAt)
                    .Select(t => MapToResponseDto(t))
                    .ToListAsync();

                return Ok(packages);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching trek packages");
                return StatusCode(500, new { message = "Error fetching packages", error = ex.Message });
            }
        }

        // GET: api/TrekPackage/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TrekPackageResponseDto>> GetTrekPackage(int id)
        {
            try
            {
                var package = await _context.TrekPackages
                    .Include(t => t.Country)
                    .Include(t => t.MainHeading)
                    .Include(t => t.Heading)
                    .Include(t => t.SubHeading)
                    .Include(t => t.SliderImages.OrderBy(s => s.DisplayOrder))
                    .Include(t => t.GalleryImages.OrderBy(g => g.DisplayOrder))
                    .Include(t => t.Itinerary.OrderBy(i => i.DayNumber))
                    .Include(t => t.CostIncludes.OrderBy(c => c.DisplayOrder))
                    .Include(t => t.CostExcludes.OrderBy(c => c.DisplayOrder))
                    .Include(t => t.Faqs.OrderBy(f => f.DisplayOrder))
                    .Include(t => t.DepartureDates.OrderBy(d => d.StartDate))
                    .Include(t => t.GroupDiscounts.OrderBy(g => g.MinTravelers))
                    .FirstOrDefaultAsync(t => t.Id == id);

                if (package == null)
                {
                    return NotFound(new { message = "Trek package not found" });
                }

                return Ok(MapToResponseDto(package));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error fetching trek package with ID: {id}");
                return StatusCode(500, new { message = "Error fetching package", error = ex.Message });
            }
        }

        // GET: api/TrekPackage/by-mainheading/5
        [HttpGet("by-mainheading/{mainHeadingId}")]
        public async Task<ActionResult<IEnumerable<TrekPackageResponseDto>>> GetTrekPackagesByMainHeading(int mainHeadingId)
        {
            try
            {
                var packages = await _context.TrekPackages
                    .Include(t => t.Country)
                    .Include(t => t.MainHeading)
                    .Include(t => t.Heading)
                    .Include(t => t.SubHeading)
                    .Include(t => t.SliderImages)
                    .Include(t => t.GalleryImages)
                    .Where(t => t.MainHeadingId == mainHeadingId && t.IsActive)
                    .OrderByDescending(t => t.CreatedAt)
                    .Select(t => MapToResponseDto(t))
                    .ToListAsync();

                return Ok(packages);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error fetching packages by main heading: {mainHeadingId}");
                return StatusCode(500, new { message = "Error fetching packages", error = ex.Message });
            }
        }

        // GET: api/TrekPackage/by-heading/5
        [HttpGet("by-heading/{headingId}")]
        public async Task<ActionResult<IEnumerable<TrekPackageResponseDto>>> GetTrekPackagesByHeading(int headingId)
        {
            try
            {
                var packages = await _context.TrekPackages
                    .Include(t => t.Country)
                    .Include(t => t.MainHeading)
                    .Include(t => t.Heading)
                    .Include(t => t.SubHeading)
                    .Include(t => t.SliderImages)
                    .Include(t => t.GalleryImages)
                    .Where(t => t.HeadingId == headingId && t.IsActive)
                    .OrderByDescending(t => t.CreatedAt)
                    .Select(t => MapToResponseDto(t))
                    .ToListAsync();

                return Ok(packages);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error fetching packages by heading: {headingId}");
                return StatusCode(500, new { message = "Error fetching packages", error = ex.Message });
            }
        }

        [HttpGet("by-subheading/{subHeadingId}")]
        public async Task<ActionResult<IEnumerable<TrekPackageResponseDto>>> GetTrekPackagesBySubHeading(int subHeadingId)
        {
            var packages = await _context.TrekPackages
                .Include(t => t.Country)
                .Include(t => t.MainHeading)
                .Include(t => t.Heading)
                .Include(t => t.SubHeading)
                .Include(t => t.SliderImages)
                .Include(t => t.GalleryImages)
                .Include(t => t.DepartureDates)
                .Include(t => t.GroupDiscounts)
                .Where(t => t.SubHeadingId == subHeadingId && t.IsActive)
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();

            var result = packages.Select(t => new TrekPackageResponseDto
            {
                Id = t.Id,
                Name = t.Name,
                ShortDescription = t.ShortDescription,
                Price = t.Price,
                DiscountedPrice = t.DiscountedPrice,
                DurationDays = t.DurationDays,
                DurationNights = t.DurationNights,
                TripGrade = t.TripGrade,
                MainHeadingId = t.MainHeadingId,
                MainHeadingName = t.MainHeading?.Name ?? string.Empty,
                HeadingId = t.HeadingId,
                HeadingName = t.Heading?.Name ?? string.Empty,
                SubHeadingId = t.SubHeadingId,
                SubHeadingName = t.SubHeading?.Name,
                CountryId = t.CountryId,
                CountryName = t.Country?.Name ?? string.Empty,
                MaximumAltitude = t.MaximumAltitude,
                GroupSize = t.GroupSize,
                StartsAt = t.StartsAt,
                EndsAt = t.EndsAt,
                Activities = t.Activities,
                BestTime = t.BestTime,
                Overview = t.Overview,
                EssentialInformation = t.EssentialInformation,
                VideoReviewUrl = t.VideoReviewUrl,
                RouteMapImageUrl = t.RouteMapImageUrl,
                IsActive = t.IsActive,
                CreatedAt = t.CreatedAt,
                UpdatedAt = t.UpdatedAt,
                SliderImages = t.SliderImages?.Select(s => new TripSliderImageDto
                {
                    Id = s.Id,
                    ImageUrl = s.ImageUrl,
                    Title = s.Title,
                    Caption = s.Caption,
                    AltText = s.AltText,
                    DisplayOrder = s.DisplayOrder
                }).OrderBy(s => s.DisplayOrder).ToList() ?? new List<TripSliderImageDto>(),
                GalleryImages = t.GalleryImages?.Select(g => new TripGalleryImageDto
                {
                    Id = g.Id,
                    ImageUrl = g.ImageUrl,
                    Title = g.Title,
                    Description = g.Description,
                    AltText = g.AltText,
                    DisplayOrder = g.DisplayOrder,
                    IsFeatured = g.IsFeatured
                }).OrderBy(g => g.DisplayOrder).ToList() ?? new List<TripGalleryImageDto>(),
                GroupDiscounts = t.GroupDiscounts?.Select(g => new GroupDiscountDto
                {
                    Id = g.Id,
                    MinTravelers = g.MinTravelers,
                    MaxTravelers = g.MaxTravelers,
                    PricePerPerson = g.PricePerPerson,
                    DiscountPercentage = g.DiscountPercentage,
                    Description = g.Description,
                    DisplayOrder = g.DisplayOrder,
                    IsActive = g.IsActive,
                    TotalPrice = g.PricePerPerson * g.MaxTravelers
                }).OrderBy(g => g.MinTravelers).ToList() ?? new List<GroupDiscountDto>(),
                Itinerary = new List<TripItineraryDayDto>(),
                CostIncludes = new List<TripCostIncludeDto>(),
                CostExcludes = new List<TripCostExcludeDto>(),
                Faqs = new List<TripFaqDto>(),
                DepartureDates = new List<TripDepartureDateDto>(),
                IsBestSeller = t.DepartureDates != null && t.DepartureDates.Any(d => d.IsBestSeller == true),
                IsTopSeller = t.DepartureDates != null && t.DepartureDates.Any(d => d.IsTopSeller == true),
                HasGuaranteedDeparture = t.DepartureDates != null && t.DepartureDates.Any(d => d.IsGuaranteed == true)
            }).ToList();

            return Ok(result);
        }

        // GET: api/TrekPackage/featured
        [HttpGet("featured")]
        public async Task<ActionResult<IEnumerable<TrekPackageResponseDto>>> GetFeaturedPackages()
        {
            try
            {
                var packages = await _context.TrekPackages
                    .Include(t => t.Country)
                    .Include(t => t.MainHeading)
                    .Include(t => t.Heading)
                    .Include(t => t.SubHeading)
                    .Include(t => t.SliderImages.Where(s => s.IsActive))
                    .Include(t => t.GalleryImages.Where(g => g.IsFeatured && g.IsActive))
                    .Where(t => t.IsActive)
                    .OrderBy(t => t.Name)
                    .Take(6)
                    .Select(t => MapToResponseDto(t))
                    .ToListAsync();

                return Ok(packages);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching featured packages");
                return StatusCode(500, new { message = "Error fetching featured packages", error = ex.Message });
            }
        }

        // POST: api/TrekPackage
        [HttpPost]
        public async Task<ActionResult<TrekPackageResponseDto>> CreateTrekPackage([FromForm] CreateTrekPackageDto createDto)
        {
            try
            {
                _logger.LogInformation("Starting package creation");

                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("Invalid model state");
                    return BadRequest(ModelState);
                }

                createDto.DeserializeJsonCollections();

                // Validate hierarchy and country
                var mainHeading = await _context.MainHeadings.FindAsync(createDto.MainHeadingId);
                if (mainHeading == null)
                {
                    return NotFound(new { message = "Main heading not found" });
                }

                var heading = await _context.Headings
                    .FirstOrDefaultAsync(h => h.Id == createDto.HeadingId && h.MainHeadingId == createDto.MainHeadingId);
                if (heading == null)
                {
                    return NotFound(new { message = "Heading not found or does not belong to the selected main heading" });
                }

                if (createDto.SubHeadingId.HasValue)
                {
                    var subHeading = await _context.SubHeadings
                        .FirstOrDefaultAsync(sh => sh.Id == createDto.SubHeadingId &&
                                                  sh.HeadingId == createDto.HeadingId &&
                                                  sh.MainHeadingId == createDto.MainHeadingId);
                    if (subHeading == null)
                    {
                        return NotFound(new { message = "Subheading not found or does not belong to the selected heading" });
                    }
                }

                var country = await _context.Countries.FindAsync(createDto.CountryId);
                if (country == null)
                {
                    return NotFound(new { message = "Country not found" });
                }

                var existingPackage = await _context.TrekPackages
                    .FirstOrDefaultAsync(t => t.Name.ToLower() == createDto.Name.ToLower());

                if (existingPackage != null)
                {
                    return Conflict(new { message = "A trek package with this name already exists" });
                }

                // Create new package
                var package = new TrekPackage
                {
                    Name = createDto.Name,
                    ShortDescription = createDto.ShortDescription,
                    Price = createDto.Price,
                    DiscountedPrice = createDto.DiscountedPrice,
                    DurationDays = createDto.DurationDays,
                    DurationNights = createDto.DurationNights,
                    TripGrade = createDto.TripGrade,
                    MainHeadingId = createDto.MainHeadingId,
                    HeadingId = createDto.HeadingId,
                    SubHeadingId = createDto.SubHeadingId,
                    CountryId = createDto.CountryId,
                    MaximumAltitude = createDto.MaximumAltitude,
                    GroupSize = createDto.GroupSize,
                    StartsAt = createDto.StartsAt,
                    EndsAt = createDto.EndsAt,
                    Activities = createDto.Activities,
                    BestTime = createDto.BestTime,
                    Overview = createDto.Overview,
                    EssentialInformation = createDto.EssentialInformation,
                    VideoReviewUrl = createDto.VideoReviewUrl,
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true
                };

                _context.TrekPackages.Add(package);
                await _context.SaveChangesAsync();

                // Handle Route Map Image
                if (createDto.RouteMapImage != null)
                {
                    var imageUrl = await SaveImage(createDto.RouteMapImage, "routemaps");
                    package.RouteMapImageUrl = imageUrl;
                    await _context.SaveChangesAsync();
                }

                // Handle Slider Images
                if (createDto.SliderImages != null && createDto.SliderImages.Any())
                {
                    for (int i = 0; i < createDto.SliderImages.Count; i++)
                    {
                        var image = createDto.SliderImages[i];
                        var imageUrl = await SaveImage(image, "slider");

                        _context.TripSliderImages.Add(new TripSliderImage
                        {
                            TrekPackageId = package.Id,
                            ImageUrl = imageUrl,
                            Title = SafeGetValue(createDto.SliderTitles, i),
                            Caption = SafeGetValue(createDto.SliderCaptions, i),
                            AltText = SafeGetValue(createDto.SliderAltTexts, i),
                            DisplayOrder = i,
                            IsActive = true
                        });
                    }
                }

                // Handle Gallery Images
                if (createDto.GalleryImages != null && createDto.GalleryImages.Any())
                {
                    for (int i = 0; i < createDto.GalleryImages.Count; i++)
                    {
                        var image = createDto.GalleryImages[i];
                        var imageUrl = await SaveImage(image, "gallery");

                        _context.TripGalleryImages.Add(new TripGalleryImage
                        {
                            TrekPackageId = package.Id,
                            ImageUrl = imageUrl,
                            Title = SafeGetValue(createDto.GalleryTitles, i),
                            Description = SafeGetValue(createDto.GalleryDescriptions, i),
                            AltText = SafeGetValue(createDto.GalleryAltTexts, i),
                            DisplayOrder = i,
                            IsFeatured = createDto.FeaturedImageIndices?.Contains(i) ?? false,
                            IsActive = true,
                            CreatedAt = DateTime.UtcNow
                        });
                    }
                }

                // Handle Itinerary
                if (createDto.Itinerary != null && createDto.Itinerary.Any())
                {
                    foreach (var item in createDto.Itinerary)
                    {
                        _context.TripItineraryDays.Add(new TripItineraryDay
                        {
                            TrekPackageId = package.Id,
                            DayNumber = item.DayNumber,
                            Title = item.Title,
                            Description = item.Description,
                            MaxAltitude = item.MaxAltitude,
                            Accommodation = item.Accommodation,
                            Meals = item.Meals,
                            Duration = item.Duration,
                            Distance = item.Distance,
                            DisplayOrder = item.DayNumber
                        });
                    }
                }

                // Handle Cost Includes
                if (createDto.CostIncludes != null && createDto.CostIncludes.Any())
                {
                    foreach (var item in createDto.CostIncludes)
                    {
                        _context.TripCostIncludes.Add(new TripCostInclude
                        {
                            TrekPackageId = package.Id,
                            Description = item.Description,
                            Category = item.Category,
                            DisplayOrder = item.DisplayOrder
                        });
                    }
                }

                // Handle Cost Excludes
                if (createDto.CostExcludes != null && createDto.CostExcludes.Any())
                {
                    foreach (var item in createDto.CostExcludes)
                    {
                        _context.TripCostExcludes.Add(new TripCostExclude
                        {
                            TrekPackageId = package.Id,
                            Description = item.Description,
                            Category = item.Category,
                            DisplayOrder = item.DisplayOrder
                        });
                    }
                }

                // Handle FAQs
                if (createDto.Faqs != null && createDto.Faqs.Any())
                {
                    foreach (var item in createDto.Faqs)
                    {
                        _context.TripFaqs.Add(new TripFAQ
                        {
                            TrekPackageId = package.Id,
                            Question = item.Question,
                            Answer = item.Answer,
                            DisplayOrder = item.DisplayOrder
                        });
                    }
                }

                // Handle Departure Dates
                if (createDto.DepartureDates != null && createDto.DepartureDates.Any())
                {
                    foreach (var item in createDto.DepartureDates)
                    {
                        item.ConvertToUtc();

                        _context.TripDepartureDates.Add(new TripDepartureDate
                        {
                            TrekPackageId = package.Id,
                            StartDate = item.StartDate,
                            EndDate = item.EndDate,
                            Price = item.Price,
                            DiscountedPrice = item.DiscountedPrice,
                            IsGuaranteed = item.IsGuaranteed,
                            IsAvailable = true,
                            Notes = item.Notes,
                            IsBestSeller = item.IsBestSeller,
                            IsTopSeller = item.IsTopSeller,
                            BookingCount = item.BookingCount
                        });
                    }
                }

                // Handle Group Discounts
                if (createDto.GroupDiscounts != null && createDto.GroupDiscounts.Any())
                {
                    foreach (var item in createDto.GroupDiscounts)
                    {
                        _context.TripGroupDiscounts.Add(new TripGroupDiscount
                        {
                            TrekPackageId = package.Id,
                            MinTravelers = item.MinTravelers,
                            MaxTravelers = item.MaxTravelers,
                            PricePerPerson = item.PricePerPerson,
                            DiscountPercentage = item.DiscountPercentage,
                            Description = item.Description,
                            DisplayOrder = item.DisplayOrder,
                            IsActive = true,
                            CreatedAt = DateTime.UtcNow
                        });
                    }
                }

                await _context.SaveChangesAsync();
                _logger.LogInformation($"Package created successfully with ID: {package.Id}");

                var createdPackage = await _context.TrekPackages
                    .Include(t => t.Country)
                    .Include(t => t.MainHeading)
                    .Include(t => t.Heading)
                    .Include(t => t.SubHeading)
                    .Include(t => t.SliderImages)
                    .Include(t => t.GalleryImages)
                    .Include(t => t.Itinerary)
                    .Include(t => t.CostIncludes)
                    .Include(t => t.CostExcludes)
                    .Include(t => t.Faqs)
                    .Include(t => t.DepartureDates)
                    .FirstOrDefaultAsync(t => t.Id == package.Id);

                return CreatedAtAction(nameof(GetTrekPackage), new { id = package.Id }, MapToResponseDto(createdPackage!));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating trek package");
                return StatusCode(500, new { message = "An error occurred while creating the package", error = ex.Message });
            }
        }

        // PUT: api/TrekPackage/5 - UPDATED WITH PRESERVE IMAGE LOGIC
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTrekPackage(int id, [FromForm] UpdateTrekPackageDto updateDto)
        {
            try
            {
                _logger.LogInformation($"Starting package update for ID: {id}");

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                updateDto.DeserializeJsonCollections();

                var package = await _context.TrekPackages
                    .Include(t => t.SliderImages)
                    .Include(t => t.GalleryImages)
                    .Include(t => t.Itinerary)
                    .Include(t => t.CostIncludes)
                    .Include(t => t.CostExcludes)
                    .Include(t => t.Faqs)
                    .Include(t => t.DepartureDates)
                    .Include(t => t.GroupDiscounts)
                    .FirstOrDefaultAsync(t => t.Id == id);

                if (package == null)
                {
                    return NotFound(new { message = "Trek package not found" });
                }

                // Validate hierarchy
                var mainHeading = await _context.MainHeadings.FindAsync(updateDto.MainHeadingId);
                if (mainHeading == null)
                {
                    return NotFound(new { message = "Main heading not found" });
                }

                var heading = await _context.Headings
                    .FirstOrDefaultAsync(h => h.Id == updateDto.HeadingId && h.MainHeadingId == updateDto.MainHeadingId);
                if (heading == null)
                {
                    return NotFound(new { message = "Heading not found or does not belong to the selected main heading" });
                }

                if (updateDto.SubHeadingId.HasValue)
                {
                    var subHeading = await _context.SubHeadings
                        .FirstOrDefaultAsync(sh => sh.Id == updateDto.SubHeadingId &&
                                                  sh.HeadingId == updateDto.HeadingId &&
                                                  sh.MainHeadingId == updateDto.MainHeadingId);
                    if (subHeading == null)
                    {
                        return NotFound(new { message = "Subheading not found or does not belong to the selected heading" });
                    }
                }

                // Check if another package with the same name exists
                var existingPackage = await _context.TrekPackages
                    .FirstOrDefaultAsync(t => t.Name.ToLower() == updateDto.Name.ToLower() && t.Id != id);

                if (existingPackage != null)
                {
                    return Conflict(new { message = "Another trek package with this name already exists" });
                }

                // Update basic fields
                package.Name = updateDto.Name;
                package.ShortDescription = updateDto.ShortDescription;
                package.Price = updateDto.Price;
                package.DiscountedPrice = updateDto.DiscountedPrice;
                package.DurationDays = updateDto.DurationDays;
                package.DurationNights = updateDto.DurationNights;
                package.TripGrade = updateDto.TripGrade;
                package.MainHeadingId = updateDto.MainHeadingId;
                package.HeadingId = updateDto.HeadingId;
                package.SubHeadingId = updateDto.SubHeadingId;
                package.CountryId = updateDto.CountryId;
                package.MaximumAltitude = updateDto.MaximumAltitude;
                package.GroupSize = updateDto.GroupSize;
                package.StartsAt = updateDto.StartsAt;
                package.EndsAt = updateDto.EndsAt;
                package.Activities = updateDto.Activities;
                package.BestTime = updateDto.BestTime;
                package.Overview = updateDto.Overview;
                package.EssentialInformation = updateDto.EssentialInformation;
                package.VideoReviewUrl = updateDto.VideoReviewUrl;
                package.UpdatedAt = DateTime.UtcNow;

                // Update Route Map Image if new one uploaded
                if (updateDto.RouteMapImage != null)
                {
                    if (!string.IsNullOrEmpty(package.RouteMapImageUrl))
                    {
                        DeleteImage(package.RouteMapImageUrl);
                    }
                    package.RouteMapImageUrl = await SaveImage(updateDto.RouteMapImage, "routemaps");
                }

                // ========== UPDATE SLIDER IMAGES - PRESERVE EXISTING ==========
                if (updateDto.SliderImages != null)
                {
                    var existingSliderImages = package.SliderImages.ToList();
                    var imagesToKeep = new List<TripSliderImage>();

                    // Process images (both existing and new)
                    for (int i = 0; i < updateDto.SliderImages.Count; i++)
                    {
                        var newImage = updateDto.SliderImages[i];

                        // Check if this is an existing image (has ID)
                        var existingImage = existingSliderImages.FirstOrDefault(img =>
                            img.Id.ToString() == SafeGetValue(updateDto.SliderImageIds, i));

                        if (existingImage != null)
                        {
                            // Update existing image metadata
                            existingImage.Title = SafeGetValue(updateDto.SliderTitles, i);
                            existingImage.Caption = SafeGetValue(updateDto.SliderCaptions, i);
                            existingImage.AltText = SafeGetValue(updateDto.SliderAltTexts, i);
                            existingImage.DisplayOrder = i;
                            imagesToKeep.Add(existingImage);
                        }
                        else
                        {
                            // This is a new image - upload and add
                            var imageUrl = await SaveImage(newImage, "slider");

                            var newSliderImage = new TripSliderImage
                            {
                                TrekPackageId = package.Id,
                                ImageUrl = imageUrl,
                                Title = SafeGetValue(updateDto.SliderTitles, i),
                                Caption = SafeGetValue(updateDto.SliderCaptions, i),
                                AltText = SafeGetValue(updateDto.SliderAltTexts, i),
                                DisplayOrder = i,
                                IsActive = true
                            };

                            _context.TripSliderImages.Add(newSliderImage);
                            imagesToKeep.Add(newSliderImage);
                        }
                    }

                    // Identify and remove images not in the keep list
                    var imagesToRemove = existingSliderImages
                        .Where(img => !imagesToKeep.Any(k => k.Id == img.Id))
                        .ToList();

                    foreach (var imageToRemove in imagesToRemove)
                    {
                        if (!string.IsNullOrEmpty(imageToRemove.ImageUrl))
                        {
                            DeleteImage(imageToRemove.ImageUrl);
                        }
                        _context.TripSliderImages.Remove(imageToRemove);
                    }
                }

                // ========== UPDATE GALLERY IMAGES - PRESERVE EXISTING ==========
                if (updateDto.GalleryImages != null)
                {
                    var existingGalleryImages = package.GalleryImages.ToList();
                    var imagesToKeep = new List<TripGalleryImage>();

                    // Process images (both existing and new)
                    for (int i = 0; i < updateDto.GalleryImages.Count; i++)
                    {
                        var newImage = updateDto.GalleryImages[i];

                        // Check if this is an existing image (has ID)
                        var existingImage = existingGalleryImages.FirstOrDefault(img =>
                            img.Id.ToString() == SafeGetValue(updateDto.GalleryImageIds, i));

                        if (existingImage != null)
                        {
                            // Update existing image metadata
                            existingImage.Title = SafeGetValue(updateDto.GalleryTitles, i);
                            existingImage.Description = SafeGetValue(updateDto.GalleryDescriptions, i);
                            existingImage.AltText = SafeGetValue(updateDto.GalleryAltTexts, i);
                            existingImage.IsFeatured = updateDto.FeaturedImageIndices?.Contains(i) ?? false;
                            existingImage.DisplayOrder = i;
                            imagesToKeep.Add(existingImage);
                        }
                        else
                        {
                            // This is a new image - upload and add
                            var imageUrl = await SaveImage(newImage, "gallery");

                            var newGalleryImage = new TripGalleryImage
                            {
                                TrekPackageId = package.Id,
                                ImageUrl = imageUrl,
                                Title = SafeGetValue(updateDto.GalleryTitles, i),
                                Description = SafeGetValue(updateDto.GalleryDescriptions, i),
                                AltText = SafeGetValue(updateDto.GalleryAltTexts, i),
                                DisplayOrder = i,
                                IsFeatured = updateDto.FeaturedImageIndices?.Contains(i) ?? false,
                                IsActive = true,
                                CreatedAt = DateTime.UtcNow
                            };

                            _context.TripGalleryImages.Add(newGalleryImage);
                            imagesToKeep.Add(newGalleryImage);
                        }
                    }

                    // Identify and remove images not in the keep list
                    var imagesToRemove = existingGalleryImages
                        .Where(img => !imagesToKeep.Any(k => k.Id == img.Id))
                        .ToList();

                    foreach (var imageToRemove in imagesToRemove)
                    {
                        if (!string.IsNullOrEmpty(imageToRemove.ImageUrl))
                        {
                            DeleteImage(imageToRemove.ImageUrl);
                        }
                        _context.TripGalleryImages.Remove(imageToRemove);
                    }
                }

                // Update Itinerary
                if (updateDto.Itinerary != null)
                {
                    _context.TripItineraryDays.RemoveRange(package.Itinerary);
                    foreach (var item in updateDto.Itinerary)
                    {
                        _context.TripItineraryDays.Add(new TripItineraryDay
                        {
                            TrekPackageId = package.Id,
                            DayNumber = item.DayNumber,
                            Title = item.Title,
                            Description = item.Description,
                            MaxAltitude = item.MaxAltitude,
                            Accommodation = item.Accommodation,
                            Meals = item.Meals,
                            Duration = item.Duration,
                            Distance = item.Distance,
                            DisplayOrder = item.DayNumber
                        });
                    }
                }

                // Update Cost Includes
                if (updateDto.CostIncludes != null)
                {
                    _context.TripCostIncludes.RemoveRange(package.CostIncludes);
                    foreach (var item in updateDto.CostIncludes)
                    {
                        _context.TripCostIncludes.Add(new TripCostInclude
                        {
                            TrekPackageId = package.Id,
                            Description = item.Description,
                            Category = item.Category,
                            DisplayOrder = item.DisplayOrder
                        });
                    }
                }

                // Update Cost Excludes
                if (updateDto.CostExcludes != null)
                {
                    _context.TripCostExcludes.RemoveRange(package.CostExcludes);
                    foreach (var item in updateDto.CostExcludes)
                    {
                        _context.TripCostExcludes.Add(new TripCostExclude
                        {
                            TrekPackageId = package.Id,
                            Description = item.Description,
                            Category = item.Category,
                            DisplayOrder = item.DisplayOrder
                        });
                    }
                }

                // Update FAQs
                if (updateDto.Faqs != null)
                {
                    _context.TripFaqs.RemoveRange(package.Faqs);
                    foreach (var item in updateDto.Faqs)
                    {
                        _context.TripFaqs.Add(new TripFAQ
                        {
                            TrekPackageId = package.Id,
                            Question = item.Question,
                            Answer = item.Answer,
                            DisplayOrder = item.DisplayOrder
                        });
                    }
                }

                // Update Departure Dates
                if (updateDto.DepartureDates != null)
                {
                    _context.TripDepartureDates.RemoveRange(package.DepartureDates);
                    foreach (var item in updateDto.DepartureDates)
                    {
                        item.ConvertToUtc();

                        _context.TripDepartureDates.Add(new TripDepartureDate
                        {
                            TrekPackageId = package.Id,
                            StartDate = item.StartDate,
                            EndDate = item.EndDate,
                            Price = item.Price,
                            DiscountedPrice = item.DiscountedPrice,
                            IsGuaranteed = item.IsGuaranteed,
                            IsAvailable = true,
                            Notes = item.Notes,
                            IsBestSeller = item.IsBestSeller,
                            IsTopSeller = item.IsTopSeller,
                            BookingCount = item.BookingCount
                        });
                    }
                }

                // Update Group Discounts
                if (updateDto.GroupDiscounts != null)
                {
                    _context.TripGroupDiscounts.RemoveRange(package.GroupDiscounts);
                    foreach (var item in updateDto.GroupDiscounts)
                    {
                        _context.TripGroupDiscounts.Add(new TripGroupDiscount
                        {
                            TrekPackageId = package.Id,
                            MinTravelers = item.MinTravelers,
                            MaxTravelers = item.MaxTravelers,
                            PricePerPerson = item.PricePerPerson,
                            DiscountPercentage = item.DiscountPercentage,
                            Description = item.Description,
                            DisplayOrder = item.DisplayOrder,
                            IsActive = true,
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        });
                    }
                }

                await _context.SaveChangesAsync();
                _logger.LogInformation($"Package updated successfully with ID: {id}");

                return Ok(new { message = "Trek package updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating trek package with ID: {id}");
                return StatusCode(500, new { message = "An error occurred while updating the package", error = ex.Message });
            }
        }

        // DELETE: api/TrekPackage/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTrekPackage(int id)
        {
            try
            {
                var package = await _context.TrekPackages
                    .Include(t => t.SliderImages)
                    .Include(t => t.GalleryImages)
                    .FirstOrDefaultAsync(t => t.Id == id);

                if (package == null)
                {
                    return NotFound(new { message = "Trek package not found" });
                }

                // Soft delete
                package.IsActive = false;
                package.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Trek package deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting trek package with ID: {id}");
                return StatusCode(500, new { message = "Error deleting package", error = ex.Message });
            }
        }

        // PATCH: api/TrekPackage/5/toggle-status
        [HttpPatch("{id}/toggle-status")]
        public async Task<IActionResult> TogglePackageStatus(int id)
        {
            try
            {
                var package = await _context.TrekPackages.FindAsync(id);
                if (package == null)
                {
                    return NotFound(new { message = "Trek package not found" });
                }

                package.IsActive = !package.IsActive;
                package.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = $"Trek package {(package.IsActive ? "activated" : "deactivated")} successfully",
                    isActive = package.IsActive
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error toggling package status for ID: {id}");
                return StatusCode(500, new { message = "Error toggling status", error = ex.Message });
            }
        }

        // GET: api/TrekPackage/search
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<TrekPackageResponseDto>>> SearchTrekPackages(
            [FromQuery] string? name,
            [FromQuery] int? mainHeadingId,
            [FromQuery] int? headingId,
            [FromQuery] int? countryId,
            [FromQuery] int? minDays,
            [FromQuery] int? maxDays,
            [FromQuery] string? grade,
            [FromQuery] decimal? maxPrice,
            [FromQuery] string? month)
        {
            try
            {
                var query = _context.TrekPackages
                    .Include(t => t.Country)
                    .Include(t => t.MainHeading)
                    .Include(t => t.Heading)
                    .Include(t => t.SubHeading)
                    .Include(t => t.SliderImages)
                    .Where(t => t.IsActive)
                    .AsQueryable();

                if (!string.IsNullOrWhiteSpace(name))
                {
                    query = query.Where(t => t.Name.ToLower().Contains(name.ToLower()) ||
                                            (t.ShortDescription != null && t.ShortDescription.ToLower().Contains(name.ToLower())));
                }

                if (mainHeadingId.HasValue)
                {
                    query = query.Where(t => t.MainHeadingId == mainHeadingId.Value);
                }

                if (headingId.HasValue)
                {
                    query = query.Where(t => t.HeadingId == headingId.Value);
                }

                if (countryId.HasValue)
                {
                    query = query.Where(t => t.CountryId == countryId.Value);
                }

                if (minDays.HasValue)
                {
                    query = query.Where(t => t.DurationDays >= minDays.Value);
                }

                if (maxDays.HasValue)
                {
                    query = query.Where(t => t.DurationDays <= maxDays.Value);
                }

                if (!string.IsNullOrWhiteSpace(grade))
                {
                    query = query.Where(t => t.TripGrade != null && t.TripGrade.ToLower().Contains(grade.ToLower()));
                }

                if (maxPrice.HasValue)
                {
                    query = query.Where(t => t.DiscountedPrice != null ? t.DiscountedPrice <= maxPrice : t.Price <= maxPrice);
                }

                if (!string.IsNullOrWhiteSpace(month))
                {
                    query = query.Where(t => t.BestTime != null && t.BestTime.ToLower().Contains(month.ToLower()));
                }

                var packages = await query
                    .OrderBy(t => t.Name)
                    .Select(t => MapToResponseDto(t))
                    .ToListAsync();

                return Ok(packages);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching packages");
                return StatusCode(500, new { message = "Error searching packages", error = ex.Message });
            }
        }

        // GET: api/TrekPackage/5/similar
        [HttpGet("{id}/similar")]
        public async Task<ActionResult<IEnumerable<TrekPackageResponseDto>>> GetSimilarPackages(int id)
        {
            try
            {
                var package = await _context.TrekPackages.FindAsync(id);
                if (package == null)
                {
                    return NotFound(new { message = "Trek package not found" });
                }

                var similarPackages = await _context.TrekPackages
                    .Include(t => t.Country)
                    .Include(t => t.MainHeading)
                    .Include(t => t.Heading)
                    .Include(t => t.SliderImages)
                    .Where(t => t.Id != id && t.HeadingId == package.HeadingId && t.IsActive)
                    .OrderBy(t => t.Name)
                    .Take(4)
                    .Select(t => MapToResponseDto(t))
                    .ToListAsync();

                return Ok(similarPackages);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error fetching similar packages for ID: {id}");
                return StatusCode(500, new { message = "Error fetching similar packages", error = ex.Message });
            }
        }

        // Helper method to save images
        private async Task<string> SaveImage(IFormFile image, string folderName)
        {
            if (image == null || image.Length == 0)
                return string.Empty;

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
            var folderPath = Path.Combine(_environment.WebRootPath ?? "wwwroot", "uploads", "trekpackages", folderName);

            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }

            var filePath = Path.Combine(folderPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }

            return $"/uploads/trekpackages/{folderName}/{fileName}";
        }

        // Helper method to delete image
        private void DeleteImage(string imageUrl)
        {
            if (string.IsNullOrEmpty(imageUrl))
                return;

            var fileName = Path.GetFileName(imageUrl);
            var folderName = Path.GetFileName(Path.GetDirectoryName(imageUrl));
            var filePath = Path.Combine(_environment.WebRootPath ?? "wwwroot", "uploads", "trekpackages", folderName ?? "", fileName ?? "");

            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }
        }

        // Helper method to safely get value from list by index
        private T? SafeGetValue<T>(List<T>? list, int index)
        {
            if (list != null && index >= 0 && index < list.Count)
            {
                return list[index];
            }
            return default;
        }

        // Helper method to map TrekPackage to Response DTO
        private static TrekPackageResponseDto MapToResponseDto(TrekPackage package)
        {
            return new TrekPackageResponseDto
            {
                Id = package.Id,
                Name = package.Name,
                ShortDescription = package.ShortDescription,
                Price = package.Price,
                DiscountedPrice = package.DiscountedPrice,
                DurationDays = package.DurationDays,
                DurationNights = package.DurationNights,
                TripGrade = package.TripGrade,
                MainHeadingId = package.MainHeadingId,
                MainHeadingName = package.MainHeading?.Name ?? string.Empty,
                HeadingId = package.HeadingId,
                HeadingName = package.Heading?.Name ?? string.Empty,
                SubHeadingId = package.SubHeadingId,
                SubHeadingName = package.SubHeading?.Name,
                CountryId = package.CountryId,
                CountryName = package.Country?.Name ?? string.Empty,
                MaximumAltitude = package.MaximumAltitude,
                GroupSize = package.GroupSize,
                StartsAt = package.StartsAt,
                EndsAt = package.EndsAt,
                Activities = package.Activities,
                BestTime = package.BestTime,
                Overview = package.Overview,
                EssentialInformation = package.EssentialInformation,
                VideoReviewUrl = package.VideoReviewUrl,
                RouteMapImageUrl = package.RouteMapImageUrl,
                IsActive = package.IsActive,
                CreatedAt = package.CreatedAt,
                UpdatedAt = package.UpdatedAt,
                IsBestSeller = package.DepartureDates != null && package.DepartureDates.Any(d => d.IsBestSeller == true),
                IsTopSeller = package.DepartureDates != null && package.DepartureDates.Any(d => d.IsTopSeller == true),
                HasGuaranteedDeparture = package.DepartureDates != null && package.DepartureDates.Any(d => d.IsGuaranteed == true),
                SliderImages = package.SliderImages?.Select(s => new TripSliderImageDto
                {
                    Id = s.Id,
                    ImageUrl = s.ImageUrl,
                    Title = s.Title,
                    Caption = s.Caption,
                    AltText = s.AltText,
                    DisplayOrder = s.DisplayOrder
                }).OrderBy(s => s.DisplayOrder).ToList() ?? new List<TripSliderImageDto>(),
                GalleryImages = package.GalleryImages?.Select(g => new TripGalleryImageDto
                {
                    Id = g.Id,
                    ImageUrl = g.ImageUrl,
                    Title = g.Title,
                    Description = g.Description,
                    AltText = g.AltText,
                    DisplayOrder = g.DisplayOrder,
                    IsFeatured = g.IsFeatured
                }).OrderBy(g => g.DisplayOrder).ToList() ?? new List<TripGalleryImageDto>(),
                Itinerary = package.Itinerary?.Select(i => new TripItineraryDayDto
                {
                    Id = i.Id,
                    DayNumber = i.DayNumber,
                    Title = i.Title,
                    Description = i.Description,
                    MaxAltitude = i.MaxAltitude,
                    Accommodation = i.Accommodation,
                    Meals = i.Meals,
                    Duration = i.Duration,
                    Distance = i.Distance
                }).OrderBy(i => i.DayNumber).ToList() ?? new List<TripItineraryDayDto>(),
                CostIncludes = package.CostIncludes?.Select(c => new TripCostIncludeDto
                {
                    Id = c.Id,
                    Description = c.Description,
                    Category = c.Category,
                    DisplayOrder = c.DisplayOrder
                }).OrderBy(c => c.DisplayOrder).ToList() ?? new List<TripCostIncludeDto>(),
                CostExcludes = package.CostExcludes?.Select(c => new TripCostExcludeDto
                {
                    Id = c.Id,
                    Description = c.Description,
                    Category = c.Category,
                    DisplayOrder = c.DisplayOrder
                }).OrderBy(c => c.DisplayOrder).ToList() ?? new List<TripCostExcludeDto>(),
                Faqs = package.Faqs?.Select(f => new TripFaqDto
                {
                    Id = f.Id,
                    Question = f.Question,
                    Answer = f.Answer,
                    DisplayOrder = f.DisplayOrder
                }).OrderBy(f => f.DisplayOrder).ToList() ?? new List<TripFaqDto>(),
                DepartureDates = package.DepartureDates?.Select(d => new TripDepartureDateDto
                {
                    Id = d.Id,
                    StartDate = d.StartDate,
                    EndDate = d.EndDate,
                    Price = d.Price,
                    DiscountedPrice = d.DiscountedPrice,
                    IsGuaranteed = d.IsGuaranteed,
                    IsAvailable = d.IsAvailable,
                    Notes = d.Notes,
                    IsBestSeller = d.IsBestSeller,
                    IsTopSeller = d.IsTopSeller,
                    BookingCount = d.BookingCount
                }).OrderBy(d => d.StartDate).ToList() ?? new List<TripDepartureDateDto>(),
                GroupDiscounts = package.GroupDiscounts?.Select(g => new GroupDiscountDto
                {
                    Id = g.Id,
                    MinTravelers = g.MinTravelers,
                    MaxTravelers = g.MaxTravelers,
                    PricePerPerson = g.PricePerPerson,
                    DiscountPercentage = g.DiscountPercentage,
                    Description = g.Description,
                    DisplayOrder = g.DisplayOrder,
                    IsActive = g.IsActive,
                    TotalPrice = g.PricePerPerson * g.MaxTravelers
                }).OrderBy(g => g.MinTravelers).ToList() ?? new List<GroupDiscountDto>()
            };
        }
    }
}