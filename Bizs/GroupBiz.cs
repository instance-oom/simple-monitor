using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Monitor.Models;

namespace Monitor.Bizs
{
    public class GroupBiz
    {
        private readonly MonitorContext _db = new MonitorContext();

        public List<GroupInfo> GetGroupInfos()
        {
            var groups = _db.GroupInfos.AsNoTracking().ToList();
            return groups;
        }

        public List<GroupInfo> GetGroupInfos(int pageIndex)
        {
            return GetGroupInfos(pageIndex, 10);
        }

        public List<GroupInfo> GetGroupInfos(int pageIndex, int pageSize)
        {
            var groups = _db.GroupInfos.Skip((pageIndex - 1)*pageSize).Take(pageSize).AsNoTracking().ToList();
            return groups;
        }

        public GroupInfo GetById(int groupId)
        {
            var group = _db.GroupInfos.Include(x => x.PanelInfos)
                .ThenInclude(panel => panel.HostInfos)
                .Include(x => x.PanelInfos)
                .ThenInclude(panel => panel.ColumnInfos)
                .AsNoTracking()
                .FirstOrDefault(x => x.GroupId == groupId);
            return group;
        }

        public GroupInfo AddGroup(GroupInfo groupInfo)
        {
            var group = new GroupInfo
            {
                Name = groupInfo.Name,
                Description = groupInfo.Description,
                Icon = groupInfo.Icon
            };
            _db.GroupInfos.Add(group);
            _db.SaveChanges();
            return group;
        }

        public void UpdateGroup(GroupInfo groupInfo)
        {
            var group = _db.GroupInfos.SingleOrDefault(x => x.GroupId == groupInfo.GroupId);
            group.Name = groupInfo.Name;
            group.Description = groupInfo.Description;
            group.Icon = groupInfo.Icon;
            _db.SaveChanges();
        }

        public void DeleteGroup(int groupId)
        {
            var group = _db.GroupInfos.Include(x => x.PanelInfos)
                .ThenInclude(panel => panel.HostInfos)
                .Include(x => x.PanelInfos)
                .ThenInclude(panel => panel.ColumnInfos)
                .FirstOrDefault(x => x.GroupId == groupId);
            _db.Remove(group);
            _db.SaveChanges();
        }

        public bool IsExists(int groupId, string name)
        {
            var group = _db.GroupInfos.AsNoTracking().FirstOrDefault(x => x.GroupId != groupId && x.Name == name);
            return group != null;
        }
    }
}
