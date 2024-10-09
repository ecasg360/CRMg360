using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IProjectMemberService
    {
        ProjectMember GetProjectMember(int id);
        ProjectMember GetProjectMember(int projectId, long userId);
        void CreateProjectMember(ProjectMember projectMember);
        IEnumerable<ProjectMember> CreateProjectMembers(List<ProjectMember> projectMembers);
        void DeleteProjectMember(ProjectMember projectMember);
        void UpdateProjectMember(ProjectMember projectMember);
        //void UpdateProjectMemberOwner(ProjectMember projectMember);
    }
}
