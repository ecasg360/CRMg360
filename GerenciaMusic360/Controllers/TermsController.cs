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
    public class TermsController : ControllerBase
    {
        private readonly ITermsService _termsService;

        public TermsController(ITermsService termsService)
        {
            _termsService = termsService;
        }

        [Route("api/Terms")]
        [HttpGet]
        public MethodResponse<List<Terms>> Get()
        {
            var result = new MethodResponse<List<Terms>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _termsService.GetAllTerms()
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

        [Route("api/TermsByTermType")]
        [HttpGet]
        public MethodResponse<List<Terms>> Get(short termTypeId)
        {
            var result = new MethodResponse<List<Terms>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _termsService.GetAllTerms(termTypeId).ToList();
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/Term")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Terms term = _termsService.Get(id);
                term.StatusRecordId = 3;
                term.Erased = DateTime.Now;
                term.Eraser = userId;
                _termsService.Update(term);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }
        [Route("api/TermStatus")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody]StatusUpdateModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Terms term = _termsService.Get(int.Parse(model.Id.ToString()));
                term.StatusRecordId = model.Status;
                term.Modified = DateTime.Now;
                term.Modifier = userId;
                _termsService.Update(term);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/Term")]
        [HttpPost]
        public MethodResponse<Terms> Post([FromBody] Terms model)
        {
            var result = new MethodResponse<Terms> { Code = 100, Message = "Success", Result = null };
            try
            {
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                model.Created = DateTime.Now;
                model.Creator = userId;
                model.StatusRecordId = 1;
                result.Result = _termsService.Create(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/Term")]
        [HttpGet]
        public MethodResponse<Terms> Get(int id)
        {
            var result = new MethodResponse<Terms> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _termsService.Get(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/Term")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] Terms model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                var termType = _termsService.Get(model.Id);

                termType.Name = model.Name;
                termType.Modified = DateTime.Now;
                termType.Modifier = userId;
                _termsService.Update(termType);
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
