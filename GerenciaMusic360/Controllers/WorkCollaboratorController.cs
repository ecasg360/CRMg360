using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class WorkCollaboratorController : ControllerBase
    {
        private readonly IWorkCollaboratorService _workCollaborator;

        public WorkCollaboratorController(
            IWorkCollaboratorService workCollaborator
            )
        {
            _workCollaborator = workCollaborator;
        }

        [Route("api/WorkCollaborators")]
        [HttpGet]
        public MethodResponse<List<WorkCollaborator>> Get(int workId)
        {
            var result = new MethodResponse<List<WorkCollaborator>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _workCollaborator.GetWorkCollaboratorsByWork(workId).ToList();

            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/WorkCollaborator")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] WorkCollaborator model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                _workCollaborator.CreateWorkCollaborator(model);

            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/WorkCollaborators")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] List<WorkCollaborator> model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                _workCollaborator.CreateWorkCollaborators(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/WorkCollaborator")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] WorkCollaborator model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                WorkCollaborator workCollaborator =
                    _workCollaborator.GetWorkCollaborator(model.WorkId, model.ComposerId);

                workCollaborator.ComposerId = model.ComposerId;
                workCollaborator.AmountRevenue = model.AmountRevenue;
                workCollaborator.PercentageRevenue = model.PercentageRevenue;

                _workCollaborator.UpdateWorkCollaborator(workCollaborator);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/WorkCollaborators")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] List<WorkCollaborator> model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                var listCollaborators = _workCollaborator.GetWorkCollaboratorsByWork(model[0].WorkId).ToList();
                var listExist = listCollaborators.Where(b => model.Any(a => a.ComposerId == b.ComposerId)).ToList();
                var listDelete = listCollaborators.Where(b => !listExist.Any(a => a.ComposerId == b.ComposerId)).ToList();
                var listNew = model.Where(b => !listCollaborators.Any(a => a.ComposerId == b.ComposerId)).ToList();

                //Se agregan los nuevos colaboradores
                if (listNew.Count() > 0)
                {
                    _workCollaborator.CreateWorkCollaborators(listNew);
                }

                //Se remueven los colaboradores que ya no estan asignados a la obra
                if (listDelete.Count() > 0)
                {
                    _workCollaborator.DeleteWorkCollaborators(listDelete);
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

        [Route("api/WorkCollaborator")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int workId, int composerId)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                WorkCollaborator workCollaborator =
                   _workCollaborator.GetWorkCollaborator(workId, composerId);

                _workCollaborator.DeleteWorkCollaborator(workCollaborator);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/WorkCollaborators")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int workId)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                IEnumerable<WorkCollaborator> workCollaborators =
                   _workCollaborator.GetWorkCollaboratorsByWork(workId);

                _workCollaborator.DeleteWorkCollaborators(workCollaborators);
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