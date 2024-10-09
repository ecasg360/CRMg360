using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{

    [ApiController]
    public class ProjectBuyerController : ControllerBase
    {
        private readonly IProjectBuyerService _projectBuyerService;

        public ProjectBuyerController(IProjectBuyerService projectBuyerService)
        {
            _projectBuyerService = projectBuyerService;
        }

        [Route("api/ProjectBuyers")]
        [HttpGet]
        public MethodResponse<List<ProjectBuyer>> Get(int projectId)
        {
            var result = new MethodResponse<List<ProjectBuyer>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _projectBuyerService.GetProjectBuyerByProject(projectId)
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

        [Route("api/ProjectBuyer")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] ProjectBuyer model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                _projectBuyerService.CreateProjectBuyer(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/ProjectBuyers")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] List<ProjectBuyer> model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                _projectBuyerService.CreateProjectBuyers(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/ProjectBuyer")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int projectId, int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                ProjectBuyer projectBuyer = _projectBuyerService.GetProjectBuyer(id);
                _projectBuyerService.DeleteProjectBuyer(projectBuyer);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/ProjectBuyers")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int projectId)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                IEnumerable<ProjectBuyer> projectBuyers =
                    _projectBuyerService.GetProjectBuyerByProject(projectId);

                _projectBuyerService.DeleteProjectBuyers(projectBuyers);
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
