using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Monitor.Models;

namespace simplemonitor.Migrations
{
    [DbContext(typeof(MonitorContext))]
    partial class MonitorContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "1.1.0-rtm-22752");

            modelBuilder.Entity("Monitor.Models.ColumnInfo", b =>
                {
                    b.Property<int>("ColumnId")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("ColumnType");

                    b.Property<string>("DisplayName");

                    b.Property<string>("Key");

                    b.Property<int>("PanelId");

                    b.HasKey("ColumnId");

                    b.HasIndex("PanelId");

                    b.ToTable("ColumnInfos");
                });

            modelBuilder.Entity("Monitor.Models.GroupInfo", b =>
                {
                    b.Property<int>("GroupId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Description");

                    b.Property<string>("Icon");

                    b.Property<string>("Name");

                    b.HasKey("GroupId");

                    b.ToTable("GroupInfos");
                });

            modelBuilder.Entity("Monitor.Models.HostInfo", b =>
                {
                    b.Property<int>("HostId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("DisplayName");

                    b.Property<int>("PanelId");

                    b.Property<string>("Url");

                    b.HasKey("HostId");

                    b.HasIndex("PanelId");

                    b.ToTable("HostInfos");
                });

            modelBuilder.Entity("Monitor.Models.PanelInfo", b =>
                {
                    b.Property<int>("PanelId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Description");

                    b.Property<DateTime>("EditDate");

                    b.Property<int>("GroupId");

                    b.Property<DateTime>("InDate");

                    b.Property<string>("Name");

                    b.HasKey("PanelId");

                    b.HasIndex("GroupId");

                    b.ToTable("PanelInfos");
                });

            modelBuilder.Entity("Monitor.Models.ColumnInfo", b =>
                {
                    b.HasOne("Monitor.Models.PanelInfo", "PanelInfo")
                        .WithMany("ColumnInfos")
                        .HasForeignKey("PanelId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Monitor.Models.HostInfo", b =>
                {
                    b.HasOne("Monitor.Models.PanelInfo", "PanelInfo")
                        .WithMany("HostInfos")
                        .HasForeignKey("PanelId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Monitor.Models.PanelInfo", b =>
                {
                    b.HasOne("Monitor.Models.GroupInfo", "GroupInfo")
                        .WithMany("PanelInfos")
                        .HasForeignKey("GroupId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
        }
    }
}
