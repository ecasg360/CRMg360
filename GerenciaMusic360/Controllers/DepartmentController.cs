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
    public class DepartmentController : ControllerBase
    {
        private readonly IDepartmentService _departmentService;
        public DepartmentController(
            IDepartmentService departmentService)
        {
            _departmentService = departmentService;
        }

        [Route("api/Departments")]
        [HttpGet]
        public MethodResponse<IEnumerable<Department>> Get()
        {
            var result = new MethodResponse<IEnumerable<Department>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _departmentService.GetList();
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/Department")]
        [HttpGet]
        public MethodResponse<Department> Get(int id)
        {
            var result = new MethodResponse<Department> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _departmentService.Get(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/Department")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] Department model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                model.Created = DateTime.Now;
                model.Creator = userId;
                model.StatusRecordId = 1;
                _departmentService.Create(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/Department")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] Currency model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Department department = _departmentService.Get(model.Id);
                department.Name = model.Code;
                department.Description = model.Description;
                department.Modified = DateTime.Now;
                department.Modifier = userId;

                _departmentService.Update(department);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/DepartmentStatus")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody]StatusUpdateModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Department department = _departmentService.Get(Convert.ToInt32(model.Id));
                department.StatusRecordId = model.Status;
                department.Modified = DateTime.Now;
                department.Modifier = userId;
                _departmentService.Update(department);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/Department")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Department department = _departmentService.Get(id);
                department.StatusRecordId = 3;
                department.Erased = DateTime.Now;
                department.Eraser = userId;

                _departmentService.Update(department);
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
