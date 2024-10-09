using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class PermissionService : Repository<Permission>, IPermissionService
    {
        public PermissionService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }
        public void Create(Permission permission)
        {
            if (!this.FindAll(item => item.ControllerName == permission.ControllerName
             && item.ActionName == permission.ActionName).Any())
            {
                this.Add(permission);
            }
        }

        public void DeletePermission(Permission permission)
        {
            this.Delete(permission);
        }

        public IEnumerable<Permission> GetList()
        {
            string[] other = { "RolProfilePermission" };
            return this.GetAll(other);
        }

        public Permission Get(int id)
        {
            return this.Find(x => x.Id == id);
        }

        public void Update(Permission permission)
        {
            this.Update(permission, permission.Id);
        }




    }
}
