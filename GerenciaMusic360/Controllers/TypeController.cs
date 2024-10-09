
using GerenciaMusic360.Entities;
using GerenciaMusic360.Entities.Models;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class TypeController : ControllerBase
    {
        private readonly ITypeService _typeService;
        public TypeController(
            ITypeService typeService)
        {
            _typeService = typeService;
        }

        [Route("api/Types")]
        [HttpGet]
        public MethodResponse<List<Type>> Get(int typeId)
        {
            var result = new MethodResponse<List<Type>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _typeService.GetAllTypes(typeId)
               .ToList();
            }
            catch (System.Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/Type")]
        [HttpGet]
        public MethodResponse<Type> Get(int id, int typeId)
        {
            var result = new MethodResponse<Type> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _typeService.GetType(id, typeId);
            }
            catch (System.Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/Type")]
        [HttpPost]
        public MethodResponse<Type> Post([FromBody] Type model)
        {
            var result = new MethodResponse<Type> { Code = 100, Message = "Success", Result = null };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                result.Result = _typeService.CreateType(model, userId);
            }
            catch (System.Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/Type")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] Type model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                _typeService.UpdateType(model, userId);
            }
            catch (System.Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/TypeStatus")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody]StatusUpdateModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                _typeService.UpdateStatusType(new Type
                {
                    Id = System.Convert.ToInt32(model.Id),
                    TypeId = model.TypeId,
                    StatusRecordId = model.Status
                }, userId);
            }
            catch (System.Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/Type")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id, int typeId)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                _typeService.UpdateStatusType(new Type
                {
                    Id = id,
                    TypeId = typeId,
                    StatusRecordId = 3
                }, userId);
            }
            catch (System.Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }
    }
}