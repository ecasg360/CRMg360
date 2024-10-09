using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class MarketingOverviewDetailController : ControllerBase
    {

        private readonly IMarketingOverviewDService _marketingOverviewDService;

        public MarketingOverviewDetailController(IMarketingOverviewDService marketingOverviewDService)
        {
            _marketingOverviewDService = marketingOverviewDService;
        }

        [Route("api/MarketingOverviewDetails")]
        [HttpGet]
        public MethodResponse<List<MarketingOverViewDetail>> Get(int marketingOverviewId)
        {
            var result = new MethodResponse<List<MarketingOverViewDetail>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _marketingOverviewDService.GetAll(marketingOverviewId)
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


        [Route("api/MarketingOverviewDetail")]
        [HttpPost]
        public MethodResponse<MarketingOverViewDetail> Post([FromBody] MarketingOverViewDetail model)
        {
            var result = new MethodResponse<MarketingOverViewDetail> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _marketingOverviewDService.Create(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/MarketingOverviewDetails")]
        [HttpPost]
        public MethodResponse<List<MarketingOverViewDetail>> Post([FromBody] List<MarketingOverViewDetail> model)
        {
            var result = new MethodResponse<List<MarketingOverViewDetail>> { Code = 100, Message = "Success", Result = new List<MarketingOverViewDetail>() };
            try
            {
                foreach (MarketingOverViewDetail detail in model)
                {
                    result.Result.Add(_marketingOverviewDService.Create(detail));
                }
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/MarketingOverviewDetail")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                MarketingOverViewDetail marketingOverViewDetail = _marketingOverviewDService.Get(id);
                _marketingOverviewDService.Delete(marketingOverViewDetail);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/MarketingOverviewDetails")]
        [HttpDelete]
        public MethodResponse<bool> DeleteByOverview(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                IEnumerable<MarketingOverViewDetail> marketingOverViewDetails = _marketingOverviewDService.GetByOverView(id);
                _marketingOverviewDService.DeleteAll(marketingOverViewDetails);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/MarketingOverviewDetailsByOverviewSocial")]
        [HttpDelete]
        public MethodResponse<bool> DeleteByOverview(int overviewId, int socialNetworkId)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                IEnumerable<MarketingOverViewDetail> marketingOverViewDetails = _marketingOverviewDService.GetByOverView(overviewId, socialNetworkId);
                _marketingOverviewDService.DeleteAll(marketingOverViewDetails);
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