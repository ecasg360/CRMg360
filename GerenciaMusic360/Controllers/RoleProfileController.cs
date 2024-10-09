using GerenciaMusic360.Entities;
using GerenciaMusic360.Entities.Models;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class RoleProfileController : ControllerBase
    {
        private readonly IRoleProfileService _roleProfileService;
        private readonly RoleManager<AspNetRoles> _roleManager;

        public RoleProfileController(
            IRoleProfileService roleProfileService,
            RoleManager<AspNetRoles> roleManager
            )
        {
            _roleManager = roleManager;
            _roleProfileService = roleProfileService;
        }

        [Route("api/Roles")]
        [HttpGet]
        public MethodResponse<List<RoleProfile>> Get()
        {
            var result = new MethodResponse<List<RoleProfile>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _roleProfileService.GetAllRoleProfiles()
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

        [Route("api/Role")]
        [HttpGet]
        public MethodResponse<RoleProfile> Get(int id)
        {
            var result = new MethodResponse<RoleProfile> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _roleProfileService.GetRoleProfile(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/Role")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody]RoleProfile model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                AspNetRoles role = new AspNetRoles();
                role.Name = model.Name;
                IdentityResult roleResult = _roleManager.CreateAsync(role).Result;
                if (!roleResult.Succeeded)
                {
                    string errors = string.Empty;
                    roleResult.Errors.ToList().ForEach(f => errors += $"{f.Description}, ");
                    result.Message = errors.Remove(errors.Length - 1);
                    result.Code = -100;
                }
                else
                {
                    var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                    _roleProfileService.CreateRoleProfile(new RoleProfile
                    {
                        RoleId = role.Id,
                        Description = model.Description,
                        StatusRecordId = 1,
                        Created = DateTime.Now,
                        Creator = userId
                    });
                }
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/Role")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] RoleProfile model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                var role = _roleProfileService.GetRoleProfile(model.Id);
                var roleApp = _roleManager.FindByIdAsync(role.RoleId).Result;
                roleApp.Name = model.Name;

                var r = _roleManager.UpdateAsync(roleApp);
                if (r.Result.Succeeded)
                {
                    var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                    role.Description = model.Description;
                    role.Modified = DateTime.Now;
                    role.Modifier = userId;

                    _roleProfileService.UpdateRoleProfile(role);
                }
                else
                {
                    string errors = string.Empty;
                    r.Result.Errors.ToList().ForEach(f => errors += $"{f.Description}, ");

                    result.Code = -100;
                    result.Message = errors.Remove(errors.Length - 1);
                }
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/RoleStatus")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] StatusUpdateModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                var role = _roleProfileService.GetRoleProfile(Convert.ToInt32(model.Id));
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                role.StatusRecordId = model.Status;
                role.Modified = DateTime.Now;
                role.Modifier = userId;
                _roleProfileService.UpdateRoleProfile(role);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/Role")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                var role = _roleProfileService.GetRoleProfile(id);
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                role.StatusRecordId = 3;
                role.Erased = DateTime.Now;
                role.Eraser = userId;
                _roleProfileService.UpdateRoleProfile(role);
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