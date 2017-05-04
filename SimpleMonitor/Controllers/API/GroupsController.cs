using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SimpleMonitor.Data;
using SimpleMonitor.Models;

namespace SimpleMonitor.Controllers.API
{
    [Route("api/[controller]")]
    public class GroupsController : Controller
    {
        private readonly MonitorDbContext _context;
        public GroupsController(MonitorDbContext context)
        {
            this._context = context;
        }

        [HttpGet("")]
        public async Task<IActionResult> Get()
        {
            var groups = await _context.GroupInfos.AsNoTracking().ToListAsync();
            return Ok(groups);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var group = await _context.GroupInfos.Include(x => x.PanelInfos)
                .ThenInclude(panel => panel.HostInfos)
                .Include(x => x.PanelInfos)
                .ThenInclude(panel => panel.ColumnInfos)
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.GroupId == id);
            if (group == null)
            {
                throw new HttpRequestException("Group is not exists.");
            }
            return Ok(group);
        }

        [HttpPost("")]
        public async Task<IActionResult> Add([FromBody] GroupInfo groupInfo)
        {
            var isGroupExists = IsGroupExists(0, groupInfo.Name);
            if (isGroupExists)
            {
                throw new HttpRequestException("Group is exists.");
            }
            groupInfo.GroupId = 0;
            groupInfo.PanelInfos = null;
            _context.GroupInfos.Add(groupInfo);
            await _context.SaveChangesAsync();
            return Ok(groupInfo);
        }

        [HttpPut("")]
        public async Task<IActionResult> Update([FromBody] GroupInfo groupInfo)
        {
            if (groupInfo.GroupId == 0)
            {
                throw new HttpRequestException("GroupId cannot be null or empty.");
            }
            if (!_context.GroupInfos.Any(x => x.GroupId == groupInfo.GroupId))
            {
                throw new HttpRequestException("Group id not esists.");
            }
            var isGroupExists = IsGroupExists(groupInfo.GroupId, groupInfo.Name);
            if (isGroupExists)
            {
                throw new HttpRequestException("Group is exists.");
            }
            var group = _context.GroupInfos.SingleOrDefault(x => x.GroupId == groupInfo.GroupId);
            group.Name = groupInfo.Name;
            group.Description = groupInfo.Description;
            group.Icon = groupInfo.Icon;
            await _context.SaveChangesAsync();
            return Ok(group);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            if (!_context.GroupInfos.Any(x => x.GroupId == id))
            {
                throw new HttpRequestException("Group id not esists.");
            }
            var group = _context.GroupInfos.Include(x => x.PanelInfos)
                .ThenInclude(panel => panel.HostInfos)
                .Include(x => x.PanelInfos)
                .ThenInclude(panel => panel.ColumnInfos)
                .FirstOrDefault(x => x.GroupId == id);
            _context.Remove(group);
            await _context.SaveChangesAsync();
            return Ok(new { result = true });
        }

        private bool IsGroupExists(int groupId, string name)
        {
            return _context.GroupInfos.AsNoTracking().Any(x => x.GroupId != groupId && x.Name == name);
        }
    }
}