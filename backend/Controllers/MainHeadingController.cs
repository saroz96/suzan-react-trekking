using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.DTO;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MainHeadingController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MainHeadingController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/MainHeading
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MainHeadingResponseDto>>> GetMainHeadings()
        {
            var headings = await _context.MainHeadings
                .OrderByDescending(h => h.CreatedAt)
                .Select(h => new MainHeadingResponseDto
                {
                    Id = h.Id,
                    Name = h.Name,
                    CreatedAt = h.CreatedAt,
                    UpdatedAt = h.UpdatedAt
                })
                .ToListAsync();

            return Ok(headings);
        }

        // GET: api/MainHeading/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MainHeadingResponseDto>> GetMainHeading(int id)
        {
            var heading = await _context.MainHeadings.FindAsync(id);

            if (heading == null)
            {
                return NotFound(new { message = "Main heading not found" });
            }

            return Ok(new MainHeadingResponseDto
            {
                Id = heading.Id,
                Name = heading.Name,
                CreatedAt = heading.CreatedAt,
                UpdatedAt = heading.UpdatedAt
            });
        }

        // POST: api/MainHeading
        [HttpPost]
        public async Task<ActionResult<MainHeadingResponseDto>> CreateMainHeading(CreateMainHeadingDto createDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if heading with same name already exists
            var existingHeading = await _context.MainHeadings
                .FirstOrDefaultAsync(h => h.Name.ToLower() == createDto.Name.ToLower());

            if (existingHeading != null)
            {
                return Conflict(new { message = "A main heading with this name already exists" });
            }

            var heading = new MainHeading
            {
                Name = createDto.Name,
                CreatedAt = DateTime.UtcNow
            };

            _context.MainHeadings.Add(heading);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMainHeading), new { id = heading.Id }, new MainHeadingResponseDto
            {
                Id = heading.Id,
                Name = heading.Name,
                CreatedAt = heading.CreatedAt,
                UpdatedAt = heading.UpdatedAt
            });
        }

        // PUT: api/MainHeading/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMainHeading(int id, UpdateMainHeadingDto updateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var heading = await _context.MainHeadings.FindAsync(id);
            if (heading == null)
            {
                return NotFound(new { message = "Main heading not found" });
            }

            // Check if another heading with the same name exists (excluding current)
            var existingHeading = await _context.MainHeadings
                .FirstOrDefaultAsync(h => h.Name.ToLower() == updateDto.Name.ToLower() && h.Id != id);

            if (existingHeading != null)
            {
                return Conflict(new { message = "Another main heading with this name already exists" });
            }

            heading.Name = updateDto.Name;
            heading.UpdatedAt = DateTime.UtcNow;

            _context.Entry(heading).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(new MainHeadingResponseDto
            {
                Id = heading.Id,
                Name = heading.Name,
                CreatedAt = heading.CreatedAt,
                UpdatedAt = heading.UpdatedAt
            });
        }

        // DELETE: api/MainHeading/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMainHeading(int id)
        {
            var heading = await _context.MainHeadings.FindAsync(id);
            if (heading == null)
            {
                return NotFound(new { message = "Main heading not found" });
            }

            _context.MainHeadings.Remove(heading);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Main heading deleted successfully" });
        }

        // GET: api/MainHeading/search?name=value
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<MainHeadingResponseDto>>> SearchMainHeadings([FromQuery] string name)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                return await GetMainHeadings();
            }

            var headings = await _context.MainHeadings
                .Where(h => h.Name.ToLower().Contains(name.ToLower()))
                .OrderBy(h => h.Name)
                .Select(h => new MainHeadingResponseDto
                {
                    Id = h.Id,
                    Name = h.Name,
                    CreatedAt = h.CreatedAt,
                    UpdatedAt = h.UpdatedAt
                })
                .ToListAsync();

            return Ok(headings);
        }
    }
}