using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IRolProfilePermissionService
    {
        IEnumerable<RolProfilePermission> GetList();
        RolProfilePermission Get(long id);
        void Create(RolProfilePermission permission);
        void Update(RolProfilePermission permission);
        void DeletePermission(RolProfilePermission permission);
        RolProfilePermission DeleteAllPermission(int rolId);
    }
}
