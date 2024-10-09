using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IUserMemberProjectService
    {
        IEnumerable<UserMemberProject> GetAllMemberProjects();

        IEnumerable<UserMemberProject> GetAllMemberProjects(int projectId);
    }
}
