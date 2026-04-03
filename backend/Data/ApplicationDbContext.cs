using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data;

public class ApplicationDbContext : IdentityDbContext<AppUser, IdentityRole, string>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    // Add DbSet for MainHeading
    public DbSet<MainHeading> MainHeadings { get; set; }
    public DbSet<Heading> Headings { get; set; }
    public DbSet<SubHeading> SubHeadings { get; set; }
    public DbSet<TrekPackage> TrekPackages { get; set; }
    public DbSet<TripSliderImage> TripSliderImages { get; set; }
    public DbSet<TripGalleryImage> TripGalleryImages { get; set; }
    public DbSet<TripItineraryDay> TripItineraryDays { get; set; }
    public DbSet<TripCostInclude> TripCostIncludes { get; set; }
    public DbSet<TripCostExclude> TripCostExcludes { get; set; }
    public DbSet<TripFAQ> TripFaqs { get; set; }
    public DbSet<TripDepartureDate> TripDepartureDates { get; set; }
    public DbSet<TripGroupDiscount> TripGroupDiscounts { get; set; }
    public DbSet<Country> Countries { get; set; }

    public DbSet<TrekPackageReview> TrekPackageReviews { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Configure AppUser
        builder.Entity<AppUser>(entity =>
        {
            entity.Property(e => e.Name)
                .HasMaxLength(100);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        // Configure MainHeading
        builder.Entity<MainHeading>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.Property(e => e.UpdatedAt);

            // Add index on Name for faster searches
            entity.HasIndex(e => e.Name)
                .IsUnique(false); // Set to true if names should be unique
        });

        builder.Entity<Heading>()
                .HasOne(h => h.MainHeading)
                .WithMany()
                .HasForeignKey(h => h.MainHeadingId)
                .OnDelete(DeleteBehavior.Cascade); // When MainHeading is deleted, delete all its Headings

        // Add indexes for better performance
        builder.Entity<Heading>()
            .HasIndex(h => h.MainHeadingId);

        builder.Entity<Heading>()
            .HasIndex(h => new { h.MainHeadingId, h.Name })
            .IsUnique(); // Ensure unique heading names under the same main heading

        builder.Entity<Heading>()
            .HasIndex(h => h.IsActive);

        builder.Entity<SubHeading>()
            .HasOne(sh => sh.MainHeading)
            .WithMany()
            .HasForeignKey(sh => sh.MainHeadingId)
            .OnDelete(DeleteBehavior.Restrict); // Prevent cascade delete

        // Configure relationship between SubHeading and Heading
        builder.Entity<SubHeading>()
            .HasOne(sh => sh.Heading)
            .WithMany()
            .HasForeignKey(sh => sh.HeadingId)
            .OnDelete(DeleteBehavior.Cascade); // When Heading is deleted, delete its SubHeadings

        // Add indexes for better performance
        builder.Entity<SubHeading>()
            .HasIndex(sh => sh.MainHeadingId);

        builder.Entity<SubHeading>()
            .HasIndex(sh => sh.HeadingId);

        builder.Entity<SubHeading>()
            .HasIndex(sh => new { sh.HeadingId, sh.Name })
            .IsUnique(); // Ensure unique subheading names under the same heading

        builder.Entity<SubHeading>()
            .HasIndex(sh => sh.IsActive);

        builder.Entity<SubHeading>()
            .HasIndex(sh => sh.DisplayOrder);

        builder.Entity<TrekPackage>(entity =>
            {
                // Country relationship
                entity.HasOne(t => t.Country)
                    .WithMany()
                    .HasForeignKey(t => t.CountryId)
                    .OnDelete(DeleteBehavior.Restrict);

                // Configure Slider Images - using explicit navigation
                entity.HasMany(t => t.SliderImages)
                    .WithOne(s => s.TrekPackage!)
                    .HasForeignKey(s => s.TrekPackageId)
                    .OnDelete(DeleteBehavior.Cascade);

                // Configure Gallery Images
                entity.HasMany(t => t.GalleryImages)
                    .WithOne(g => g.TrekPackage!)
                    .HasForeignKey(g => g.TrekPackageId)
                    .OnDelete(DeleteBehavior.Cascade);

                // Configure Itinerary
                entity.HasMany(t => t.Itinerary)
                    .WithOne(i => i.TrekPackage!)
                    .HasForeignKey(i => i.TrekPackageId)
                    .OnDelete(DeleteBehavior.Cascade);

                // Configure Cost Includes
                entity.HasMany(t => t.CostIncludes)
                    .WithOne(c => c.TrekPackage!)
                    .HasForeignKey(c => c.TrekPackageId)
                    .OnDelete(DeleteBehavior.Cascade);

                // Configure Cost Excludes
                entity.HasMany(t => t.CostExcludes)
                    .WithOne(c => c.TrekPackage!)
                    .HasForeignKey(c => c.TrekPackageId)
                    .OnDelete(DeleteBehavior.Cascade);

                // Configure FAQs
                entity.HasMany(t => t.Faqs)
                    .WithOne(f => f.TrekPackage!)
                    .HasForeignKey(f => f.TrekPackageId)
                    .OnDelete(DeleteBehavior.Cascade);

                // Configure Departure Dates
                entity.HasMany(t => t.DepartureDates)
                    .WithOne(d => d.TrekPackage!)
                    .HasForeignKey(d => d.TrekPackageId)
                    .OnDelete(DeleteBehavior.Cascade);

                // Add indexes for better performance
                entity.HasIndex(t => t.CountryId);
                entity.HasIndex(t => t.IsActive);
                entity.HasIndex(t => t.Name);
            });

        // Configure TripSliderImage
        builder.Entity<TripSliderImage>(entity =>
        {
            entity.HasIndex(s => new { s.TrekPackageId, s.DisplayOrder });
        });

        // Configure TripGalleryImage
        builder.Entity<TripGalleryImage>(entity =>
        {
            entity.HasIndex(g => new { g.TrekPackageId, g.DisplayOrder });
            entity.HasIndex(g => g.IsFeatured);
        });

        // Configure TripItineraryDay
        builder.Entity<TripItineraryDay>(entity =>
        {
            entity.HasIndex(i => new { i.TrekPackageId, i.DayNumber });
        });

        // Configure TripCostInclude
        builder.Entity<TripCostInclude>(entity =>
        {
            entity.HasIndex(c => new { c.TrekPackageId, c.DisplayOrder });
            entity.HasIndex(c => c.Category);
        });

        // Configure TripCostExclude
        builder.Entity<TripCostExclude>(entity =>
        {
            entity.HasIndex(c => new { c.TrekPackageId, c.DisplayOrder });
            entity.HasIndex(c => c.Category);
        });

        // Configure TripFaq
        builder.Entity<TripFAQ>(entity =>
        {
            entity.HasIndex(f => new { f.TrekPackageId, f.DisplayOrder });
        });

        // Configure TripDepartureDate
        builder.Entity<TripDepartureDate>(entity =>
        {
            entity.HasIndex(d => new { d.TrekPackageId, d.StartDate });
            entity.HasIndex(d => d.IsAvailable);
        });

        builder.Entity<TripGroupDiscount>()
            .HasOne(g => g.TrekPackage)
            .WithMany(p => p.GroupDiscounts)
            .HasForeignKey(g => g.TrekPackageId)
            .OnDelete(DeleteBehavior.Cascade);

        // Country configuration
        builder.Entity<Country>(entity =>
            {
                entity.HasIndex(c => c.Name).IsUnique();
                entity.HasIndex(c => c.Code).IsUnique();
                entity.HasIndex(c => c.IsActive);
                entity.HasIndex(c => c.DisplayOrder);

                // Relationship with TrekPackage
                entity.HasMany(c => c.TrekPackages)
                    .WithOne(t => t.Country)
                    .HasForeignKey(t => t.CountryId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

        // ========== TREK PACKAGE REVIEW CONFIGURATION ==========
        builder.Entity<TrekPackageReview>(entity =>
        {
            // Primary key
            entity.HasKey(e => e.Id);

            // Properties configuration
            entity.Property(e => e.Rating)
                .IsRequired();

            entity.Property(e => e.Title)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(e => e.Comment)
                .IsRequired()
                .HasMaxLength(2000);

            entity.Property(e => e.UserAvatar)
                .HasMaxLength(10);

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            // Relationships
            entity.HasOne(e => e.TrekPackage)
                .WithMany(p => p.Reviews)
                .HasForeignKey(e => e.TrekPackageId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.User)
                .WithMany(u => u.Reviews)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Indexes for better performance
            entity.HasIndex(e => e.TrekPackageId);
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.Rating);
            entity.HasIndex(e => e.CreatedAt);
            entity.HasIndex(e => e.IsActive);
            entity.HasIndex(e => e.IsApproved);

            // Composite indexes
            entity.HasIndex(e => new { e.TrekPackageId, e.IsApproved, e.IsActive });
            entity.HasIndex(e => new { e.UserId, e.TrekPackageId }).IsUnique(); // Prevent duplicate reviews from same user
            entity.HasIndex(e => new { e.Rating, e.IsApproved });
        });
    }
}