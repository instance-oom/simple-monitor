using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Monitor.Bizs;
using Monitor.Models;

namespace Monitor.Controllers
{
    [Route("api/[controller]")]
    public class PanelsController : Controller
    {
        private readonly PanelBiz _panelBiz = new PanelBiz();

        [HttpGet]
        public IActionResult Get()
        {
            var result = _panelBiz.GetPanelInfos();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var panel = _panelBiz.GetPanelInfo(id);
            if (panel == null)
            {
                throw new KeyNotFoundException($"Panel info is not found with id {id}.");
            }
            return Ok(panel);
        }

        [HttpPost]
        public IActionResult Post([FromBody] PanelInfo panelInfo)
        {
            var isExists = _panelBiz.IsExists(0, panelInfo.Name);
            if (isExists)
            {
                throw new Exception("Panel is exists.");
            }
            panelInfo = _panelBiz.AddPanel(panelInfo);
            return Ok(panelInfo);
        }

        [HttpPut("{id}")]
        [HttpPost("{id}")]
        public IActionResult Put(int id, [FromBody] PanelInfo panelInfo)
        {
            var isExists = _panelBiz.IsExists(id, panelInfo.Name);
            if (isExists)
            {
                throw new Exception("Panel is exists.");
            }
            panelInfo.PanelId = id;
            _panelBiz.UpdatePanel(panelInfo);
            return Ok();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _panelBiz.DeletePanel(id);
            return Ok();
        }
    }
}
