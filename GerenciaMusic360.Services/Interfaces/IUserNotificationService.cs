using GerenciaMusic360.Common.Enum;
using GerenciaMusic360.Entities.Models;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IUserNotificationService
    {
        IEnumerable<UserNotificationModel> GetUserNotification(NotificationType notification);
    }
}
