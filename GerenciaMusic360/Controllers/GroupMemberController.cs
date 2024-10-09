using GerenciaMusic360.Common.Enum;
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
    public class GroupMemberController : ControllerBase
    {
        private readonly IPersonService _personService;
        private readonly IGroupMemberService _groupMemberService;
        private readonly IHelperService _helperService;
        private readonly IHostingEnvironment _env;

        public GroupMemberController(
            IPersonService personService,
            IGroupMemberService groupMemberService,
            IHelperService helperService,
            IHostingEnvironment env)
        {
            _personService = personService;
            _groupMemberService = groupMemberService;
            _helperService = helperService;
            _env = env;
        }

        [Route("api/GroupMembers")]
        [HttpGet]
        public MethodResponse<List<Person>> Get(int personId)
        {
            var result = new MethodResponse<List<Person>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _personService.GetPersonsByRelationPerson(personId, (int)Entity.MemberGroup)
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

        [Route("api/GroupMember")]
        [HttpGet]
        public MethodResponse<Person> Get(int personId, int id)
        {
            var result = new MethodResponse<Person> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _personService.GetMemberArtistPerson(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/GroupMember")]
        [HttpPost]
        public MethodResponse<Person> Post([FromBody] Person model)
        {
            var result = new MethodResponse<Person> { Code = 100, Message = "Success", Result = null };
            try
            {
                string pictureURL = string.Empty;
                if (model.PictureUrl?.Length > 0)
                    pictureURL = _helperService.SaveImage(
                        model.PictureUrl.Split(",")[1],
                        "groupmember", $"{Guid.NewGuid()}.jpg",
                        _env);

                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                model.PictureUrl = pictureURL;
                model.BirthDate = DateTime.Parse(model.BirthDateString);
                model.Created = DateTime.Now;
                model.Creator = userId;
                model.EntityId = (int)Entity.MemberGroup;
                model.StatusRecordId = 1;

                result.Result = _personService.CreatePerson(model);

                DateTime? endDate = null;
                if (!string.IsNullOrEmpty(model.EndDateJoinedString))
                    endDate = DateTime.Parse(model.EndDateJoinedString);

                _groupMemberService.CreateGroupMember(new GroupMember
                {
                    GroupId = model.PersonRelationId,
                    PersonMemberId = result.Result.Id,
                    MainAcitvityId = model.MainActivityId,
                    StartDateJoined = DateTime.Parse(model.StartDateJoinedString),
                    EndDateJoined = endDate,
                    StatusRecordId = 1,
                    Created = DateTime.Now,
                    Creator = userId
                });
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/GroupMembers")]
        [HttpPost]
        public MethodResponse<Person> Post([FromBody] List<Person> model)
        {
            var result = new MethodResponse<Person> { Code = 100, Message = "Success", Result = null };
            try
            {
                foreach (Person personModel in model)
                {
                    string pictureURL = string.Empty;
                    if (personModel.PictureUrl?.Length > 0)
                        pictureURL = _helperService.SaveImage(
                            personModel.PictureUrl.Split(",")[1],
                            "groupmember", $"{Guid.NewGuid()}.jpg",
                            _env);

                    string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                    personModel.PictureUrl = pictureURL;
                    personModel.BirthDate = DateTime.Parse(personModel.BirthDateString);
                    personModel.Created = DateTime.Now;
                    personModel.Creator = userId;
                    personModel.EntityId = (int)Entity.MemberGroup;
                    personModel.StatusRecordId = 1;

                    result.Result = _personService.CreatePerson(personModel);

                    DateTime? endDate = null;
                    if (!string.IsNullOrEmpty(personModel.EndDateJoinedString))
                        endDate = DateTime.Parse(personModel.EndDateJoinedString);

                    _groupMemberService.CreateGroupMember(new GroupMember
                    {
                        GroupId = personModel.PersonRelationId,
                        PersonMemberId = result.Result.Id,
                        MainAcitvityId = personModel.MainActivityId,
                        StartDateJoined = DateTime.Parse(personModel.StartDateJoinedString),
                        EndDateJoined = endDate,
                        StatusRecordId = 1,
                        Created = DateTime.Now,
                        Creator = userId
                    });
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


        [Route("api/GroupMember")]
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
                        "groupmember", $"{Guid.NewGuid()}.jpg",
                        _env);

                person.Name = model.Name;
                person.LastName = model.LastName;
                person.SecondLastName = model.SecondLastName;
                person.BirthDate = DateTime.Parse(model.BirthDateString);
                person.Gender = model.Gender;
                person.PictureUrl = pictureURL;
                person.Email = model.Email;
                person.OfficePhone = model.OfficePhone;
                person.CellPhone = model.CellPhone;
                person.Biography = model.Biography;
                person.Modified = DateTime.Now;
                person.Modifier = userId;

                _personService.UpdatePerson(person);

                GroupMember groupMember = _groupMemberService.GetGroupMemberByMember(model.Id);
                groupMember.StartDateJoined = DateTime.Parse(model.StartDateJoinedString);
                groupMember.EndDateJoined = DateTime.Parse(model.EndDateJoinedString);
                groupMember.MainAcitvityId = model.MainActivityId;
                groupMember.Modified = DateTime.Now;
                groupMember.Modifier = userId;

                if (!string.IsNullOrEmpty(model.EndDateJoinedString))
                    groupMember.EndDateJoined = DateTime.Parse(model.EndDateJoinedString);
                else
                    groupMember.EndDateJoined = null;

                _groupMemberService.UpdateGroupMember(groupMember);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/GroupMemberStatus")]
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

                GroupMember groupMember = _groupMemberService
                    .GetGroupMemberByMember(Convert.ToInt32(model.Id));

                groupMember.StatusRecordId = model.Status;
                groupMember.Modified = DateTime.Now;
                groupMember.Modifier = userId;

                _groupMemberService.UpdateGroupMember(groupMember);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/GroupMember")]
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

                GroupMember groupMember = _groupMemberService
                   .GetGroupMemberByMember(id);

                groupMember.StatusRecordId = 3;
                groupMember.Modified = DateTime.Now;
                groupMember.Modifier = userId;

                _groupMemberService.UpdateGroupMember(groupMember);
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