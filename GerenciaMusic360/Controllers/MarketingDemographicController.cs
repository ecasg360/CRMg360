using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class MarketingDemographicController : ControllerBase
    {
        private readonly IMarketingDemographicService _marketingDemographicService;

        public MarketingDemographicController(IMarketingDemographicService marketingDemographicService)
        {
            _marketingDemographicService = marketingDemographicService;
        }

        [Route("api/MarketingDemographics")]
        [HttpGet]
        public MethodResponse<List<MarketingDemographic>> Get(int marketingId)
        {
            var result = new MethodResponse<List<MarketingDemographic>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _marketingDemographicService.GetAll(marketingId)
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

        [Route("api/MarketingDemographics")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] List<MarketingDemographic> model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                IEnumerable<MarketingDemographic> demographics =
                    _marketingDemographicService.GetAll(model.First().MarketingId);

                if (demographics.Count() > 0)
                    _marketingDemographicService.Delete(demographics);

                _marketingDemographicService.Create(model);
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