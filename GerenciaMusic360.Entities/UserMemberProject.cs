using System.Collections.Generic;

namespace GerenciaMusic360.Entities
{
    public class UserMemberProject : UserProfile
    {
        public int MemberProjectId { get; set; }
        public int ProjectId { get; set; }
        public bool IsOwner { get; set; }
        public int ProjectRoleId { get; set; }
        public List<ProjectMember> ProjectMembers { get; set; }

    }
}
