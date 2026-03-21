using Microsoft.AspNetCore.Identity;
using backend.Models;

namespace backend.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly ILogger<UserService> _logger;

        public UserService(UserManager<AppUser> userManager, ILogger<UserService> logger)
        {
            _userManager = userManager;
            _logger = logger;
        }

        public async Task<AppUser?> GetUserByUserNameAsync(string userName)
        {
            try
            {
                _logger.LogInformation("Getting user by username: {UserName}", userName);
                return await _userManager.FindByNameAsync(userName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user by username: {UserName}", userName);
                throw;
            }
        }

        public async Task<AppUser?> GetUserByEmailAsync(string email)
        {
            try
            {
                _logger.LogInformation("Getting user by email: {Email}", email);
                return await _userManager.FindByEmailAsync(email);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user by email: {Email}", email);
                throw;
            }
        }

        public async Task<bool> CreateUserAsync(AppUser user, string password)
        {
            try
            {
                _logger.LogInformation("=== CREATE USER STARTED ===");
                _logger.LogInformation($"Username: {user.UserName}");
                _logger.LogInformation($"Name: {user.Name}");

                // Set timestamps
                user.CreatedAt = DateTime.UtcNow;
                user.IsActive = true;

                _logger.LogInformation("Creating user in database...");
                var result = await _userManager.CreateAsync(user, password);

                if (result.Succeeded)
                {
                    _logger.LogInformation($"✅ User created successfully with ID: {user.Id}");
                    return true;
                }
                else
                {
                    _logger.LogError("❌ Failed to create user:");
                    foreach (var error in result.Errors)
                    {
                        _logger.LogError($"   - {error.Description}");
                    }
                    return false;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating user: {UserName}", user.UserName);
                throw;
            }
        }
    }
}