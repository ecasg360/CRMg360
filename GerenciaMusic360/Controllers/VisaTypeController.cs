using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class VisaTypeController : ControllerBase
    {
        private readonly IVisaTypeService _visaTypeService;
        public VisaTypeController(
            IVisaTypeService visaTypeService)
        {
            _visaTypeService = visaTypeService;
        }

        [Route("api/VisaTypes")]
        [HttpGet]
        public MethodResponse<List<VisaType>> Get()
        {
            var result = new MethodResponse<List<VisaType>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _visaTypeService.GetAllVisaTypes()
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

        [Route("api/VisaType")]
        [HttpGet]
        public MethodResponse<VisaType> Get(short id)
        {
            var result = new MethodResponse<VisaType> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _visaTypeService.GetVisaType(id);
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