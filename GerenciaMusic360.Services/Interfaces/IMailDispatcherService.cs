using GerenciaMusic360.Common.Enum;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Entities.Models;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IMailDispatcherService
    {
        void CreateMailDispatchers(
            NotificationType notificationType,
            List<UserNotificationModel> recipients,
            Notification notification,
            List<ReplaceModel> replaces);

        string ReplaceTag(string HtmlBody, List<ReplaceModel> replaces);
    }
}
