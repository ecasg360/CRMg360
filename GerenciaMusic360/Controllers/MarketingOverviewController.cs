using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{

    [ApiController]
    public class MarketingOverviewController : ControllerBase
    {
        private readonly IMarketingOverviewService _marketingOverviewService;

        public MarketingOverviewController(IMarketingOverviewService marketingOverviewService)
        {
            _marketingOverviewService = marketingOverviewService;
        }

        [Route("api/MarketingOverviews")]
        [HttpGet]
        public MethodResponse<List<MarketingOverview>> Get(int marketingId)
        {
            var result = new MethodResponse<List<MarketingOverview>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _marketingOverviewService.GetAll(marketingId)
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

        [Route("api/MarketingOverviewsBySection")]
        [HttpGet]
        public MethodResponse<List<MarketingOverview>> GetBySection(int sectionId)
        {
            var result = new MethodResponse<List<MarketingOverview>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _marketingOverviewService.GetBySection(sectionId)
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

        [Route("api/MarketingOverview")]
        [HttpPost]
        public MethodResponse<MarketingOverview> Post([FromBody] MarketingOverview model)
        {
            var result = new MethodResponse<MarketingOverview> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _marketingOverviewService.Create(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/MarketingOverview")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                MarketingOverview marketingOverview = _marketingOverviewService.Get(id);
                _marketingOverviewService.Delete(marketingOverview);
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