using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SimpleMonitor.Models
{
    public class PanelInfo
    {
        [Key]
        public int PanelId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public PanelType PanelType { get; set; }
        public DateTime InDate { get; set; }
        public DateTime EditDate { get; set; }

        public int GroupId { get; set; }
        [ForeignKey("GroupId")]
        public GroupInfo GroupInfo { get; set; }

        public List<HostInfo> HostInfos { get; set; }
        public List<ColumnInfo> ColumnInfos { get; set; }
    }

    public enum PanelType
    {
        Table = 0,
        Chart = 1
    }
}
