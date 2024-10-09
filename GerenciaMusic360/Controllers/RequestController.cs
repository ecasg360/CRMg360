using GerenciaMusic360.Entities;
using GerenciaMusic360.Entities.Models;
using GerenciaMusic360.Entities.ModelView;
using GerenciaMusic360.HubConfig;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using GerenciaMusic360.Common.Enum;
using Microsoft.Extensions.Configuration;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class RequestController : ControllerBase
    {
        private readonly IRequestService _requestService;
        private readonly IUserProfileService _userService;
        private readonly IHubContext<NotificationHub> _contextNotificationHub;
        private readonly INotificationWebService _notificationService;
        private readonly IModuleService _moduleService;
        private readonly IProjectTaskService _taskService;
        private readonly IMarketingPlanService _planService;
        private readonly ITemplateTaskDocumentDetailService _templateService;
        private readonly INotificationService _notification;
        private readonly IMailDispatcherService _mailDispatcherService;
        private readonly IProjectService _projectService;
        private readonly IConfiguration _configuration;
        private readonly IHelperService _helperService;
        private readonly IProjectTaskAutorizeService _projectTaskAutorizeService;

        public RequestController(
            IRequestService requestService,
            IUserProfileService userService,
            IHubContext<NotificationHub> contextNotificationHub,
            INotificationWebService notificationService,
            IModuleService moduleService,
            IProjectTaskService taskService,
            IMarketingPlanService planService,
            ITemplateTaskDocumentDetailService templateService,
            INotificationService notificationEmailService,
            IMailDispatcherService mailDispatcherService,
            IProjectService projectService,
            IConfiguration configuration,
            IHelperService helperService,
            IProjectTaskAutorizeService projectTaskAutorizeService
            )
        {
            _requestService = requestService;
            _userService = userService;
            _contextNotificationHub = contextNotificationHub;
            _notificationService = notificationService;
            _moduleService = moduleService;
            _taskService = taskService;
            _planService = planService;
            _templateService = templateService;
            _notification = notificationEmailService;
            _mailDispatcherService = mailDispatcherService;
            _projectService = projectService;
            _configuration = configuration;
            _helperService = helperService;
            _projectTaskAutorizeService = projectTaskAutorizeService;
        }

        [Route("api/Requests")]
        [HttpGet]
        public MethodResponse<List<Request>> Get()
        {
            var result = new MethodResponse<List<Request>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _requestService.GetRequests()
                    .ToList();

                foreach (Request request in result.Result)
                {
                    if (request.UsersString != null)
                        request.Users = request.UsersString.Split(',').Select(long.Parse).ToList();
                }
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/RequestsByTask")]
        [HttpGet]
        public MethodResponse<List<Request>> GetByTask(int taskId)
        {
            var result = new MethodResponse<List<Request>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _requestService.GetRequestsByTask(taskId)
                    .ToList();

                foreach (Request request in result.Result)
                {
                    if (request.UsersString != null)
                        request.Users = request.UsersString.Split(',').Select(long.Parse).ToList();
                }
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/RequestsByModule")]
        [HttpGet]
        public MethodResponse<List<Request>> GetByModule(int moduleId)
        {
            var result = new MethodResponse<List<Request>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _requestService.GetRequestsByModule(moduleId)
                    .ToList();

                foreach (Request request in result.Result)
                {
                    if (request.UsersString != null)
                        request.Users = request.UsersString.Split(',').Select(long.Parse).ToList();
                }
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/RequestsByModuleTask")]
        [HttpGet]
        public MethodResponse<List<Request>> GetByModuleTask(int moduleId, int taskId)
        {
            var result = new MethodResponse<List<Request>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _requestService.GetRequestsByModuleTask(moduleId, taskId)
                    .ToList();

                foreach (Request request in result.Result)
                {
                    if (request.UsersString != null)
                        request.Users = request.UsersString.Split(',').Select(long.Parse).ToList();
                }
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/Request")]
        [HttpGet]
        public MethodResponse<Request> Get(int id)
        {
            var result = new MethodResponse<Request> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _requestService.GetRequest(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/Request")]
        [HttpPost]
        public MethodResponse<int> Post([FromBody] Request model)
        {
            var result = new MethodResponse<int> { Code = 100, Message = "Success", Result = 0 };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                UserProfile user = _userService.GetUserByUserId(userId);

                model.Created = DateTime.Now;
                model.Creator = userId;
                model.StatusModuleId = 16;
                model.TransmitterId = user.Id;
                if (model.Users.Count > 0)
                    model.UsersString = string.Join(",", model.Users.Select(s => s.ToString()).ToArray());

                result.Result = _requestService.CreateRequest(model).Id;
                CreateNotificationWeb(model);

                if (model.Users.Count() > 0)
                    SendAlertNotificationWeb(model.Users);

                // Enviar notificación por email
                Notification template = _notification.GetNotification(NotificationType.NewComment);
                ProjectTask projectTask = _taskService.GetProjectTask(model.TaskId.Value);
                Project project = _projectService.GetProject(projectTask.ProjectId);
                TemplateTaskDocumentDetail taskDetail = _templateService.GetTemplate(projectTask.TemplateTaskDocumentDetailId);

                IEnumerable<ProjectTaskAutorize> projectAutorizes = _projectTaskAutorizeService.GetProjectTaskAutorizeByProjectTaskId(projectTask.Id);

                string url = _configuration.GetValue<string>("URL");
                var theLink = $"{url}/projects/manage/{project.Id}";

                List<ReplaceModel> replaces = new List<ReplaceModel>()
                    {
                        new ReplaceModel {  Key="projectName", Value =$"{project.Name}" },
                        new ReplaceModel {  Key="taskName", Value =$"{taskDetail.Name}" },
                        new ReplaceModel {  Key="taskComment", Value =$"{model.Commentary}" },
                        new ReplaceModel {  Key="commentDate", Value =$"{DateTime.Now.ToString("MM/dd/yyyy")}" },
                        new ReplaceModel {  Key="Code", Value =$"{theLink}" }
                    };
                string body = _mailDispatcherService.ReplaceTag(template.HtmlBody, replaces);

                string display = _configuration.GetValue<string>("Display");

                foreach (var currentUser in model.Users)
                {
                    if (currentUser != 0)
                    {
                        var theUser = _userService.GetUserProfile(currentUser);
                        _helperService.SendEmail(
                            GetMailConfig(),
                            $"{template.Subject} {display}",
                            body,
                            new List<string> { theUser.Email }
                        );
                    }
                }

                foreach (var pAutorize in projectAutorizes)
                {
                    var exists = false;
                    foreach (var currentUser in model.Users)
                    {
                        if (currentUser == pAutorize.UserId)
                        {
                            exists = true;
                        }
                    }
                    if (!exists)
                    {
                        var theUser = _userService.GetUserProfile(pAutorize.UserId);
                        _helperService.SendEmail(
                            GetMailConfig(),
                            $"{template.Subject} {display}",
                            body,
                            new List<string> { theUser.Email }
                        );
                    }
                }

            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = 0;
            }
            return result;
        }

        [Route("api/Request")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] Request model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Request request = _requestService.GetRequest(model.Id);

                request.Commentary = model.Commentary;
                request.Modified = DateTime.Now;
                request.Modifier = userId;
                if (model.Users.Count > 0)
                    request.UsersString = string.Join(",", model.Users.Select(s => s.ToString()).ToArray());
                else
                    request.UsersString = null;

                _requestService.UpdateRequest(request);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/RequestStatus")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody]StatusUpdateModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Request request = _requestService.GetRequest(Convert.ToInt32(model.Id));
                request.StatusModuleId = model.Status;
                request.Modified = DateTime.Now;
                request.Modifier = userId;

                _requestService.UpdateRequest(request);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        private void CreateNotificationWeb(Request model)
        {
            string message = string.Empty;
            UserProfile user = _userService.GetUserProfile(model.TransmitterId);
            string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

            message = $"{user.Name} {user.LastName} te ha mencionado en los comentarios ";

            if (model.TaskId != null)
            {
                if (model.ModuleId != null)
                {
                    switch (model.ModuleId)
                    {
                        case 9:
                            ProjectTask task = _taskService.GetProjectTask((int)model.TaskId);
                            message += $"de la tarea {task.TemplateTaskDocumentDetailName} ";
                            break;

                        case 10:
                            MarketingPlan marketingPlan = _planService.Get((int)model.TaskId);
                            TemplateTaskDocumentDetail template = _templateService.GetTemplate(marketingPlan.TaskDocumentDetailId);
                            message += $"de la tarea {template.Name} ";
                            break;
                    }
                }
            }

            if (model.ModuleId != null)
            {
                Module module = _moduleService.GetModule((int)model.ModuleId);
                message += $"en el módulo {module.Name}";
            }

            if (model.TaskId == null & model.ModuleId == null)
                message += "generales";

            _notificationService.Create(model.Users.Select(s => new NotificationWeb
            {
                Message = message,
                Active = true,
                Created = DateTime.Now,
                Creator = userId,
                UserId = s
            }).ToList());
        }

        private async void SendAlertNotificationWeb(List<long> ids)
        {
            await _contextNotificationHub.Clients.All.SendAsync("SignalMessageReceived", new SignalResponse
            {
                Message = "you have a mention in comment",
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