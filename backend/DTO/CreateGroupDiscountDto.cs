// backend/DTO/GroupDiscountDto.cs
using System.ComponentModel.DataAnnotations;

namespace backend.DTO
{
    public class CreateGroupDiscountDto
    {
        [Required]
        public int MinTravelers { get; set; }

        [Required]
        public int MaxTravelers { get; set; }

        [Required]
        public decimal PricePerPerson { get; set; }

        public decimal? DiscountPercentage { get; set; }

        [StringLength(200)]
        public string? Description { get; set; }

        public int DisplayOrder { get; set; } = 0;
    }

    public class UpdateGroupDiscountDto : CreateGroupDiscountDto
    {
        public int Id { get; set; }
    }

    public class GroupDiscountDto
    {
        public int Id { get; set; }
        public int MinTravelers { get; set; }
        public int MaxTravelers { get; set; }
        public decimal PricePerPerson { get; set; }
        public decimal? DiscountPercentage { get; set; }
        public string? Description { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsActive { get; set; }
        public decimal TotalPrice { get; set; }
    }
}