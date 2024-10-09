using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IProjectTaskAutorizeService
    {
        void CreateProjectTaskAutorizes(List<ProjectTaskAutorize> ProjectTaskAutorizes);
        IEnumerable<ProjectTaskAutorize> GetProjectTaskAutorizeByProject(int projectId);
        IEnumerable<ProjectTaskAutorize> GetProjectTaskAutorizeByProjectTaskId(int projectTaskId);
        ProjectTaskAutorize GetByUserTask(long userId, int taskId);
        void UpdateTaskAutorize(ProjectTaskAutorize ProjectTaskAutorizes);
        void DeleteAutorize(ProjectTaskAutorize ProjectTaskAutorize);
        void DeleteAll(IEnumerable<ProjectTaskAutorize> ProjectTaskAutorizes);
    }
}
