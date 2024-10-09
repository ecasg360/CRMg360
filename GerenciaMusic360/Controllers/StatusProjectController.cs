using GerenciaMusic360.Entities;
using GerenciaMusic360.Entities.Models;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class StatusProjectController : ControllerBase
    {
        private readonly IStatusProjectService _statusProjectService;
        public StatusProjectController(
            IStatusProjectService StatusProjectService)
        {
            _statusProjectService = StatusProjectService;
        }

        [Route("api/StatusProjects")]
        [HttpGet]
        public MethodResponse<List<StatusProject>> Get()
        {
            var result = new MethodResponse<List<StatusProject>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _statusProjectService.GetList()
               .ToList();
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/StatusProjectsLeft")]
        [HttpGet]
        public MethodResponse<IEnumerable<StatusProject>> GetLeftStates(int projectId)
        {
            var result = new MethodResponse<IEnumerable<StatusProject>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _statusProjectService.GetLeftStates(projectId);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/StatusProject")]
        [HttpGet]
        public MethodResponse<StatusProject> Get(int id)
        {
            var result = new MethodResponse<StatusProject> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _statusProjectService.Get(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/StatusProject")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] StatusProject model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                model.Created = DateTime.Now;
                model.Creator = userId;
                model.StatusRecordId = 1;
                _statusProjectService.Create(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/StatusProject")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] StatusProject model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                StatusProject StatusProject = _statusProjectService.Get(model.Id);
                StatusProject.Name = model.Name;
                StatusProject.Description = model.Description;
                StatusProject.Modified = DateTime.Now;
                StatusProject.Modifier = userId;
                _statusProjectService.Update(StatusProject);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/StatusProjectStatus")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody]StatusUpdateModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                StatusProject StatusProject = _statusProjectService.Get(Convert.ToInt32(model.Id));
                StatusProject.StatusRecordId = model.Status;
                StatusProject.Modified = DateTime.Now;
                StatusProject.Modifier = userId;
                _statusProjectService.Update(StatusProject);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/StatusProject")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                StatusProject StatusProject = _statusProjectService.Get(id);
                StatusProject.StatusRecordId = 3;
                StatusProject.Erased = DateTime.Now;
                StatusProject.Eraser = userId;

                _statusProjectService.Update(StatusProject);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }
    }
}
