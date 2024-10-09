using GerenciaMusic360.Entities;
using GerenciaMusic360.Entities.Report;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [Authorize]
    [ApiController]
    public class EventController : ControllerBase
    {
        private readonly IEventService _eventService;
        private readonly IHostingEnvironment _env;
        private readonly IConfiguration _configuration;

        public EventController(
            IEventService eventService,
            IHostingEnvironment env,
            IConfiguration configuration)
        {
            _eventService = eventService;
            _env = env;
            _configuration = configuration;
        }

        [Route("api/EventsByArtist")]
        [HttpGet]
        public MethodResponse<List<BudgetEvent>> Get(int artistId, int projectTypeId, int projectId)
        {
            var result = new MethodResponse<List<BudgetEvent>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _eventService.GetEventsByArtist(artistId, projectTypeId, projectId).ToList();
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
