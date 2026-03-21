using System.ComponentModel.DataAnnotations;

namespace backend.DTO
{
    public class CreateMainHeadingDto
    {
        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;
    }

    public class UpdateMainHeadingDto
    {
        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;
    }

    public class MainHeadingResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}