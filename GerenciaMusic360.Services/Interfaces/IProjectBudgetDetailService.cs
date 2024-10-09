using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IProjectBudgetDetailService
    {
        IEnumerable<ProjectBudgetDetail> GetAllBudgetDetails(int projectBudgetId);
        ProjectBudgetDetail GetProjectBudgetDetail(int id);
        ProjectBudgetDetail CreateProjectBudgetDetail(ProjectBudgetDetail projectBudgetDetail);
        void UpdateProjectBudgetDetail(ProjectBudgetDetail projectBudgetDetail);
        void DeleteProjectBudgetDetail(ProjectBudgetDetail projectBudgetDetail);
    }
}
