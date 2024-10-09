using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class TrackWorkController : ControllerBase
    {
        private readonly ITrackWorkService _TrackWorkService;
        public TrackWorkController(
            ITrackWorkService TrackWorkService)
        {
            _TrackWorkService = TrackWorkService;
        }

        [Route("api/TrackWork")]
        [HttpGet]
        public MethodResponse<List<TrackWork>> Get()
        {
            var result = new MethodResponse<List<TrackWork>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _TrackWorkService.GetAllTrackWork()
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

        [Route("api/TrackWork")]
        [HttpPost]
        public MethodResponse<TrackWork> Post([FromBody] TrackWork model)
        {
            var result = new MethodResponse<TrackWork> { Code = 100, Message = "Success", Result = null };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                result.Result = _TrackWorkService.Create(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/TrackWork")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] TrackWork model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                TrackWork TrackWork = _TrackWorkService.Get(model.Id);
                TrackWork.ISRC = model.ISRC;
                TrackWork.UPC = model.UPC;
                _TrackWorkService.Update(TrackWork);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }
    }
}
