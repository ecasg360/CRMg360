using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class GroupService : Repository<Group>, IGroupService
    {
        public GroupService(Context_DB context_DB) : base(context_DB)
        {
        }
        void IGroupService.Create(Group group) => Add(group);
        void IGroupService.Delete(Group group) => Delete(group);
        Group IGroupService.Get(int id)
        {
            DbCommand cmd = LoadCmd("GetGroup");
            cmd = AddParameter(cmd, "Id", id);
            return ExecuteReader(cmd).First();
        }
        IEnumerable<Group> IGroupService.GetAll()
        {
            DbCommand cmd = LoadCmd("GetAllGroups");
            return ExecuteReader(cmd);
        }
        void IGroupService.Update(Group group) => Update(group, group.Id);
    }
}
