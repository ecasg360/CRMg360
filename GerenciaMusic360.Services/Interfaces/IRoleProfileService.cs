using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IRoleProfileService
    {
        IEnumerable<RoleProfile> GetAllRoleProfiles();
        RoleProfile GetRoleProfile(int id);
        void CreateRoleProfile(RoleProfile user);
        void UpdateRoleProfile(RoleProfile user);
        void DeleteRoleProfile(RoleProfile user);
        RoleProfile GetRoleByRoleId(string id);
    }
}
