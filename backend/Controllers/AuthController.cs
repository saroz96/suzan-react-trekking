
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using backend.Models;
using backend.DTO;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<AppUser> _userManager;
    private readonly SignInManager<AppUser> _signInManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly IJwtService _jwtService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(
        UserManager<AppUser> userManager,
        SignInManager<AppUser> signInManager,
RoleManager<IdentityRole> roleManager,

        IJwtService jwtService,
         ILogger<AuthController> logger)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _roleManager = roleManager;
        _jwtService = jwtService;
        _logger = logger;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
    {
        try
        {
            _logger.LogInformation("=== REGISTRATION ATTEMPT ===");
            _logger.LogInformation($"Email: {registerDto.Email}");

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if user already exists
            var existingUser = await _userManager.FindByEmailAsync(registerDto.Email);
            if (existingUser != null)
            {
                return Conflict(new { message = "An account with this email already exists" });
            }

            // Create new user
            var user = new AppUser
            {
                UserName = registerDto.Email,
                Email = registerDto.Email,
                Name = registerDto.Name,
                UserType = registerDto.UserType ?? "Customer",
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                _logger.LogWarning($"Registration failed: {errors}");
                return BadRequest(new { message = $"Registration failed: {errors}" });
            }

            // Assign role (Customer by default)
            var roleName = registerDto.UserType == "Admin" ? "Admin" : "Customer";

            // Ensure role exists
            if (!await _roleManager.RoleExistsAsync(roleName))
            {
                await _roleManager.CreateAsync(new IdentityRole(roleName));
            }

            await _userManager.AddToRoleAsync(user, roleName);
            _logger.LogInformation($"User assigned to role: {roleName}");

            // Generate JWT token
            var token = _jwtService.GenerateJwtToken(user);

            _logger.LogInformation($"Registration successful for user: {user.Id}");

            var response = new
            {
                message = "Registration successful",
                token = token,
                user = new
                {
                    user.Id,
                    user.Name,
                    user.Email,
                    user.UserName,
                    user.UserType
                }
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during registration");
            return StatusCode(500, new { message = "An error occurred during registration" });
        }
    }


    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        try
        {
            _logger.LogInformation("=== LOGIN ATTEMPT ===");
            _logger.LogInformation($"Username/Email: {loginDto.UserName}");

            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid model state");
                return BadRequest(ModelState);
            }

            // Try to find user by username first, then by email
            var user = await _userManager.FindByNameAsync(loginDto.UserName);

            if (user == null && loginDto.UserName.Contains("@"))
            {
                user = await _userManager.FindByEmailAsync(loginDto.UserName);
            }

            if (user == null)
            {
                _logger.LogWarning($"User not found: {loginDto.UserName}");
                return Unauthorized(new { message = "Invalid username/email or password" });
            }

            _logger.LogInformation($"User found: {user.Id}, Active: {user.IsActive}");

            if (!user.IsActive)
            {
                _logger.LogWarning($"User account is deactivated: {user.Id}");
                return Unauthorized(new { message = "Account is deactivated. Please contact support." });
            }

            var result = await _signInManager.CheckPasswordSignInAsync(
                user, loginDto.Password, false);

            _logger.LogInformation($"Password check result: {result.Succeeded}");

            if (result.Succeeded)
            {
                _logger.LogInformation("Password verified, generating token...");

                // Generate JWT token
                var token = _jwtService.GenerateJwtToken(user);

                _logger.LogInformation($"Token generated successfully");

                var response = new
                {
                    message = "Login successful",
                    token = token,
                    user = new
                    {
                        user.Id,
                        user.Name,
                        user.Email,
                        user.UserName
                    }
                };

                _logger.LogInformation("=== LOGIN SUCCESSFUL ===");
                return Ok(response);
            }

            if (result.IsLockedOut)
            {
                _logger.LogWarning($"Account locked out: {user.Id}");
                return Unauthorized(new { message = "Account is locked out. Please try again later." });
            }

            _logger.LogWarning($"Invalid password for user: {user.Id}");
            return Unauthorized(new { message = "Invalid username/email or password" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login");
            return StatusCode(500, new { message = "An error occurred during login" });
        }
    }

    // [HttpPost("register")]
    // public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
    // {
    //     try
    //     {
    //         _logger.LogInformation("=== REGISTRATION ATTEMPT ===");
    //         _logger.LogInformation($"Email: {registerDto.Email}");

    //         if (!ModelState.IsValid)
    //         {
    //             return BadRequest(ModelState);
    //         }

    //         // Check if user already exists
    //         var existingUser = await _userManager.FindByEmailAsync(registerDto.Email);
    //         if (existingUser != null)
    //         {
    //             return Conflict(new { message = "An account with this email already exists" });
    //         }

    //         // Create new user
    //         var user = new AppUser
    //         {
    //             UserName = registerDto.Email, // Use email as username for simplicity
    //             Email = registerDto.Email,
    //             Name = registerDto.Name,
    //             UserType = registerDto.UserType ?? "Customer",
    //             CreatedAt = DateTime.UtcNow,
    //             IsActive = true
    //         };

    //         var result = await _userManager.CreateAsync(user, registerDto.Password);

    //         if (!result.Succeeded)
    //         {
    //             var errors = string.Join(", ", result.Errors.Select(e => e.Description));
    //             _logger.LogWarning($"Registration failed: {errors}");
    //             return BadRequest(new { message = $"Registration failed: {errors}" });
    //         }

    //         // Assign role
    //         await _userManager.AddToRoleAsync(user, registerDto.UserType == "Admin" ? "Admin" : "Customer");

    //         // Generate JWT token
    //         var token = _jwtService.GenerateJwtToken(user);

    //         _logger.LogInformation($"Registration successful for user: {user.Id}");

    //         var response = new
    //         {
    //             message = "Registration successful",
    //             token = token,
    //             user = new
    //             {
    //                 user.Id,
    //                 user.Name,
    //                 user.Email,
    //                 user.UserName,
    //                 user.UserType
    //             }
    //         };

    //         return Ok(response);
    //     }
    //     catch (Exception ex)
    //     {
    //         _logger.LogError(ex, "Error during registration");
    //         return StatusCode(500, new { message = "An error occurred during registration" });
    //     }
    // }



    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        // JWT is stateless, so logout is handled client-side
        return Ok(new { message = "Logged out successfully" });
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userId = User.FindFirst("userId")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(new { message = "Not authenticated" });
        }

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return NotFound(new { message = "User not found" });
        }

        return Ok(new
        {
            user.Id,
            user.Name,
            user.Email,
            user.UserName,
            user.UserType
        });
    }
}

