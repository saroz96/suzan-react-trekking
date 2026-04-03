using Microsoft.AspNetCore.Identity;

namespace backend.Models;

public class AppUser : IdentityUser
{
    public string? Name { get; set; }

    public DateTime? CreatedAt { get; set; }
    public bool IsActive { get; set; } = true;
    public string? UserType { get; set; } // "Admin", "Customer"

    public virtual ICollection<TrekPackageReview> Reviews { get; set; } = new List<TrekPackageReview>();
}