using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class PreferenceTypeController : ControllerBase
    {
        private readonly IPreferenceTypeService _preferenceTypeService;
        public PreferenceTypeController(
            IPreferenceTypeService preferenceTypeService)
        {
            _preferenceTypeService = preferenceTypeService;
        }

        [Route("api/PreferenceTypes")]
        [HttpGet]
        public MethodResponse<List<PreferenceType>> Get()
        {
            var result = new MethodResponse<List<PreferenceType>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _preferenceTypeService.GetAllPreferenceTypes()
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