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
    public class TimeController : ControllerBase
    {
        private readonly ITimeService _timeService;

        public TimeController(ITimeService timeService)
        {
            _timeService = timeService;
        }

        [Route("api/Times")]
        [HttpGet]
        public MethodResponse<List<Time>> Get()
        {
            var result = new MethodResponse<List<Time>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _timeService.GetAllTimes()
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

        [Route("api/TimesByModule")]
        [HttpGet]
        public MethodResponse<List<Time>> GetByModule(int moduleId)
        {
            var result = new MethodResponse<List<Time>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _timeService.GetTimesByModule(moduleId)
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

        [Route("api/Time")]
        [HttpGet]
        public MethodResponse<Time> Get(int id)
        {
            var result = new MethodResponse<Time> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _timeService.GetTime(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/Time")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] Time model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                model.Created = DateTime.Now;
                model.Creator = userId;
                model.StatusRecordId = 1;

                _timeService.CreateTime(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }


        [Route("api/Time")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] Time model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Time time = _timeService.GetTime(model.Id);

                time.Name = model.Name;
                time.InitialValue = model.InitialValue;
                time.FinalValue = model.FinalValue;
                time.ModuleId = model.ModuleId;
                time.WithRange = model.WithRange;
                time.TimeTypeId = model.TimeTypeId;
                time.Modified = DateTime.Now;
                time.Modifier = userId;

                _timeService.UpdateTime(time);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/TimeStatus")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody]StatusUpdateModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Time time = _timeService.GetTime(Convert.ToInt32(model.Id));
                time.StatusRecordId = model.Status;
                time.Modified = DateTime.Now;
                time.Modifier = userId;

                _timeService.UpdateTime(time);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/Time")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Time time = _timeService.GetTime(id);
                time.StatusRecordId = 3;
                time.Erased = DateTime.Now;
                time.Eraser = userId;

                _timeService.UpdateTime(time);
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