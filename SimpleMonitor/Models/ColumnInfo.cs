using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SimpleMonitor.Models
{
    public class ColumnInfo
    {
        [Key]
        public int ColumnId { get; set; }

        public string DisplayName { get; set; }
        public string Key { get; set; }
        public ColumnType ColumnType { get; set; }

        public int PanelId { get; set; }
        [ForeignKey("PanelId")]
        public PanelInfo PanelInfo { get; set; }
    }

    public enum ColumnType
    {
        String = 0,
        Bool = 1
    }
}
