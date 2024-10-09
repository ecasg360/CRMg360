using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class ProjectBuyerService : Repository<ProjectBuyer>, IProjectBuyerService
    {
        public ProjectBuyerService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<ProjectBuyer> GetProjectBuyerByProject(int projectId)
        {
            return this._context.ProjectBuyer
                .Include(r => r.BuyerType)
                .Include(r => r.Company)
                .Include(r => r.Person)
                .Where(x => x.ProjectId == projectId).ToList();
        }

        public ProjectBuyer GetProjectBuyer(int id)
        {
            DbCommand cmd = LoadCmd("GetProjectBuyer");
            cmd = AddParameter(cmd, "Id", id);
            return ExecuteReader(cmd).First();
        }

        public void CreateProjectBuyer(ProjectBuyer projectBuyer) =>
        Add(projectBuyer);

        public void CreateProjectBuyers(List<ProjectBuyer> projectBuyers) =>
        AddRange(projectBuyers);

        public void DeleteProjectBuyer(ProjectBuyer projectBuyer) =>
        Delete(projectBuyer);

        public void DeleteProjectBuyers(IEnumerable<ProjectBuyer> projectBuyers) =>
        DeleteRange(projectBuyers);
    }
}
