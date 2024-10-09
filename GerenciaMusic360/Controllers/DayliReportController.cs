using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace GerenciaMusic360.Controllers
{
    //[Route("api/[controller]")]
    [ApiController]
    public class DayliReportController : ControllerBase
    {
        //variables?
        private readonly IDayliReportService _dayliReportService;

        public DayliReportController(IDayliReportService dayliReportService)
        {
            _dayliReportService = dayliReportService;
        }
        // GET: api/<DayliReportController>

        //trae todos los reportes por usuario
        [Route("api/DayliReportsByUser")]
        [HttpGet]

        public MethodResponse<List<DayliReport>> Get( int UserId)
        {
            var result = new MethodResponse<List<DayliReport>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _dayliReportService.GetReportByUserId(UserId).ToList();
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -101;
                result.Result = null;
            }
            return result;
        }

        //solo trae los reportes de fechas especificas
        [Route("api/DayliReportByUserAndDate")]
        [HttpGet]
        public MethodResponse<List<DayliReport>> Get(string InitialDate, int UserId)
        {
            var result = new MethodResponse<List<DayliReport>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _dayliReportService.GetByUserAndDate(InitialDate, UserId).ToList();
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }


        // POST api/<DayliReportController>
        //guarda un reporte
        [Route("api/DayliReport")]
        [HttpPost]
        public MethodResponse<int> Post([FromBody] DayliReport model)
        {
            var result = new MethodResponse<int> { Code = 100, Message = "Success", Result = 0 };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                model.Completed = 0;

                DayliReport resultCreate = _dayliReportService.CreateRecord(model);
                result.Result = resultCreate.Id;
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = 0;
            }
            return result;
        }

    }
}
