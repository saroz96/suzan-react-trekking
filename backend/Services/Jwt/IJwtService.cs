using backend.Models;

namespace backend.Services
{
    public interface IJwtService
    {
        string GenerateJwtToken(AppUser user);
    }
}