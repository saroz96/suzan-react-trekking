using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubHeadingController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SubHeadingController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/SubHeading
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SubHeadingResponseDto>>> GetSubHeadings()
        {
            var packages = await _context.TrekPackages
                .Include(tp => tp.DepartureDates)
                .Where(tp => tp.IsActive)
                .ToListAsync();

            var subHeadings = await _context.SubHeadings
                .Include(sh => sh.MainHeading)
                .Include(sh => sh.Heading)
                .OrderBy(sh => sh.MainHeadingId)
                .ThenBy(sh => sh.HeadingId)
                .ThenBy(sh => sh.DisplayOrder)
                .ThenBy(sh => sh.Name)
                .ToListAsync();

            var result = subHeadings.Select(sh => new SubHeadingResponseDto
            {
                Id = sh.Id,
                Name = sh.Name,
                MainHeadingId = sh.MainHeadingId,
                MainHeadingName = sh.MainHeading?.Name ?? string.Empty,
                HeadingId = sh.HeadingId,
                HeadingName = sh.Heading?.Name ?? string.Empty,
                Description = sh.Description,
                Content = sh.Content,
                DisplayOrder = sh.DisplayOrder,
                IsActive = sh.IsActive,
                IconUrl = sh.IconUrl,
                ImageUrl = sh.ImageUrl,
                MetaDescription = sh.MetaDescription,
                MetaKeywords = sh.MetaKeywords,
                CreatedAt = sh.CreatedAt,
                UpdatedAt = sh.UpdatedAt,
                PackageCount = packages.Count(p => p.SubHeadingId == sh.Id),
                BestSellerCount = packages.Count(p => p.SubHeadingId == sh.Id &&
                    p.DepartureDates != null &&
                    p.DepartureDates.Any(d => d.IsBestSeller && d.StartDate > DateTime.UtcNow && d.IsAvailable)),
                TopSellerCount = packages.Count(p => p.SubHeadingId == sh.Id &&
                    p.DepartureDates != null &&
                    p.DepartureDates.Any(d => d.IsTopSeller && d.StartDate > DateTime.UtcNow && d.IsAvailable)),
                GuaranteedCount = packages.Count(p => p.SubHeadingId == sh.Id &&
                    p.DepartureDates != null &&
                    p.DepartureDates.Any(d => d.IsGuaranteed && d.StartDate > DateTime.UtcNow && d.IsAvailable))
            }).ToList();

            return Ok(result);
        }

        // GET: api/SubHeading/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SubHeadingResponseDto>> GetSubHeading(int id)
        {
            var subHeading = await _context.SubHeadings
                .Include(sh => sh.MainHeading)
                .Include(sh => sh.Heading)
                .FirstOrDefaultAsync(sh => sh.Id == id);

            if (subHeading == null)
            {
                return NotFound(new { message = "SubHeading not found" });
            }

            var packages = await _context.TrekPackages
                .Include(tp => tp.DepartureDates)
                .Where(tp => tp.SubHeadingId == id && tp.IsActive)
                .ToListAsync();

            return Ok(new SubHeadingResponseDto
            {
                Id = subHeading.Id,
                Name = subHeading.Name,
                MainHeadingId = subHeading.MainHeadingId,
                MainHeadingName = subHeading.MainHeading?.Name ?? string.Empty,
                HeadingId = subHeading.HeadingId,
                HeadingName = subHeading.Heading?.Name ?? string.Empty,
                Description = subHeading.Description,
                Content = subHeading.Content,
                DisplayOrder = subHeading.DisplayOrder,
                IsActive = subHeading.IsActive,
                IconUrl = subHeading.IconUrl,
                ImageUrl = subHeading.ImageUrl,
                MetaDescription = subHeading.MetaDescription,
                MetaKeywords = subHeading.MetaKeywords,
                CreatedAt = subHeading.CreatedAt,
                UpdatedAt = subHeading.UpdatedAt,
                PackageCount = packages.Count,
                BestSellerCount = packages.Count(p => p.DepartureDates != null &&
                    p.DepartureDates.Any(d => d.IsBestSeller && d.StartDate > DateTime.UtcNow && d.IsAvailable)),
                TopSellerCount = packages.Count(p => p.DepartureDates != null &&
                    p.DepartureDates.Any(d => d.IsTopSeller && d.StartDate > DateTime.UtcNow && d.IsAvailable)),
                GuaranteedCount = packages.Count(p => p.DepartureDates != null &&
                    p.DepartureDates.Any(d => d.IsGuaranteed && d.StartDate > DateTime.UtcNow && d.IsAvailable))
            });
        }

        // GET: api/SubHeading/5/statistics
        [HttpGet("{id}/statistics")]
        public async Task<ActionResult<SubHeadingStatisticsDto>> GetSubHeadingStatistics(int id)
        {
            var subHeading = await _context.SubHeadings
                .FirstOrDefaultAsync(sh => sh.Id == id);

            if (subHeading == null)
            {
                return NotFound(new { message = "SubHeading not found" });
            }

            var packages = await _context.TrekPackages
                .Include(tp => tp.DepartureDates)
                .Where(tp => tp.SubHeadingId == id && tp.IsActive)
                .ToListAsync();

            var now = DateTime.UtcNow;

            var stats = new SubHeadingStatisticsDto
            {
                SubHeadingId = id,
                SubHeadingName = subHeading.Name,
                TotalPackages = packages.Count,
                ActivePackages = packages.Count(p => p.IsActive),

                TotalBestSellerPackages = packages.Count(p => p.DepartureDates != null &&
                    p.DepartureDates.Any(d => d.IsBestSeller && d.StartDate > now && d.IsAvailable)),
                TotalTopSellerPackages = packages.Count(p => p.DepartureDates != null &&
                    p.DepartureDates.Any(d => d.IsTopSeller && d.StartDate > now && d.IsAvailable)),
                TotalGuaranteedDepartures = packages.Count(p => p.DepartureDates != null &&
                    p.DepartureDates.Any(d => d.IsGuaranteed && d.StartDate > now && d.IsAvailable)),

                TotalBookings = packages.Sum(p => p.DepartureDates?.Sum(d => d.BookingCount) ?? 0),
                UpcomingDepartures = packages.Sum(p => p.DepartureDates?.Count(d => d.StartDate > now && d.IsAvailable) ?? 0),

                MinPrice = packages.Min(p => p.DiscountedPrice ?? p.Price ?? 0),
                MaxPrice = packages.Max(p => p.DiscountedPrice ?? p.Price ?? 0),
                AveragePrice = packages.Average(p => (double)(p.DiscountedPrice ?? p.Price ?? 0)),

                MinDuration = packages.Min(p => p.DurationDays ?? 0),
                MaxDuration = packages.Max(p => p.DurationDays ?? 0),
                AverageDuration = packages.Average(p => p.DurationDays ?? 0)
            };

            return Ok(stats);
        }

        // GET: api/SubHeading/5/packages-with-seller-status
        [HttpGet("{id}/packages-with-seller-status")]
        public async Task<ActionResult<IEnumerable<PackageWithSellerStatusDto>>> GetPackagesWithSellerStatus(int id)
        {
            var subHeading = await _context.SubHeadings.FindAsync(id);
            if (subHeading == null)
            {
                return NotFound(new { message = "SubHeading not found" });
            }

            var now = DateTime.UtcNow;

            // Get packages with their related data - PostgreSQL will handle this efficiently
            var packages = await _context.TrekPackages
                .Include(tp => tp.MainHeading)
                .Include(tp => tp.Heading)
                .Include(tp => tp.Country)
                .Include(tp => tp.SliderImages)
                .Include(tp => tp.DepartureDates)
                .Where(tp => tp.SubHeadingId == id && tp.IsActive)
                .ToListAsync(); // Execute the query first

            // Then process in memory (client-side evaluation)
            var result = packages.Select(tp => new PackageWithSellerStatusDto
            {
                Id = tp.Id,
                Name = tp.Name,
                ShortDescription = tp.ShortDescription,
                Price = tp.Price,
                DiscountedPrice = tp.DiscountedPrice,
                DurationDays = tp.DurationDays,
                TripGrade = tp.TripGrade,
                MainHeadingName = tp.MainHeading?.Name ?? string.Empty,
                HeadingName = tp.Heading?.Name ?? string.Empty,
                SubHeadingName = subHeading.Name,
                CountryName = tp.Country?.Name ?? string.Empty,
                SliderImageUrl = tp.SliderImages?
                    .OrderBy(s => s.DisplayOrder)
                    .Select(s => s.ImageUrl)
                    .FirstOrDefault(),

                // These checks now run in memory after the data is loaded from PostgreSQL
                IsBestSeller = tp.DepartureDates != null &&
                    tp.DepartureDates.Any(d => d.IsBestSeller && d.StartDate > now && d.IsAvailable),
                IsTopSeller = tp.DepartureDates != null &&
                    tp.DepartureDates.Any(d => d.IsTopSeller && d.StartDate > now && d.IsAvailable),
                HasGuaranteedDeparture = tp.DepartureDates != null &&
                    tp.DepartureDates.Any(d => d.IsGuaranteed && d.StartDate > now && d.IsAvailable),

                NextDepartureDate = tp.DepartureDates?
                    .Where(d => d.StartDate > now && d.IsAvailable)
                    .OrderBy(d => d.StartDate)
                    .Select(d => d.StartDate)
                    .FirstOrDefault(),

                TotalBookings = tp.DepartureDates?.Sum(d => d.BookingCount) ?? 0
            })
            .OrderByDescending(tp => tp.IsBestSeller)
            .ThenByDescending(tp => tp.IsTopSeller)
            .ThenBy(tp => tp.Name)
            .ToList();

            return Ok(result);
        }

        // GET: api/SubHeading/best-sellers
        [HttpGet("best-sellers")]
        public async Task<ActionResult<IEnumerable<SubHeadingBestSellerDto>>> GetBestSellerSubHeadings([FromQuery] int? limit = 10)
        {
            var packages = await _context.TrekPackages
                .Include(tp => tp.DepartureDates)
                .Where(tp => tp.IsActive)
                .ToListAsync();

            var subHeadings = await _context.SubHeadings
                .Where(sh => sh.IsActive)
                .Include(sh => sh.MainHeading)
                .Include(sh => sh.Heading)
                .ToListAsync();

            var result = subHeadings.Select(sh => new SubHeadingBestSellerDto
            {
                Id = sh.Id,
                Name = sh.Name,
                MainHeadingName = sh.MainHeading?.Name ?? string.Empty,
                HeadingName = sh.Heading?.Name ?? string.Empty,
                TotalPackages = packages.Count(p => p.SubHeadingId == sh.Id),
                BestSellerPackages = packages.Count(p => p.SubHeadingId == sh.Id &&
                    p.DepartureDates != null &&
                    p.DepartureDates.Any(d => d.IsBestSeller && d.StartDate > DateTime.UtcNow && d.IsAvailable)),
                TopSellerPackages = packages.Count(p => p.SubHeadingId == sh.Id &&
                    p.DepartureDates != null &&
                    p.DepartureDates.Any(d => d.IsTopSeller && d.StartDate > DateTime.UtcNow && d.IsAvailable)),
                TotalBookings = packages.Where(p => p.SubHeadingId == sh.Id)
                    .Sum(p => p.DepartureDates?.Sum(d => d.BookingCount) ?? 0),
                ImageUrl = sh.ImageUrl
            })
            .OrderByDescending(sh => sh.BestSellerPackages)
            .ThenByDescending(sh => sh.TotalBookings)
            .Take(limit ?? 10)
            .ToList();

            return Ok(result);
        }

        // GET: api/SubHeading/by-heading/5
        [HttpGet("by-heading/{headingId}")]
        public async Task<ActionResult<IEnumerable<SubHeadingResponseDto>>> GetSubHeadingsByHeading(int headingId)
        {
            var headingExists = await _context.Headings.AnyAsync(h => h.Id == headingId);
            if (!headingExists)
            {
                return NotFound(new { message = "Heading not found" });
            }

            var packages = await _context.TrekPackages
                .Include(tp => tp.DepartureDates)
                .Where(tp => tp.HeadingId == headingId && tp.IsActive)
                .ToListAsync();

            var subHeadings = await _context.SubHeadings
                .Where(sh => sh.HeadingId == headingId && sh.IsActive)
                .Include(sh => sh.MainHeading)
                .Include(sh => sh.Heading)
                .OrderBy(sh => sh.DisplayOrder)
                .ThenBy(sh => sh.Name)
                .Select(sh => new SubHeadingResponseDto
                {
                    Id = sh.Id,
                    Name = sh.Name,
                    MainHeadingId = sh.MainHeadingId,
                    MainHeadingName = sh.MainHeading != null ? sh.MainHeading.Name : string.Empty,
                    HeadingId = sh.HeadingId,
                    HeadingName = sh.Heading != null ? sh.Heading.Name : string.Empty,
                    Description = sh.Description,
                    Content = sh.Content,
                    DisplayOrder = sh.DisplayOrder,
                    IsActive = sh.IsActive,
                    IconUrl = sh.IconUrl,
                    ImageUrl = sh.ImageUrl,
                    MetaDescription = sh.MetaDescription,
                    MetaKeywords = sh.MetaKeywords,
                    CreatedAt = sh.CreatedAt,
                    UpdatedAt = sh.UpdatedAt,
                    PackageCount = packages.Count(p => p.SubHeadingId == sh.Id),
                    BestSellerCount = packages.Count(p => p.SubHeadingId == sh.Id &&
                        p.DepartureDates != null &&
                        p.DepartureDates.Any(d => d.IsBestSeller && d.StartDate > DateTime.UtcNow && d.IsAvailable)),
                    TopSellerCount = packages.Count(p => p.SubHeadingId == sh.Id &&
                        p.DepartureDates != null &&
                        p.DepartureDates.Any(d => d.IsTopSeller && d.StartDate > DateTime.UtcNow && d.IsAvailable)),
                    GuaranteedCount = packages.Count(p => p.SubHeadingId == sh.Id &&
                        p.DepartureDates != null &&
                        p.DepartureDates.Any(d => d.IsGuaranteed && d.StartDate > DateTime.UtcNow && d.IsAvailable))
                })
                .ToListAsync();

            return Ok(subHeadings);
        }

        // GET: api/SubHeading/by-mainheading/5
        [HttpGet("by-mainheading/{mainHeadingId}")]
        public async Task<ActionResult<IEnumerable<SubHeadingResponseDto>>> GetSubHeadingsByMainHeading(int mainHeadingId)
        {
            var mainHeadingExists = await _context.MainHeadings.AnyAsync(mh => mh.Id == mainHeadingId);
            if (!mainHeadingExists)
            {
                return NotFound(new { message = "Main heading not found" });
            }

            var packages = await _context.TrekPackages
                .Include(tp => tp.DepartureDates)
                .Where(tp => tp.MainHeadingId == mainHeadingId && tp.IsActive)
                .ToListAsync();

            var subHeadings = await _context.SubHeadings
                .Where(sh => sh.MainHeadingId == mainHeadingId && sh.IsActive)
                .Include(sh => sh.MainHeading)
                .Include(sh => sh.Heading)
                .OrderBy(sh => sh.HeadingId)
                .ThenBy(sh => sh.DisplayOrder)
                .ThenBy(sh => sh.Name)
                .Select(sh => new SubHeadingResponseDto
                {
                    Id = sh.Id,
                    Name = sh.Name,
                    MainHeadingId = sh.MainHeadingId,
                    MainHeadingName = sh.MainHeading != null ? sh.MainHeading.Name : string.Empty,
                    HeadingId = sh.HeadingId,
                    HeadingName = sh.Heading != null ? sh.Heading.Name : string.Empty,
                    Description = sh.Description,
                    Content = sh.Content,
                    DisplayOrder = sh.DisplayOrder,
                    IsActive = sh.IsActive,
                    IconUrl = sh.IconUrl,
                    ImageUrl = sh.ImageUrl,
                    MetaDescription = sh.MetaDescription,
                    MetaKeywords = sh.MetaKeywords,
                    CreatedAt = sh.CreatedAt,
                    UpdatedAt = sh.UpdatedAt,
                    PackageCount = packages.Count(p => p.SubHeadingId == sh.Id),
                    BestSellerCount = packages.Count(p => p.SubHeadingId == sh.Id &&
                        p.DepartureDates != null &&
                        p.DepartureDates.Any(d => d.IsBestSeller && d.StartDate > DateTime.UtcNow && d.IsAvailable)),
                    TopSellerCount = packages.Count(p => p.SubHeadingId == sh.Id &&
                        p.DepartureDates != null &&
                        p.DepartureDates.Any(d => d.IsTopSeller && d.StartDate > DateTime.UtcNow && d.IsAvailable)),
                    GuaranteedCount = packages.Count(p => p.SubHeadingId == sh.Id &&
                        p.DepartureDates != null &&
                        p.DepartureDates.Any(d => d.IsGuaranteed && d.StartDate > DateTime.UtcNow && d.IsAvailable))
                })
                .ToListAsync();

            return Ok(subHeadings);
        }

        // GET: api/SubHeading/full-hierarchy
        [HttpGet("full-hierarchy")]
        public async Task<ActionResult<IEnumerable<MainHeadingWithHeadingsAndSubHeadingsDto>>> GetFullHierarchy()
        {
            var mainHeadings = await _context.MainHeadings
                .OrderBy(mh => mh.Name)
                .ToListAsync();

            var allPackages = await _context.TrekPackages
                .Include(tp => tp.DepartureDates)
                .Where(tp => tp.IsActive)
                .ToListAsync();

            var result = new List<MainHeadingWithHeadingsAndSubHeadingsDto>();

            foreach (var mainHeading in mainHeadings)
            {
                var headings = await _context.Headings
                    .Where(h => h.MainHeadingId == mainHeading.Id && h.IsActive)
                    .OrderBy(h => h.DisplayOrder)
                    .ThenBy(h => h.Name)
                    .ToListAsync();

                var headingDtos = new List<HeadingWithSubHeadingsDto>();

                foreach (var heading in headings)
                {
                    var subHeadings = await _context.SubHeadings
                        .Where(sh => sh.HeadingId == heading.Id)
                        .OrderBy(sh => sh.DisplayOrder)
                        .ThenBy(sh => sh.Name)
                        .ToListAsync();

                    var subHeadingDtos = subHeadings.Select(sh => new SubHeadingResponseDto
                    {
                        Id = sh.Id,
                        Name = sh.Name,
                        MainHeadingId = sh.MainHeadingId,
                        MainHeadingName = mainHeading.Name,
                        HeadingId = sh.HeadingId,
                        HeadingName = heading.Name,
                        Description = sh.Description,
                        Content = sh.Content,
                        DisplayOrder = sh.DisplayOrder,
                        IsActive = sh.IsActive,
                        IconUrl = sh.IconUrl,
                        ImageUrl = sh.ImageUrl,
                        MetaDescription = sh.MetaDescription,
                        MetaKeywords = sh.MetaKeywords,
                        CreatedAt = sh.CreatedAt,
                        UpdatedAt = sh.UpdatedAt,
                        PackageCount = allPackages.Count(p => p.SubHeadingId == sh.Id),
                        BestSellerCount = allPackages.Count(p => p.SubHeadingId == sh.Id &&
                            p.DepartureDates != null &&
                            p.DepartureDates.Any(d => d.IsBestSeller && d.StartDate > DateTime.UtcNow && d.IsAvailable)),
                        TopSellerCount = allPackages.Count(p => p.SubHeadingId == sh.Id &&
                            p.DepartureDates != null &&
                            p.DepartureDates.Any(d => d.IsTopSeller && d.StartDate > DateTime.UtcNow && d.IsAvailable)),
                        GuaranteedCount = allPackages.Count(p => p.SubHeadingId == sh.Id &&
                            p.DepartureDates != null &&
                            p.DepartureDates.Any(d => d.IsGuaranteed && d.StartDate > DateTime.UtcNow && d.IsAvailable))
                    }).ToList();

                    headingDtos.Add(new HeadingWithSubHeadingsDto
                    {
                        HeadingId = heading.Id,
                        HeadingName = heading.Name,
                        SubHeadings = subHeadingDtos
                    });
                }

                result.Add(new MainHeadingWithHeadingsAndSubHeadingsDto
                {
                    MainHeadingId = mainHeading.Id,
                    MainHeadingName = mainHeading.Name,
                    Headings = headingDtos
                });
            }

            return Ok(result);
        }

        // POST: api/SubHeading
        [HttpPost]
        public async Task<ActionResult<SubHeadingResponseDto>> CreateSubHeading(CreateSubHeadingDto createDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var mainHeading = await _context.MainHeadings.FindAsync(createDto.MainHeadingId);
            if (mainHeading == null)
            {
                return NotFound(new { message = "Main heading not found" });
            }

            var heading = await _context.Headings
                .FirstOrDefaultAsync(h => h.Id == createDto.HeadingId && h.MainHeadingId == createDto.MainHeadingId);

            if (heading == null)
            {
                return NotFound(new { message = "Heading not found or does not belong to the specified main heading" });
            }

            var existingSubHeading = await _context.SubHeadings
                .FirstOrDefaultAsync(sh => sh.HeadingId == createDto.HeadingId &&
                                          sh.Name.ToLower() == createDto.Name.ToLower());

            if (existingSubHeading != null)
            {
                return Conflict(new { message = "A subheading with this name already exists under this heading" });
            }

            var subHeading = new SubHeading
            {
                Name = createDto.Name,
                MainHeadingId = createDto.MainHeadingId,
                HeadingId = createDto.HeadingId,
                Description = createDto.Description,
                Content = createDto.Content,
                DisplayOrder = createDto.DisplayOrder,
                IsActive = true,
                IconUrl = createDto.IconUrl,
                ImageUrl = createDto.ImageUrl,
                MetaDescription = createDto.MetaDescription,
                MetaKeywords = createDto.MetaKeywords,
                CreatedAt = DateTime.UtcNow
            };

            _context.SubHeadings.Add(subHeading);
            await _context.SaveChangesAsync();

            await _context.Entry(subHeading)
                .Reference(sh => sh.MainHeading)
                .LoadAsync();
            await _context.Entry(subHeading)
                .Reference(sh => sh.Heading)
                .LoadAsync();

            return CreatedAtAction(nameof(GetSubHeading), new { id = subHeading.Id }, new SubHeadingResponseDto
            {
                Id = subHeading.Id,
                Name = subHeading.Name,
                MainHeadingId = subHeading.MainHeadingId,
                MainHeadingName = subHeading.MainHeading?.Name ?? string.Empty,
                HeadingId = subHeading.HeadingId,
                HeadingName = subHeading.Heading?.Name ?? string.Empty,
                Description = subHeading.Description,
                Content = subHeading.Content,
                DisplayOrder = subHeading.DisplayOrder,
                IsActive = subHeading.IsActive,
                IconUrl = subHeading.IconUrl,
                ImageUrl = subHeading.ImageUrl,
                MetaDescription = subHeading.MetaDescription,
                MetaKeywords = subHeading.MetaKeywords,
                CreatedAt = subHeading.CreatedAt,
                UpdatedAt = subHeading.UpdatedAt
            });
        }

        // POST: api/SubHeading/bulk
        [HttpPost("bulk")]
        public async Task<ActionResult<IEnumerable<SubHeadingResponseDto>>> CreateBulkSubHeadings(BulkSubHeadingCreateDto bulkDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var mainHeading = await _context.MainHeadings.FindAsync(bulkDto.MainHeadingId);
            if (mainHeading == null)
            {
                return NotFound(new { message = "Main heading not found" });
            }

            var heading = await _context.Headings
                .FirstOrDefaultAsync(h => h.Id == bulkDto.HeadingId && h.MainHeadingId == bulkDto.MainHeadingId);

            if (heading == null)
            {
                return NotFound(new { message = "Heading not found or does not belong to the specified main heading" });
            }

            var createdSubHeadings = new List<SubHeading>();
            var errors = new List<string>();

            foreach (var createDto in bulkDto.SubHeadings)
            {
                var duplicateInBatch = bulkDto.SubHeadings
                    .Count(d => d.Name.ToLower() == createDto.Name.ToLower()) > 1;

                if (duplicateInBatch)
                {
                    errors.Add($"Duplicate subheading name '{createDto.Name}' in the same batch");
                    continue;
                }

                var existingSubHeading = await _context.SubHeadings
                    .FirstOrDefaultAsync(sh => sh.HeadingId == bulkDto.HeadingId &&
                                              sh.Name.ToLower() == createDto.Name.ToLower());

                if (existingSubHeading != null)
                {
                    errors.Add($"Subheading '{createDto.Name}' already exists");
                    continue;
                }

                var subHeading = new SubHeading
                {
                    Name = createDto.Name,
                    MainHeadingId = bulkDto.MainHeadingId,
                    HeadingId = bulkDto.HeadingId,
                    Description = createDto.Description,
                    Content = createDto.Content,
                    DisplayOrder = createDto.DisplayOrder,
                    IsActive = true,
                    IconUrl = createDto.IconUrl,
                    ImageUrl = createDto.ImageUrl,
                    MetaDescription = createDto.MetaDescription,
                    MetaKeywords = createDto.MetaKeywords,
                    CreatedAt = DateTime.UtcNow
                };

                _context.SubHeadings.Add(subHeading);
                createdSubHeadings.Add(subHeading);
            }

            if (createdSubHeadings.Any())
            {
                await _context.SaveChangesAsync();
            }

            var response = createdSubHeadings.Select(sh => new SubHeadingResponseDto
            {
                Id = sh.Id,
                Name = sh.Name,
                MainHeadingId = sh.MainHeadingId,
                MainHeadingName = mainHeading.Name,
                HeadingId = sh.HeadingId,
                HeadingName = heading.Name,
                Description = sh.Description,
                Content = sh.Content,
                DisplayOrder = sh.DisplayOrder,
                IsActive = sh.IsActive,
                IconUrl = sh.IconUrl,
                ImageUrl = sh.ImageUrl,
                MetaDescription = sh.MetaDescription,
                MetaKeywords = sh.MetaKeywords,
                CreatedAt = sh.CreatedAt,
                UpdatedAt = sh.UpdatedAt
            }).ToList();

            if (errors.Any())
            {
                return Ok(new
                {
                    message = "Some subheadings were created with errors",
                    created = response,
                    errors = errors
                });
            }

            return Ok(response);
        }

        // PUT: api/SubHeading/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSubHeading(int id, UpdateSubHeadingDto updateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var subHeading = await _context.SubHeadings.FindAsync(id);
            if (subHeading == null)
            {
                return NotFound(new { message = "SubHeading not found" });
            }

            var existingSubHeading = await _context.SubHeadings
                .FirstOrDefaultAsync(sh => sh.HeadingId == subHeading.HeadingId &&
                                          sh.Name.ToLower() == updateDto.Name.ToLower() &&
                                          sh.Id != id);

            if (existingSubHeading != null)
            {
                return Conflict(new { message = "Another subheading with this name already exists under this heading" });
            }

            subHeading.Name = updateDto.Name;
            subHeading.Description = updateDto.Description;
            subHeading.Content = updateDto.Content;
            subHeading.DisplayOrder = updateDto.DisplayOrder;
            subHeading.IsActive = updateDto.IsActive;
            subHeading.IconUrl = updateDto.IconUrl;
            subHeading.ImageUrl = updateDto.ImageUrl;
            subHeading.MetaDescription = updateDto.MetaDescription;
            subHeading.MetaKeywords = updateDto.MetaKeywords;
            subHeading.UpdatedAt = DateTime.UtcNow;

            _context.Entry(subHeading).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            await _context.Entry(subHeading)
                .Reference(sh => sh.MainHeading)
                .LoadAsync();
            await _context.Entry(subHeading)
                .Reference(sh => sh.Heading)
                .LoadAsync();

            return Ok(new SubHeadingResponseDto
            {
                Id = subHeading.Id,
                Name = subHeading.Name,
                MainHeadingId = subHeading.MainHeadingId,
                MainHeadingName = subHeading.MainHeading?.Name ?? string.Empty,
                HeadingId = subHeading.HeadingId,
                HeadingName = subHeading.Heading?.Name ?? string.Empty,
                Description = subHeading.Description,
                Content = subHeading.Content,
                DisplayOrder = subHeading.DisplayOrder,
                IsActive = subHeading.IsActive,
                IconUrl = subHeading.IconUrl,
                ImageUrl = subHeading.ImageUrl,
                MetaDescription = subHeading.MetaDescription,
                MetaKeywords = subHeading.MetaKeywords,
                CreatedAt = subHeading.CreatedAt,
                UpdatedAt = subHeading.UpdatedAt
            });
        }

        // DELETE: api/SubHeading/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSubHeading(int id)
        {
            var subHeading = await _context.SubHeadings.FindAsync(id);
            if (subHeading == null)
            {
                return NotFound(new { message = "SubHeading not found" });
            }

            // Check if there are any packages using this subheading
            var hasPackages = await _context.TrekPackages
                .AnyAsync(tp => tp.SubHeadingId == id && tp.IsActive);

            if (hasPackages)
            {
                return BadRequest(new { message = "Cannot delete subheading because it has active packages associated with it" });
            }

            _context.SubHeadings.Remove(subHeading);
            await _context.SaveChangesAsync();

            return Ok(new { message = "SubHeading deleted successfully" });
        }

        // PATCH: api/SubHeading/5/toggle-status
        [HttpPatch("{id}/toggle-status")]
        public async Task<IActionResult> ToggleSubHeadingStatus(int id)
        {
            var subHeading = await _context.SubHeadings.FindAsync(id);
            if (subHeading == null)
            {
                return NotFound(new { message = "SubHeading not found" });
            }

            subHeading.IsActive = !subHeading.IsActive;
            subHeading.UpdatedAt = DateTime.UtcNow;

            _context.Entry(subHeading).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = $"SubHeading {(subHeading.IsActive ? "activated" : "deactivated")} successfully",
                isActive = subHeading.IsActive
            });
        }

        // POST: api/SubHeading/reorder
        [HttpPost("reorder")]
        public async Task<IActionResult> ReorderSubHeadings([FromBody] List<SubHeadingOrderDto> subHeadingOrders)
        {
            if (subHeadingOrders == null || subHeadingOrders.Count == 0)
            {
                return BadRequest(new { message = "No subheadings to reorder" });
            }

            foreach (var order in subHeadingOrders)
            {
                var subHeading = await _context.SubHeadings.FindAsync(order.Id);
                if (subHeading != null)
                {
                    subHeading.DisplayOrder = order.DisplayOrder;
                    subHeading.UpdatedAt = DateTime.UtcNow;
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "SubHeadings reordered successfully" });
        }

        // GET: api/SubHeading/search
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<SubHeadingResponseDto>>> SearchSubHeadings(
            [FromQuery] string? name,
            [FromQuery] int? mainHeadingId,
            [FromQuery] int? headingId,
            [FromQuery] bool? isActive,
            [FromQuery] bool? hasBestSeller = null,
            [FromQuery] bool? hasTopSeller = null)
        {
            var query = _context.SubHeadings
                .Include(sh => sh.MainHeading)
                .Include(sh => sh.Heading)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(name))
            {
                query = query.Where(sh => sh.Name.ToLower().Contains(name.ToLower()) ||
                                         (sh.Description != null && sh.Description.ToLower().Contains(name.ToLower())));
            }

            if (mainHeadingId.HasValue)
            {
                query = query.Where(sh => sh.MainHeadingId == mainHeadingId.Value);
            }

            if (headingId.HasValue)
            {
                query = query.Where(sh => sh.HeadingId == headingId.Value);
            }

            if (isActive.HasValue)
            {
                query = query.Where(sh => sh.IsActive == isActive.Value);
            }

            var subHeadingsList = await query.ToListAsync();

            var allPackages = await _context.TrekPackages
                .Include(tp => tp.DepartureDates)
                .Where(tp => tp.IsActive)
                .ToListAsync();

            var result = subHeadingsList.Select(sh => new SubHeadingResponseDto
            {
                Id = sh.Id,
                Name = sh.Name,
                MainHeadingId = sh.MainHeadingId,
                MainHeadingName = sh.MainHeading?.Name ?? string.Empty,
                HeadingId = sh.HeadingId,
                HeadingName = sh.Heading?.Name ?? string.Empty,
                Description = sh.Description,
                Content = sh.Content,
                DisplayOrder = sh.DisplayOrder,
                IsActive = sh.IsActive,
                IconUrl = sh.IconUrl,
                ImageUrl = sh.ImageUrl,
                MetaDescription = sh.MetaDescription,
                MetaKeywords = sh.MetaKeywords,
                CreatedAt = sh.CreatedAt,
                UpdatedAt = sh.UpdatedAt,
                PackageCount = allPackages.Count(p => p.SubHeadingId == sh.Id),
                BestSellerCount = allPackages.Count(p => p.SubHeadingId == sh.Id &&
                    p.DepartureDates != null &&
                    p.DepartureDates.Any(d => d.IsBestSeller && d.StartDate > DateTime.UtcNow && d.IsAvailable)),
                TopSellerCount = allPackages.Count(p => p.SubHeadingId == sh.Id &&
                    p.DepartureDates != null &&
                    p.DepartureDates.Any(d => d.IsTopSeller && d.StartDate > DateTime.UtcNow && d.IsAvailable)),
                GuaranteedCount = allPackages.Count(p => p.SubHeadingId == sh.Id &&
                    p.DepartureDates != null &&
                    p.DepartureDates.Any(d => d.IsGuaranteed && d.StartDate > DateTime.UtcNow && d.IsAvailable))
            }).ToList();

            if (hasBestSeller.HasValue && hasBestSeller.Value)
            {
                result = result.Where(r => r.BestSellerCount > 0).ToList();
            }

            if (hasTopSeller.HasValue && hasTopSeller.Value)
            {
                result = result.Where(r => r.TopSellerCount > 0).ToList();
            }

            return Ok(result);
        }

        // // GET: api/SubHeading/export-by-heading/5
        // [HttpGet("export-by-heading/{headingId}")]
        // public async Task<IActionResult> ExportSubHeadingsByHeading(int headingId)
        // {
        //     var heading = await _context.Headings
        //         .Include(h => h.MainHeading)
        //         .FirstOrDefaultAsync(h => h.Id == headingId);

        //     if (heading == null)
        //     {
        //         return NotFound(new { message = "Heading not found" });
        //     }

        //     var packages = await _context.TrekPackages
        //         .Include(tp => tp.DepartureDates)
        //         .Where(tp => tp.HeadingId == headingId && tp.IsActive)
        //         .ToListAsync();

        //     var subHeadings = await _context.SubHeadings
        //         .Where(sh => sh.HeadingId == headingId && sh.IsActive)
        //         .OrderBy(sh => sh.DisplayOrder)
        //         .ThenBy(sh => sh.Name)
        //         .Select(sh => new
        //         {
        //             sh.Id,
        //             sh.Name,
        //             sh.Description,
        //             sh.DisplayOrder,
        //             sh.CreatedAt,
        //             sh.UpdatedAt,
        //             sh.IconUrl,
        //             sh.ImageUrl,
        //             PackageCount = packages.Count(p => p.SubHeadingId == sh.Id),
        //             BestSellerCount = packages.Count(p => p.SubHeadingId == sh.Id &&
        //                 p.DepartureDates != null &&
        //                 p.DepartureDates.Any(d => d.IsBestSeller && d.StartDate > DateTime.UtcNow && d.IsAvailable)),
        //             TopSellerCount = packages.Count(p => p.SubHeadingId == sh.Id &&
        //                 p.DepartureDates != null &&
        //                 p.DepartureDates.Any(d => d.IsTopSeller && d.StartDate > DateTime.UtcNow && d.IsAvailable)),
        //             TotalBookings = packages.Where(p => p.SubHeadingId == sh.Id)
        //                 .Sum(p => p.DepartureDates?.Sum(d => d.BookingCount) ?? 0)
        //         })
        //         .ToListAsync();

        //     return Ok(new
        //     {
        //         mainHeading = heading.MainHeading?.Name,
        //         heading = heading.Name,
        //         totalCount = subHeadings.Count,
        //         subHeadings = subHeadings
        //     });
        // }

    }
}