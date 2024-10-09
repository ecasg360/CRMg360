using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class MarketingKeyIdeaNameController : ControllerBase
    {
        private readonly IMarketingKeyIdeasNamesService _nameService;

        public MarketingKeyIdeaNameController(IMarketingKeyIdeasNamesService nameService)
        {
            _nameService = nameService;
        }

        [Route("api/MarketingKeyIdeasNames")]
        [HttpGet]
        public MethodResponse<List<MarketingKeyIdeasNames>> Get(int marketingKeyIdeasId)
        {
            var result = new MethodResponse<List<MarketingKeyIdeasNames>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _nameService.GetAll(marketingKeyIdeasId)
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

        [Route("api/MarketingKeyIdeaName")]
        [HttpGet]
        public MethodResponse<MarketingKeyIdeasNames> GetById(int id)
        {
            var result = new MethodResponse<MarketingKeyIdeasNames> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _nameService.Get(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/MarketingKeyIdeaName")]
        [HttpPost]
        public MethodResponse<MarketingKeyIdeasNames> Post([FromBody] MarketingKeyIdeasNames model)
        {
            var result = new MethodResponse<MarketingKeyIdeasNames> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _nameService.Create(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/MarketingKeyIdeaNames")]
        [HttpPost]
        public MethodResponse<IEnumerable<MarketingKeyIdeasNames>> PostMultiple([FromBody] List<MarketingKeyIdeasNames> model)
        {
            var result = new MethodResponse<IEnumerable<MarketingKeyIdeasNames>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _nameService.Create(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/MarketingKeyIdeaName")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                MarketingKeyIdeasNames name = _nameService.Get(id);
                _nameService.Delete(name);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/MarketingKeyIdeaNameByMarketingKeysId")]
        [HttpDelete]
        public MethodResponse<bool> DeleteByMarketingKey(int marketingKeyIdeasId)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                List<MarketingKeyIdeasNames> names = _nameService.GetAll(marketingKeyIdeasId).ToList();
                _nameService.Delete(names);
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