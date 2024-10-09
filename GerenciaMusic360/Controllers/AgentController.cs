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
    public class AgentController : ControllerBase
    {
        private readonly IPersonService _personService;
        private readonly IHelperService _helperService;
        private readonly IHostingEnvironment _env;

        public AgentController(
            IPersonService personService,
            IHelperService helperService,
            IHostingEnvironment env)
        {
            _personService = personService;
            _helperService = helperService;
            _env = env;
        }

        [Route("api/Agents")]
        [HttpGet]
        public MethodResponse<List<Person>> Get()
        {
            var result = new MethodResponse<List<Person>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _personService.GetAllPersons((int)Entity.Agent)
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

        [Route("api/Agent")]
        [HttpGet]
        public MethodResponse<Person> Get(int id)
        {
            var result = new MethodResponse<Person> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _personService.GetPerson(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/Agent")]
        [HttpPost]
        public MethodResponse<int> Post([FromBody] Person model)
        {
            var result = new MethodResponse<int> { Code = 100, Message = "Success", Result = 0 };
            try
            {
                string pictureURL = string.Empty;
                if (model.PictureUrl?.Length > 0)
                    pictureURL = _helperService.SaveImage(
                        model.PictureUrl.Split(",")[1],
                        "artistmember", $"{Guid.NewGuid()}.jpg",
                        _env);

                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                model.PictureUrl = pictureURL;
                model.BirthDate = DateTime.Parse(model.BirthDateString);
                model.Created = DateTime.Now;
                model.Creator = userId;
                model.EntityId = (int)Entity.Agent;
                model.StatusRecordId = 1;

                result.Result = _personService.CreatePerson(model).Id;
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = 0;
            }
            return result;
        }


        [Route("api/Agent")]
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
                        "agent", $"{Guid.NewGuid()}.jpg",
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
                person.PictureUrl = pictureURL;
                person.Modified = DateTime.Now;
                person.Modifier = userId;

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

        [Route("api/AgentStatus")]
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
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/Agent")]
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