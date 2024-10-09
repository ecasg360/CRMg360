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
    public class FieldTypeController : ControllerBase
    {
        private readonly IFieldTypeService _FieldTypeService;
        private readonly IHelperService _helperService;
        private readonly IHostingEnvironment _env;
        private readonly IModuleService _moduleService;

        public FieldTypeController(IFieldTypeService FieldTypeService, IHelperService helperService, IHostingEnvironment env, IModuleService moduleService)
        {
            _FieldTypeService = FieldTypeService;
            _helperService = helperService;
            _env = env;
            _moduleService = moduleService;
        }

        [Route("api/FieldTypes")]
        [HttpGet]
        public MethodResponse<List<FieldType>> Get()
        {
            var result = new MethodResponse<List<FieldType>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _FieldTypeService.GetAllFieldTypes()
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

        [Route("api/FieldType")]
        [HttpGet]
        public MethodResponse<FieldType> Get(int id)
        {
            var result = new MethodResponse<FieldType> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _FieldTypeService.GetFieldType(id);
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