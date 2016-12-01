using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Monitor.Models;

namespace Monitor.Bizs
{
    public class PanelBiz
    {
        private readonly MonitorContext _db = new MonitorContext();

        public List<PanelInfo> GetPanelInfos()
        {
            var panels = _db.PanelInfos.AsNoTracking().ToList();
            return panels;
        }

        public List<PanelInfo> GetPanelInfos(int pageIndex)
        {
            return GetPanelInfos(pageIndex, 10);
        }

        public List<PanelInfo> GetPanelInfos(int pageIndex, int pageSize)
        {
            var panels = _db.PanelInfos.Skip((pageIndex - 1) * pageSize).Take(pageSize).AsNoTracking().ToList();
            return panels;
        }

        public PanelInfo GetPanelInfo(int panelId)
        {
            var panel = _db.PanelInfos.Include(x => x.HostInfos)
                .Include(x => x.ColumnInfos)
                .AsNoTracking()
                .FirstOrDefault(x => x.PanelId == panelId);
            return panel;
        }

        public PanelInfo AddPanel(PanelInfo panelInfo)
        {
            panelInfo.PanelId = 0;
            panelInfo.InDate = panelInfo.EditDate = DateTime.Now;
            _db.PanelInfos.Add(panelInfo);
            _db.SaveChanges();
            return panelInfo;
        }

        public void UpdatePanel(PanelInfo panelInfo)
        {
            using (var dbContextTransaction = _db.Database.BeginTransaction())
            {
                try
                {
                    var data = _db.PanelInfos.SingleOrDefault(x => x.PanelId == panelInfo.PanelId);
                    //Delete hosts
                    var hosts = _db.HostInfos.Where(x => x.PanelId == panelInfo.PanelId);
                    _db.HostInfos.RemoveRange(hosts);
                    //Delete columns
                    var columns = _db.ColumnInfos.Where(x => x.PanelId == panelInfo.PanelId);
                    _db.ColumnInfos.RemoveRange(columns);

                    data.EditDate = DateTime.Now;
                    data.Name = panelInfo.Name;
                    data.Description = panelInfo.Description;
                    data.HostInfos = panelInfo.HostInfos;
                    data.ColumnInfos = panelInfo.ColumnInfos;
                    _db.SaveChanges();
                    dbContextTransaction.Commit();
                }
                catch (Exception)
                {
                    dbContextTransaction.Rollback();
                    throw;
                }
            }
        }

        public void DeletePanel(int panelId)
        {
            var panel = _db.PanelInfos.Include(x => x.HostInfos)
                .Include(x => x.ColumnInfos)
                .FirstOrDefault(x => x.PanelId == panelId);
            _db.PanelInfos.Remove(panel);
            _db.SaveChanges();
        }

        public bool IsExists(int panelId, string name)
        {
            var panel = _db.PanelInfos.AsNoTracking().FirstOrDefault(x => x.PanelId != panelId && x.Name == name);
            return panel != null;
        }
    }
}
