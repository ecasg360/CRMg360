using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Data.SqlClient;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class FieldValueController : ControllerBase
    {
        private readonly IFieldValueService _FieldValueService;
        private readonly IHelperService _helperService;
        private readonly IHostingEnvironment _env;
        private readonly IModuleService _moduleService;

        public FieldValueController(IFieldValueService FieldValueService, IHelperService helperService, IHostingEnvironment env, IModuleService moduleService)
        {
            _FieldValueService = FieldValueService;
            _helperService = helperService;
            _env = env;
            _moduleService = moduleService;
        }

        [Route("api/FieldValue")]
        [HttpGet]
        public MethodResponse<FieldValue> Get(int id)
        {
            var result = new MethodResponse<FieldValue> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _FieldValueService.GetFieldValue(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/FieldValue")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] FieldValue[] lstModel)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                foreach (FieldValue fieldValue in lstModel)
                {
                    if (fieldValue.Id > 0)
                    {
                        var model = _FieldValueService.GetFieldValue(fieldValue.Id);

                        model.FieldId = fieldValue.FieldId;
                        model.ModuleId = fieldValue.ModuleId;
                        model.DocumentId = fieldValue.DocumentId;
                        model.Value = fieldValue.Value;
                        _FieldValueService.UpdateFieldValue(model);
                        result.Result = true;
                    }
                    else
                    {
                        fieldValue.StatusRecordId = 1;
                        fieldValue.Value = fieldValue.Value ?? string.Empty;
                        _FieldValueService.CreateFieldValue(fieldValue);
                        result.Result = true;
                    }
                }
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }


        [Route("api/FieldValue")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] FieldValue model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                var FieldValue = _FieldValueService.GetFieldValue(model.Id);

                FieldValue.FieldId = model.FieldId;
                FieldValue.ModuleId = model.ModuleId;
                FieldValue.DocumentId = model.DocumentId;
                FieldValue.Value = model.Value;
                _FieldValueService.UpdateFieldValue(FieldValue);

            }
            catch (SqlException ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
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