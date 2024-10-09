using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class GroupMemberService : Repository<GroupMember>, IGroupMemberService
    {
        public GroupMemberService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public GroupMember GetGroupMember(int personId, int personRelationId)
        {
            DbCommand cmd = LoadCmd("GetGroupMember");
            cmd = AddParameter(cmd, "PersonId", personId);
            cmd = AddParameter(cmd, "PersonRelationId", personRelationId);
            return ExecuteReader(cmd).First();
        }

        public GroupMember GetGroupMemberByMember(int personId)
        {
            DbCommand cmd = LoadCmd("GetGroupMemberByMember");
            cmd = AddParameter(cmd, "PersonId", personId);
            return ExecuteReader(cmd).First();
        }

        public GroupMember CreateGroupMember(GroupMember groupMember) =>
        Add(groupMember);

        public void UpdateGroupMember(GroupMember groupMember) =>
        Update(groupMember, groupMember.Id);

    }
}
