using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class StateController : ControllerBase
    {
        private readonly IStateService _stateService;
        public StateController(
            IStateService stateService)
        {
            _stateService = stateService;
        }

        [Route("api/States")]
        [HttpGet]
        public MethodResponse<List<State>> Get()
        {
            var result = new MethodResponse<List<State>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _stateService.GetAllStates()
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

        [Route("api/StatesByCountry")]
        [HttpGet]
        public MethodResponse<List<State>> Get(int countryId)
        {
            var result = new MethodResponse<List<State>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _stateService.GetStatesByCountry(countryId)
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