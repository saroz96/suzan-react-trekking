using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTrekkingTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "HeadingId",
                table: "TrekPackages",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "MainHeadingId",
                table: "TrekPackages",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "SubHeadingId",
                table: "TrekPackages",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TrekPackages_HeadingId",
                table: "TrekPackages",
                column: "HeadingId");

            migrationBuilder.CreateIndex(
                name: "IX_TrekPackages_MainHeadingId",
                table: "TrekPackages",
                column: "MainHeadingId");

            migrationBuilder.CreateIndex(
                name: "IX_TrekPackages_SubHeadingId",
                table: "TrekPackages",
                column: "SubHeadingId");

            migrationBuilder.AddForeignKey(
                name: "FK_TrekPackages_Headings_HeadingId",
                table: "TrekPackages",
                column: "HeadingId",
                principalTable: "Headings",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TrekPackages_MainHeadings_MainHeadingId",
                table: "TrekPackages",
                column: "MainHeadingId",
                principalTable: "MainHeadings",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TrekPackages_SubHeadings_SubHeadingId",
                table: "TrekPackages",
                column: "SubHeadingId",
                principalTable: "SubHeadings",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TrekPackages_Headings_HeadingId",
                table: "TrekPackages");

            migrationBuilder.DropForeignKey(
                name: "FK_TrekPackages_MainHeadings_MainHeadingId",
                table: "TrekPackages");

            migrationBuilder.DropForeignKey(
                name: "FK_TrekPackages_SubHeadings_SubHeadingId",
                table: "TrekPackages");

            migrationBuilder.DropIndex(
                name: "IX_TrekPackages_HeadingId",
                table: "TrekPackages");

            migrationBuilder.DropIndex(
                name: "IX_TrekPackages_MainHeadingId",
                table: "TrekPackages");

            migrationBuilder.DropIndex(
                name: "IX_TrekPackages_SubHeadingId",
                table: "TrekPackages");

            migrationBuilder.DropColumn(
                name: "HeadingId",
                table: "TrekPackages");

            migrationBuilder.DropColumn(
                name: "MainHeadingId",
                table: "TrekPackages");

            migrationBuilder.DropColumn(
                name: "SubHeadingId",
                table: "TrekPackages");
        }
    }
}
