using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IProjectWorkService
    {
        IEnumerable<ProjectWork> GetProjectWorksByProject(int projectId);
        IEnumerable<ProjectWork> GetProjectWorksByProjectType();
        ProjectWork GetProjectWorkByISRC(string ISRC);
        ProjectWork GetProjectWork(int id);
        ProjectWork GetByProjectAndWork(int projectId, int workId);
        ProjectWork Create(ProjectWork projectWork);
        void CreateProjectWork(ProjectWork projectWork);
        void CreateProjectWorks(List<ProjectWork> projectWorks);
        void UpdateProjectWorks(ProjectWork projectWorks);
        void DeleteProjectWork(ProjectWork projectWork);
        void DeleteProjectWorks(IEnumerable<ProjectWork> projectWorks);
    }
}
