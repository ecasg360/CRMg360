using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class ProjectBudgetDetailController : ControllerBase
    {
        private readonly IProjectBudgetService _projectBudgetService;
        private readonly IProjectBudgetDetailService _projectBudgetDetailService;
        private readonly IProjectService _projectService;
        public ProjectBudgetDetailController(
            IProjectBudgetService projectBudgetService,
            IProjectBudgetDetailService projectBudgetDetailService,
            IProjectService projectService)
        {
            _projectBudgetService = projectBudgetService;
            _projectBudgetDetailService = projectBudgetDetailService;
            _projectService = projectService;
        }

        [Route("api/ProjectBudgetDetails")]
        [HttpGet]
        public MethodResponse<List<ProjectBudgetDetail>> GetByProjectBudget(int projectBudgetId)
        {
            var result = new MethodResponse<List<ProjectBudgetDetail>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _projectBudgetDetailService.GetAllBudgetDetails(projectBudgetId)
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

        [Route("api/ProjectBudgetDetail")]
        [HttpGet]
        public MethodResponse<ProjectBudgetDetail> Get(int id)
        {
            var result = new MethodResponse<ProjectBudgetDetail> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _projectBudgetDetailService.GetProjectBudgetDetail(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/ProjectBudgetDetail")]
        [HttpPost]
        public MethodResponse<ProjectBudgetDetail> Post([FromBody] ProjectBudgetDetail model)
        {
            var result = new MethodResponse<ProjectBudgetDetail> { Code = 100, Message = "Success", Result = null };
            try
            {
                model.Date = DateTime.Parse(model.DateString);
                result.Result = _projectBudgetDetailService.CreateProjectBudgetDetail(model);

                ProjectBudget projectBudget = _projectBudgetService.GetProjectBudget(model.ProjectBudgetId);
                projectBudget.Spent += model.Spent;
                _projectBudgetService.UpdateProjectBudget(projectBudget);

                Project project = _projectService.GetProject(projectBudget.ProjectId);
                project.BudgetSpent += model.Spent;
                _projectService.Update(project);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/ProjectBudgetDetail")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] ProjectBudgetDetail model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                ProjectBudgetDetail projectBudgetDetail =
                    _projectBudgetDetailService.GetProjectBudgetDetail(model.Id);

                decimal lastSpend = projectBudgetDetail.Spent;

                projectBudgetDetail.ProjectBudgetId = model.ProjectBudgetId;
                projectBudgetDetail.CategoryId = model.CategoryId;
                projectBudgetDetail.Spent = model.Spent;
                projectBudgetDetail.Notes = model.Notes;
                projectBudgetDetail.Date = DateTime.Parse(model.DateString);

                _projectBudgetDetailService.UpdateProjectBudgetDetail(projectBudgetDetail);


                ProjectBudget projectBudget = _projectBudgetService.GetProjectBudget(model.ProjectBudgetId);
                projectBudget.Spent = (projectBudget.Spent - lastSpend) + model.Spent;
                _projectBudgetService.UpdateProjectBudget(projectBudget);

                Project project = _projectService.GetProject(projectBudget.ProjectId);
                project.BudgetSpent = (project.BudgetSpent - lastSpend) + model.Spent;
                _projectService.Update(project);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/ProjectBudgetDetail")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                ProjectBudgetDetail projectBudgetDetail = _projectBudgetDetailService.GetProjectBudgetDetail(id);

                _projectBudgetDetailService.DeleteProjectBudgetDetail(projectBudgetDetail);

                ProjectBudget projectBudget = _projectBudgetService.GetProjectBudget(projectBudgetDetail.ProjectBudgetId);
                projectBudget.Spent -= projectBudgetDetail.Spent;
                _projectBudgetService.UpdateProjectBudget(projectBudget);

                Project project = _projectService.GetProject(projectBudget.ProjectId);
                project.BudgetSpent -= projectBudgetDetail.Spent;
                _projectService.Update(project);
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