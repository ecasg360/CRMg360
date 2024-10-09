using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class ProjectTravelLogisticsTransportationController : ControllerBase
    {
        private readonly IProjectTravelLogisticsTransportationService _service;

        public ProjectTravelLogisticsTransportationController(
           IProjectTravelLogisticsTransportationService service
           )
        {
            _service = service;

        }

        [Route("api/ProjectTravelLogisticsTransportation")]
        [HttpGet]
        public MethodResponse<List<ProjectTravelLogisticsTransportation>> GetByProject(int projectId)
        {
            var result = new MethodResponse<List<ProjectTravelLogisticsTransportation>> { Code = 100, Message = "Success", Result = null };
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

        [Route("api/ProjectTravelLogisticsTransportation")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] ProjectTravelLogisticsTransportation model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                model.StatusRecordId = 1;
                model.Created = DateTime.Now;
                model.Creator = userId;
                _service.CreateProjectTravelLogisticsTransportation(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/ProjectTravelLogisticsTransportation")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] ProjectTravelLogisticsTransportation model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                var Transportation = _service.Get(model.Id);

                Transportation.OwnVehicle = model.OwnVehicle;
                Transportation.AutoBrandId = model.AutoBrandId;
                Transportation.VehicleName = model.VehicleName;
                Transportation.Agency = model.Agency;
                Transportation.ProjectTravelLogisticsId = model.ProjectTravelLogisticsId;
                Transportation.TotalCost = model.TotalCost;
                Transportation.Modifier = userId;
                Transportation.Modified = DateTime.Now;

                _service.UpdateProjectTravelLogisticsTransportation(Transportation);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }


        [Route("api/ProjectTravelLogisticsTransportation")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                var Transportation = _service.Get(id);
                Transportation.StatusRecordId = 3;
                Transportation.Erased = DateTime.Now;
                Transportation.Eraser = userId;
                _service.UpdateProjectTravelLogisticsTransportation(Transportation);
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
