using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddSellerStatusToDepartureDates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BookingCount",
                table: "TripDepartureDates",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsBestSeller",
                table: "TripDepartureDates",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsTopSeller",
                table: "TripDepartureDates",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BookingCount",
                table: "TripDepartureDates");

            migrationBuilder.DropColumn(
                name: "IsBestSeller",
                table: "TripDepartureDates");

            migrationBuilder.DropColumn(
                name: "IsTopSeller",
                table: "TripDepartureDates");
        }
    }
}
