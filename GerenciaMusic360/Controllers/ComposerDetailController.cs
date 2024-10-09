using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class ComposerDetailController : Controller
    {
        private readonly IComposerDetailService _composerDetailService;

        public ComposerDetailController(IComposerDetailService composerDetailService)
        {
            _composerDetailService = composerDetailService;
        }

        [Route("api/ComposerDetails")]
        [HttpGet]
        public MethodResponse<List<ComposerDetail>> Get()
        {
            var result = new MethodResponse<List<ComposerDetail>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _composerDetailService.GetAllComposerDetail()
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

        [Route("api/ComposerDetail")]
        [HttpGet]
        public MethodResponse<ComposerDetail> GetComposer(int id)
        {
            var result = new MethodResponse<ComposerDetail> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _composerDetailService.GetComposerDetail(id);

            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/ComposerDetailByComposerId")]
        [HttpGet]
        public MethodResponse<ComposerDetail> GetComposerDetailByComposerId(int composerId)
        {
            var result = new MethodResponse<ComposerDetail> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _composerDetailService.GetComposerDetailsByComposerId(composerId);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }


        [Route("api/ComposerDetail")]
        [HttpPost]
        public MethodResponse<int> Post([FromBody] ComposerDetail model)
        {
            var result = new MethodResponse<int> { Code = 100, Message = "Success", Result = 0 };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                result.Result = _composerDetailService.CreateComposerDetail(model).Id;
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = 0;
            }
            return result;
        }


        [Route("api/ComposerDetail")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] ComposerDetail model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                ComposerDetail composerDetail = _composerDetailService.GetComposerDetail(model.Id);

                composerDetail.AssociationId = model.AssociationId;
                composerDetail.ComposerId = model.ComposerId;
                composerDetail.EditorId = model.EditorId;
                composerDetail.IPI = model.IPI;
                composerDetail.DateEnd = model.DateEnd;
                composerDetail.DateStart = model.DateStart;

                _composerDetailService.UpdateComposerDetail(composerDetail);
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
