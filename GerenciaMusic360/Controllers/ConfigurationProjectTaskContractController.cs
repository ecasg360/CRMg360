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
    public class ConfigurationProjectTaskContractController : ControllerBase
    {
        private readonly IConfigurationProjectTaskContractService _configurationProjectTaskContractService;

        public ConfigurationProjectTaskContractController(IConfigurationProjectTaskContractService configurationProjectTaskContractService)
        {
            _configurationProjectTaskContractService = configurationProjectTaskContractService;
        }

        [Route("api/ConfigurationProjectTaskContract")]
        [HttpGet]
        public MethodResponse<List<ConfigurationProjectTaskContract>> Get(int projectTypeId)
        {
            var result = new MethodResponse<List<ConfigurationProjectTaskContract>> { Code = 100, Message = "Success", Result = null };
            try
            {
                var configurations = _configurationProjectTaskContractService.GetAllByProjectTypeId(projectTypeId).ToList();
                result.Result = configurations;
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
