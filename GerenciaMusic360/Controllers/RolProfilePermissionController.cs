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
    public class RolProfilePermissionController : ControllerBase
    {
        private readonly IRolProfilePermissionService _rolePermissionService;
        private readonly IRoleProfileService _roleService;
        private readonly IPermissionService _permisionService;
        private readonly IHelperService _helperService;
        private readonly IHostingEnvironment _env;
        public RolProfilePermissionController(
            IRolProfilePermissionService rolePermissionService,
            IRoleProfileService roleService,
            IPermissionService permisionService,
            IHelperService helperService,
            IHostingEnvironment env
            )
        {
            _rolePermissionService = rolePermissionService;
            _permisionService = permisionService;
            _roleService = roleService;
            _helperService = helperService;
            _env = env;
        }
        [Route("api/RolProfilePermission")]
        [HttpPost]
        public MethodResponse<List<RolProfilePermission>> Post(TodoModel todo)
        {
            var result = new MethodResponse<List<RolProfilePermission>> { Code = 100, Message = "Success", Result = null };
            try
            {
                var lstLastPermissions = _rolePermissionService.GetList().Where(rp => rp.RoleProfileId == int.Parse(todo.Id)).ToList();
                foreach (var rolePermission in lstLastPermissions)
                {
                    _rolePermissionService.DeletePermission(rolePermission);
                }
                var lstPermissions = todo.children.Where(p => !p.Id.Contains("_parent")).ToList();
                foreach (var newRolePermision in lstPermissions)
                {
                    RolProfilePermission rolPermission = new RolProfilePermission()
                    {
                        RoleProfileId = int.Parse(todo.Id),
                        PermissionId = long.Parse(newRolePermision.Id)
                    };
                    this._rolePermissionService.Create(rolPermission);
                }

            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }
        [Route("api/RolProfilePermission")]
        [HttpDelete]
        public MethodResponse<List<RolProfilePermission>> Delete(int id)
        {
            var result = new MethodResponse<List<RolProfilePermission>> { Code = 100, Message = "Success", Result = null };
            try
            {
                var lstLastPermissions = _rolePermissionService.GetList().Where(rp => rp.RoleProfileId == id).ToList();
                foreach (var rolePermission in lstLastPermissions)
                {
                    _rolePermissionService.DeletePermission(rolePermission);
                }
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }
        [Route("api/AddAllPermission")]
        [HttpGet]
        public MethodResponse<List<TodoModel>> AddAllPermission(int id)
        {
            var result = new MethodResponse<List<TodoModel>> { Code = 100, Message = "Success", Result = null };
            try
            {
                _rolePermissionService.DeleteAllPermission(id);
                result.Result = null;
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