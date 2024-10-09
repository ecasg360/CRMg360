using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class TemplateTDDController : ControllerBase
    {
        private readonly ITemplateTaskDocumentDetailService _templateService;
        private readonly IProjectTaskAutorizeService _pTaskAutorizeService;
        private readonly IProjectTaskService _projectTaskService;
        private readonly IConfigurationTaskService _configurationTaskService;
        private readonly ICTaskAutorizeService _cTaskAuthorizeService;

        public TemplateTDDController(
             ITemplateTaskDocumentDetailService templateService,
             IProjectTaskAutorizeService pTaskAutorizeService,
             IProjectTaskService projectTaskService,
             IConfigurationTaskService configurationTaskService,
             ICTaskAutorizeService cTaskAuthorizeService)
        {
            _templateService = templateService;
            _pTaskAutorizeService = pTaskAutorizeService;
            _projectTaskService = projectTaskService;
            _configurationTaskService = configurationTaskService;
            _cTaskAuthorizeService = cTaskAuthorizeService;
        }

        [Route("api/TemplateTaskDocumentDetail")]
        [HttpPost]
        public MethodResponse<TemplateTaskDocumentDetail> Post([FromBody] TemplateTaskDocumentDetail model)
        {
            var result = new MethodResponse<TemplateTaskDocumentDetail> { Code = 100, Message = "Success", Result = null };
            try
            {
                int id = _templateService.GetNewTTDDIdPosition("Id", model.TemplateTaskDocumentId).Id;
                int position = _templateService.GetNewTTDDIdPosition("Position", model.TemplateTaskDocumentId).Id;

                result.Result = _templateService.CreateTemplate(model);
                AdjustPositionProjectTask(model.ProjectId, model.Position);
                SaveProjectTask(result.Result);

                if (model.IsPermanent)
                    SaveConfigurationTask(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/TemplateTaskDocumentDetail")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] TemplateTaskDocumentDetail model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                TemplateTaskDocumentDetail template = _templateService.GetTemplate(model.Id);
                template.Name = model.Name;

                _templateService.UpdateTemplate(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/TemplateTaskDocumentDetail")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                TemplateTaskDocumentDetail template = _templateService.GetTemplate(id);
                _templateService.DeleteTemplate(template);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        private void SaveConfigurationTask(TemplateTaskDocumentDetail model)
        {
            int position = _configurationTaskService.GetNewCTIdPosition(model.EntityId);
            ConfigurationTask result = _configurationTaskService
                .CreateConfigurationTasks(new ConfigurationTask
                {
                    ConfigurationId = 1,
                    EntityTypeId = model.EntityId,
                    TemplateTaskDocumentDetailId = model.Id,
                    Active = true,
                    Position = (short)position,
                    ModuleId = 1
                });

            SaveConfigurationTaskAuthorize(model.UsersAuthorize, result.Id);
        }

        private void SaveProjectTask(TemplateTaskDocumentDetail model)
        {
            string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

            ProjectTask projectTask = _projectTaskService.CreateProjectTask(new ProjectTask
            {
                Completed = false,
                TemplateTaskDocumentDetailId = model.Id,
                EstimatedDateVerfication = DateTime.Parse(model.EstimatedDateVerficationString),
                Created = DateTime.Now,
                Creator = userId,
                Required = model.Required,
                Status = true,
                Position = model.Position,
                ProjectId = model.ProjectId
            });

            SaveProjectTaskAuthorize(model.UsersAuthorize, projectTask.Id);
        }

        private void SaveProjectTaskAuthorize(List<long> usersAuthorize, int projectTaskId)
        {
            List<ProjectTaskAutorize> pTaskAuthorizes = new List<ProjectTaskAutorize>();
            foreach (long user in usersAuthorize)
            {
                pTaskAuthorizes.Add(new ProjectTaskAutorize
                {
                    ProjectTaskId = projectTaskId,
                    UserId = (int)user
                });
            }
            _pTaskAutorizeService.CreateProjectTaskAutorizes(pTaskAuthorizes);
        }

        private void SaveConfigurationTaskAuthorize(List<long> usersAuthorize, int ConfigurationTaskId)
        {
            List<ConfigurationTaskAutorize> cTaskAuthorizes = new List<ConfigurationTaskAutorize>();
            foreach (long user in usersAuthorize)
            {
                cTaskAuthorizes.Add(new ConfigurationTaskAutorize
                {
                    ConfigurationTaskId = ConfigurationTaskId,
                    UserProfileId = user,
                    Active = true
                });
            }
            _cTaskAuthorizeService.CreateCTasksAutorizes(cTaskAuthorizes);
        }

        private void AdjustPositionProjectTask(int projectId, short position)
        {
            IEnumerable<ProjectTask> projectTasks =
                _projectTaskService.GetProjectTasksByPosition(projectId, position);

            foreach (ProjectTask projectTask in projectTasks)
            {
                projectTask.Position += 1;
                _projectTaskService.UpdateProjectTask(projectTask);
            }
        }
    }
}