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
    public class ProjectTypeController : ControllerBase
    {
        private readonly IProjectTypeService _projectTypeService;
        public ProjectTypeController(
            IProjectTypeService projectTypeService)
        {
            _projectTypeService = projectTypeService;
        }

        [Route("api/ProjectTypes")]
        [HttpGet]
        public MethodResponse<List<ProjectType>> Get()
        {
            var result = new MethodResponse<List<ProjectType>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _projectTypeService.GetList()
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

        [Route("api/ProjectType")]
        [HttpGet]
        public MethodResponse<ProjectType> Get(int id)
        {
            var result = new MethodResponse<ProjectType> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _projectTypeService.Get(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/ProjectType")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] ProjectType model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                //PersonType personType = _projectTypeService.GetPersonTypeNewId(model.EntityId);

                //odel.Id = personType.Id;
                model.Created = DateTime.Now;
                model.Creator = userId;
                model.StatusRecordId = 1;
                _projectTypeService.Create(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/ProjectType")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] ProjectType model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                ProjectType projectType = _projectTypeService.Get(model.Id);
                projectType.Name = model.Name;
                projectType.Description = model.Description;
                projectType.Modified = DateTime.Now;
                projectType.Modifier = userId;

                _projectTypeService.Update(projectType);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/ProjectTypeStatus")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody]StatusUpdateModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                ProjectType projectType = _projectTypeService.Get(Convert.ToInt32(model.Id));
                projectType.StatusRecordId = model.Status;
                projectType.Modified = DateTime.Now;
                projectType.Modifier = userId;
                _projectTypeService.Update(projectType);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/ProjectType")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                ProjectType projectType = _projectTypeService.Get(id);
                projectType.StatusRecordId = 3;
                projectType.Erased = DateTime.Now;
                projectType.Eraser = userId;

                _projectTypeService.Update(projectType);
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
