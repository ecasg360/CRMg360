using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{

    [ApiController]
    public class CountryController : ControllerBase
    {
        private readonly ICountryService _countryService;
        public CountryController(
            ICountryService countryService)
        {
            _countryService = countryService;
        }

        [Route("api/Countries")]
        [HttpGet]
        public MethodResponse<List<Country>> Get()
        {
            var result = new MethodResponse<List<Country>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _countryService.GetAllCountries()
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

        [Route("api/Country")]
        [HttpGet]
        public MethodResponse<Country> Get(int id)
        {
            var result = new MethodResponse<Country> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _countryService.GetCountry(id);
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