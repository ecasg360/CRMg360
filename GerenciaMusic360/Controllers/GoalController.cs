using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class GoalController : ControllerBase
    {
        private readonly IGoalService _goalService;

        public GoalController(IGoalService goalService)
        {
            _goalService = goalService;
        }

        [Route("api/Goals")]
        [HttpGet]
        public MethodResponse<List<Goal>> Get()
        {
            var result = new MethodResponse<List<Goal>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _goalService.GetAll()
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

        [Route("api/Goal")]
        [HttpPost]
        public MethodResponse<Goal> Post([FromBody] Goal model)
        {
            var result = new MethodResponse<Goal> { Code = 100, Message = "Success", Result = null };
            try
            {
                model.Active = true;
                result.Result = _goalService.Create(model);
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