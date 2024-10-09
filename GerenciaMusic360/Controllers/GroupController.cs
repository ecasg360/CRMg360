using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [Authorize]
    [ApiController]
    public class GroupController : ControllerBase
    {
        private readonly IPersonService _personService;
        private readonly IGroupService _service;
        public GroupController(IGroupService service, IPersonService personService)
        {
            _personService = personService;
            _service = service;
        }

        [Route("api/groups")]
        [HttpGet]
        public MethodResponse<List<Group>> Get()
        {
            var result = new MethodResponse<List<Group>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _service.GetAll()
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

        [Route("api/group")]
        [HttpGet]
        public MethodResponse<Group> Get(int id)
        {
            var result = new MethodResponse<Group> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _service.Get(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/group")]
        [HttpPost]
        public MethodResponse<UserProfile> Post([FromBody] Group model)
        {
            var result = new MethodResponse<UserProfile> { Code = 100, Message = "Success", Result = null };
            try
            {
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                model.StatusRecordId = 1;
                model.Created = DateTime.Now;
                model.Creater = userId;
                _service.Create(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/group")]
        [HttpPut]
        public MethodResponse<UserProfile> Put([FromBody] Group model)
        {
            var result = new MethodResponse<UserProfile> { Code = 100, Message = "Success", Result = null };
            try
            {
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                var musicalGenre = _service.Get(model.Id);
                musicalGenre.Modified = DateTime.Now;
                musicalGenre.Modifier = userId;
                musicalGenre.Description = model.Description;
                musicalGenre.Biography = model.Biography;
                musicalGenre.Name = model.Name;
                _service.Update(musicalGenre);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/group")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                var obj = _service.Get(id);
                obj.StatusRecordId = 3;
                _service.Update(obj);
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