using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IProjectTravelLogisticsService
    {
        IEnumerable<ProjectTravelLogistics> GetAllByProjectId(int projectId);
        IEnumerable<ProjectTravelLogistics> GetAllProjectTravelLogistics();
        ProjectTravelLogistics GetProjectTravelLogistics(int id);
        void CreateProjectTravelLogistics(ProjectTravelLogistics projectTravelLogistics);
        void UpdateProjectTravelLogistics(ProjectTravelLogistics projectTravelLogistics);
        void DeleteProjectTravelLogistics(ProjectTravelLogistics projectTravelLogistics);
        IEnumerable<ProjectTravelLogistics> GetAllProjectLogisticsReport(int projectId);
    }
}
