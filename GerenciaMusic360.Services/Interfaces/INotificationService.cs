using GerenciaMusic360.Common.Enum;
using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface INotificationService
    {
        IEnumerable<Notification> GetAllNotifications();
        Notification GetNotification(NotificationType notificationType);
    }
}
