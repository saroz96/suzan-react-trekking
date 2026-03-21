using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.DTO;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HeadingController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public HeadingController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Heading
        [HttpGet]
        public async Task<ActionResult<IEnumerable<HeadingResponseDto>>> GetHeadings()
        {
            var headings = await _context.Headings
                .Include(h => h.MainHeading)
                .OrderBy(h => h.MainHeadingId)
                .ThenBy(h => h.DisplayOrder)
                .ThenBy(h => h.Name)
                .Select(h => new HeadingResponseDto
                {
                    Id = h.Id,
                    Name = h.Name,
                    MainHeadingId = h.MainHeadingId,
                    MainHeadingName = h.MainHeading != null ? h.MainHeading.Name : string.Empty,
                    Description = h.Description,
                    DisplayOrder = h.DisplayOrder,
                    IsActive = h.IsActive,
                    CreatedAt = h.CreatedAt,
                    UpdatedAt = h.UpdatedAt
                })
                .ToListAsync();

            return Ok(headings);
        }

        // GET: api/Heading/5
        [HttpGet("{id}")]
        public async Task<ActionResult<HeadingResponseDto>> GetHeading(int id)
        {
            var heading = await _context.Headings
                .Include(h => h.MainHeading)
                .FirstOrDefaultAsync(h => h.Id == id);

            if (heading == null)
            {
                return NotFound(new { message = "Heading not found" });
            }

            return Ok(new HeadingResponseDto
            {
                Id = heading.Id,
                Name = heading.Name,
                MainHeadingId = heading.MainHeadingId,
                MainHeadingName = heading.MainHeading?.Name ?? string.Empty,
                Description = heading.Description,
                DisplayOrder = heading.DisplayOrder,
                IsActive = heading.IsActive,
                CreatedAt = heading.CreatedAt,
                UpdatedAt = heading.UpdatedAt
            });
        }

        // GET: api/Heading/by-mainheading/5
        [HttpGet("by-mainheading/{mainHeadingId}")]
        public async Task<ActionResult<IEnumerable<HeadingResponseDto>>> GetHeadingsByMainHeading(int mainHeadingId)
        {
            var mainHeadingExists = await _context.MainHeadings.AnyAsync(mh => mh.Id == mainHeadingId);
            if (!mainHeadingExists)
            {
                return NotFound(new { message = "Main heading not found" });
            }

            var headings = await _context.Headings
                .Where(h => h.MainHeadingId == mainHeadingId && h.IsActive)
                .Include(h => h.MainHeading)
                .OrderBy(h => h.DisplayOrder)
                .ThenBy(h => h.Name)
                .Select(h => new HeadingResponseDto
                {
                    Id = h.Id,
                    Name = h.Name,
                    MainHeadingId = h.MainHeadingId,
                    MainHeadingName = h.MainHeading != null ? h.MainHeading.Name : string.Empty,
                    Description = h.Description,
                    DisplayOrder = h.DisplayOrder,
                    IsActive = h.IsActive,
                    CreatedAt = h.CreatedAt,
                    UpdatedAt = h.UpdatedAt
                })
                .ToListAsync();

            return Ok(headings);
        }

        // GET: api/Heading/grouped-by-mainheading
        [HttpGet("grouped-by-mainheading")]
        public async Task<ActionResult<IEnumerable<MainHeadingWithHeadingsDto>>> GetHeadingsGroupedByMainHeading()
        {
            var mainHeadings = await _context.MainHeadings
                .OrderBy(mh => mh.Name)
                .ToListAsync();

            var result = new List<MainHeadingWithHeadingsDto>();

            foreach (var mainHeading in mainHeadings)
            {
                var headings = await _context.Headings
                    .Where(h => h.MainHeadingId == mainHeading.Id && h.IsActive)
                    .OrderBy(h => h.DisplayOrder)
                    .ThenBy(h => h.Name)
                    .Select(h => new HeadingResponseDto
                    {
                        Id = h.Id,
                        Name = h.Name,
                        MainHeadingId = h.MainHeadingId,
                        MainHeadingName = mainHeading.Name,
                        Description = h.Description,
                        DisplayOrder = h.DisplayOrder,
                        IsActive = h.IsActive,
                        CreatedAt = h.CreatedAt,
                        UpdatedAt = h.UpdatedAt
                    })
                    .ToListAsync();

                result.Add(new MainHeadingWithHeadingsDto
                {
                    MainHeadingId = mainHeading.Id,
                    MainHeadingName = mainHeading.Name,
                    Headings = headings
                });
            }

            return Ok(result);
        }

        // POST: api/Heading
        [HttpPost]
        public async Task<ActionResult<HeadingResponseDto>> CreateHeading(CreateHeadingDto createDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if main heading exists
            var mainHeading = await _context.MainHeadings.FindAsync(createDto.MainHeadingId);
            if (mainHeading == null)
            {
                return NotFound(new { message = "Main heading not found" });
            }

            // Check if heading with same name exists under the same main heading
            var existingHeading = await _context.Headings
                .FirstOrDefaultAsync(h => h.MainHeadingId == createDto.MainHeadingId &&
                                         h.Name.ToLower() == createDto.Name.ToLower());

            if (existingHeading != null)
            {
                return Conflict(new { message = "A heading with this name already exists under this main heading" });
            }

            var heading = new Heading
            {
                Name = createDto.Name,
                MainHeadingId = createDto.MainHeadingId,
                Description = createDto.Description,
                DisplayOrder = createDto.DisplayOrder,
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            _context.Headings.Add(heading);
            await _context.SaveChangesAsync();

            // Load the main heading for response
            await _context.Entry(heading)
                .Reference(h => h.MainHeading)
                .LoadAsync();

            return CreatedAtAction(nameof(GetHeading), new { id = heading.Id }, new HeadingResponseDto
            {
                Id = heading.Id,
                Name = heading.Name,
                MainHeadingId = heading.MainHeadingId,
                MainHeadingName = heading.MainHeading?.Name ?? string.Empty,
                Description = heading.Description,
                DisplayOrder = heading.DisplayOrder,
                IsActive = heading.IsActive,
                CreatedAt = heading.CreatedAt,
                UpdatedAt = heading.UpdatedAt
            });
        }

        // PUT: api/Heading/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateHeading(int id, UpdateHeadingDto updateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var heading = await _context.Headings.FindAsync(id);
            if (heading == null)
            {
                return NotFound(new { message = "Heading not found" });
            }

            // Check if another heading with the same name exists under the same main heading (excluding current)
            var existingHeading = await _context.Headings
                .FirstOrDefaultAsync(h => h.MainHeadingId == heading.MainHeadingId &&
                                         h.Name.ToLower() == updateDto.Name.ToLower() &&
                                         h.Id != id);

            if (existingHeading != null)
            {
                return Conflict(new { message = "Another heading with this name already exists under this main heading" });
            }

            heading.Name = updateDto.Name;
            heading.Description = updateDto.Description;
            heading.DisplayOrder = updateDto.DisplayOrder;
            heading.IsActive = updateDto.IsActive;
            heading.UpdatedAt = DateTime.UtcNow;

            _context.Entry(heading).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            // Load the main heading for response
            await _context.Entry(heading)
                .Reference(h => h.MainHeading)
                .LoadAsync();

            return Ok(new HeadingResponseDto
            {
                Id = heading.Id,
                Name = heading.Name,
                MainHeadingId = heading.MainHeadingId,
                MainHeadingName = heading.MainHeading?.Name ?? string.Empty,
                Description = heading.Description,
                DisplayOrder = heading.DisplayOrder,
                IsActive = heading.IsActive,
                CreatedAt = heading.CreatedAt,
                UpdatedAt = heading.UpdatedAt
            });
        }

        // DELETE: api/Heading/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHeading(int id)
        {
            var heading = await _context.Headings.FindAsync(id);
            if (heading == null)
            {
                return NotFound(new { message = "Heading not found" });
            }

            // Option 1: Hard delete
            _context.Headings.Remove(heading);

            // Option 2: Soft delete (uncomment below and comment hard delete)
            // heading.IsActive = false;
            // heading.UpdatedAt = DateTime.UtcNow;
            // _context.Entry(heading).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Heading deleted successfully" });
        }

        // PATCH: api/Heading/5/toggle-status
        [HttpPatch("{id}/toggle-status")]
        public async Task<IActionResult> ToggleHeadingStatus(int id)
        {
            var heading = await _context.Headings.FindAsync(id);
            if (heading == null)
            {
                return NotFound(new { message = "Heading not found" });
            }

            heading.IsActive = !heading.IsActive;
            heading.UpdatedAt = DateTime.UtcNow;

            _context.Entry(heading).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = $"Heading {(heading.IsActive ? "activated" : "deactivated")} successfully",
                isActive = heading.IsActive
            });
        }

        // POST: api/Heading/reorder
        [HttpPost("reorder")]
        public async Task<IActionResult> ReorderHeadings([FromBody] List<HeadingOrderDto> headingOrders)
        {
            if (headingOrders == null || headingOrders.Count == 0)
            {
                return BadRequest(new { message = "No headings to reorder" });
            }

            foreach (var order in headingOrders)
            {
                var heading = await _context.Headings.FindAsync(order.Id);
                if (heading != null)
                {
                    heading.DisplayOrder = order.DisplayOrder;
                    heading.UpdatedAt = DateTime.UtcNow;
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Headings reordered successfully" });
        }

        // GET: api/Heading/search?name=value&mainHeadingId=5
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<HeadingResponseDto>>> SearchHeadings(
            [FromQuery] string? name,
            [FromQuery] int? mainHeadingId)
        {
            var query = _context.Headings
                .Include(h => h.MainHeading)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(name))
            {
                query = query.Where(h => h.Name.ToLower().Contains(name.ToLower()));
            }

            if (mainHeadingId.HasValue)
            {
                query = query.Where(h => h.MainHeadingId == mainHeadingId.Value);
            }

            var headings = await query
                .OrderBy(h => h.MainHeadingId)
                .ThenBy(h => h.DisplayOrder)
                .ThenBy(h => h.Name)
                .Select(h => new HeadingResponseDto
                {
                    Id = h.Id,
                    Name = h.Name,
                    MainHeadingId = h.MainHeadingId,
                    MainHeadingName = h.MainHeading != null ? h.MainHeading.Name : string.Empty,
                    Description = h.Description,
                    DisplayOrder = h.DisplayOrder,
                    IsActive = h.IsActive,
                    CreatedAt = h.CreatedAt,
                    UpdatedAt = h.UpdatedAt
                })
                .ToListAsync();

            return Ok(headings);
        }
    }

    // DTO for reordering headings
    public class HeadingOrderDto
    {
        public int Id { get; set; }
        public int DisplayOrder { get; set; }
    }
}