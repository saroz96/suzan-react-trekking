using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddGroupDiscounts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TripGroupDiscounts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TrekPackageId = table.Column<int>(type: "integer", nullable: false),
                    MinTravelers = table.Column<int>(type: "integer", nullable: false),
                    MaxTravelers = table.Column<int>(type: "integer", nullable: false),
                    PricePerPerson = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    DiscountPercentage = table.Column<decimal>(type: "numeric(18,2)", nullable: true),
                    Description = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    DisplayOrder = table.Column<int>(type: "integer", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TripGroupDiscounts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TripGroupDiscounts_TrekPackages_TrekPackageId",
                        column: x => x.TrekPackageId,
                        principalTable: "TrekPackages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TripGroupDiscounts_TrekPackageId",
                table: "TripGroupDiscounts",
                column: "TrekPackageId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TripGroupDiscounts");
        }
    }
}
