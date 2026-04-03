// // backend/Controllers/ReviewController.cs
// using Microsoft.AspNetCore.Authorization;
// using Microsoft.AspNetCore.Identity;
// using Microsoft.AspNetCore.Mvc;
// using Microsoft.EntityFrameworkCore;
// using backend.Data;
// using backend.Models;
// using backend.DTO;
// using System.Security.Claims;

// namespace backend.Controllers
// {
//     [Route("api/[controller]")]
//     [ApiController]
//     [Authorize]
//     public class ReviewController : ControllerBase
//     {
//         private readonly ApplicationDbContext _context;
//         private readonly UserManager<AppUser> _userManager;
//         private readonly ILogger<ReviewController> _logger;

//         public ReviewController(
//             ApplicationDbContext context,
//             UserManager<AppUser> userManager,
//             ILogger<ReviewController> logger)
//         {
//             _context = context;
//             _userManager = userManager;
//             _logger = logger;
//         }

//         // GET: api/Review/package/{packageId}
//         [HttpGet("package/{packageId}")]
//         public async Task<ActionResult<IEnumerable<ReviewResponseDto>>> GetReviewsByPackage(int packageId)
//         {
//             try
//             {
//                 var reviews = await _context.TrekPackageReviews
//                     .Include(r => r.User)
//                     .Where(r => r.TrekPackageId == packageId && r.IsActive && r.IsApproved)
//                     .OrderByDescending(r => r.CreatedAt)
//                     .Select(r => new ReviewResponseDto
//                     {
//                         Id = r.Id,
//                         TrekPackageId = r.TrekPackageId,
//                         TrekPackageName = r.TrekPackage != null ? r.TrekPackage.Name : string.Empty,
//                         UserId = r.UserId,
//                         UserName = r.User != null ? r.User.Name ?? r.User.Email ?? "Anonymous" : "Anonymous",
//                         UserEmail = r.User != null ? r.User.Email : null,
//                         UserAvatar = r.UserAvatar,
//                         Rating = r.Rating,
//                         Title = r.Title,
//                         Comment = r.Comment,
//                         IsVerified = r.IsVerified,
//                         Helpful = r.Helpful,
//                         CreatedAt = r.CreatedAt,
//                         UpdatedAt = r.UpdatedAt,
//                         IsApproved = r.IsApproved
//                     })
//                     .ToListAsync();

//                 return Ok(reviews);
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "Error fetching reviews for package {PackageId}", packageId);
//                 return StatusCode(500, new { message = "Error fetching reviews", error = ex.Message });
//             }
//         }

//         // GET: api/Review/package/{packageId}/stats
//         [HttpGet("package/{packageId}/stats")]
//         public async Task<ActionResult<ReviewStatsDto>> GetReviewStats(int packageId)
//         {
//             try
//             {
//                 var reviews = await _context.TrekPackageReviews
//                     .Where(r => r.TrekPackageId == packageId && r.IsActive && r.IsApproved)
//                     .ToListAsync();

//                 var stats = new ReviewStatsDto
//                 {
//                     TotalReviews = reviews.Count,
//                     AverageRating = reviews.Any() ? reviews.Average(r => r.Rating) : 0,
//                     RatingDistribution = new Dictionary<int, int>
//                     {
//                         { 5, reviews.Count(r => r.Rating == 5) },
//                         { 4, reviews.Count(r => r.Rating == 4) },
//                         { 3, reviews.Count(r => r.Rating == 3) },
//                         { 2, reviews.Count(r => r.Rating == 2) },
//                         { 1, reviews.Count(r => r.Rating == 1) }
//                     }
//                 };

//                 return Ok(stats);
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "Error fetching review stats for package {PackageId}", packageId);
//                 return StatusCode(500, new { message = "Error fetching review stats", error = ex.Message });
//             }
//         }

