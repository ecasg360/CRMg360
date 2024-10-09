using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Implementations
{
    public class ProjectTypeService : Repository<ProjectType>, IProjectTypeService
    {
        public ProjectTypeService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public void Create(ProjectType projectType)
        {
            this.Add(projectType);
        }

        public void DeleteProjectType(ProjectType projectType)
        {
            this.Delete(projectType);
        }

        public IEnumerable<ProjectType> GetList()
        {
            return this.GetAll();
        }

        public ProjectType Get(int id)
        {
            return this.Find(x => x.Id == id);
        }

        public void Update(ProjectType projectType)
        {
            this.Update(projectType, projectType.Id);
        }
    }
}
