using GerenciaMusic360.Entities;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IGroupMemberService
    {
        GroupMember GetGroupMember(int personId, int personRelationId);
        GroupMember CreateGroupMember(GroupMember groupMember);
        GroupMember GetGroupMemberByMember(int personId);
        void UpdateGroupMember(GroupMember groupMember);
    }
}
