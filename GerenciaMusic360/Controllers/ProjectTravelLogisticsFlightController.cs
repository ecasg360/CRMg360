using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class ProjectTravelLogisticsFlightController : ControllerBase
    {
        private readonly IProjectTravelLogisticsFlightService _service;

        public ProjectTravelLogisticsFlightController(
           IProjectTravelLogisticsFlightService service
           )
        {
            _service = service;

        }

        [Route("api/ProjectTravelLogisticsFlight")]
        [HttpGet]
        public MethodResponse<List<ProjectTravelLogisticsFlight>> GetByProject(int projectId)
        {
            var result = new MethodResponse<List<ProjectTravelLogisticsFlight>> { Code = 100, Message = "Success", Result = null };
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

        [Route("api/ProjectTravelLogisticsFlight")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] ProjectTravelLogisticsFlight model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                model.StatusRecordId = 1;
                model.Created = DateTime.Now;
                model.Creator = userId;
                _service.CreateProjectTravelLogisticsFlight(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/ProjectTravelLogisticsFlight")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] ProjectTravelLogisticsFlight model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                var flight = _service.Get(model.Id);

                flight.AirLineId = model.AirLineId;
                flight.ArrivalDate = model.ArrivalDate;
                flight.ArrivalCity = model.ArrivalCity;
                flight.DepartureDate = model.DepartureDate;
                flight.DepartureCity = model.DepartureCity;
                flight.FlightNumber = model.FlightNumber;
                flight.PassengerName = model.PassengerName;
                flight.PassengerSeat = model.PassengerSeat;
                flight.ProjectTravelLogisticsId = model.ProjectTravelLogisticsId;
                flight.TotalCost = model.TotalCost;
                flight.Modifier = userId;
                flight.Modified = DateTime.Now;

                _service.UpdateProjectTravelLogisticsFlight(flight);

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


        [Route("api/ProjectTravelLogisticsFlight")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                var flight = _service.Get(id);
                flight.StatusRecordId = 3;
                flight.Erased = DateTime.Now;
                flight.Eraser = userId;
                _service.UpdateProjectTravelLogisticsFlight(flight);
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
