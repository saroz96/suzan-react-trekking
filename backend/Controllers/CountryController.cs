using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.DTO;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CountryController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public CountryController(ApplicationDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        // GET: api/Country
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CountryResponseDto>>> GetCountries()
        {
            var countries = await _context.Countries
                .Include(c => c.TrekPackages.Where(tp => tp.IsActive))
                .OrderBy(c => c.DisplayOrder)
                .ThenBy(c => c.Name)
                .Select(c => new CountryResponseDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Code = c.Code,
                    Description = c.Description,
                    FlagImageUrl = c.FlagImageUrl,
                    CoverImageUrl = c.CoverImageUrl,
                    IsActive = c.IsActive,
                    DisplayOrder = c.DisplayOrder,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt,
                    TrekPackageCount = c.TrekPackages.Count
                })
                .ToListAsync();

            return Ok(countries);
        }

        // GET: api/Country/active
        [HttpGet("active")]
        public async Task<ActionResult<IEnumerable<CountryResponseDto>>> GetActiveCountries()
        {
            var countries = await _context.Countries
                .Include(c => c.TrekPackages.Where(tp => tp.IsActive))
                .Where(c => c.IsActive)
                .OrderBy(c => c.DisplayOrder)
                .ThenBy(c => c.Name)
                .Select(c => new CountryResponseDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Code = c.Code,
                    Description = c.Description,
                    FlagImageUrl = c.FlagImageUrl,
                    CoverImageUrl = c.CoverImageUrl,
                    IsActive = c.IsActive,
                    DisplayOrder = c.DisplayOrder,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt,
                    TrekPackageCount = c.TrekPackages.Count
                })
                .ToListAsync();

            return Ok(countries);
        }

        // GET: api/Country/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CountryDetailResponseDto>> GetCountry(int id)
        {
            var country = await _context.Countries
                .Include(c => c.TrekPackages.Where(tp => tp.IsActive))
                    .ThenInclude(tp => tp.SliderImages.OrderBy(s => s.DisplayOrder))
                .FirstOrDefaultAsync(c => c.Id == id);

            if (country == null)
            {
                return NotFound(new { message = "Country not found" });
            }

            var response = new CountryDetailResponseDto
            {
                Id = country.Id,
                Name = country.Name,
                Code = country.Code,
                Description = country.Description,
                FlagImageUrl = country.FlagImageUrl,
                CoverImageUrl = country.CoverImageUrl,
                IsActive = country.IsActive,
                DisplayOrder = country.DisplayOrder,
                CreatedAt = country.CreatedAt,
                UpdatedAt = country.UpdatedAt,
                TrekPackageCount = country.TrekPackages.Count,
                TrekPackages = country.TrekPackages.Select(tp => new CountryTrekPackageDto
                {
                    Id = tp.Id,
                    Name = tp.Name,
                    ShortDescription = tp.ShortDescription,
                    Price = tp.Price,
                    DiscountedPrice = tp.DiscountedPrice,
                    DurationDays = tp.DurationDays,
                    TripGrade = tp.TripGrade,
                    CoverImageUrl = tp.SliderImages.FirstOrDefault()?.ImageUrl
                }).ToList()
            };

            return Ok(response);
        }

        // GET: api/Country/by-code/NP
        [HttpGet("by-code/{code}")]
        public async Task<ActionResult<CountryResponseDto>> GetCountryByCode(string code)
        {
            var country = await _context.Countries
                .Include(c => c.TrekPackages.Where(tp => tp.IsActive))
                .FirstOrDefaultAsync(c => c.Code.ToUpper() == code.ToUpper());

            if (country == null)
            {
                return NotFound(new { message = "Country not found" });
            }

            var response = new CountryResponseDto
            {
                Id = country.Id,
                Name = country.Name,
                Code = country.Code,
                Description = country.Description,
                FlagImageUrl = country.FlagImageUrl,
                CoverImageUrl = country.CoverImageUrl,
                IsActive = country.IsActive,
                DisplayOrder = country.DisplayOrder,
                CreatedAt = country.CreatedAt,
                UpdatedAt = country.UpdatedAt,
                TrekPackageCount = country.TrekPackages.Count
            };

            return Ok(response);
        }

        // POST: api/Country
        [HttpPost]
        public async Task<ActionResult<CountryResponseDto>> CreateCountry([FromForm] CreateCountryDto createDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if country with same name exists
            var existingCountry = await _context.Countries
                .FirstOrDefaultAsync(c => c.Name.ToLower() == createDto.Name.ToLower());

            if (existingCountry != null)
            {
                return Conflict(new { message = "A country with this name already exists" });
            }

            // Check if country with same code exists (if code provided)
            if (!string.IsNullOrWhiteSpace(createDto.Code))
            {
                var existingCode = await _context.Countries
                    .FirstOrDefaultAsync(c => c.Code != null && c.Code.ToUpper() == createDto.Code.ToUpper());

                if (existingCode != null)
                {
                    return Conflict(new { message = "A country with this code already exists" });
                }
            }

            var country = new Country
            {
                Name = createDto.Name,
                Code = createDto.Code?.ToUpper(),
                Description = createDto.Description,
                DisplayOrder = createDto.DisplayOrder,
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            _context.Countries.Add(country);
            await _context.SaveChangesAsync();

            var response = new CountryResponseDto
            {
                Id = country.Id,
                Name = country.Name,
                Code = country.Code,
                Description = country.Description,
                FlagImageUrl = country.FlagImageUrl,
                CoverImageUrl = country.CoverImageUrl,
                IsActive = country.IsActive,
                DisplayOrder = country.DisplayOrder,
                CreatedAt = country.CreatedAt,
                UpdatedAt = country.UpdatedAt,
                TrekPackageCount = 0
            };

            return CreatedAtAction(nameof(GetCountry), new { id = country.Id }, response);
        }

        // POST: api/Country/5/upload-flag
        [HttpPost("{id}/upload-flag")]
        public async Task<IActionResult> UploadFlagImage(int id, IFormFile flagImage)
        {
            var country = await _context.Countries.FindAsync(id);
            if (country == null)
            {
                return NotFound(new { message = "Country not found" });
            }

            if (flagImage == null || flagImage.Length == 0)
            {
                return BadRequest(new { message = "No image file provided" });
            }

            // Delete old flag image if exists
            if (!string.IsNullOrEmpty(country.FlagImageUrl))
            {
                DeleteImage(country.FlagImageUrl);
            }

            // Save new flag image
            var imageUrl = await SaveImage(flagImage, "flags");
            country.FlagImageUrl = imageUrl;
            country.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { flagImageUrl = imageUrl });
        }

        // POST: api/Country/5/upload-cover
        [HttpPost("{id}/upload-cover")]
        public async Task<IActionResult> UploadCoverImage(int id, IFormFile coverImage)
        {
            var country = await _context.Countries.FindAsync(id);
            if (country == null)
            {
                return NotFound(new { message = "Country not found" });
            }

            if (coverImage == null || coverImage.Length == 0)
            {
                return BadRequest(new { message = "No image file provided" });
            }

            // Delete old cover image if exists
            if (!string.IsNullOrEmpty(country.CoverImageUrl))
            {
                DeleteImage(country.CoverImageUrl);
            }

            // Save new cover image
            var imageUrl = await SaveImage(coverImage, "covers");
            country.CoverImageUrl = imageUrl;
            country.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { coverImageUrl = imageUrl });
        }

        // PUT: api/Country/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCountry(int id, UpdateCountryDto updateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var country = await _context.Countries.FindAsync(id);
            if (country == null)
            {
                return NotFound(new { message = "Country not found" });
            }

            // Check if another country with the same name exists (excluding current)
            var existingCountry = await _context.Countries
                .FirstOrDefaultAsync(c => c.Name.ToLower() == updateDto.Name.ToLower() && c.Id != id);

            if (existingCountry != null)
            {
                return Conflict(new { message = "Another country with this name already exists" });
            }

            // Check if another country with the same code exists (excluding current)
            if (!string.IsNullOrWhiteSpace(updateDto.Code))
            {
                var existingCode = await _context.Countries
                    .FirstOrDefaultAsync(c => c.Code != null && c.Code.ToUpper() == updateDto.Code.ToUpper() && c.Id != id);

                if (existingCode != null)
                {
                    return Conflict(new { message = "Another country with this code already exists" });
                }
            }

            country.Name = updateDto.Name;
            country.Code = updateDto.Code?.ToUpper();
            country.Description = updateDto.Description;
            country.DisplayOrder = updateDto.DisplayOrder;
            country.IsActive = updateDto.IsActive;
            country.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Country updated successfully" });
        }

        // DELETE: api/Country/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCountry(int id)
        {
            var country = await _context.Countries
                .Include(c => c.TrekPackages)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (country == null)
            {
                return NotFound(new { message = "Country not found" });
            }

            // Check if country has associated trek packages
            if (country.TrekPackages.Any())
            {
                return BadRequest(new
                {
                    message = "Cannot delete country because it has associated trek packages. Please delete or reassign the packages first.",
                    packageCount = country.TrekPackages.Count
                });
            }

            // Option 1: Soft delete
            country.IsActive = false;
            country.UpdatedAt = DateTime.UtcNow;

            // Option 2: Hard delete (uncomment below and comment soft delete)
            // // Delete associated images
            // if (!string.IsNullOrEmpty(country.FlagImageUrl))
            // {
            //     DeleteImage(country.FlagImageUrl);
            // }
            // if (!string.IsNullOrEmpty(country.CoverImageUrl))
            // {
            //     DeleteImage(country.CoverImageUrl);
            // }
            // _context.Countries.Remove(country);

            await _context.SaveChangesAsync();

            return Ok(new { message = "Country deleted successfully" });
        }

        // PATCH: api/Country/5/toggle-status
        [HttpPatch("{id}/toggle-status")]
        public async Task<IActionResult> ToggleCountryStatus(int id)
        {
            var country = await _context.Countries.FindAsync(id);
            if (country == null)
            {
                return NotFound(new { message = "Country not found" });
            }

            country.IsActive = !country.IsActive;
            country.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = $"Country {(country.IsActive ? "activated" : "deactivated")} successfully",
                isActive = country.IsActive
            });
        }

        // PATCH: api/Country/5/update-order
        [HttpPatch("{id}/update-order")]
        public async Task<IActionResult> UpdateDisplayOrder(int id, [FromBody] int displayOrder)
        {
            var country = await _context.Countries.FindAsync(id);
            if (country == null)
            {
                return NotFound(new { message = "Country not found" });
            }

            country.DisplayOrder = displayOrder;
            country.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Display order updated successfully" });
        }

        // POST: api/Country/reorder
        [HttpPost("reorder")]
        public async Task<IActionResult> ReorderCountries([FromBody] List<CountryOrderDto> countryOrders)
        {
            if (countryOrders == null || countryOrders.Count == 0)
            {
                return BadRequest(new { message = "No countries to reorder" });
            }

            foreach (var order in countryOrders)
            {
                var country = await _context.Countries.FindAsync(order.Id);
                if (country != null)
                {
                    country.DisplayOrder = order.DisplayOrder;
                    country.UpdatedAt = DateTime.UtcNow;
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Countries reordered successfully" });
        }

        // GET: api/Country/search
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<CountryResponseDto>>> SearchCountries(
            [FromQuery] string? name,
            [FromQuery] bool? isActive)
        {
            var query = _context.Countries
                .Include(c => c.TrekPackages.Where(tp => tp.IsActive))
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(name))
            {
                query = query.Where(c => c.Name.ToLower().Contains(name.ToLower()) ||
                                        (c.Description != null && c.Description.ToLower().Contains(name.ToLower())));
            }

            if (isActive.HasValue)
            {
                query = query.Where(c => c.IsActive == isActive.Value);
            }

            var countries = await query
                .OrderBy(c => c.DisplayOrder)
                .ThenBy(c => c.Name)
                .Select(c => new CountryResponseDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Code = c.Code,
                    Description = c.Description,
                    FlagImageUrl = c.FlagImageUrl,
                    CoverImageUrl = c.CoverImageUrl,
                    IsActive = c.IsActive,
                    DisplayOrder = c.DisplayOrder,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt,
                    TrekPackageCount = c.TrekPackages.Count
                })
                .ToListAsync();

            return Ok(countries);
        }

        // GET: api/Country/5/statistics
        [HttpGet("{id}/statistics")]
        public async Task<IActionResult> GetCountryStatistics(int id)
        {
            var country = await _context.Countries
                .Include(c => c.TrekPackages)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (country == null)
            {
                return NotFound(new { message = "Country not found" });
            }

            var activePackages = country.TrekPackages.Count(tp => tp.IsActive);
            var totalPackages = country.TrekPackages.Count;

            var statistics = new
            {
                totalPackages,
                activePackages,
                inactivePackages = totalPackages - activePackages,
                averageDuration = country.TrekPackages.Where(tp => tp.IsActive && tp.DurationDays.HasValue)
                                                     .Average(tp => tp.DurationDays),
                minPrice = country.TrekPackages.Where(tp => tp.IsActive && tp.Price.HasValue)
                                              .Min(tp => tp.DiscountedPrice ?? tp.Price),
                maxPrice = country.TrekPackages.Where(tp => tp.IsActive && tp.Price.HasValue)
                                              .Max(tp => tp.Price)
            };

            return Ok(statistics);
        }

        // Helper method to save images
        private async Task<string> SaveImage(IFormFile image, string folderName)
        {
            if (image == null || image.Length == 0)
                return string.Empty;

            // Create unique filename
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);

            // Define folder path
            var folderPath = Path.Combine(_environment.WebRootPath ?? "wwwroot", "uploads", "countries", folderName);

            // Create directory if it doesn't exist
            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }

            // Full file path
            var filePath = Path.Combine(folderPath, fileName);

            // Save file
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }

            // Return relative URL
            return $"/uploads/countries/{folderName}/{fileName}";
        }

        // Helper method to delete image
        private void DeleteImage(string imageUrl)
        {
            if (string.IsNullOrEmpty(imageUrl))
                return;

            var fileName = Path.GetFileName(imageUrl);
            var folderName = Path.GetFileName(Path.GetDirectoryName(imageUrl));

            var filePath = Path.Combine(_environment.WebRootPath ?? "wwwroot", "uploads", "countries", folderName ?? "", fileName ?? "");

            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }
        }
    }

    // DTO for reordering
    public class CountryOrderDto
    {
        public int Id { get; set; }
        public int DisplayOrder { get; set; }
    }
}