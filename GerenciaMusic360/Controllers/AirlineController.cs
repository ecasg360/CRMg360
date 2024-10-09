using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class AirlineController : ControllerBase
    {
        private readonly IAirlineService _airlineService;
        private readonly IHelperService _helperService;
        private readonly IHostingEnvironment _env;

        public AirlineController(
            IAirlineService airlineService,
            IHelperService helperService,
            IHostingEnvironment env)
        {
            _airlineService = airlineService;
            _helperService = helperService;
            _env = env;
        }

        [Route("api/Airlines")]
        [HttpGet]
        public MethodResponse<List<AirLine>> Get()
        {
            var result = new MethodResponse<List<AirLine>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _airlineService.GetAllAirlines()
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