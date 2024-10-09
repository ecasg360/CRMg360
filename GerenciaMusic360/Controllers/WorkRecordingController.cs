using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class WorkRecordingController : ControllerBase
    {
        private readonly IWorkRecordingService _workRecording;

        public WorkRecordingController(
            IWorkRecordingService workRecording
            )
        {
            _workRecording = workRecording;
        }

        [Route("api/WorkRecording")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] WorkRecording model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                model.RecordingDate = DateTime.Parse(model.RecordingDateString);
                _workRecording.CreateWorkRecording(model);

            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/WorkRecordings")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] List<WorkRecording> model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                model.ForEach(f => f.RecordingDate = null);
                _workRecording.CreateWorkRecordings(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/WorkRecording")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] WorkRecording model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                WorkRecording workRecording =
                    _workRecording.GetWorkRecording(model.WorkId, model.ArtistId);

                workRecording.RecordingDate = DateTime.Parse(model.RecordingDateString);
                workRecording.AmountRevenue = model.AmountRevenue;
                workRecording.Rating = model.Rating;
                workRecording.Notes = model.Notes;

                _workRecording.UpdateWorkRecording(workRecording);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/WorkRecordings")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] List<WorkRecording> model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                var listRecordings = _workRecording.GetAllWorkRecordings(model[0].WorkId).ToList();
                var listExist = listRecordings.Where(b => model.Any(a => a.ArtistId == b.ArtistId)).ToList();
                var listDelete = listRecordings.Where(b => !listExist.Any(a => a.ArtistId == b.ArtistId)).ToList();
                var listNew = model.Where(b => !listRecordings.Any(a => a.ArtistId == b.ArtistId)).ToList();

                //Se agregan los nuevos colaboradores
                if (listNew.Count() > 0)
                {
                    _workRecording.CreateWorkRecordings(listNew);
                }

                //Se remueven los colaboradores que ya no estan asignados a la obra
                if (listDelete.Count() > 0)
                {
                    _workRecording.DeleteWorkRecordings(listDelete);
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

        [Route("api/WorkRecording")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int workId, int artistId)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                WorkRecording workRecording =
                     _workRecording.GetWorkRecording(workId, artistId);

                _workRecording.DeleteWorkRecording(workRecording);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/WorkRecordings")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int workId)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                IEnumerable<WorkRecording> workRecordings =
                   _workRecording.GetAllWorkRecordings(workId);

                _workRecording.DeleteWorkRecordings(workRecordings);
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