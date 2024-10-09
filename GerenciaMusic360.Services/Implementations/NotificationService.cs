using GerenciaMusic360.Common.Enum;
using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class NotificationService : Repository<Notification>, INotificationService
    {
        public NotificationService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<Notification> GetAllNotifications()
        {
            DbCommand cmd = LoadCmd("GetAllNotifications");
            return ExecuteReader(cmd);
        }

        public Notification GetNotification(NotificationType notificationType)
        {
            DbCommand cmd = LoadCmd("GetNotification");
            cmd = AddParameter(cmd, "Id", (int)notificationType);
            return ExecuteReader(cmd).First();
        }
    }
}