//         // GET: api/Review/user/my-reviews
//         [HttpGet("user/my-reviews")]
//         public async Task<ActionResult<IEnumerable<ReviewResponseDto>>> GetMyReviews()
//         {
//             try
//             {
//                 var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
//                 if (string.IsNullOrEmpty(userId))
//                 {
//                     return Unauthorized(new { message = "User not authenticated" });
//                 }

//                 var reviews = await _context.TrekPackageReviews
//                     .Include(r => r.TrekPackage)
//                     .Include(r => r.User)
//                     .Where(r => r.UserId == userId && r.IsActive)
//                     .OrderByDescending(r => r.CreatedAt)
//                     .Select(r => new ReviewResponseDto
//                     {
//                         Id = r.Id,
//                         TrekPackageId = r.TrekPackageId,
//                         TrekPackageName = r.TrekPackage != null ? r.TrekPackage.Name : string.Empty,
//                         UserId = r.UserId,
//                         UserName = r.User != null ? r.User.Name ?? r.User.Email ?? "Anonymous" : "Anonymous",
//                         UserEmail = r.User != null ? r.User.Email : null,
//                         UserAvatar = r.UserAvatar,
//                         Rating = r.Rating,
//                         Title = r.Title,
//                         Comment = r.Comment,
//                         IsVerified = r.IsVerified,
//                         Helpful = r.Helpful,
//                         CreatedAt = r.CreatedAt,
//                         UpdatedAt = r.UpdatedAt,
//                         IsApproved = r.IsApproved
//                     })
//                     .ToListAsync();

//                 return Ok(reviews);
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "Error fetching user reviews");
//                 return StatusCode(500, new { message = "Error fetching reviews", error = ex.Message });
//             }
//         }

//         // POST: api/Review
//         [HttpPost]
//         public async Task<ActionResult<ReviewResponseDto>> CreateReview([FromBody] CreateReviewDto createDto)
//         {
//             try
//             {
//                 // Log all headers
//                 Console.WriteLine("=== REVIEW POST REQUEST ===");
//                 Console.WriteLine($"Request Method: {Request.Method}");
//                 Console.WriteLine($"Request Path: {Request.Path}");

//                 // Check Authorization header
//                 var authHeader = Request.Headers["Authorization"].FirstOrDefault();
//                 Console.WriteLine($"Authorization Header: {authHeader}");

//                 if (string.IsNullOrEmpty(authHeader))
//                 {
//                     Console.WriteLine("❌ No Authorization header found!");
//                     return Unauthorized(new { message = "No Authorization header" });
//                 }

//                 if (!authHeader.StartsWith("Bearer "))
//                 {
//                     Console.WriteLine("❌ Authorization header doesn't start with Bearer!");
//                     return Unauthorized(new { message = "Invalid Authorization header format" });
//                 }

//                 var token = authHeader.Substring("Bearer ".Length);
//                 Console.WriteLine($"Token extracted: {token.Substring(0, Math.Min(30, token.Length))}...");

//                 // Continue with existing code...
//                 if (!ModelState.IsValid)
//                 {
//                     return BadRequest(ModelState);
//                 }

//                 var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
//                 Console.WriteLine($"UserId from claims: {userId}");

//                 if (!ModelState.IsValid)
//                 {
//                     return BadRequest(ModelState);
//                 }

//                 // var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
//                 if (string.IsNullOrEmpty(userId))
//                 {
//                     return Unauthorized(new { message = "User not authenticated" });
//                 }

//                 var user = await _userManager.FindByIdAsync(userId);
//                 if (user == null)
//                 {
//                     return Unauthorized(new { message = "User not found" });
//                 }

//                 // Check if user has already reviewed this package
//                 var existingReview = await _context.TrekPackageReviews
//                     .FirstOrDefaultAsync(r => r.UserId == userId && r.TrekPackageId == createDto.TrekPackageId);

//                 if (existingReview != null)
//                 {
//                     return Conflict(new { message = "You have already reviewed this package" });
//                 }

