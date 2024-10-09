using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IProjectTaskService
    {
        IEnumerable<ProjectTask> GetProjectTasks(int projectId, int typeId);
        ProjectTask GetProjectTask(int id);
        IEnumerable<ProjectTask> GetProjectTasksByPosition(int projectId, short positionId);
        IEnumerable<ProjectTask> GetProjectTaskByProject(int id);
        IEnumerable<ProjectTask> GetByProjectActive(int projectId);
        IEnumerable<ProjectTask> CreateProjectTasks(List<ProjectTask> projectTasks);
        ProjectTask CreateProjectTask(ProjectTask projectTask);
        void UpdateProjectTask(ProjectTask projectTasks);
        void DeleteProjectTasks(List<ProjectTask> projectTasks);
        void CancelProjectTaskByProject(int projectId, string user);
        ProjectTask GetByTemplateTaskDocumentDetailId(int templateTaskDocumentDetailId);
    }
}
