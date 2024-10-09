using GerenciaMusic360.Common.Enum;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Entities.Models;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [Authorize]
    [ApiController]
    public class ArtistController : ControllerBase
    {
        private readonly IPersonService _personService;
        private readonly IHelperService _helperService;
        private readonly IHostingEnvironment _env;
        private readonly IMailDispatcherService _notificationDispatcher;
        private readonly IUserNotificationService _userNotification;
        private readonly INotificationService _notification;
        private readonly IUserProfileService _userProfileService;
        private readonly IConfiguration _configuration;

        public ArtistController(
            IPersonService personService,
            IHelperService helperService,
            IHostingEnvironment env,
            IMailDispatcherService notificationDispatcher,
            IUserNotificationService userNotification,
            INotificationService notification,
            IUserProfileService userProfileService,
            IConfiguration configuration)
        {
            _personService = personService;
            _helperService = helperService;
            _env = env;
            _notificationDispatcher = notificationDispatcher;
            _userNotification = userNotification;
            _notification = notification;
            _userProfileService = userProfileService;
            _configuration = configuration;
        }

        [Route("api/Artists")]
        [HttpGet]
        public MethodResponse<List<Person>> Get()
        {
            var result = new MethodResponse<List<Person>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _personService.GetAllPersons((int)Entity.Artist)
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

        [Route("api/Artist")]
        [HttpGet]
        public MethodResponse<Person> Get(int id)
        {
            var result = new MethodResponse<Person> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _personService.GetAgentArtistPerson(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/Artist")]
        [HttpPost]
        public MethodResponse<int> Post([FromBody] Person model)
        {
            var result = new MethodResponse<int> { Code = 100, Message = "Success", Result = 0 };
            try
            {
                string pictureURL = string.Empty;
                if (!string.IsNullOrWhiteSpace(model.PictureUrl) && model.PictureUrl?.Length > 0)
                    pictureURL = _helperService.SaveImage(
                        model.PictureUrl.Split(",")[1],
                        "artist", $"{Guid.NewGuid()}.jpg",
                        _env);

                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                model.PictureUrl = pictureURL;
                if (!string.IsNullOrWhiteSpace(model.BirthDateString)) {
                    model.BirthDate = DateTime.Parse(model.BirthDateString);
                }               
                model.Created = DateTime.Now;
                model.Creator = userId;
                model.EntityId = (int)Entity.Artist;
                model.StatusRecordId = 1;

                Person resultCreate = _personService.CreatePerson(model);
                result.Result = resultCreate.Id;

                if (_configuration.GetValue<bool>("IsActiveNotification"))
                    SendNotification(resultCreate, userId);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = 0;
            }
            return result;
        }


        [Route("api/Artist")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] Person model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {

                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Person person = _personService.GetPerson(model.Id);

                if (System.IO.File.Exists(Path.Combine(_env.WebRootPath, "clientapp", "dist", person.PictureUrl)))
                    System.IO.File.Delete(Path.Combine(_env.WebRootPath, "clientapp", "dist", person.PictureUrl));

                string pictureURL = string.Empty;
                if (model.PictureUrl?.Length > 0)
                    pictureURL = _helperService.SaveImage(
                        model.PictureUrl.Split(",")[1],
                        "artist", $"{Guid.NewGuid()}.jpg",
                        _env);

                person.AliasName = model.AliasName;
                person.Name = model.Name;
                person.LastName = model.LastName;
                person.SecondLastName = model.SecondLastName;
                if (!string.IsNullOrWhiteSpace(model.BirthDateString))
                {
                    person.BirthDate = DateTime.Parse(model.BirthDateString);
                }
                person.PersonTypeId = model.PersonTypeId;
                person.Gender = model.Gender;
                person.PictureUrl = pictureURL;
                person.Email = model.Email;
                person.OfficePhone = model.OfficePhone;
                person.CellPhone = model.CellPhone;
                person.Biography = model.Biography;
                person.GeneralTaste = model.GeneralTaste;
                person.WebSite = model.WebSite;
                person.Price = model.Price;
                person.Modified = DateTime.Now;
                person.Modifier = userId;
                person.IsInternal = model.IsInternal;
                _personService.UpdatePerson(person);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/ArtistStatus")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody]StatusUpdateModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Person person = _personService.GetPerson(Convert.ToInt32(model.Id));
                person.StatusRecordId = model.Status;
                person.Modified = DateTime.Now;
                person.Modifier = userId;
                _personService.UpdatePerson(person);

                StatusMembers(person.Id, model.Status, userId);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/Artist")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Person person = _personService.GetPerson(id);
                person.StatusRecordId = 3;
                person.Erased = DateTime.Now;
                person.Eraser = userId;
                _personService.UpdatePerson(person);

                StatusMembers(id, 3, userId);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        private void StatusMembers(int personId, short status, string userId)
        {
            List<Person> members =
            _personService.GetPersonsByRelationPerson(personId, (int)Entity.MemberArtist)
            .ToList();

            foreach (Person member in members)
            {
                member.StatusRecordId = status;

                if (status == 3)
                {
                    member.Erased = DateTime.Now;
                    member.Eraser = userId;
                }
                else
                {
                    member.Modified = DateTime.Now;
                    member.Modifier = userId;
                }

                _personService.UpdatePerson(member);
            }
        }

        private void SendNotification(Person person, string userId)
        {
            UserProfile userProfile = _userProfileService.GetUserByUserId(userId);

            List<ReplaceModel> replaces = new List<ReplaceModel>()
            {
                new ReplaceModel {Key = "ArtistName",Value=$"{person.AliasName}"},
                new ReplaceModel {Key = "UserName",Value=$"{userProfile.Name} {userProfile.LastName} {userProfile.SecondLastName}"}
            };

            List<UserNotificationModel> recipients =
                   _userNotification.GetUserNotification(NotificationType.NewArtist)
                   .ToList();

            _notificationDispatcher.CreateMailDispatchers(
                NotificationType.NewArtist,
                recipients,
                _notification.GetNotification(NotificationType.NewArtist),
                replaces
                );
        }
    }
}
