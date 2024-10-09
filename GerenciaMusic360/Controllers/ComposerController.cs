using GerenciaMusic360.Common.Enum;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Entities.Models;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [Authorize]
    [ApiController]
    public class ComposerController : ControllerBase
    {
        private readonly IPersonService _personService;
        private readonly IComposerDetailService _composerDetailService;
        private readonly IHelperService _helperService;
        private readonly IHostingEnvironment _env;

        public ComposerController(
            IPersonService personService,
            IComposerDetailService composerDetailService,
            IHelperService helperService,
            IHostingEnvironment env)
        {
            _personService = personService;
            _composerDetailService = composerDetailService;
            _helperService = helperService;
            _env = env;
        }

        [Route("api/Composers")]
        [HttpGet]
        public MethodResponse<List<Person>> Get()
        {
            var result = new MethodResponse<List<Person>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _personService.GetAllPersons((int)Entity.Composer)
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

        [Route("api/ComposersProjectWork")]
        [HttpGet]
        public MethodResponse<List<Person>> GetComposersProjectWork()
        {
            var result = new MethodResponse<List<Person>> { Code = 100, Message = "Success", Result = null };
            try
            {
                var composers = _personService.GetAllPersons((int)Entity.Composer)
                    .ToList();

                foreach (var item in composers)
                {
                    item.ComposerDetail = _composerDetailService.GetComposerDetailsByComposerId(item.Id);
                }

                result.Result = composers;
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/ComposersInternals")]
        [HttpGet]
        public MethodResponse<List<Person>> GetComposer(bool isInternal)
        {
            var result = new MethodResponse<List<Person>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _personService.GetAllPersons((int)Entity.Composer).Where(x => x.IsInternal == isInternal)
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

        [Route("api/Composer")]
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

        [Route("api/Composer")]
        [HttpPost]
        public MethodResponse<int> Post([FromBody] Person model)
        {
            var result = new MethodResponse<int> { Code = 100, Message = "Success", Result = 0 };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                if (!string.IsNullOrWhiteSpace(model.PictureUrl) && !model.PictureUrl.Contains("asset"))
                {
                    model.PictureUrl = _helperService.SaveImage(
                        model.PictureUrl.Split(",")[1],
                        "composer", $"{Guid.NewGuid()}.jpg",
                        _env);
                }

                if (!string.IsNullOrWhiteSpace(model.BirthDateString))
                    model.BirthDate = DateTime.Parse(model.BirthDateString);

                model.Created = DateTime.Now;
                model.Creator = userId;
                model.EntityId = (int)Entity.Composer;
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


        [Route("api/Composer")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] Person model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {

                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Person person = _personService.GetPerson(model.Id);

                if (!string.IsNullOrWhiteSpace(model.PictureUrl) && !model.PictureUrl.Contains("asset"))
                {
                    if (System.IO.File.Exists(Path.Combine(_env.WebRootPath, "clientapp", "dist", person.PictureUrl)))
                        System.IO.File.Delete(Path.Combine(_env.WebRootPath, "clientapp", "dist", person.PictureUrl));

                    person.PictureUrl = _helperService.SaveImage(
                        model.PictureUrl.Split(",")[1],
                        "composer", $"{Guid.NewGuid()}.jpg",
                        _env);
                }

                person.AliasName = model.AliasName;
                person.Name = model.Name;
                person.LastName = model.LastName;
                person.SecondLastName = model.SecondLastName;

                if (!string.IsNullOrWhiteSpace(model.BirthDateString))
                    person.BirthDate = DateTime.Parse(model.BirthDateString);

                person.Gender = model.Gender;
                person.Email = model.Email;
                person.OfficePhone = model.OfficePhone;
                person.CellPhone = model.CellPhone;
                person.Biography = model.Biography;
                person.GeneralTaste = model.GeneralTaste;
                person.WebSite = model.WebSite;
                person.AssociationId = model.AssociationId;
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

        [Route("api/ComposerStatus")]
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

        [Route("api/Composer")]
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