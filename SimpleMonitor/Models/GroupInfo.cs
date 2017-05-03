using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SimpleMonitor.Models
{
    public class GroupInfo
    {
        [Key]
        public int GroupId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Icon { get; set; }

        public List<PanelInfo> PanelInfos { get; set; }
    }
}
