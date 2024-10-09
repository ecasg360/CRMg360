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
    public class ProjectBudgetDetailService : Repository<ProjectBudgetDetail>, IProjectBudgetDetailService
    {
        public ProjectBudgetDetailService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<ProjectBudgetDetail> GetAllBudgetDetails(int projectBudgetId)
        {
            IEnumerable<ProjectBudgetDetail> projectBudgetDetails =
                _context.ProjectBudgetDetail.Where(w => w.ProjectBudgetId == projectBudgetId)
                .Include(i => i.Category);

            foreach (ProjectBudgetDetail projectBudget in projectBudgetDetails)
                projectBudget.DateString =
                    projectBudget.Date.ToString("M/d/yyyy", CultureInfo.InvariantCulture);

            return projectBudgetDetails;
        }

        public ProjectBudgetDetail GetProjectBudgetDetail(int id)
        {
            return Find(w => w.Id == id);
        }

        public ProjectBudgetDetail CreateProjectBudgetDetail(ProjectBudgetDetail projectBudgetDetail) =>
        Add(projectBudgetDetail);

        public void UpdateProjectBudgetDetail(ProjectBudgetDetail projectBudgetDetail) =>
        Update(projectBudgetDetail, projectBudgetDetail.Id);

        public void DeleteProjectBudgetDetail(ProjectBudgetDetail projectBudgetDetail) =>
        Delete(projectBudgetDetail);
    }

}
