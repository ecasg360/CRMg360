using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class ProjectWorkAdminService : Repository<ProjectWorkAdmin>, IProjectWorkAdminService
    {
        public ProjectWorkAdminService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public ProjectWorkAdmin CreateProjectWorkAdmin(ProjectWorkAdmin projectWorkAdmin) =>
            Add(projectWorkAdmin);

        public void DeleteProjectWorkAdmin(ProjectWorkAdmin projectWorkAdmin) =>
            Delete(projectWorkAdmin);

        public ProjectWorkAdmin GetProjectWorkAdmin(int id) =>
            Find(x => x.Id == id);

        public IEnumerable<ProjectWorkAdmin> GetProjectWorksAdmin() =>
            GetAll();

        public IEnumerable<ProjectWorkAdmin> GetProjectWorksAdminByProjectWork(int projectWorkId)
        {
            var result = _context.ProjectWorkAdmin.Include(r => r.Editor).Where(x => x.ProjectWorkId == projectWorkId).ToList();
            return result;
        }

        public void UpdateProjectWorksAdmin(ProjectWorkAdmin projectWorkAdmin) =>
            Update(projectWorkAdmin, projectWorkAdmin.Id);

    }
}
