using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class RoleProfileService : Repository<RoleProfile>, IRoleProfileService
    {
        public RoleProfileService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<RoleProfile> GetAllRoleProfiles()
        {
            DbCommand cmd = LoadCmd("GetAllRoleProfiles");
            return ExecuteReader(cmd);
        }

        public RoleProfile GetRoleProfile(int id)
        {
            DbCommand cmd = LoadCmd("GetRoleProfile");
            cmd = AddParameter(cmd, "Id", id);
            return ExecuteReader(cmd).First();
        }

        public void CreateRoleProfile(RoleProfile role) =>
        Add(role);

        public void UpdateRoleProfile(RoleProfile role) =>
        Update(role, role.Id);

        public void DeleteRoleProfile(RoleProfile role) =>
        Delete(role);

        public RoleProfile GetRoleByRoleId(string id) =>
        Find(w => w.RoleId == id);
    }
}
