using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SimpleMonitor.Data;
using Microsoft.EntityFrameworkCore;
using SimpleMonitor.Models;

namespace SimpleMonitor.Controllers.API
{
    [Route("api/[controller]")]
    public class PanelsController : Controller
    {
        private readonly MonitorDbContext _context;

        public PanelsController(MonitorDbContext context)
        {
            this._context = context;
        }

        [HttpGet("")]
        public async Task<IActionResult> Get()
        {
            var panels = await _context.PanelInfos.AsNoTracking().ToListAsync();
            return Ok(panels);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var panel = await _context.PanelInfos.Include(x => x.HostInfos)
                .Include(x => x.ColumnInfos)
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.PanelId == id);
            if (panel == null)
            {
                throw new HttpRequestException($"Panel info is not found with id {id}.");
            }
            return Ok(panel);
        }

        [HttpPost("")]
        public async Task<IActionResult> Add([FromBody] PanelInfo panelInfo)
        {
            var isExists = IsPanelExists(panelInfo.GroupId, 0, panelInfo.Name);
            if (isExists)
            {
                throw new HttpRequestException($"Panel {panelInfo.Name} is exists.");
            }
            panelInfo.PanelId = 0;
            panelInfo.InDate = panelInfo.EditDate = DateTime.Now;
            _context.PanelInfos.Add(panelInfo);
            await _context.SaveChangesAsync();            
            return Ok(panelInfo);
        }

        [HttpPut("")]
        public async Task<IActionResult> Update([FromBody] PanelInfo panelInfo)
        {
            var isExists = IsPanelExists(panelInfo.GroupId, panelInfo.PanelId, panelInfo.Name);
            if (isExists)
            {
                throw new HttpRequestException($"Panel {panelInfo.Name} is exists.");
            }
            using (var dbContextTransaction = _context.Database.BeginTransaction())
            {
                try
                {
                    var data = _context.PanelInfos.SingleOrDefault(x => x.PanelId == panelInfo.PanelId);

                    var hosts = _context.HostInfos.Where(x => x.PanelId == panelInfo.PanelId);
                    _context.HostInfos.RemoveRange(hosts);

                    var columns = _context.ColumnInfos.Where(x => x.PanelId == panelInfo.PanelId);
                    _context.ColumnInfos.RemoveRange(columns);

                    data.EditDate = DateTime.Now;
                    data.Name = panelInfo.Name;
                    data.Description = panelInfo.Description;
                    data.HostInfos = panelInfo.HostInfos;
                    data.ColumnInfos = panelInfo.ColumnInfos;

                    await _context.SaveChangesAsync();
                    dbContextTransaction.Commit();
                    return Ok(new {result = true});
                }
                catch (Exception)
                {
                    dbContextTransaction.Rollback();
                    throw new HttpRequestException("Update panel failed.");
                }
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var panel = _context.PanelInfos.Include(x => x.HostInfos)
                .Include(x => x.ColumnInfos)
                .FirstOrDefault(x => x.PanelId == id);
            if (panel == null)
            {
                throw new HttpRequestException("Panel is not exists.");
            }
            _context.PanelInfos.Remove(panel);
            await _context.SaveChangesAsync();
            return Ok(new { result = true });
        }

        private bool IsPanelExists(int groupid, int panelId, string name)
        {
            return _context.PanelInfos.AsNoTracking()
                .Any(x => x.GroupId == groupid && x.PanelId != panelId && x.Name == name);
        }
    }
}