//                 var review = new TrekPackageReview
//                 {
//                     TrekPackageId = createDto.TrekPackageId,
//                     UserId = userId,
//                     Rating = createDto.Rating,
//                     Title = createDto.Title,
//                     Comment = createDto.Comment,
//                     UserAvatar = user.Name?.Substring(0, 1).ToUpper(),
//                     IsVerified = false,
//                     CreatedAt = DateTime.UtcNow,
//                     IsActive = true,
//                     IsApproved = true
//                 };

//                 _context.TrekPackageReviews.Add(review);
//                 await _context.SaveChangesAsync();

//                 var response = new ReviewResponseDto
//                 {
//                     Id = review.Id,
//                     TrekPackageId = review.TrekPackageId,
//                     UserId = review.UserId,
//                     UserName = user.Name ?? user.Email ?? "Anonymous",
//                     UserEmail = user.Email,
//                     UserAvatar = review.UserAvatar,
//                     Rating = review.Rating,
//                     Title = review.Title,
//                     Comment = review.Comment,
//                     IsVerified = review.IsVerified,
//                     Helpful = review.Helpful,
//                     CreatedAt = review.CreatedAt,
//                     UpdatedAt = review.UpdatedAt,
//                     IsApproved = review.IsApproved
//                 };

//                 return CreatedAtAction(nameof(GetReviewsByPackage), new { packageId = review.TrekPackageId }, response);
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "Error creating review");
//                 return StatusCode(500, new { message = "Error creating review", error = ex.Message });
//             }
//         }

//         // PUT: api/Review/{id}
//         [HttpPut("{id}")]
//         public async Task<IActionResult> UpdateReview(int id, [FromBody] UpdateReviewDto updateDto)
//         {
//             try
//             {
//                 var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
//                 if (string.IsNullOrEmpty(userId))
//                 {
//                     return Unauthorized(new { message = "User not authenticated" });
//                 }

//                 var review = await _context.TrekPackageReviews.FindAsync(id);
//                 if (review == null)
//                 {
//                     return NotFound(new { message = "Review not found" });
//                 }

//                 // Check if user owns this review
//                 if (review.UserId != userId)
//                 {
//                     var user = await _userManager.FindByIdAsync(userId);
//                     var isAdmin = await _userManager.IsInRoleAsync(user, "Admin");

//                     if (!isAdmin)
//                     {
//                         return Forbid();
//                     }
//                 }

//                 if (updateDto.Rating.HasValue)
//                     review.Rating = updateDto.Rating.Value;

//                 if (!string.IsNullOrEmpty(updateDto.Title))
//                     review.Title = updateDto.Title;

//                 if (!string.IsNullOrEmpty(updateDto.Comment))
//                     review.Comment = updateDto.Comment;

//                 review.UpdatedAt = DateTime.UtcNow;

//                 await _context.SaveChangesAsync();

//                 return Ok(new { message = "Review updated successfully" });
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "Error updating review {ReviewId}", id);
//                 return StatusCode(500, new { message = "Error updating review", error = ex.Message });
//             }
//         }

//         // POST: api/Review/{id}/helpful
//         [HttpPost("{id}/helpful")]
//         public async Task<IActionResult> MarkHelpful(int id)
//         {
//             try
//             {
//                 var review = await _context.TrekPackageReviews.FindAsync(id);
//                 if (review == null)
//                 {
//                     return NotFound(new { message = "Review not found" });
//                 }

//                 review.Helpful++;
//                 await _context.SaveChangesAsync();

//                 return Ok(new { helpful = review.Helpful });
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "Error marking review as helpful {ReviewId}", id);
//                 return StatusCode(500, new { message = "Error updating review", error = ex.Message });
//             }
//         }

//         // DELETE: api/Review/{id}
//         [HttpDelete("{id}")]
//         public async Task<IActionResult> DeleteReview(int id)
//         {
//             try
//             {
//                 var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
//                 if (string.IsNullOrEmpty(userId))
//                 {
//                     return Unauthorized(new { message = "User not authenticated" });
//                 }

//                 var review = await _context.TrekPackageReviews.FindAsync(id);
//                 if (review == null)
//                 {
//                     return NotFound(new { message = "Review not found" });
//                 }

