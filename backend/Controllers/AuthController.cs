using Microsoft.AspNetCore.Identity;
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
    private readonly IJwtService _jwtService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(
        UserManager<AppUser> userManager,
        SignInManager<AppUser> signInManager,
        IJwtService jwtService,
         ILogger<AuthController> logger)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _jwtService = jwtService;
        _logger = logger;

    }

    // [HttpPost("login")]
    // public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    // {
    //     if (!ModelState.IsValid)
    //         return BadRequest(ModelState);

    //     var user = await _userManager.FindByNameAsync(loginDto.UserName);

    //     if (user == null)
    //     {
    //         return Unauthorized(new { message = "Invalid username or password" });
    //     }

    //     if (!user.IsActive)
    //     {
    //         return Unauthorized(new { message = "Account is deactivated" });
    //     }

    //     var result = await _signInManager.CheckPasswordSignInAsync(
    //         user, loginDto.Password, false);

    //     if (result.Succeeded)
    //     {
    //         // Generate JWT token
    //         var token = _jwtService.GenerateJwtToken(user);

    //         return Ok(new
    //         {
    //             message = "Login successful",
    //             token = token,
    //             user = new
    //             {
    //                 user.Id,
    //                 user.Name,
    //             }
    //         });
    //     }

    //     if (result.IsLockedOut)
    //     {
    //         return Unauthorized(new { message = "Account is locked out" });
    //     }

    //     return Unauthorized(new { message = "Invalid username or password" });
    // }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        try
        {
            _logger.LogInformation("=== LOGIN ATTEMPT ===");
            _logger.LogInformation($"Username: {loginDto.UserName}");

            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid model state");
                return BadRequest(ModelState);
            }

            var user = await _userManager.FindByNameAsync(loginDto.UserName);

            if (user == null)
            {
                _logger.LogWarning($"User not found: {loginDto.UserName}");
                return Unauthorized(new { message = "Invalid username or password" });
            }

            _logger.LogInformation($"User found: {user.Id}, Active: {user.IsActive}");

            if (!user.IsActive)
            {
                _logger.LogWarning($"User account is deactivated: {user.Id}");
                return Unauthorized(new { message = "Account is deactivated" });
            }

            var result = await _signInManager.CheckPasswordSignInAsync(
                user, loginDto.Password, false);

            _logger.LogInformation($"Password check result: {result.Succeeded}");

            if (result.Succeeded)
            {
                _logger.LogInformation("Password verified, generating token...");

                // Generate JWT token
                var token = _jwtService.GenerateJwtToken(user);

                _logger.LogInformation($"Token generated: {token?.Substring(0, Math.Min(20, token?.Length ?? 0))}...");

                var response = new
                {
                    message = "Login successful",
                    token = token,
                    user = new
                    {
                        user.Id,
                        user.Name,
                    }
                };

                _logger.LogInformation("=== LOGIN SUCCESSFUL ===");
                return Ok(response);
            }

            if (result.IsLockedOut)
            {
                _logger.LogWarning($"Account locked out: {user.Id}");
                return Unauthorized(new { message = "Account is locked out" });
            }

            _logger.LogWarning($"Invalid password for user: {user.Id}");
            return Unauthorized(new { message = "Invalid username or password" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login");
            return StatusCode(500, new { message = "An error occurred during login" });
        }
    }

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
        var userId = User.FindFirst("userId")?.Value;

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
            user.Email
        });
    }
}