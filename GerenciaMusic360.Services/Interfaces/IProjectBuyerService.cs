using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IProjectBuyerService
    {
        IEnumerable<ProjectBuyer> GetProjectBuyerByProject(int projectId);
        ProjectBuyer GetProjectBuyer(int id);
        void CreateProjectBuyer(ProjectBuyer projectBuyer);
        void CreateProjectBuyers(List<ProjectBuyer> projectBuyers);
        void DeleteProjectBuyer(ProjectBuyer projectBuyer);
        void DeleteProjectBuyers(IEnumerable<ProjectBuyer> projectBuyers);
    }
}
