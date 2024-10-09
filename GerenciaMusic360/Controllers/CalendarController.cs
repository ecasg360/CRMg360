using GerenciaMusic360.Entities;
using GerenciaMusic360.Entities.Models;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class CalendarController : ControllerBase
    {
        private readonly ICalendarService _calendarService;
        private readonly IHelperService _helperService;
        private readonly IHostingEnvironment _env;
        private readonly IUserProfileService _user;
        private readonly IProjectService _projectService;

        public CalendarController(
            ICalendarService calendarService,
            IHelperService helperService,
            IHostingEnvironment env,
            IUserProfileService user,
            IProjectService projectService
            )
        {
            _calendarService = calendarService;
            _helperService = helperService;
            _env = env;
            _user = user;
            _projectService = projectService;
        }

        [Route("api/CalendarEvents")]
        [HttpGet]
        public MethodResponse<List<Calendar>> Get()
        {
            var result = new MethodResponse<List<Calendar>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _calendarService.GetAllCalendarEvents()
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

        [Route("api/CalendarEventsByUser")]
        [HttpGet]
        public MethodResponse<List<Calendar>> GetByUser(int personId)
        {
            var result = new MethodResponse<List<Calendar>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _calendarService.GetAllCalendarEvents(personId)
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

        [Route("api/CalendarEventsByLabel")]
        [HttpGet]
        public MethodResponse<List<Calendar>> GetByLabel(int userId)
        {
            var result = new MethodResponse<List<Calendar>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _calendarService.GetByLabel(userId)
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

        [Route("api/CalendarEventsByAgency")]
        [HttpGet]
        public MethodResponse<List<Calendar>> GetByAgency(int userId)
        {
            var result = new MethodResponse<List<Calendar>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _calendarService.GetByAgency(userId)
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

        [Route("api/CalendarEventsByEvent")]
        [HttpGet]
        public MethodResponse<List<Calendar>> GetByEvent(int userId)
        {
            var result = new MethodResponse<List<Calendar>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _calendarService.GetByEvent(userId)
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

        [Route("api/CalendarEventsByProject")]
        [HttpGet]
        public MethodResponse<List<Calendar>> GetByProject(int projectId)
        {
            var result = new MethodResponse<List<Calendar>> { Code = 100, Message = "Success", Result = null };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                UserProfile user = _user.GetUserByUserId(userId);

                result.Result = _calendarService.GetCalendarEventsByProject(projectId, user.Id)
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

        [Route("api/CalendarEvent")]
        [HttpGet]
        public MethodResponse<Calendar> Get(int id)
        {
            var result = new MethodResponse<Calendar> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _calendarService.GetCalendarEvent(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/CalendarEvent")]
        [HttpPost]
        public MethodResponse<Calendar> Post([FromBody] Calendar model)
        {
            var result = new MethodResponse<Calendar> { Code = 100, Message = "Success", Result = null };
            try
            {
                string pictureURL = string.Empty;
                if (model.PictureUrl?.Length > 0)
                    pictureURL = _helperService.SaveImage(
                        model.PictureUrl.Split(",")[1],
                        "event", $"{Guid.NewGuid()}.jpg",
                        _env);

                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                model.StartDate = DateTime.Parse(model.StartDateString);
                model.EndDate = DateTime.Parse(model.EndDateString);
                model.PictureUrl = pictureURL;
                model.Created = DateTime.Now;
                model.Creator = userId;
                model.StatusRecordId = 1;
                model.ProjectTaskIsMember = false;
                model.Checked = 0;
                model.ModuleId = null;
                result.Result = _calendarService.CreateCalendarEvent(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/CalendarEvent")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] Calendar model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                if (!model.IsProjectRelease ?? true)
                {
                    Calendar calendar = _calendarService.GetCalendarEvent(model.Id);

                    if (calendar.PictureUrl != null)
                        if (System.IO.File.Exists(Path.Combine(_env.WebRootPath, "clientapp", "dist", calendar.PictureUrl)))
                            System.IO.File.Delete(Path.Combine(_env.WebRootPath, "clientapp", "dist", calendar.PictureUrl));

                    string pictureURL = string.Empty;
                    if (model.PictureUrl?.Length > 0)
                        pictureURL = _helperService.SaveImage(
                            model.PictureUrl.Split(",")[1],
                            "calendar", $"{Guid.NewGuid()}.jpg",
                            _env);


                    calendar.Title = model.Title;
                    calendar.PictureUrl = pictureURL;
                    calendar.StartDate = DateTime.Parse(model.StartDateString);
                    calendar.EndDate = DateTime.Parse(model.EndDateString);
                    calendar.AllDay = model.AllDay;
                    calendar.Location = model.Location;
                    calendar.Notes = model.Notes;
                    calendar.Modified = DateTime.Now;
                    calendar.Modifier = userId;

                    _calendarService.UpdateCalendarEvent(calendar);
                } else
                {
                    Project project = _projectService.GetProject(model.Id);
                    project.Name = model.Title;
                    project.InitialDate = model.EndDate;
                    project.EndDate = model.EndDate;
                    _projectService.Update(project);
                    result.Result = true;
                }
                
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/CalendarEventStatus")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody]StatusUpdateModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Calendar calendar = _calendarService.GetCalendarEvent(Convert.ToInt32(model.Id));
                calendar.StatusRecordId = model.Status;
                calendar.Modified = DateTime.Now;
                calendar.Modifier = userId;

                _calendarService.UpdateCalendarEvent(calendar);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/CalendarEvent")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Calendar calendar = _calendarService.GetCalendarEvent(Convert.ToInt32(id));
                calendar.StatusRecordId = 3;
                calendar.Erased = DateTime.Now;
                calendar.Eraser = userId;

                _calendarService.UpdateCalendarEvent(calendar);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/CalendarReleasesProjects")]
        [HttpGet]
        public MethodResponse<List<Calendar>> GetByReleasesProjects()
        {
            var result = new MethodResponse<List<Calendar>> { Code = 100, Message = "Success", Result = null };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                UserProfile user = _user.GetUserByUserId(userId);

                result.Result = _calendarService.GetCalendarReleasesProjects()
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