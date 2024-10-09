using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IProjectWorkAdminService
    {
        IEnumerable<ProjectWorkAdmin> GetProjectWorksAdminByProjectWork(int projectWorkId);
        IEnumerable<ProjectWorkAdmin> GetProjectWorksAdmin();
        ProjectWorkAdmin GetProjectWorkAdmin(int id);
        ProjectWorkAdmin CreateProjectWorkAdmin(ProjectWorkAdmin projectWorkAdmin);
        void UpdateProjectWorksAdmin(ProjectWorkAdmin projectWorkAdmin);
        void DeleteProjectWorkAdmin(ProjectWorkAdmin projectWorkAdmin);
    }
}
