using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class CityController : ControllerBase
    {
        private readonly ICityService _cityService;

        public CityController(
            ICityService cityService)
        {
            _cityService = cityService;
        }

        [Route("api/Cities")]
        [HttpGet]
        public MethodResponse<List<City>> Get()
        {
            var result = new MethodResponse<List<City>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _cityService.GetAllCities()
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

        [Route("api/CitiesByState")]
        [HttpGet]
        public MethodResponse<List<City>> Get(int stateId)
        {
            var result = new MethodResponse<List<City>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _cityService.GetCitiesByState(stateId)
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