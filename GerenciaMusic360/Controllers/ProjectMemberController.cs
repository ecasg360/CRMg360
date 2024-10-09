using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class ProjectMemberController : ControllerBase
    {
        private readonly IProjectService _projectService;
        private readonly IUserMemberProjectService _userMemberProjectService;
        private readonly IProjectMemberService _projectMemberService;
        private readonly ICalendarService _calendarService;
        private readonly IProjectTaskService _projectTaskService;

        public ProjectMemberController(
            IProjectService projectService,
            IUserMemberProjectService userMemberProjectService,
            IProjectMemberService projectMemberService,
            ICalendarService calendarService,
            IProjectTaskService projectTaskService
            )
        {
            _projectService = projectService;
            _userMemberProjectService = userMemberProjectService;
            _projectMemberService = projectMemberService;
            _calendarService = calendarService;
            _projectTaskService = projectTaskService;
        }

        [Route("api/ProjectMembers")]
        [HttpGet]
        public MethodResponse<List<UserMemberProject>> Get()
        {
            var result = new MethodResponse<List<UserMemberProject>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _userMemberProjectService.GetAllMemberProjects()
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

        [Route("api/ProjectMembersByProject")]
        [HttpGet]
        public MethodResponse<List<UserMemberProject>> Get(int projectId)
        {
            var result = new MethodResponse<List<UserMemberProject>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _userMemberProjectService.GetAllMemberProjects(projectId)
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

        [Route("api/ProjectMemberRelation")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] ProjectMember model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                _projectMemberService.CreateProjectMember(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/ProjectMemberRelations")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] List<ProjectMember> model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                IEnumerable<ProjectMember> projectMembers = _projectMemberService.CreateProjectMembers(model);

                SaveEvents(projectMembers);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/ProjectMemberRelation")]
        [HttpPut]
        public MethodResponse<bool> Put(ProjectMember model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                ProjectMember projectMember = _projectMemberService.GetProjectMember(model.ProjectId, model.UserId);
                projectMember.ProjectRoleId = model.ProjectRoleId;

                _projectMemberService.UpdateProjectMember(projectMember);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        //[Route("api/ProjectMemberRelationOwner")]
        //[HttpPost]
        //public MethodResponse<bool> PostOwner(ProjectMember model)
        //{
        //    var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
        //    try
        //    {
        //        _projectMemberService.UpdateProjectMemberOwner(model);
        //    }
        //    catch (Exception ex)
        //    {
        //        result.Message = ex.Message;
        //        result.Code = -100;
        //        result.Result = false;
        //    }
        //    return result;
        //}

        [Route("api/ProjectMemberRelation")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int projectId, long userId)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                ProjectMember projectMember = _projectMemberService.GetProjectMember(projectId, userId);
                _projectMemberService.DeleteProjectMember(projectMember);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        private void SaveEvents(IEnumerable<ProjectMember> projecMembers)
        {
            Project project = _projectService.GetProject(projecMembers.First().ProjectId);
            IEnumerable<ProjectTask> projectTasks =
                _projectTaskService.GetProjectTaskByProject(projecMembers.FirstOrDefault().ProjectId);

            List<Calendar> events = new List<Calendar>();
            foreach (ProjectTask projectTask in projectTasks)
            {
                foreach (ProjectMember projecMember in projecMembers)
                {
                    events.Add(new Calendar
                    {
                        AllDay = 1,
                        Checked = 0,
                        StatusRecordId = 1,
                        Created = projectTask.Created,
                        Creator = projectTask.Creator,
                        PersonId = Convert.ToInt32(projecMember.UserId),
                        StartDate = DateTime.Now,
                        EndDate = projectTask.EstimatedDateVerfication,
                        Title = $"Seguimiento - Proyecto {project.Name}",
                        ProjectTaskId = projectTask.Id,
                        ProjectTaskIsMember = true,
                        ModuleId = 1
                    });
                }
            }

            _calendarService.CreateCalendarEvents(events);
        }
    }
}