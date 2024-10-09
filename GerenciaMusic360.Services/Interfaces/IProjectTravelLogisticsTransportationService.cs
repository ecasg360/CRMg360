using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IProjectTravelLogisticsTransportationService
    {
        void CreateProjectTravelLogisticsTransportation(ProjectTravelLogisticsTransportation projectTravelLogisticsTransportation);
        void UpdateProjectTravelLogisticsTransportation(ProjectTravelLogisticsTransportation projectTravelLogisticsTransportation);
        void DeleteProjectTravelLogisticsTransportation(ProjectTravelLogisticsTransportation projectTravelLogisticsTransportation);
        ProjectTravelLogisticsTransportation Get(int id);
        IEnumerable<ProjectTravelLogisticsTransportation> GetAllByProjectId(int projectId);
        ProjectTravelLogisticsTransportation GetByCost(int projectTravelLogisticsid, decimal cost);
    }
}
