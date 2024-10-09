using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IProjectStateService
    {
        IEnumerable<ProjectState> GetList();
        ProjectState Get(int id);
        IEnumerable<ProjectState> GetByProjectId(int id);
        void Create(ProjectState projectState);
        void Update(ProjectState projectState);
        void Delete(ProjectState projectState);
    }
}
