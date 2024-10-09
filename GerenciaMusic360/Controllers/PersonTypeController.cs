using GerenciaMusic360.Entities;
using GerenciaMusic360.Entities.Models;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class PersonTypeController : ControllerBase
    {
        private readonly IPersonTypeService _personTypeService;
        public PersonTypeController(
            IPersonTypeService personTypeService)
        {
            _personTypeService = personTypeService;
        }

        [Route("api/PersonTypes")]
        [HttpGet]
        public MethodResponse<List<PersonType>> Get(int entityId)
        {
            var result = new MethodResponse<List<PersonType>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _personTypeService.GetAllPersonTypes(entityId)
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

        [Route("api/PersonType")]
        [HttpGet]
        public MethodResponse<PersonType> Get(int entityId, int id)
        {
            var result = new MethodResponse<PersonType> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _personTypeService.GetPersonType(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/PersonType")]
        [HttpPost]
        public MethodResponse<PersonType> Post([FromBody] PersonType model)
        {
            var result = new MethodResponse<PersonType> { Code = 100, Message = "Success", Result = null };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                PersonType personType = _personTypeService.GetPersonTypeNewId(model.EntityId);

                model.Id = personType.Id;
                model.Created = DateTime.Now;
                model.Creator = userId;
                model.StatusRecordId = 1;
                result.Result = _personTypeService.CreatePersonType(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/PersonType")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] PersonType model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                PersonType personType = _personTypeService.GetPersonType(model.Id);
                personType.Name = model.Name;
                personType.Description = model.Description;
                personType.Modified = DateTime.Now;
                personType.Modifier = userId;

                _personTypeService.UpdatePersonType(personType);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/PersonTypeStatus")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody]StatusUpdateModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                PersonType personType = _personTypeService.GetPersonType(Convert.ToInt32(model.Id));
                personType.StatusRecordId = model.Status;
                personType.Modified = DateTime.Now;
                personType.Modifier = userId;
                _personTypeService.UpdatePersonType(personType);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/PersonType")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                PersonType personType = _personTypeService.GetPersonType(id);
                personType.StatusRecordId = 3;
                personType.Erased = DateTime.Now;
                personType.Eraser = userId;

                _personTypeService.UpdatePersonType(personType);
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
