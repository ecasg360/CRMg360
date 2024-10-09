using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService _notificationService;
        public NotificationController(
            INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        [Route("api/Notifications")]
        [HttpGet]
        public MethodResponse<List<Notification>> Get()
        {
            var result = new MethodResponse<List<Notification>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _notificationService.GetAllNotifications()
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
    }
}