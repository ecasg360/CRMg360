using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class ProjectTravelLogisticsOtherController : ControllerBase
    {
        private readonly IProjectTravelLogisticsOtherService _service;

        public ProjectTravelLogisticsOtherController(
           IProjectTravelLogisticsOtherService service
           )
        {
            _service = service;

        }

        [Route("api/ProjectTravelLogisticsOther")]
        [HttpGet]
        public MethodResponse<List<ProjectTravelLogisticsOther>> GetByProject(int projectId)
        {
            var result = new MethodResponse<List<ProjectTravelLogisticsOther>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _service.GetAllByProjectId(projectId)
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

        [Route("api/ProjectTravelLogisticsOther")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] ProjectTravelLogisticsOther model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                model.StatusRecordId = 1;
                model.Created = DateTime.Now;
                model.Creator = userId;
                _service.CreateProjectTravelLogisticsOther(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/ProjectTravelLogisticsOther")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] ProjectTravelLogisticsOther model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                var Other = _service.Get(model.Id);

                Other.Name = model.Name;
                Other.TotalCost = model.TotalCost;
                Other.ProjectTravelLogisticsId = model.ProjectTravelLogisticsId;
                Other.OtherTypeId = model.OtherTypeId;
                Other.TotalCost = model.TotalCost;
                Other.Modifier = userId;
                Other.Modified = DateTime.Now;

                _service.UpdateProjectTravelLogisticsOther(Other);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }


        [Route("api/ProjectTravelLogisticsOther")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                var Other = _service.Get(id);
                Other.StatusRecordId = 3;
                Other.Erased = DateTime.Now;
                Other.Eraser = userId;
                _service.UpdateProjectTravelLogisticsOther(Other);
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
