using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class ProjectStateService : Repository<ProjectState>, IProjectStateService
    {
        public ProjectStateService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public void Create(ProjectState projectState)
        {
            this.Add(projectState);
        }

        public void DeleteProjectType(ProjectState projectState)
        {
            this.Delete(projectState);
        }

        public IEnumerable<ProjectState> GetList()
        {
            return this.GetAll("StatusProject", "UserProfile");
        }

        public ProjectState Get(int id)
        {
            return this.Find(x => x.Id == id);
        }

        public IEnumerable<ProjectState> GetByProjectId(int id)
        {
            return this._context.ProjectState.Where(x => x.ProjectId == id).ToList();
        }

        public void Update(ProjectState projectState)
        {
            this.Update(projectState, projectState.Id);
        }
    }
}
