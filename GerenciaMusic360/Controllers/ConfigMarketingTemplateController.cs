using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class ConfigMarketingTemplateController : ControllerBase
    {
        private readonly IConfigMarketingTemplateService _configuration;

        public ConfigMarketingTemplateController(IConfigMarketingTemplateService configuration)
        {
            _configuration = configuration;
        }

        [Route("api/ConfigMarketingTemplates")]
        [HttpGet]
        public MethodResponse<List<ConfigurationMarketingTemplate>> Get()
        {
            var result = new MethodResponse<List<ConfigurationMarketingTemplate>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _configuration.GetAll()
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