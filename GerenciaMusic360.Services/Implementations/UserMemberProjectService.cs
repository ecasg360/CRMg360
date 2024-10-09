using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class UserMemberProjectService : Repository<UserMemberProject>, IUserMemberProjectService
    {
        public UserMemberProjectService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<UserMemberProject> GetAllMemberProjects()
        {
            DbCommand cmd = LoadCmd("GetAllMemberProjects");
            IEnumerable<UserMemberProject> userMemberProject = ExecuteReader(cmd);

            return ProcessProjectMembers(userMemberProject);
        }

        public IEnumerable<UserMemberProject> GetAllMemberProjects(int projectId)
        {
            DbCommand cmd = LoadCmd("GetAllMemberProjectsByProject");
            cmd = AddParameter(cmd, "ProjectId", projectId);
            IEnumerable<UserMemberProject> userMemberProject = ExecuteReader(cmd);

            return ProcessProjectMembers(userMemberProject);
        }

        private IEnumerable<UserMemberProject> ProcessProjectMembers(
           IEnumerable<UserMemberProject> memberProjects)
        {
            List<UserMemberProject> result = new List<UserMemberProject>();
            IEnumerable<long> ids = memberProjects.Select(s => s.Id)
                                  .Distinct();

            foreach (long id in ids)
            {
                UserMemberProject memberProject = memberProjects.FirstOrDefault(w => w.Id == id);

                memberProject.ProjectMembers = memberProjects.Where(w => w.Id == id)
                    .Select(s => new ProjectMember
                    {
                        ProjectId = s.ProjectId,
                        Id = s.MemberProjectId,
                        ProjectRoleId = s.ProjectRoleId,
                    })
                    .ToList();

                result.Add(memberProject);
            }

            return result;
        }
    }
}
