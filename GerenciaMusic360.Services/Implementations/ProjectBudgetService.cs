using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class ProjectBudgetService : Repository<ProjectBudget>, IProjectBudgetService
    {
        public ProjectBudgetService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<ProjectBudget> GetAllProjectBudgets(int projectId)
        {
            IEnumerable<ProjectBudget> projectBudgets = _context.ProjectBudget
                .Where(w => w.ProjectId == projectId & w.StatusRecordId == 1)
                .Include(n => n.Category)
                .Include(p => p.ProjectBudgetDetail)
                .ThenInclude(c => c.Category);

            foreach (ProjectBudget projectBudget in projectBudgets)
                foreach (ProjectBudgetDetail projectBudgetDetail in projectBudget.ProjectBudgetDetail)
                    projectBudgetDetail.DateString =
                        projectBudgetDetail.Date.ToString("M/d/yyyy", CultureInfo.InvariantCulture);

            return projectBudgets;
        }

        public ProjectBudget GetProjectBudget(int id)
        {
            return Find(w => w.Id == id);
        }

        public ProjectBudget CreateProjectBudget(ProjectBudget projectBudget) =>
        Add(projectBudget);

        public void UpdateProjectBudget(ProjectBudget projectBudget) =>
        Update(projectBudget, projectBudget.Id);

        public void DeleteProjectBudget(ProjectBudget projectBudget) =>
        Delete(projectBudget);

        public IEnumerable<ProjectBudget> CreateProjectBudgets(List<ProjectBudget> projectBudgets) =>
        AddRange(projectBudgets);

        public void DeleteProjectBudgets(List<ProjectBudget> projectBudgets) =>
        DeleteRange(projectBudgets);
    }
}
