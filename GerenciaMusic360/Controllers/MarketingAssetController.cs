using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class MarketingAssetController : ControllerBase
    {
        private readonly IMarketingAssetService _assetService;

        public MarketingAssetController(IMarketingAssetService assetService)
        {
            _assetService = assetService;
        }

        [Route("api/MarketingAssets")]
        [HttpGet]
        public MethodResponse<List<MarketingAsset>> Get(int marketingId)
        {
            var result = new MethodResponse<List<MarketingAsset>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _assetService.GetAll(marketingId)
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

        [Route("api/MarketingAsset")]
        [HttpGet]
        public MethodResponse<MarketingAsset> GetAsset(int id)
        {
            var result = new MethodResponse<MarketingAsset> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _assetService.Get(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/MarketingAsset")]
        [HttpPost]
        public MethodResponse<MarketingAsset> Post([FromBody] MarketingAsset model)
        {
            var result = new MethodResponse<MarketingAsset> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _assetService.Create(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }


        [Route("api/MarketingAsset")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] MarketingAsset model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                MarketingAsset asset = _assetService.Get(model.Id);

                asset.Description = model.Description;
                asset.Url = model.Url;
                asset.Position = model.Position;

                _assetService.Update(asset);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }


        [Route("api/MarketingAsset")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                MarketingAsset asset = _assetService.Get(id);
                _assetService.Delete(asset);
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