using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class StatusProjectService : Repository<StatusProject>, IStatusProjectService
    {
        public StatusProjectService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public void Create(StatusProject statusProject)
        {
            this.Add(statusProject);
        }

        public void DeleteProjectType(StatusProject statusProject)
        {
            this.Delete(statusProject);
        }

        public IEnumerable<StatusProject> GetList()
        {
            return this.GetAll();
        }

        public StatusProject Get(int id)
        {
            return this.Find(x => x.Id == id);
        }

        public IEnumerable<StatusProject> GetLeftStates(int projectId)
        {
            var projectStatesList = this._context.ProjectState.Where(x => x.Id == projectId).ToList();
            int id = 0;
            if (projectStatesList.Count > 0)
            {
                id = projectStatesList.Max(x => x.Id);
            }
            return this._context.StatusProject.Where(x => x.Id > id).ToList();
        }

        public void Update(StatusProject statusProject)
        {
            this.Update(statusProject, statusProject.Id);
        }
    }
}
