using System;
using Microsoft.AspNetCore.Mvc;
using Monitor.Bizs;
using Monitor.Models;

namespace Monitor.Controllers
{
    [Route("api/[controller]")]
    public class GroupsController: Controller
    {
        private readonly GroupBiz _groupBiz = new GroupBiz();

        [HttpGet]
        public IActionResult Get()
        {
            var groups = _groupBiz.GetGroupInfos();
            return Ok(groups);
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var group = _groupBiz.GetById(id);
            if (group == null)
            {
                throw new Exception("Group is not exists.");
            }
            return Ok(group);
        }

        [HttpPost]
        public IActionResult AddGroup([FromBody]GroupInfo groupInfo)
        {
            var isExists = _groupBiz.IsExists(0, groupInfo.Name);
            if (isExists)
            {
                throw new Exception("Group is exists.");
            }
            groupInfo = _groupBiz.AddGroup(groupInfo);
            return Ok(groupInfo);
        }

        [HttpPut("{id}")]
        [HttpPost("{id}")]
        public IActionResult UpdateGroup(int id, [FromBody]GroupInfo groupInfo)
        {
            var isExists = _groupBiz.IsExists(id, groupInfo.Name);
            if (isExists)
            {
                throw new Exception("Group is exists.");
            }
            groupInfo.GroupId = id;
            _groupBiz.UpdateGroup(groupInfo);
            return Ok();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteGroup(int id)
        {
            _groupBiz.DeleteGroup(id);
            return Ok();
        }
    }
}
