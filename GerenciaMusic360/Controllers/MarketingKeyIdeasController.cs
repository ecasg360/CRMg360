using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class MarketingKeyIdeasController : ControllerBase
    {
        private readonly IMarketingKeyIdeasService _marketingKeyIdeasService;

        public MarketingKeyIdeasController(IMarketingKeyIdeasService marketingKeyIdeasService)
        {
            _marketingKeyIdeasService = marketingKeyIdeasService;
        }

        [Route("api/MarketingKeyIdeas")]
        [HttpGet]
        public MethodResponse<List<MarketingKeyIdeas>> Get(int marketingId)
        {
            var result = new MethodResponse<List<MarketingKeyIdeas>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _marketingKeyIdeasService.GetAll(marketingId)
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

        [Route("api/MarketingKeyIdea")]
        [HttpGet]
        public MethodResponse<MarketingKeyIdeas> GetKeyIdea(int id)
        {
            var result = new MethodResponse<MarketingKeyIdeas> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _marketingKeyIdeasService.Get(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/MarketingKeyIdea")]
        [HttpPost]
        public MethodResponse<MarketingKeyIdeas> Post([FromBody] MarketingKeyIdeas model)
        {
            var result = new MethodResponse<MarketingKeyIdeas> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _marketingKeyIdeasService.Create(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/MarketingKeyIdea")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                MarketingKeyIdeas marketing = _marketingKeyIdeasService.Get(id);
                _marketingKeyIdeasService.Delete(marketing);
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