//                 // Check if user owns this review
//                 if (review.UserId != userId)
//                 {
//                     var user = await _userManager.FindByIdAsync(userId);
//                     var isAdmin = await _userManager.IsInRoleAsync(user, "Admin");

//                     if (!isAdmin)
//                     {
//                         return Forbid();
//                     }
//                 }

//                 // Soft delete
//                 review.IsActive = false;
//                 await _context.SaveChangesAsync();

//                 return Ok(new { message = "Review deleted successfully" });
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "Error deleting review {ReviewId}", id);
//                 return StatusCode(500, new { message = "Error deleting review", error = ex.Message });
//             }
//         }
//     }
// }

//----------------------------------------------------------end

// backend/Controllers/ReviewController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.DTO;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    // REMOVE [Authorize] from controller level - make public endpoints
    public class ReviewController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<AppUser> _userManager;
        private readonly ILogger<ReviewController> _logger;

        public ReviewController(
            ApplicationDbContext context,
            UserManager<AppUser> userManager,
            ILogger<ReviewController> logger)
        {
            _context = context;
            _userManager = userManager;
            _logger = logger;
        }

        // GET: api/Review/package/{packageId} - Public
        [HttpGet("package/{packageId}")]
        public async Task<ActionResult<IEnumerable<ReviewResponseDto>>> GetReviewsByPackage(int packageId)
        {
            try
            {
                var reviews = await _context.TrekPackageReviews
                    .Include(r => r.User)
                    .Where(r => r.TrekPackageId == packageId && r.IsActive && r.IsApproved)
                    .OrderByDescending(r => r.CreatedAt)
                    .Select(r => new ReviewResponseDto
                    {
                        Id = r.Id,
                        TrekPackageId = r.TrekPackageId,
                        TrekPackageName = r.TrekPackage != null ? r.TrekPackage.Name : string.Empty,
                        UserId = r.UserId,
                        UserName = r.User != null ? r.User.Name :null,
                        UserEmail = r.User != null ? r.User.Email : null,
                        UserAvatar = r.UserAvatar,
                        Rating = r.Rating,
                        Title = r.Title,
                        Comment = r.Comment,
                        IsVerified = r.IsVerified,
                        Helpful = r.Helpful,
                        CreatedAt = r.CreatedAt,
                        UpdatedAt = r.UpdatedAt,
                        IsApproved = r.IsApproved
                    })
                    .ToListAsync();

                return Ok(reviews);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching reviews for package {PackageId}", packageId);
                return StatusCode(500, new { message = "Error fetching reviews", error = ex.Message });
            }
        }

        // GET: api/Review/package/{packageId}/stats - Public
        [HttpGet("package/{packageId}/stats")]
        public async Task<ActionResult<ReviewStatsDto>> GetReviewStats(int packageId)
        {
            try
            {
                var reviews = await _context.TrekPackageReviews
                    .Where(r => r.TrekPackageId == packageId && r.IsActive && r.IsApproved)
                    .ToListAsync();

                var stats = new ReviewStatsDto
                {
                    TotalReviews = reviews.Count,
                    AverageRating = reviews.Any() ? reviews.Average(r => r.Rating) : 0,
                    RatingDistribution = new Dictionary<int, int>
                    {
                        { 5, reviews.Count(r => r.Rating == 5) },
                        { 4, reviews.Count(r => r.Rating == 4) },
                        { 3, reviews.Count(r => r.Rating == 3) },
                        { 2, reviews.Count(r => r.Rating == 2) },
                        { 1, reviews.Count(r => r.Rating == 1) }
                    }
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching review stats for package {PackageId}", packageId);
                return StatusCode(500, new { message = "Error fetching review stats", error = ex.Message });
            }
        }

        // GET: api/Review/user/my-reviews - Requires authentication
        [Authorize]
        [HttpGet("user/my-reviews")]
        public async Task<ActionResult<IEnumerable<ReviewResponseDto>>> GetMyReviews()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                var reviews = await _context.TrekPackageReviews
                    .Include(r => r.TrekPackage)
                    .Include(r => r.User)
                    .Where(r => r.UserId == userId && r.IsActive)
                    .OrderByDescending(r => r.CreatedAt)
                    .Select(r => new ReviewResponseDto
                    {
                        Id = r.Id,
                        TrekPackageId = r.TrekPackageId,
                        TrekPackageName = r.TrekPackage != null ? r.TrekPackage.Name : string.Empty,
                        UserId = r.UserId,
                        UserName = r.User != null ? r.User.Name : null,
                        UserEmail = r.User != null ? r.User.Email : null,
                        UserAvatar = r.UserAvatar,
                        Rating = r.Rating,
                        Title = r.Title,
                        Comment = r.Comment,
                        IsVerified = r.IsVerified,
                        Helpful = r.Helpful,
                        CreatedAt = r.CreatedAt,
                        UpdatedAt = r.UpdatedAt,
                        IsApproved = r.IsApproved
                    })
                    .ToListAsync();

                return Ok(reviews);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching user reviews");
                return StatusCode(500, new { message = "Error fetching reviews", error = ex.Message });
            }
        }

        // POST: api/Review - PUBLIC - NO LOGIN REQUIRED
        [HttpPost]
        public async Task<ActionResult<ReviewResponseDto>> CreateReview([FromBody] CreateReviewDto createDto)
        {
            try
            {
                Console.WriteLine("=== CREATE REVIEW (PUBLIC) ===");
                Console.WriteLine($"PackageId: {createDto.TrekPackageId}");
                Console.WriteLine($"Rating: {createDto.Rating}");
                Console.WriteLine($"Title: {createDto.Title}");
                Console.WriteLine($"Email: {createDto.Email}");

                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage);
                    Console.WriteLine($"ModelState errors: {string.Join(", ", errors)}");
                    return BadRequest(ModelState);
                }

                // Check if email is provided
                if (string.IsNullOrEmpty(createDto.Email))
                {
                    return BadRequest(new { message = "Email is required for review" });
                }

                // Validate email format
                if (!IsValidEmail(createDto.Email))
                {
                    return BadRequest(new { message = "Invalid email format" });
                }

                // Try to find existing user or create anonymous user
                var user = await _userManager.FindByEmailAsync(createDto.Email);
                string userId;
                string userName;

                if (user == null)
                {
                    // Create anonymous user
                    userName = string.IsNullOrEmpty(createDto.UserName)
                        ? createDto.Email.Split('@')[0]
                        : createDto.UserName;

                    var anonymousUser = new AppUser
                    {
                        UserName = createDto.Email, // Use email as username for uniqueness
                        Email = createDto.Email,
                        Name = userName,
                        UserType = "Anonymous",
                        CreatedAt = DateTime.UtcNow,
                        IsActive = true,
                        EmailConfirmed = true // Auto-confirm for anonymous users
                    };

                    var result = await _userManager.CreateAsync(anonymousUser);
                    if (result.Succeeded)
                    {
                        // Add to Customer role
                        await _userManager.AddToRoleAsync(anonymousUser, "Customer");
                        userId = anonymousUser.Id;
                        user = anonymousUser;
                        Console.WriteLine($"✅ Created anonymous user: {createDto.Email}");
                    }
                    else
                    {
                        Console.WriteLine($"❌ Failed to create user: {string.Join(", ", result.Errors.Select(e => e.Description))}");
                        return StatusCode(500, new { message = "Could not create user for review", errors = result.Errors.Select(e => e.Description) });
                    }
                }
                else
                {
                    userId = user.Id;
                    userName = user.Name ?? user.Email?.Split('@')[0] ?? "Anonymous";
                    Console.WriteLine($"✅ Found existing user: {user.Email}");
                }

                // Check if this user has already reviewed this package
                var existingReview = await _context.TrekPackageReviews
                    .FirstOrDefaultAsync(r => r.UserId == userId && r.TrekPackageId == createDto.TrekPackageId);

                if (existingReview != null)
                {
                    return Conflict(new { message = "You have already reviewed this package" });
                }

                var review = new TrekPackageReview
                {
                    TrekPackageId = createDto.TrekPackageId,
                    UserId = userId,
                    Rating = createDto.Rating,
                    Title = createDto.Title,
                    Comment = createDto.Comment,
                    UserAvatar = userName?.Substring(0, 1).ToUpper(),
                    IsVerified = false,
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true,
                    IsApproved = true // Auto-approve for simplicity
                };

                _context.TrekPackageReviews.Add(review);
                await _context.SaveChangesAsync();

                var response = new ReviewResponseDto
                {
                    Id = review.Id,
                    TrekPackageId = review.TrekPackageId,
                    UserId = review.UserId,
                    UserName = userName,
                    UserEmail = user.Email,
                    UserAvatar = review.UserAvatar,
                    Rating = review.Rating,
                    Title = review.Title,
                    Comment = review.Comment,
                    IsVerified = review.IsVerified,
                    Helpful = review.Helpful,
                    CreatedAt = review.CreatedAt,
                    UpdatedAt = review.UpdatedAt,
                    IsApproved = review.IsApproved
                };

                Console.WriteLine($"✅ Review created successfully with ID: {review.Id}");
                return CreatedAtAction(nameof(GetReviewsByPackage), new { packageId = review.TrekPackageId }, response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating review");
                Console.WriteLine($"❌ Error: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, new { message = "Error creating review", error = ex.Message });
            }
        }

        // Helper method to validate email
        private bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }

        // PUT: api/Review/{id} - Requires authentication
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateReview(int id, [FromBody] UpdateReviewDto updateDto)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                var review = await _context.TrekPackageReviews.FindAsync(id);
                if (review == null)
                {
                    return NotFound(new { message = "Review not found" });
                }

                // Check if user owns this review
                if (review.UserId != userId)
                {
                    var user = await _userManager.FindByIdAsync(userId);
                    var isAdmin = await _userManager.IsInRoleAsync(user, "Admin");

                    if (!isAdmin)
                    {
                        return Forbid();
                    }
                }

                if (updateDto.Rating.HasValue)
                    review.Rating = updateDto.Rating.Value;

                if (!string.IsNullOrEmpty(updateDto.Title))
                    review.Title = updateDto.Title;

                if (!string.IsNullOrEmpty(updateDto.Comment))
                    review.Comment = updateDto.Comment;

                review.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Review updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating review {ReviewId}", id);
                return StatusCode(500, new { message = "Error updating review", error = ex.Message });
            }
        }

        // POST: api/Review/{id}/helpful - Public (no login required)
        [HttpPost("{id}/helpful")]
        public async Task<IActionResult> MarkHelpful(int id)
        {
            try
            {
                var review = await _context.TrekPackageReviews.FindAsync(id);
                if (review == null)
                {
                    return NotFound(new { message = "Review not found" });
                }

                review.Helpful++;
                await _context.SaveChangesAsync();

                return Ok(new { helpful = review.Helpful });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error marking review as helpful {ReviewId}", id);
                return StatusCode(500, new { message = "Error updating review", error = ex.Message });
            }
        }

        // DELETE: api/Review/{id} - Requires authentication
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReview(int id)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                var review = await _context.TrekPackageReviews.FindAsync(id);
                if (review == null)
                {
                    return NotFound(new { message = "Review not found" });
                }

                // Check if user owns this review
                if (review.UserId != userId)
                {
                    var user = await _userManager.FindByIdAsync(userId);
                    var isAdmin = await _userManager.IsInRoleAsync(user, "Admin");

                    if (!isAdmin)
                    {
                        return Forbid();
                    }
                }

                // Soft delete
                review.IsActive = false;
                await _context.SaveChangesAsync();

                return Ok(new { message = "Review deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting review {ReviewId}", id);
                return StatusCode(500, new { message = "Error deleting review", error = ex.Message });
            }
        }
    }
}