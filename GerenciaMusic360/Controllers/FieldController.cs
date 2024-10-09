using GerenciaMusic360.Entities;
using GerenciaMusic360.Entities.Models;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class FieldController : ControllerBase
    {
        private readonly IFieldService _FieldService;
        private readonly IFieldValueService _FieldValueService;
        private readonly IHelperService _helperService;
        private readonly IHostingEnvironment _env;
        private readonly IModuleService _moduleService;

        public FieldController(IFieldService FieldService, IHelperService helperService, IHostingEnvironment env, IModuleService moduleService, IFieldValueService fieldValueService)
        {
            _FieldService = FieldService;
            _helperService = helperService;
            _env = env;
            _moduleService = moduleService;
            _FieldValueService = fieldValueService;
        }

        [Route("api/Fields")]
        [HttpGet]
        public MethodResponse<List<Field>> Get()
        {
            var result = new MethodResponse<List<Field>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _FieldService.GetAllFields()
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

        [Route("api/FieldsByModule")]
        [HttpGet]
        public MethodResponse<List<Field>> Get(int moduleId, int moduleTypeId, int documentId)
        {
            var result = new MethodResponse<List<Field>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _FieldService.GetAllFieldsByModule(moduleId, moduleTypeId, documentId)
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

        [Route("api/Field")]
        [HttpGet]
        public MethodResponse<Field> Get(int id)
        {
            var result = new MethodResponse<Field> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _FieldService.GetField(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/Field")]
        [HttpPost]
        public MethodResponse<int> Post([FromBody] Field model)
        {
            var result = new MethodResponse<int> { Code = 100, Message = "Success", Result = 0 };
            try
            {
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                model.StatusRecordId = 1;
                model.Created = DateTime.Now;
                model.Creator = userId;
                _FieldService.CreateField(model);
                result.Result = model.Id;
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = 0;
            }
            return result;
        }


        [Route("api/Field")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] Field model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                var field = _FieldService.GetField(model.Id);

                field.FieldTypeId = model.FieldTypeId;
                field.Key = model.Key;
                field.Text = model.Text;
                field.ValueDefault = model.ValueDefault;
                field.ModuleId = model.ModuleId;
                field.Dimension = model.Dimension;
                field.ModuleTypeId = model.ModuleTypeId;
                field.Position = model.Position;
                field.Required = model.Required;
                field.Modifier = userId;
                field.Modified = DateTime.Now;

                _FieldService.UpdateField(field);

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

        [Route("api/FieldStatus")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody]StatusUpdateModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Field Field = _FieldService.GetField(Convert.ToInt32(model.Id));
                Field.StatusRecordId = model.Status;
                Field.Modified = DateTime.Now;
                Field.Modifier = userId;

                _FieldService.UpdateField(Field);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/Field")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                var field = _FieldService.GetField(id);
                field.StatusRecordId = 3;
                field.Erased = DateTime.Now;
                field.Eraser = userId;
                _FieldService.UpdateField(field);
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