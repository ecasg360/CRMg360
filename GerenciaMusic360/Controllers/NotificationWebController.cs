using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class NotificationWebController : ControllerBase
    {

        private readonly INotificationWebService _notificationService;

        public NotificationWebController(INotificationWebService notificationService)
        {
            _notificationService = notificationService;
        }

        [Route("api/NotificationWeb")]
        [HttpGet]
        public MethodResponse<List<NotificationWeb>> Get(long userId)
        {
            var result = new MethodResponse<List<NotificationWeb>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _notificationService.GetAll(userId)
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

        [Route("api/NotificationWeb")]
        [HttpDelete]
        public MethodResponse<bool> Delete(long id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                NotificationWeb notification = _notificationService.Get(id);
                notification.Active = false;

                _notificationService.Update(notification);
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