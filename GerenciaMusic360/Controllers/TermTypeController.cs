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
    public class TermTypeController : ControllerBase
    {
        private readonly ITermTypeService _termTypeService;

        public TermTypeController(ITermTypeService termTypeService)
        {
            _termTypeService = termTypeService;
        }

        [Route("api/TermTypes")]
        [HttpGet]
        public MethodResponse<List<TermType>> Get()
        {
            var result = new MethodResponse<List<TermType>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _termTypeService.GetAllTermTypes()
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

        [Route("api/TermType")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                TermType termType = _termTypeService.Get(id);
                termType.StatusRecordId = 3;
                termType.Erased = DateTime.Now;
                termType.Eraser = userId;
                _termTypeService.Update(termType);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/TermTypeStatus")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody]StatusUpdateModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                TermType termType = _termTypeService.Get(int.Parse(model.Id.ToString()));
                termType.StatusRecordId = model.Status;
                termType.Modified = DateTime.Now;
                termType.Modifier = userId;
                _termTypeService.Update(termType);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/TermType")]
        [HttpPost]
        public MethodResponse<TermType> Post([FromBody] TermType model)
        {
            var result = new MethodResponse<TermType> { Code = 100, Message = "Success", Result = null };
            try
            {
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                model.Created = DateTime.Now;
                model.Creator = userId;
                model.StatusRecordId = 1;
                result.Result = _termTypeService.Create(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/TermType")]
        [HttpGet]
        public MethodResponse<TermType> Get(int id)
        {
            var result = new MethodResponse<TermType> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _termTypeService.Get(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/TermType")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] TermType model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                var termType = _termTypeService.Get(model.Id);

                termType.Name = model.Name;
                termType.Modified = DateTime.Now;
                termType.Modifier = userId;
                _termTypeService.Update(termType);
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
