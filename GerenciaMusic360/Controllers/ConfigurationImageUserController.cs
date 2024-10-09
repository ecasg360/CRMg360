using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{

    [ApiController]
    public class ConfigurationImageUserController : ControllerBase
    {
        private readonly IConfigurationImageUserService _configurationImageUserService;
        private readonly IConfigurationImageService _configurationImageService;

        public ConfigurationImageUserController(
            IConfigurationImageUserService configurationImageUserService,
            IConfigurationImageService configurationImageService)
        {
            _configurationImageUserService = configurationImageUserService;
            _configurationImageService = configurationImageService;
        }


        [Route("api/ConfigurationImageUser")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] ConfigurationImageUser model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                _configurationImageUserService.CreateConfigurationImageUser(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }


        [Route("api/ConfigurationUserImages")]
        [HttpGet]
        public MethodResponse<List<ConfigurationImage>> Get()
        {
            var result = new MethodResponse<List<ConfigurationImage>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _configurationImageService.GetAllConfigurationUserImages()
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