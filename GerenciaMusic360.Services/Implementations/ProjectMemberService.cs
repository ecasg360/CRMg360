using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class ProjectMemberService : Repository<ProjectMember>, IProjectMemberService
    {
        public ProjectMemberService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public ProjectMember GetProjectMember(int id)
        {
            DbCommand cmd = LoadCmd("GetProjectMember");
            cmd = AddParameter(cmd, "Id", id);
            return ExecuteReader(cmd).First();
        }

        public ProjectMember GetProjectMember(int projectId, long userId)
        {
            DbCommand cmd = LoadCmd("GetProjectMemberByDetail");
            cmd = AddParameter(cmd, "ProjectId", projectId);
            cmd = AddParameter(cmd, "UserId", userId);
            return ExecuteReader(cmd).First();
        }

        public void CreateProjectMember(ProjectMember projectMember) =>
        Add(projectMember);

        public IEnumerable<ProjectMember> CreateProjectMembers(List<ProjectMember> projectMembers) =>
        AddRange(projectMembers);

        public void DeleteProjectMember(ProjectMember projectMember) =>
        Delete(projectMember);

        public void UpdateProjectMember(ProjectMember projectMember) =>
        Update(projectMember, projectMember.Id);

        //public void UpdateProjectMemberOwner(ProjectMember model)
        //{
        //    ProjectMember lastProjectMember = Find(w => w.IsOwner & w.ProjectId == model.ProjectId);
        //    if (lastProjectMember != null)
        //    {
        //        lastProjectMember.IsOwner = false;
        //        Update(lastProjectMember, lastProjectMember.Id);
        //    }

        //    ProjectMember newProjectMember =
        //        Find(w => w.UserId == model.UserId & w.ProjectId == model.ProjectId);
        //    newProjectMember.IsOwner = true;
        //    Update(newProjectMember, newProjectMember.Id);

        //}
    }
}