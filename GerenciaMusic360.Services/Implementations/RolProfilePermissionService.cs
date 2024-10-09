using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class RolProfilePermissionService : Repository<RolProfilePermission>, IRolProfilePermissionService
    {
        public RolProfilePermissionService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }
        public void Create(RolProfilePermission permission)
        {
            this.Add(permission);
        }

        public void DeletePermission(RolProfilePermission permission)
        {
            this.Delete(permission);
        }

        public IEnumerable<RolProfilePermission> GetList()
        {
            return this.GetAll();
        }

        public RolProfilePermission Get(long id)
        {
            return this.Find(x => x.Id == id);
        }

        public void Update(RolProfilePermission permission)
        {
            this.Update(permission, permission.Id);
        }
        public RolProfilePermission DeleteAllPermission(int roleId)
        {
            DbCommand cmd = LoadCmd("SetAllPermissions");
            cmd = AddParameter(cmd, "ROLID", roleId);
            return ExecuteReader(cmd).FirstOrDefault();
        }
    }
}
