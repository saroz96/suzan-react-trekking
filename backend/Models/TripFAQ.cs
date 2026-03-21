using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class TripFAQ
    {
        public int Id { get; set; }
        public int TrekPackageId { get; set; }
        [ForeignKey("TrekPackageId")]
        public virtual TrekPackage? TrekPackage { get; set; }

        [Required]
        public string Question { get; set; } = string.Empty;

        [Required]
        public string Answer { get; set; } = string.Empty;

        public int DisplayOrder { get; set; }
    }
}