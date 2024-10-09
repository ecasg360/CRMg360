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
    public class RoleNotificationController : ControllerBase
    {
        private readonly IRoleNotificationService _roleNotificationService;

        public RoleNotificationController(
           IRoleNotificationService roleNotificationService)
        {
            _roleNotificationService = roleNotificationService;
        }

        [Route("api/RoleNotifications")]
        [HttpGet]
        public MethodResponse<List<RoleProfileNotification>> Get()
        {
            var result = new MethodResponse<List<RoleProfileNotification>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _roleNotificationService
                    .GetAllRoleNotifications()
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

        [Route("api/RoleNotification")]
        [HttpGet]
        public MethodResponse<List<RoleProfileNotification>> Get(int roleProfileId)
        {
            var result = new MethodResponse<List<RoleProfileNotification>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _roleNotificationService
                    .GetRoleNotificationsByRole(roleProfileId)
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

        [Route("api/RoleNotification")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] RoleProfileNotification model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                model.StatusRecordId = 1;
                model.Created = DateTime.Now;
                model.Creator = userId;

                _roleNotificationService.CreateRoleNotification(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/RoleNotifications")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] List<RoleProfileNotification> model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                foreach (RoleProfileNotification roleNotification in model)
                {
                    roleNotification.StatusRecordId = 1;
                    roleNotification.Created = DateTime.Now;
                    roleNotification.Creator = userId;
                }

                _roleNotificationService.CreateRoleNotifications(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/RoleNotificationStatus")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] StatusUpdateModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                List<RoleProfileNotification> roleNotifications = _roleNotificationService
                    .GetRoleNotificationsByRole(Convert.ToInt32(model.Id))
                    .ToList();

                foreach (RoleProfileNotification roleNotification in roleNotifications)
                {
                    roleNotification.StatusRecordId = model.Status;
                    roleNotification.Modified = DateTime.Now;
                    roleNotification.Modifier = userId;

                    _roleNotificationService.UpdateRoleNotification(roleNotification);
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

        [Route("api/RoleNotification")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int roleProfileId, int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                RoleProfileNotification roleNotification =
                    _roleNotificationService.GetRoleNotification(Convert.ToInt32(id));

                //roleNotification.StatusRecordId = 3;
                //roleNotification.Modified = DateTime.Now;
                //roleNotification.Modifier = userId;

                _roleNotificationService.DeleteRoleNotification(roleNotification);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        //[Route("api/RoleNotifications")]
        //[HttpDelete]
        //public MethodResponse<bool> Delete(int roleProfileId)
        //{
        //    var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
        //    try
        //    {
        //        string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
        //        List<RoleProfileNotification> roleNotifications = _roleNotificationService
        //            .GetRoleNotificationsByRole(Convert.ToInt32(roleProfileId))
        //            .ToList();

        //        foreach (RoleProfileNotification roleNotification in roleNotifications)
        //        {
        //            roleNotification.StatusRecordId = 3;
        //            roleNotification.Modified = DateTime.Now;
        //            roleNotification.Modifier = userId;

        //            _roleNotificationService.UpdateRoleNotification(roleNotification);
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        result.Message = ex.Message;
        //        result.Code = -100;
        //        result.Result = false;
        //    }
        //    return result;
        //}
    }
}