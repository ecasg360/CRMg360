using GerenciaMusic360.Entities;
using GerenciaMusic360.Entities.Models;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using GerenciaMusic360.Common.Enum;
using Microsoft.Extensions.Configuration;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class TrackController : ControllerBase
    {
        private readonly ITrackService _TrackService;
        private readonly INotificationService _notification;
        private readonly IProjectService _projectService;
        private readonly IMailDispatcherService _mailDispatcherService;
        private readonly IConfiguration _configuration;
        private readonly IUserProfileService _userProfileService;
        private readonly IHelperService _helperService;
        public TrackController(
            ITrackService TrackService,
            INotificationService notificationEmailService,
            IProjectService projectService,
            IMailDispatcherService mailDispatcherService,
            IConfiguration configuration,
            IUserProfileService userProfileService,
            IHelperService helperService
        )
        {
            _TrackService = TrackService;
            _notification = notificationEmailService;
            _projectService = projectService;
            _mailDispatcherService = mailDispatcherService;
            _configuration = configuration;
            _userProfileService = userProfileService;
            _helperService = helperService;
        }

        [Route("api/Tracks")]
        [HttpGet]
        public MethodResponse<List<Track>> Get()
        {
            var result = new MethodResponse<List<Track>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _TrackService.GetAll()
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

        [Route("api/Track")]
        [HttpGet]
        public MethodResponse<Track> Get(int id)
        {
            var result = new MethodResponse<Track> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _TrackService.Get(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/TracksByWork")]
        [HttpGet]
        public MethodResponse<List<Track>> GetByWork(int workId)
        {
            var result = new MethodResponse<List<Track>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _TrackService.GetAllByWork(workId)
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

        [Route("api/TracksByProject")]
        [HttpGet]
        public MethodResponse<List<Track>> GetByProject(int projectId)
        {
            var result = new MethodResponse<List<Track>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _TrackService.GetAllByProject(projectId)
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

        [Route("api/TracksByProjectAndWork")]
        [HttpGet]
        public MethodResponse<Track> GetByProjectAndWork(int projectId, int workId)
        {
            var result = new MethodResponse<Track> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _TrackService.GetAllByProjectAndWork(projectId, workId);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }


        [Route("api/Track")]
        [HttpPost]
        public MethodResponse<Track> Post([FromBody] Track model)
        {
            var result = new MethodResponse<Track> { Code = 100, Message = "Success", Result = null };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                model.Created = DateTime.Now;
                model.Creator = userId;
                model.StatusRecordId = 1;
                result.Result = _TrackService.Create(model);

                /* Enviar Email de notificación de nuevo track */
                Notification template = _notification.GetNotification(NotificationType.NewTrack);
                Project theProject = _projectService.GetProject(model.ProjectId);
                List<ReplaceModel> replaces = new List<ReplaceModel>()
                    {
                        new ReplaceModel {  Key="projectName", Value =$"{theProject.Name}" },
                        new ReplaceModel {  Key="trackName", Value =$"{model.Name}" },
                        new ReplaceModel {  Key="numberTrack", Value =$"{model.NumberTrack}" }
                    };
                string body = _mailDispatcherService.ReplaceTag(template.HtmlBody, replaces);

                string display = _configuration.GetValue<string>("Display");

                var users = _userProfileService.GetUsersEmailByRole("PUBLISHING");
                var usersAdmin = _userProfileService.GetUsersEmailByRole("ADMIN");
                var usersRoyalties = _userProfileService.GetUsersEmailByRole("ROYALTIES");

                foreach (var user in users)
                {
                    _helperService.SendEmail(
                        GetMailConfig(),
                        $"{template.Subject} {display}",
                        body,
                        new List<string> { user.Email }
                    );
                }
                foreach (var user in usersAdmin)
                {
                    _helperService.SendEmail(
                        GetMailConfig(),
                        $"{template.Subject} {display}",
                        body,
                        new List<string> { user.Email }
                    );
                }
                foreach (var user in usersRoyalties)
                {
                    _helperService.SendEmail(
                        GetMailConfig(),
                        $"{template.Subject} {display}",
                        body,
                        new List<string> { user.Email }
                    );
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

        [Route("api/Track")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] Track model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Track Track = _TrackService.Get(model.Id);
                Track.Name = model.Name;
                Track.NumberTrack = model.NumberTrack;
                Track.WorkId = model.WorkId;
                Track.Modified = DateTime.Now;
                Track.Modifier = userId;
                Track.Time = model.Time;
                //Track.ReleaseDate = model.ReleaseDate;
                //Track.SoundRecordingRegistration = model.SoundRecordingRegistration;
                //Track.MusicCopyright = model.MusicCopyright;
                //Track.SoundExchangeRegistration = model.SoundExchangeRegistration;
                //Track.WorkForHireSound = model.WorkForHireSound;
                //Track.WorkForHireVideo = model.WorkForHireVideo;

                _TrackService.Update(Track);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/TrackStatus")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody]StatusUpdateModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Track Track = _TrackService.Get(Convert.ToInt32(model.Id));
                Track.StatusRecordId = model.Status;
                Track.Modified = DateTime.Now;
                Track.Modifier = userId;
                _TrackService.Update(Track);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/Track")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Track Track = _TrackService.Get(id);
                Track.StatusRecordId = 3;
                Track.Erased = DateTime.Now;
                Track.Eraser = userId;

                _TrackService.Update(Track);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
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
