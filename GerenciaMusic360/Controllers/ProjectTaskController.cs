using GerenciaMusic360.Entities;
using GerenciaMusic360.Entities.Models;
using GerenciaMusic360.Entities.ModelView;
using GerenciaMusic360.HubConfig;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using GerenciaMusic360.Common.Enum;
using Microsoft.Extensions.Configuration;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class ProjectTaskController : ControllerBase
    {
        private readonly IProjectService _projectService;
        private readonly IProjectTaskService _projectTaskService;
        private readonly IProjectStateService _projectState;
        private readonly ICalendarService _calendarService;
        private readonly IProjectTaskAutorizeService _projectTaskAutorizeService;
        private readonly IHostingEnvironment _env;
        private readonly IUserProfileService _userProfileService;
        private readonly ITemplateTaskDocumentDetailService _template;
        private readonly ILogger<ProjectTaskController> _logger;
        private readonly IHubContext<NotificationHub> _contextNotificationHub;
        private readonly INotificationWebService _notificationService;
        private readonly INotificationService _notification;
        private readonly IMailDispatcherService _mailDispatcherService;
        private readonly IConfiguration _configuration;
        private readonly IHelperService _helperService;

        public ProjectTaskController(
            IProjectService projectService,
            ICalendarService calendarService,
            IProjectStateService projectState,
            IProjectTaskService projectTaskService,
            IProjectTaskAutorizeService projectTaskAutorizeService,
            IHostingEnvironment env,
            IUserProfileService userProfileService,
            ILogger<ProjectTaskController> logger,
            IHubContext<NotificationHub> contextNotificationHub,
            INotificationWebService notificationService,
            ITemplateTaskDocumentDetailService template,
            INotificationService notificationEmailService,
            IMailDispatcherService mailDispatcherService,
            IConfiguration configuration,
            IHelperService helperService)
        {
            _projectService = projectService;
            _calendarService = calendarService;
            _projectState = projectState;
            _projectTaskService = projectTaskService;
            _projectTaskAutorizeService = projectTaskAutorizeService;
            _env = env;
            _userProfileService = userProfileService;
            _template = template;
            _logger = logger;
            _contextNotificationHub = contextNotificationHub;
            _notificationService = notificationService;
            _notification = notificationEmailService;
            _mailDispatcherService = mailDispatcherService;
            _configuration = configuration;
            _helperService = helperService;
        }

        [Route("api/ProjectTasks")]
        [HttpGet]
        public MethodResponse<List<ProjectTask>> Get(int projectId, int projectTypeId)
        {
            var result = new MethodResponse<List<ProjectTask>> { Code = 100, Message = "Success", Result = null };
            try
            {
                IEnumerable<ProjectTask> data = _projectTaskService.GetProjectTasks(projectId, projectTypeId);
                result.Result = ProcessProjectTask(data.ToList(), true);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
                _logger.LogError(ex, "ProjectTasksGet");
            }
            return result;
        }

        [Route("api/ProjectTasksByProject")]
        [HttpGet]
        public MethodResponse<List<ProjectTask>> GetByProject(int projectId)
        {
            var result = new MethodResponse<List<ProjectTask>> { Code = 100, Message = "Success", Result = null };
            try
            {
                IEnumerable<ProjectTask> data = _projectTaskService.GetProjectTaskByProject(projectId);
                result.Result = ProcessProjectTask(data.ToList());
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
                _logger.LogError(ex, "ProjectTasksByProject");
            }
            return result;
        }


        [Route("api/ProjectTask")]
        [HttpGet]
        public MethodResponse<ProjectTask> Get(int id)
        {
            var result = new MethodResponse<ProjectTask> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _projectTaskService.GetProjectTask(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
                _logger.LogError(ex, "ProjectTasksGet");
            }
            return result;
        }

        [Route("api/ProjectTasks")]
        [HttpPost]
        public MethodResponse<int> Post([FromBody] List<ProjectTask> model)
        {
            var result = new MethodResponse<int> { Code = 100, Message = "Success", Result = 0 };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                foreach (ProjectTask projectTask in model)
                {
                    projectTask.Created = DateTime.Now;
                    projectTask.Creator = userId;
                    projectTask.Completed = false;
                    projectTask.Status = true;
                    projectTask.EstimatedDateVerfication = DateTime.Parse(projectTask.EstimatedDateVerficationString);
                }

                IEnumerable<ProjectTask> projectTasks = _projectTaskService.CreateProjectTasks(model);

                SaveConfiguration(projectTasks.ToList());

            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = 0;
                _logger.LogError(ex, "ProjectTasks Post");
            }
            return result;
        }

        [Route("api/ProjectTasks")]
        [HttpPut]
        public MethodResponse<int> Put([FromBody] List<ProjectTask> model)
        {
            var result = new MethodResponse<int> { Code = 100, Message = "Success", Result = 0 };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                foreach (ProjectTask projectTask in model)
                {
                    ProjectTask projectTastLast = _projectTaskService.GetProjectTask(projectTask.Id);

                    projectTastLast.Modifier = userId;
                    projectTastLast.Modified = DateTime.Now;
                    projectTastLast.Notes = projectTask.Notes;
                    projectTastLast.ProjectIdRelation = projectTask.ProjectIdRelation;
                    projectTastLast.EstimatedDateVerfication = DateTime.Parse(projectTask.EstimatedDateVerficationString);

                    _projectTaskService.UpdateProjectTask(projectTastLast);
                    UpdateAutorizeRelation(projectTask);
                }
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = 0;
                _logger.LogError(ex, "ProjectTasks Put");
            }
            return result;
        }


        [Route("api/ProjectTask")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] ProjectTask model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                ProjectTask projectTast = _projectTaskService.GetProjectTask(model.Id);

                projectTast.Modifier = userId;
                projectTast.Modified = DateTime.Now;
                projectTast.Notes = model.Notes;
                projectTast.EstimatedDateVerfication = DateTime.Parse(model.EstimatedDateVerficationString);
                projectTast.TemplateTaskDocumentDetailName = model.TemplateTaskDocumentDetailName;

                _projectTaskService.UpdateProjectTask(projectTast);
                UpdateTemplate(projectTast);
                projectTast.Users = model.Users;
                UpdateAutorizeRelation(projectTast);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
                _logger.LogError(ex, "ProjectTasks put");
            }
            return result;
        }

        [Route("api/ProjectTaskComplete")]
        [HttpPost]
        public MethodResponse<bool> PostCheck(CheckTaskModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                ProjectTask projectTask = _projectTaskService.GetProjectTask(model.Id);

                IEnumerable<ProjectTask> projectTasks =
                   ProcessProjectTask(_projectTaskService.GetProjectTaskByProject(projectTask.ProjectId)
                   .ToList());

                int taskChecked = projectTasks.Where(w => w.Completed).Count();

                if (!string.IsNullOrWhiteSpace(projectTask.Notes))
                    model.Notes = model.Notes + projectTask.Notes;

                if (taskChecked == 0)
                    SetStateProject(projectTask.ProjectId, model.Notes, 3);
                else
                {
                    IEnumerable<ProjectTask> taskRequired = projectTasks.Where(w => w.Required);
                    if (taskRequired.Count() > 0)
                    {
                        short taskMax = projectTasks.Where(w => w.Required).Max(s => s.Position);
                        if (taskMax == projectTask.Position)
                            SetStateProject(projectTask.ProjectId, model.Notes, 4);
                    }
                    else
                        SetStateProject(projectTask.ProjectId, model.Notes, 4);
                }

                projectTask.Modified = DateTime.Now;
                projectTask.Modifier = userId;
                projectTask.Completed = true;

                _projectTaskService.UpdateProjectTask(projectTask);

                UserProfile user = _userProfileService.GetUserByUserId(userId);

                IEnumerable<Calendar> eventCalendar = _calendarService.GetCalendarByUser(user.Id, model.Id);
                foreach (Calendar calendar in eventCalendar)
                {
                    calendar.Checked = 1;
                    _calendarService.UpdateCalendarEvent(calendar);
                }

                ProjectTaskAutorize authorize = _projectTaskAutorizeService.GetByUserTask(user.Id, model.Id);
                if (authorize != null)
                {
                    authorize.VerificationDate = DateTime.Now;
                    authorize.Notes = model.Notes;
                    _projectTaskAutorizeService.UpdateTaskAutorize(authorize);
                }
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
                _logger.LogError(ex, "ProjectTaskComplete");
            }
            return result;
        }

        [Route("api/ProjectTaskUndoComplete")]
        [HttpPost]
        public MethodResponse<bool> UndoPostCheck(CheckTaskModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                ProjectTask projectTask = _projectTaskService.GetProjectTask(model.Id);

                IEnumerable<ProjectTask> projectTasks =
                   ProcessProjectTask(_projectTaskService.GetProjectTaskByProject(projectTask.ProjectId)
                   .ToList());

                projectTask.Modified = DateTime.Now;
                projectTask.Modifier = userId;
                projectTask.Completed = false;
                projectTask.Notes += model.Notes; 

                _projectTaskService.UpdateProjectTask(projectTask);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
                _logger.LogError(ex, "ProjectTaskUndoComplete");
            }
            return result;
        }

        [Route("api/ProjectTaskCommentary")]
        [HttpPost]
        public MethodResponse<bool> CommentaryCheck(CheckTaskModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                ProjectTask projectTask = _projectTaskService.GetProjectTask(model.Id);
                projectTask.Notes = model.Notes;

                _projectTaskService.UpdateProjectTask(projectTask);

                UserProfile user = _userProfileService.GetUserByUserId(userId);
                ProjectTaskAutorize authorize = _projectTaskAutorizeService.GetByUserTask(user.Id, model.Id);
                if (authorize != null)
                {
                    authorize.VerificationDate = DateTime.Now;
                    authorize.Notes = model.Notes;
                    _projectTaskAutorizeService.UpdateTaskAutorize(authorize);
                }
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
                _logger.LogError(ex, "ProjectTaskCommentary");
            }
            return result;
        }

        [Route("api/ProjectTasksPosition")]
        [HttpPost]
        public MethodResponse<int> PostPosition([FromBody] List<ProjectTask> model)
        {
            var result = new MethodResponse<int> { Code = 100, Message = "Success", Result = 0 };
            try
            {
                foreach (ProjectTask projectTask in model)
                {
                    ProjectTask currentProjectTask = _projectTaskService.GetProjectTask(projectTask.Id);
                    currentProjectTask.Position = projectTask.Position;
                    _projectTaskService.UpdateProjectTask(currentProjectTask);
                }
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = 0;
                _logger.LogError(ex, "ProjectTasksPosition");
            }
            return result;
        }


        [Route("api/ProjectTasksActive")]
        [HttpGet]
        public MethodResponse<List<ProjectTask>> GetByProjectActive(int projectId)
        {
            var result = new MethodResponse<List<ProjectTask>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _projectTaskService.GetByProjectActive(projectId)
                    .ToList();
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
                _logger.LogError(ex, "ProjectTasksActive");
            }
            return result;
        }

        [Route("api/ProjectTasksByTemplateTaskDocumentDetailId")]
        [HttpGet]
        public MethodResponse<ProjectTask> GetByTemplateTaskDocumentDetailId(int templateTaskId)
        {
            var result = new MethodResponse<ProjectTask> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _projectTaskService.GetByTemplateTaskDocumentDetailId(templateTaskId);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
                _logger.LogError(ex, "ProjectTasksActive");
            }
            return result;
        }

        private void SetStateProject(int projectId, string notes, short status)
        {
            string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
            UserProfile userProfile = _userProfileService.GetUserByUserId(userId);

            _projectState.Create(new ProjectState
            {
                StatusProjectId = status,
                Date = DateTime.Now,
                Created = DateTime.Now,
                Creator = userId,
                Notes = notes ?? "",
                ProjectId = projectId,
                ApproverUserId = userProfile.Id
            });
        }

        private void SaveConfiguration(List<ProjectTask> projectTasks)
        {
            List<ConfigurationTaskAutorize> authorize = new List<ConfigurationTaskAutorize>();
            projectTasks.ForEach(f => authorize.AddRange(f.Users));
            IEnumerable<long> usersIdsGobal = authorize.Select(s => s.UserProfileId)
                                  .Distinct();

            string usersIds = string.Join(",", usersIdsGobal);

            List<UserProfile> userProfiles = _userProfileService
                .GetUserProfilesByIds(usersIds)
                .ToList();

            SaveEvents(projectTasks, userProfiles);
            SaveAuthorize(projectTasks, userProfiles);
            CreateNotificationWeb(projectTasks);
        }

        private void SaveEvents(List<ProjectTask> projectTasks, List<UserProfile> userProfiles)
        {
            Project project = _projectService.GetProject(projectTasks.First().ProjectId);
            List<Calendar> events = new List<Calendar>();

            foreach (ProjectTask projectTask in projectTasks)
            {
                List<long> usersProfileIds = projectTask.Users.Select(s => s.UserProfileId).ToList();

                IEnumerable<UserProfile> users = userProfiles
                               .Where(w => usersProfileIds.Contains((int)w.Id));

                events.AddRange(
                                users
                               .Select(s => new Calendar
                               {
                                   AllDay = 1,
                                   Checked = 0,
                                   StatusRecordId = 1,
                                   Created = projectTask.Created,
                                   Creator = projectTask.Creator,
                                   PersonId = Convert.ToInt32(s.Id),
                                   StartDate = projectTask.EstimatedDateVerfication,
                                   EndDate = projectTask.EstimatedDateVerfication,
                                   Title = $"Seguimiento proyecto ({project.Name}), tarea ({projectTask.TemplateTaskDocumentDetailName})",
                                   ProjectTaskId = projectTask.Id,
                                   ProjectTaskIsMember = false,
                                   ModuleId = 1
                               }).ToList());
            }
            _calendarService.CreateCalendarEvents(events);

        }

        private void SaveAuthorize(List<ProjectTask> projectTasks, List<UserProfile> userProfiles)
        {
            List<ProjectTaskAutorize> authorize = new List<ProjectTaskAutorize>();
            foreach (ProjectTask projectTask in projectTasks)
            {
                List<long> usersIds = projectTask.Users.Select(s => s.UserProfileId).ToList();

                authorize.AddRange(userProfiles.Where(w => usersIds.Contains(w.Id))
                             .Select(s => new ProjectTaskAutorize
                             {                                 
                                 ProjectTaskId = projectTask.Id,
                                 UserId = Convert.ToInt32(s.Id)
                             }).ToList());
            }
            _projectTaskAutorizeService.CreateProjectTaskAutorizes(authorize);
        }

        private List<ProjectTask> ProcessProjectTask(List<ProjectTask> data, bool loadDefaultUser = false)
        {
            IEnumerable<int> configurationIds = data.Select(s => s.TemplateTaskDocumentDetailId)
                                  .Distinct();

            List<ProjectTask> model = new List<ProjectTask>();

            foreach (int configurationId in configurationIds)
            {
                ProjectTask configurationTask = data
                    .FirstOrDefault(w => w.TemplateTaskDocumentDetailId == configurationId);

                bool completed = data
                    .Where(w => w.Id == configurationTask.Id & w.Completed)
                    .Count() > 0;

                string notes = data
                   .FirstOrDefault(w => w.Id == configurationTask.Id & w.Notes != null & w.Completed)
                   ?.Notes;
                List<ConfigurationTaskAutorize> users;
                if (loadDefaultUser)
                {
                    users = data
                        .Where(w => w.TemplateTaskDocumentDetailId == configurationTask.TemplateTaskDocumentDetailId)
                        .Select(s => new ConfigurationTaskAutorize
                        {
                            Id = s.Id,
                            UserProfileAuthorized = s.UserProfileAuthorized,
                            UserProfileId = s.UserProfileId,
                            UserProfileName = s.UserProfileName,
                            DepartmentId = s.DepartmentId.GetValueOrDefault(),
                            DepartmentName = s.DepartmentName
                        }).ToList();
                }                    
                else 
                {
                    users = _projectTaskAutorizeService.GetProjectTaskAutorizeByProjectTaskId(configurationTask.Id)
                       .Select(s => new ConfigurationTaskAutorize
                       {
                           Id = s.Id,
                           UserProfileAuthorized = true,
                           UserProfileId = s.UserId,
                           UserProfileName = s.UserProfileName,
                           DepartmentId = 0,
                           DepartmentName = string.Empty
                       }).ToList();
                };

                model.Add(new ProjectTask
                {
                    Id = configurationTask.Id,
                    ProjectId = configurationTask.ProjectId,
                    Position = configurationTask.Position,
                    Notes = configurationTask.Notes,
                    Required = configurationTask.Required,
                    EstimatedDateVerficationString = configurationTask.EstimatedDateVerficationString,
                    TemplateTaskDocumentId = configurationTask.TemplateTaskDocumentId,
                    TemplateTaskDocumentName = configurationTask.TemplateTaskDocumentName,
                    TemplateTaskDocumentDetailId = configurationTask.TemplateTaskDocumentDetailId,
                    TemplateTaskDocumentDetailName = configurationTask.TemplateTaskDocumentDetailName,
                    Completed = completed,
                    ConfigurationTaskId = configurationTask.ConfigurationTaskId,
                    Created = configurationTask.Created,
                    Creator = configurationTask.Creator,
                    Modified = configurationTask.Modified,
                    Modifier = configurationTask.Modifier,
                    EstimatedDateVerfication = configurationTask.EstimatedDateVerfication,
                    Users = users
                });
            }
            return model;
        }

        private void UpdateTemplate(ProjectTask task)
        {
            TemplateTaskDocumentDetail template = _template.GetTemplate(task.TemplateTaskDocumentDetailId);
            template.Name = task.TemplateTaskDocumentDetailName;
            _template.UpdateTemplate(template);
        }

        private void UpdateAutorizeRelation(ProjectTask projectTask) {
            IEnumerable<Calendar> events = _calendarService.GetCalendarByProjectTask(projectTask.Id);
            if (events.Count() > 0) {
                _calendarService.DeleteEvents(events);
            }

            IEnumerable<ProjectTaskAutorize> autorizes = _projectTaskAutorizeService.GetProjectTaskAutorizeByProjectTaskId(projectTask.Id);
            if (autorizes.Count() > 0) {
                _projectTaskAutorizeService.DeleteAll(autorizes);
            }
            List<ProjectTask> projectTasks = new List<ProjectTask>();
            projectTasks.Add(projectTask);
            SaveConfiguration(projectTasks);
        }



        private void CreateNotificationWeb(List<ProjectTask> projectTasks)
        {
            string message = string.Empty;
            string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
            Project project = _projectService.GetProject(projectTasks.First().ProjectId);
            foreach (ProjectTask projectTask in projectTasks)
            {
                List<long> usersProfileIds = projectTask.Users.Select(s => s.UserProfileId).ToList();

                if (usersProfileIds.Count > 0)
                {
                    message = $"Has sido asignado(a) a la tarea {projectTask.TemplateTaskDocumentDetailName} del proyecto {project.Name}";


                    List<NotificationWeb> notifications = new List<NotificationWeb>(0);
                    foreach (var user in projectTask.Users)
                    {
                        if (user.UserProfileId != 0)
                        {
                            NotificationWeb notification = new NotificationWeb();
                            notification.Message = message;
                            notification.Active = true;
                            notification.Created = DateTime.Now;
                            notification.Creator = userId;
                            notification.UserId = user.UserProfileId;
                            notification.TaskId = projectTask.Id;
                            notifications.Add(notification);
                        }
                        
                    }

                    _notificationService.Create(notifications);

                    List<long> usersToNotificate = new List<long>(0);
                    foreach (var user in usersProfileIds)
                    {
                        if (user != 0)
                        {
                            usersToNotificate.Add(user);
                        }
                    }
                    SendAlertNotificationWeb(usersToNotificate);
                    /* Enviar Email de notificación */
                    Notification template = _notification.GetNotification(NotificationType.NewTask);
                    Project theProject = _projectService.GetProject(projectTask.ProjectId);
                    List<ReplaceModel> replaces = new List<ReplaceModel>()
                    {
                        new ReplaceModel {  Key="projectName", Value =$"{theProject.Name}" },
                        new ReplaceModel {  Key="taskName", Value =$"{projectTask.TemplateTaskDocumentDetailName}" },
                        new ReplaceModel {  Key="taskDate", Value =$"{projectTask.EstimatedDateVerfication.ToString("MM/dd/yyyy")}" }
                    };
                    string body = _mailDispatcherService.ReplaceTag(template.HtmlBody, replaces);

                    string display = _configuration.GetValue<string>("Display");

                    foreach (var user in projectTask.Users)
                    {
                        if (user.UserProfileId != 0)
                        {
                            var theUser = _userProfileService.GetUserProfile(user.UserProfileId);
                            _helperService.SendEmail(
                                GetMailConfig(),
                                $"{template.Subject} {display}",
                                body,
                                new List<string> { theUser.Email }
                            );
                        }
                    }
                }
            }
        }

        private async void SendAlertNotificationWeb(List<long> ids)
        {
            await _contextNotificationHub.Clients.All.SendAsync("SignalMessageReceived", new SignalResponse
            {
                Message = "you have a task assign",
                UsersIds = ids
            });
        }

        private MailConfig GetMailConfig()
        {
            return new MailConfig
            {
                Display = _configuration.GetValue<string>("Display"),
                EnableSSL = _configuration.GetValue<bool>("EnableSSL"),
                Host = _configuration.GetValue<string>("HostEmail"),
                UserName = _configuration.GetValue<string>("Email"),
                Password = _configuration.GetValue<string>("Password"),
                Port = _configuration.GetValue<int>("Port")
            };
        }
    }
}
