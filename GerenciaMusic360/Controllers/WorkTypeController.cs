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
    public class WorkTypeController : ControllerBase
    {
        private readonly IWorkTypeService _workTypeService;
        public WorkTypeController(
            IWorkTypeService workTypeService)
        {
            _workTypeService = workTypeService;
        }

        [Route("api/WorkTypes")]
        [HttpGet]
        public MethodResponse<List<WorkType>> Get()
        {
            var result = new MethodResponse<List<WorkType>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _workTypeService.GetAllWorkTypes()
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

        [Route("api/WorkType")]
        [HttpGet]
        public MethodResponse<WorkType> Get(int id)
        {
            var result = new MethodResponse<WorkType> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _workTypeService.GetWorkType(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/WorkType")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] WorkType model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                model.Created = DateTime.Now;
                model.Creator = userId;
                model.StatusRecordId = 1;
                _workTypeService.CreateWorkType(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/WorkType")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] WorkType model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                var workType = _workTypeService.GetWorkType(model.Id);
                workType.Name = model.Name;
                workType.Description = model.Description;
                workType.Modified = DateTime.Now;
                workType.Modifier = userId;

                _workTypeService.UpdateWorkType(workType);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/WorkType")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody]StatusUpdateModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                var user = _workTypeService.GetWorkType(Convert.ToInt32(model.Id));
                user.StatusRecordId = model.Status;
                user.Modified = DateTime.Now;
                user.Modifier = userId;
                _workTypeService.UpdateWorkType(user);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        /*[Route("api/ArtistType")]
        [HttpDelete]
        public MethodResponse<bool> Delete(short id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                var user = _artistTypeService.GetArtistType(id);
                user.StatusRecordId = 3;
                user.Erased = DateTime.Now;
                user.Eraser = userId;
                _artistTypeService.UpdateArtistType(user);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }*/
    }
}