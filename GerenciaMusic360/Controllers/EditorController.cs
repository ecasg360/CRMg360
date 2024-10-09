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
    public class EditorController : ControllerBase
    {
        private readonly IEditorService _editorService;

        public EditorController(IEditorService editorService)
        {
            _editorService = editorService;
        }

        [Route("api/EditorsByInternal")]
        [HttpGet]
        public MethodResponse<List<Editor>> Get(bool isInternal)
        {
            var result = new MethodResponse<List<Editor>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _editorService.GetAllEditorsByIsInternal(isInternal)
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

        [Route("api/Editors")]
        [HttpGet]
        public MethodResponse<List<Editor>> Get()
        {
            var result = new MethodResponse<List<Editor>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _editorService.GetAllEditors()
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

        [Route("api/Editor")]
        [HttpGet]
        public MethodResponse<Editor> Get(int id)
        {
            var result = new MethodResponse<Editor> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _editorService.GetEditor(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/Editor")]
        [HttpPost]
        public MethodResponse<int> Post([FromBody] Editor model)
        {
            var result = new MethodResponse<int> { Code = 100, Message = "Success", Result = 0 };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                model.Created = DateTime.Now;
                model.Creator = userId;
                model.StatusRecordId = 1;

                result.Result = _editorService.CreateEditor(model).Id;
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = 0;
            }
            return result;
        }


        [Route("api/Editor")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] Editor model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Editor editor = _editorService.GetEditor(model.Id);

                editor.Dba = model.Dba;
                editor.LocalCompanyId = model.LocalCompanyId;
                editor.AssociationId = model.AssociationId;
                editor.IsInternal = model.IsInternal;
                editor.Modified = DateTime.Now;
                editor.Modifier = userId;
                editor.Name = model.Name;

                _editorService.UpdateEditor(editor);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/EditorStatus")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody]StatusUpdateModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Editor editor = _editorService.GetEditor(Convert.ToInt32(model.Id));
                editor.StatusRecordId = model.Status;
                editor.Modified = DateTime.Now;
                editor.Modifier = userId;

                _editorService.UpdateEditor(editor);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/Editor")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Editor editor = _editorService.GetEditor(id);
                editor.StatusRecordId = 3;
                editor.Erased = DateTime.Now;
                editor.Eraser = userId;

                _editorService.UpdateEditor(editor);
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