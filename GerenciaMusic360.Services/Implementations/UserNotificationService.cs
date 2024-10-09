using GerenciaMusic360.Common.Enum;
using GerenciaMusic360.Data;
using GerenciaMusic360.Entities.Models;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;

namespace GerenciaMusic360.Services.Implementations
{
    public class UserNotificationService : Repository<UserNotificationModel>, IUserNotificationService
    {
        public UserNotificationService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<UserNotificationModel> GetUserNotification(NotificationType notification)
        {
            DbCommand cmd = LoadCmd("GetUserNotification");
            cmd = AddParameter(cmd, "Id", (int)notification);
            return ExecuteReader(cmd);
        }
    }
}
