using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace simplemonitor.Migrations
{
    public partial class init : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "GroupInfos",
                columns: table => new
                {
                    GroupId = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Description = table.Column<string>(nullable: true),
                    Icon = table.Column<string>(nullable: true),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GroupInfos", x => x.GroupId);
                });

            migrationBuilder.CreateTable(
                name: "PanelInfos",
                columns: table => new
                {
                    PanelId = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Description = table.Column<string>(nullable: true),
                    EditDate = table.Column<DateTime>(nullable: false),
                    GroupId = table.Column<int>(nullable: false),
                    InDate = table.Column<DateTime>(nullable: false),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PanelInfos", x => x.PanelId);
                    table.ForeignKey(
                        name: "FK_PanelInfos_GroupInfos_GroupId",
                        column: x => x.GroupId,
                        principalTable: "GroupInfos",
                        principalColumn: "GroupId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ColumnInfos",
                columns: table => new
                {
                    ColumnId = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ColumnType = table.Column<int>(nullable: false),
                    DisplayName = table.Column<string>(nullable: true),
                    Key = table.Column<string>(nullable: true),
                    PanelId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ColumnInfos", x => x.ColumnId);
                    table.ForeignKey(
                        name: "FK_ColumnInfos_PanelInfos_PanelId",
                        column: x => x.PanelId,
                        principalTable: "PanelInfos",
                        principalColumn: "PanelId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "HostInfos",
                columns: table => new
                {
                    HostId = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    DisplayName = table.Column<string>(nullable: true),
                    PanelId = table.Column<int>(nullable: false),
                    Url = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HostInfos", x => x.HostId);
                    table.ForeignKey(
                        name: "FK_HostInfos_PanelInfos_PanelId",
                        column: x => x.PanelId,
                        principalTable: "PanelInfos",
                        principalColumn: "PanelId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ColumnInfos_PanelId",
                table: "ColumnInfos",
                column: "PanelId");

            migrationBuilder.CreateIndex(
                name: "IX_HostInfos_PanelId",
                table: "HostInfos",
                column: "PanelId");

            migrationBuilder.CreateIndex(
                name: "IX_PanelInfos_GroupId",
                table: "PanelInfos",
                column: "GroupId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ColumnInfos");

            migrationBuilder.DropTable(
                name: "HostInfos");

            migrationBuilder.DropTable(
                name: "PanelInfos");

            migrationBuilder.DropTable(
                name: "GroupInfos");
        }
    }
}
