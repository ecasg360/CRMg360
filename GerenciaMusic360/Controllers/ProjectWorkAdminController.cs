using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class ProjectWorkAdminController : ControllerBase
    {
        private readonly IProjectWorkAdminService _projectWorkAdminService;
        public ProjectWorkAdminController(IProjectWorkAdminService projectWorkAdminService)
        {
            _projectWorkAdminService = projectWorkAdminService;
        }

        [Route("api/ProjectWorksAdmin")]
        [HttpGet]
        public MethodResponse<List<ProjectWorkAdmin>> Get(int projectId)
        {
            var result = new MethodResponse<List<ProjectWorkAdmin>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _projectWorkAdminService.GetProjectWorksAdmin().ToList();
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/ProjectWorksAdminByProjectWorkId")]
        [HttpGet]
        public MethodResponse<List<ProjectWorkAdmin>> GetProjectWorkAdminByProjectWorkId(int projectWorkId)
        {
            var result = new MethodResponse<List<ProjectWorkAdmin>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _projectWorkAdminService.GetProjectWorksAdminByProjectWork(projectWorkId).ToList();
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/ProjectWorksAdminById")]
        [HttpGet]
        public MethodResponse<ProjectWorkAdmin> GetProjectWorkAdminById(int id)
        {
            var result = new MethodResponse<ProjectWorkAdmin> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _projectWorkAdminService.GetProjectWorkAdmin(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/ProjectWorkAdmin")]
        [HttpPost]
        public MethodResponse<ProjectWorkAdmin> Post(ProjectWorkAdmin model)
        {
            var result = new MethodResponse<ProjectWorkAdmin> { Code = 100, Message = "Success", Result = null };
            try
            {
                var find = _projectWorkAdminService.GetProjectWorksAdminByProjectWork(model.ProjectWorkId);

                var match = find.SingleOrDefault(x => x.EditorId == model.EditorId);
                if (match != null)
                {
                    throw new Exception("The editor was already record");
                }

                result.Result = _projectWorkAdminService.CreateProjectWorkAdmin(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/ProjectWorkAdmin")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                ProjectWorkAdmin pwa = new ProjectWorkAdmin();
                pwa.Id = id;
                _projectWorkAdminService.DeleteProjectWorkAdmin(pwa);
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
