using Microsoft.EntityFrameworkCore;

namespace Monitor.Models
{
    public class MonitorContext : DbContext
    {
        public DbSet<GroupInfo> GroupInfos { get; set; }
        public DbSet<PanelInfo> PanelInfos { get; set; }
        public DbSet<HostInfo> HostInfos { get; set; }
        public DbSet<ColumnInfo> ColumnInfos { get; set; }
    }
}
