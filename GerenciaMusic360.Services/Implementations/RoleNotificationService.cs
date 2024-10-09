using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class RoleNotificationService : Repository<RoleProfileNotification>, IRoleNotificationService
    {
        public RoleNotificationService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<RoleProfileNotification> GetAllRoleNotifications()
        {
            DbCommand cmd = LoadCmd("GetAllRoleNotifications");
            return ExecuteReader(cmd);
        }

        public IEnumerable<RoleProfileNotification> GetRoleNotificationsByRole(int roleId)
        {
            DbCommand cmd = LoadCmd("GetRoleNotificationsByRole");
            cmd = AddParameter(cmd, "RoleId", roleId);
            return ExecuteReader(cmd);
        }

        public RoleProfileNotification GetRoleNotification(int id)
        {
            DbCommand cmd = LoadCmd("GetRoleNotification");
            cmd = AddParameter(cmd, "Id", id);
            return ExecuteReader(cmd).First();
        }

        public void CreateRoleNotification(RoleProfileNotification roleNotification) =>
        Add(roleNotification);

        public void CreateRoleNotifications(List<RoleProfileNotification> roleNotifications) =>
        AddRange(roleNotifications);

        public void UpdateRoleNotification(RoleProfileNotification roleNotification) =>
        Update(roleNotification, roleNotification.Id);

        public void DeleteRoleNotification(RoleProfileNotification roleNotification) =>
        Delete(roleNotification);
    }
}
