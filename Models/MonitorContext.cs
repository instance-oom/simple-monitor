using Microsoft.EntityFrameworkCore;

namespace Monitor.Models
{
    public class MonitorContext : DbContext
    {
        //public MonitorContext(DbContextOptions options)
        //    : base(options)
        //{
        //}

        public DbSet<GroupInfo> GroupInfos { get; set; }
        public DbSet<PanelInfo> PanelInfos { get; set; }
        public DbSet<HostInfo> HostInfos { get; set; }
        public DbSet<ColumnInfo> ColumnInfos { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Filename=./db/Monitor.db");
        }
    }
}
