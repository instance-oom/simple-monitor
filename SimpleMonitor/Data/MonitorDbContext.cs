using Microsoft.EntityFrameworkCore;
using SimpleMonitor.Models;

namespace SimpleMonitor.Data
{
    public sealed class MonitorDbContext : DbContext
    {
        public MonitorDbContext(DbContextOptions<MonitorDbContext> options)
            : base(options)
        {
            Database.EnsureCreated();
        }

        public DbSet<GroupInfo> GroupInfos { get; set; }
        public DbSet<PanelInfo> PanelInfos { get; set; }
        public DbSet<HostInfo> HostInfos { get; set; }
        public DbSet<ColumnInfo> ColumnInfos { get; set; }
    }
}
