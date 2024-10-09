using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{

    [ApiController]
    public class CMKeyIdeasCategoryController : ControllerBase
    {
        private readonly ICMKeyIdeasCategoryService _condigurationService;

        public CMKeyIdeasCategoryController(ICMKeyIdeasCategoryService condigurationService)
        {
            _condigurationService = condigurationService;
        }


        [Route("api/ConfigurationMarketingKeyIdeasCategory")]
        [HttpGet]
        public MethodResponse<List<ConfigurationMarketingKeyIdeasCategory>> Get()
        {
            var result = new MethodResponse<List<ConfigurationMarketingKeyIdeasCategory>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _condigurationService.GetAll()
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
    }
}