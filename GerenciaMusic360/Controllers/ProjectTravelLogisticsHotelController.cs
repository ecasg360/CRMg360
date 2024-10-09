using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class ProjectTravelLogisticsHotelController : ControllerBase
    {
        private readonly IProjectTravelLogisticsHotelService _service;

        public ProjectTravelLogisticsHotelController(
           IProjectTravelLogisticsHotelService service
           )
        {
            _service = service;

        }

        [Route("api/ProjectTravelLogisticsHotel")]
        [HttpGet]
        public MethodResponse<List<ProjectTravelLogisticsHotel>> GetByProject(int projectId)
        {
            var result = new MethodResponse<List<ProjectTravelLogisticsHotel>> { Code = 100, Message = "Success", Result = null };
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

        [Route("api/ProjectTravelLogisticsHotel")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] ProjectTravelLogisticsHotel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                model.AddressId = 1;
                model.StatusRecordId = 1;
                model.Created = DateTime.Now;
                model.Creator = userId;
                _service.CreateProjectTravelLogisticsHotel(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/ProjectTravelLogisticsHotel")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] ProjectTravelLogisticsHotel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                var hotel = _service.Get(model.Id);

                hotel.Name = model.Name;
                hotel.RoomNumber = model.RoomNumber;
                hotel.ReservationName = model.ReservationName;
                hotel.ProjectTravelLogisticsId = model.ProjectTravelLogisticsId;
                hotel.TotalCost = model.TotalCost;
                hotel.Modifier = userId;
                hotel.Modified = DateTime.Now;

                _service.UpdateProjectTravelLogisticsHotel(hotel);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }


        [Route("api/ProjectTravelLogisticsHotel")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                var hotel = _service.Get(id);
                hotel.StatusRecordId = 3;
                hotel.Erased = DateTime.Now;
                hotel.Eraser = userId;
                _service.UpdateProjectTravelLogisticsHotel(hotel);
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
