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
    public class AutoBrandController : ControllerBase
    {
        private readonly IAutoBrandService _autoBrandService;
        private readonly IHelperService _helperService;
        private readonly IHostingEnvironment _env;

        public AutoBrandController(
            IAutoBrandService autoBrandService,
            IHelperService helperService,
            IHostingEnvironment env)
        {
            _autoBrandService = autoBrandService;
            _helperService = helperService;
            _env = env;
        }

        [Route("api/AutoBrands")]
        [HttpGet]
        public MethodResponse<List<AutoBrand>> Get()
        {
            var result = new MethodResponse<List<AutoBrand>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _autoBrandService.GetAllAutoBrands()
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