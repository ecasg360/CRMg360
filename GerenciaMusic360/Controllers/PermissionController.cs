using GerenciaMusic360.Entities;
using GerenciaMusic360.Entities.Models;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class PermissionController : ControllerBase
    {
        private readonly IPermissionService _permissionService;
        private readonly IHelperService _helperService;
        private readonly IHostingEnvironment _env;
        public PermissionController(IPermissionService permissionService,
            IHelperService helperService,
            IHostingEnvironment env
            )
        {
            _permissionService = permissionService;
            _helperService = helperService;
            _env = env;
        }
        [Route("api/Permissions")]
        [HttpGet]
        public MethodResponse<List<Permission>> Get()
        {
            var result = new MethodResponse<List<Permission>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _permissionService.GetList()
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
        [Route("api/PermissionGroup")]
        [HttpGet]
        public MethodResponse<List<TodoModel>> GetGroup()
        {
            var result = new MethodResponse<List<TodoModel>> { Code = 100, Message = "Success", Result = null };
            try
            {
                var lstPermission = _permissionService.GetList();
                var lstModulos = lstPermission.Select(item => item.Name).Distinct().OrderBy(item => item).ToList();
                List<TodoModel> lstTodo = new List<TodoModel>();
                foreach (var modulo in lstModulos)
                {
                    var parent = new TodoModel()
                    {
                        Item = modulo,
                        Id = modulo + "_parent",
                        Checked = false,
                        children = new List<TodoModel>()
                    };
                    parent.children = lstPermission.Where(i => i.Name == modulo).ToList()
                        .Select(i => new TodoModel
                        {
                            Item = i.ActionName + (!string.IsNullOrEmpty(i.Description) ? " " + "(" + i.Description + ")" : ""),
                            Id = i.Id.ToString(),
                        }).ToList();
                    lstTodo.Add(parent);
                }
                result.Result = lstTodo;
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }
        [Route("api/Permission")]
        [HttpPut]
        public MethodResponse<List<Permission>> Put(Permission permission)
        {
            var result = new MethodResponse<List<Permission>> { Code = 100, Message = "Success", Result = null };
            try
            {
                _permissionService.Update(permission);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }
        [Route("api/PermissionByRolId")]
        [HttpGet]
        public MethodResponse<List<TodoModel>> PermissionByRolId(int rolId)
        {
            var result = new MethodResponse<List<TodoModel>> { Code = 100, Message = "Success", Result = null };
            try
            {
                var lstPermission = _permissionService.GetList();
                var lstModulos = lstPermission.Select(item => item.Name).Distinct().OrderBy(item => item).ToList();
                List<TodoModel> lstTodo = new List<TodoModel>();
                foreach (var modulo in lstModulos)
                {
                    var parent = new TodoModel()
                    {
                        Item = modulo,
                        Id = modulo + "_parent",
                        Checked = false,
                        children = new List<TodoModel>()
                    };
                    var children = lstPermission.Where(i => i.Name == modulo).ToList()
                        .Select(i => new TodoModel
                        {
                            Item = i.ActionName + (!string.IsNullOrEmpty(i.Description) ? i.ControllerName + "(" + i.Description + ")" : ""),
                            Id = i.Id.ToString(),
                            Checked = i.RolProfilePermission.Where(r => r.RoleProfileId == rolId).Any(),
                        }).ToList();
                    parent.Checked = (children.Count() == (children.Where(child => child.Checked == true).Count()));
                    if (!parent.Checked)
                        parent.indeterminate = (children.Where(child => child.Checked == true).Count() > 0);
                    lstTodo.Add(parent);
                    lstTodo.AddRange(children);
                }
                result.Result = lstTodo;
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

    }
}