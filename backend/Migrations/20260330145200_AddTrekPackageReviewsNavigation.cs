using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddTrekPackageReviewsNavigation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UserType",
                table: "AspNetUsers",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "TrekPackageReviews",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TrekPackageId = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: false),
                    Rating = table.Column<int>(type: "integer", nullable: false),
                    Title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Comment = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false),
                    UserAvatar = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    IsVerified = table.Column<bool>(type: "boolean", nullable: false),
                    Helpful = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    IsApproved = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrekPackageReviews", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TrekPackageReviews_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TrekPackageReviews_TrekPackages_TrekPackageId",
                        column: x => x.TrekPackageId,
                        principalTable: "TrekPackages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TrekPackageReviews_CreatedAt",
                table: "TrekPackageReviews",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_TrekPackageReviews_IsActive",
                table: "TrekPackageReviews",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_TrekPackageReviews_IsApproved",
                table: "TrekPackageReviews",
                column: "IsApproved");

            migrationBuilder.CreateIndex(
                name: "IX_TrekPackageReviews_Rating",
                table: "TrekPackageReviews",
                column: "Rating");

            migrationBuilder.CreateIndex(
                name: "IX_TrekPackageReviews_Rating_IsApproved",
                table: "TrekPackageReviews",
                columns: new[] { "Rating", "IsApproved" });

            migrationBuilder.CreateIndex(
                name: "IX_TrekPackageReviews_TrekPackageId",
                table: "TrekPackageReviews",
                column: "TrekPackageId");

            migrationBuilder.CreateIndex(
                name: "IX_TrekPackageReviews_TrekPackageId_IsApproved_IsActive",
                table: "TrekPackageReviews",
                columns: new[] { "TrekPackageId", "IsApproved", "IsActive" });

            migrationBuilder.CreateIndex(
                name: "IX_TrekPackageReviews_UserId",
                table: "TrekPackageReviews",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_TrekPackageReviews_UserId_TrekPackageId",
                table: "TrekPackageReviews",
                columns: new[] { "UserId", "TrekPackageId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TrekPackageReviews");

            migrationBuilder.DropColumn(
                name: "UserType",
                table: "AspNetUsers");
        }
    }
}
