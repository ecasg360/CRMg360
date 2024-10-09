using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IPermissionService
    {
        IEnumerable<Permission> GetList();
        Permission Get(int id);
        void Create(Permission permission);
        void Update(Permission permission);
        void DeletePermission(Permission permission);
    }
}
