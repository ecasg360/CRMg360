using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class MetasController : ControllerBase
    {
        private readonly IMetasService _metasService;
        private readonly IMetasCommentsService _metasCommentsService;

        public MetasController(
            IMetasService metasService,
            IMetasCommentsService metasCommentsService)
        {
            _metasService = metasService;
            _metasCommentsService = metasCommentsService;
        }

        [Route("api/Metas")]
        [HttpGet]
        public MethodResponse<List<Metas>> Get(string InitialDate)
        {
            var result = new MethodResponse<List<Metas>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _metasService.GetCurrentWeek(InitialDate).ToList();
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/MetasByUserAndDate")]
        [HttpGet]
        public MethodResponse<List<Metas>> Get(string InitialDate, int UserId)
        {
            var result = new MethodResponse<List<Metas>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _metasService.GetByUserAndDate(InitialDate, UserId).ToList();
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/Metas")]
        [HttpPost]
        public MethodResponse<int> Post([FromBody] Metas model)
        {
            var result = new MethodResponse<int> { Code = 100, Message = "Success", Result = 0 };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                model.Completed = 0;
                model.StatusRecordId = 1;

                Metas resultCreate = _metasService.CreateRecord(model);
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

        [Route("api/Metas")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] Metas model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {

                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Metas meta = _metasService.GetRecord(model.Id);

                meta.GoalDescription = model.GoalDescription;
                meta.IsMeasurable = model.IsMeasurable;
                meta.StatusRecordId = 1;
                _metasService.UpdateRecord(meta);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/MetasCompleted")]
        [HttpPut]
        public MethodResponse<bool> PutCompleted([FromBody] Metas model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {

                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Metas meta = _metasService.GetRecord(model.Id);

                meta.IsCompleted = model.IsCompleted;
                meta.StatusRecordId = 1;
                _metasService.UpdateRecord(meta);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/Metas")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Metas meta = _metasService.GetRecord(id);
                meta.StatusRecordId = 3;
                _metasService.DeleteRecord(meta);
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
