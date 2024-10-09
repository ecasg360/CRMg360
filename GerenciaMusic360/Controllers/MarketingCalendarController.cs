using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class MarketingCalendarController : ControllerBase
    {
        private readonly IMarketingCalendarService _calendarService;

        public MarketingCalendarController(IMarketingCalendarService calendarService)
        {
            _calendarService = calendarService;
        }

        [Route("api/MarketingCalendars")]
        [HttpGet]
        public MethodResponse<List<MarketingCalendar>> Get(int marketingId)
        {
            var result = new MethodResponse<List<MarketingCalendar>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _calendarService.GetAll(marketingId)
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

        [Route("api/MarketingCalendar")]
        [HttpPost]
        public MethodResponse<MarketingCalendar> Post([FromBody] MarketingCalendar model)
        {
            var result = new MethodResponse<MarketingCalendar> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _calendarService.Create(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }


        [Route("api/MarketingCalendar")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] MarketingCalendar model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                MarketingCalendar calendar = _calendarService.Get(model.Id);

                calendar.FromDate = model.FromDate;
                calendar.ToDate = model.ToDate;
                calendar.Description = model.Description;

                _calendarService.Update(calendar);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/MarketingCalendar")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                MarketingCalendar calendar = _calendarService.Get(id);
                _calendarService.Delete(calendar);
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