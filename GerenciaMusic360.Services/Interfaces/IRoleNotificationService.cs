using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IRoleNotificationService
    {
        IEnumerable<RoleProfileNotification> GetAllRoleNotifications();
        IEnumerable<RoleProfileNotification> GetRoleNotificationsByRole(int roleId);
        RoleProfileNotification GetRoleNotification(int id);
        void CreateRoleNotification(RoleProfileNotification roleNotification);
        void CreateRoleNotifications(List<RoleProfileNotification> roleNotifications);
        void UpdateRoleNotification(RoleProfileNotification roleNotification);
        void DeleteRoleNotification(RoleProfileNotification roleNotification);
    }
}
