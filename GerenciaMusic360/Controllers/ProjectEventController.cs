using GerenciaMusic360.Entities;
using GerenciaMusic360.Entities.Models;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class ProjectEventController : ControllerBase
    {
        private readonly IConfigurationLabelCopyService _configuration;
        private readonly IHostingEnvironment _env;
        private readonly IProjectEventService _projectEventService;

        public ProjectEventController(
            IConfigurationLabelCopyService configuration,
            IHostingEnvironment env,
            IProjectEventService projectEventService
        )
        {
            _configuration = configuration;
            _env = env;
            _projectEventService = projectEventService;
        }

        [Route("api/ProjectEventsByProject")]
        [HttpGet]
        public MethodResponse<IEnumerable<ProjectEvent>> GetProjectEvents(int projectId)
        {
            var result = new MethodResponse<IEnumerable<ProjectEvent>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _projectEventService.GetProjectEvents(projectId).ToArray();
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/ProjectEvents")]
        [HttpGet]
        public MethodResponse<IEnumerable<ProjectEvent>> Get(int projectId)
        {
            var result = new MethodResponse<IEnumerable<ProjectEvent>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _projectEventService.GetEventsByProjectId(projectId).ToArray();
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/ProjectEvent")]
        [HttpPost]
        public MethodResponse<int> Post([FromBody] ProjectEvent model)
        {
            var result = new MethodResponse<int> { Code = 100, Message = "Success", Result = 0 };
            try
            {
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                model.StatusRecordId = 1;
                model.Created = DateTime.Now;
                model.Creator = userId;
                _projectEventService.Create(model);
                result.Result = model.Id;
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = 0;
            }
            return result;
        }


        [Route("api/ProjectEvent")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] ProjectEvent model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                var projectEvent = _projectEventService.Get(model.Id);

                projectEvent.EventDate = model.EventDate;
                projectEvent.LocationId = model.LocationId;
                projectEvent.Deposit = model.Deposit;
                projectEvent.LastPayment = model.LastPayment;
                projectEvent.DepositDate = model.DepositDate;
                projectEvent.LastPaymentDate = model.LastPaymentDate;
                projectEvent.Guarantee = model.Guarantee;
                projectEvent.Venue = model.Venue;
                projectEvent.Modifier = userId;
                projectEvent.Modified = DateTime.Now;

                _projectEventService.Update(projectEvent);

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

        [Route("api/ProjectEvent")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                var field = _projectEventService.Get(id);
                field.StatusRecordId = 3;
                field.Erased = DateTime.Now;
                field.Eraser = userId;
                _projectEventService.Update(field);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/ProjectEventStatus")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody]StatusUpdateModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                ProjectEvent projectEvent = _projectEventService.Get(Convert.ToInt32(model.Id));
                projectEvent.StatusRecordId = model.Status;
                projectEvent.Modified = DateTime.Now;
                projectEvent.Modifier = userId;

                _projectEventService.Update(projectEvent);
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