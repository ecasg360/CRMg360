using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IProjectBudgetService
    {
        IEnumerable<ProjectBudget> GetAllProjectBudgets(int projectId);
        ProjectBudget GetProjectBudget(int id);
        ProjectBudget CreateProjectBudget(ProjectBudget projectBudget);
        IEnumerable<ProjectBudget> CreateProjectBudgets(List<ProjectBudget> projectBudgets);
        void UpdateProjectBudget(ProjectBudget projectBudget);
        void DeleteProjectBudget(ProjectBudget projectBudget);
        void DeleteProjectBudgets(List<ProjectBudget> projectBudgets);
    }
}
