using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class TemplateTaskDetailsController : ControllerBase
    {

        private readonly ITemplateTaskDocumentDetailService _templateTaskDocumentDetailsService;

        public TemplateTaskDetailsController(ITemplateTaskDocumentDetailService templateTaskDocumentDetailsService)
        {
            _templateTaskDocumentDetailsService = templateTaskDocumentDetailsService;
        }

        [Route("api/TemplateTaskDetailByProjectType")]
        [HttpGet]
        public MethodResponse<List<TemplateTaskDocumentDetail>> GetByProjectType(int projectTypeId)
        {
            var result = new MethodResponse<List<TemplateTaskDocumentDetail>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _templateTaskDocumentDetailsService.getByProjectType(projectTypeId)
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

        [Route("api/TemplateTaskDetailByTemplateTask")]
        [HttpGet]
        public MethodResponse<List<TemplateTaskDocumentDetail>> GetByTemplateTask(int templateTaskId)
        {
            var result = new MethodResponse<List<TemplateTaskDocumentDetail>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _templateTaskDocumentDetailsService.getByTemplateTask(templateTaskId)
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
    }
}
