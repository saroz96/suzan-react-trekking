// using System.ComponentModel.DataAnnotations;

// namespace backend.DTO
// {
//     public class CreateReviewDto
//     {
//         [Required]
//         public int TrekPackageId { get; set; }

//         [Required]
//         [Range(1, 5)]
//         public int Rating { get; set; }

//         [Required]
//         [StringLength(200)]
//         public string Title { get; set; } = string.Empty;

//         [Required]
//         [StringLength(2000)]
//         public string Comment { get; set; } = string.Empty;
//     }

//     public class UpdateReviewDto
//     {
//         [Range(1, 5)]
//         public int? Rating { get; set; }

//         [StringLength(200)]
//         public string? Title { get; set; }

//         [StringLength(2000)]
//         public string? Comment { get; set; }
//     }

//     public class ReviewResponseDto
//     {
//         public int Id { get; set; }
//         public int TrekPackageId { get; set; }
//         public string TrekPackageName { get; set; } = string.Empty;
//         public string UserId { get; set; } = string.Empty;
//         public string UserName { get; set; } = string.Empty;
//         public string? UserEmail { get; set; }
//         public string? UserAvatar { get; set; }
//         public int Rating { get; set; }
//         public string Title { get; set; } = string.Empty;
//         public string Comment { get; set; } = string.Empty;
//         public bool IsVerified { get; set; }
//         public int Helpful { get; set; }
//         public DateTime CreatedAt { get; set; }
//         public DateTime? UpdatedAt { get; set; }
//         public bool IsApproved { get; set; }
//     }

//     public class ReviewStatsDto
//     {
//         public double AverageRating { get; set; }
//         public int TotalReviews { get; set; }
//         public Dictionary<int, int> RatingDistribution { get; set; } = new();
//     }
// }

//-------------------------------------------------------------------end

using System.ComponentModel.DataAnnotations;

namespace backend.DTO
{
    public class CreateReviewDto
    {
        [Required]
        public int TrekPackageId { get; set; }

        [Required]
        [Range(1, 5)]
        public int Rating { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [StringLength(2000)]
        public string Comment { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(200)]
        public string Email { get; set; } = string.Empty;

        [StringLength(100)]
        public string? UserName { get; set; }
    }

    public class UpdateReviewDto
    {
        [Range(1, 5)]
        public int? Rating { get; set; }

        [StringLength(200)]
        public string? Title { get; set; }

        [StringLength(2000)]
        public string? Comment { get; set; }
    }

    public class ReviewResponseDto
    {
        public int Id { get; set; }
        public int TrekPackageId { get; set; }
        public string TrekPackageName { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string? UserEmail { get; set; }
        public string? UserAvatar { get; set; }
        public int Rating { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Comment { get; set; } = string.Empty;
        public bool IsVerified { get; set; }
        public int Helpful { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public bool IsApproved { get; set; }
    }

    public class ReviewStatsDto
    {
        public double AverageRating { get; set; }
        public int TotalReviews { get; set; }
        public Dictionary<int, int> RatingDistribution { get; set; } = new();
    }
}