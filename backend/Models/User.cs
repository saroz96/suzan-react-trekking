using Microsoft.AspNetCore.Identity;

namespace backend.Models;

public class AppUser : IdentityUser
{
    public string? Name { get; set; }

    public DateTime? CreatedAt { get; set; }
    public bool IsActive { get; set; } = true;
}