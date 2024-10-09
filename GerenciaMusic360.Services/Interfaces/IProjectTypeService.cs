using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IProjectTypeService
    {
        IEnumerable<ProjectType> GetList();
        ProjectType Get(int id);
        void Create(ProjectType projectType);
        void Update(ProjectType projectType);
        void Delete(ProjectType projectType);
    }
}
