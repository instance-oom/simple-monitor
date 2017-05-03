using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SimpleMonitor.Models
{
    public class HostInfo
    {
        [Key]
        public int HostId { get; set; }
        public string DisplayName { get; set; }
        public string Url { get; set; }

        public int PanelId { get; set; }
        [ForeignKey("PanelId")]
        public PanelInfo PanelInfo { get; set; }
    }
}
