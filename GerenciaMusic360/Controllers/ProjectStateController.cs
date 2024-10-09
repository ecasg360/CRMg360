using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class ProjectStateController : ControllerBase
    {
        private readonly IProjectStateService _projectStateService;
        public ProjectStateController(
            IProjectStateService projectStateService)
        {
            _projectStateService = projectStateService;
        }

        [Route("api/ProjectStates")]
        [HttpGet]
        public MethodResponse<List<ProjectState>> Get()
        {
            var result = new MethodResponse<List<ProjectState>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _projectStateService.GetList()
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

        [Route("api/ProjectStateByProjectId")]
        [HttpGet]
        public MethodResponse<IEnumerable<ProjectState>> GetByProjectId(int id)
        {
            var result = new MethodResponse<IEnumerable<ProjectState>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _projectStateService.GetByProjectId(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/ProjectState")]
        [HttpGet]
        public MethodResponse<ProjectState> Get(int id)
        {
            var result = new MethodResponse<ProjectState> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _projectStateService.Get(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/ProjectState")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] ProjectState model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                model.Created = DateTime.Now;
                model.Creator = userId;
                _projectStateService.Create(model);
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
