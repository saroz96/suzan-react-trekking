using backend.Models;

namespace backend.Services
{
    public interface IUserService
    {
        Task<AppUser?> GetUserByUserNameAsync(string userName);
        Task<AppUser?> GetUserByEmailAsync(string email);
        Task<bool> CreateUserAsync(AppUser user, string password);
    }
}