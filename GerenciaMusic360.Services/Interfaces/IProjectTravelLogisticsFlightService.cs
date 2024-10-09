using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IProjectTravelLogisticsFlightService
    {
        IEnumerable<ProjectTravelLogisticsFlight> GetAllByProjectTravelLogistics(int projectTravelLogisticsId);
        IEnumerable<ProjectTravelLogisticsFlight> GetAll();
        ProjectTravelLogisticsFlight Get(int id);
        ProjectTravelLogisticsFlight GetProjectTravelLogisticsFlight(int id);
        void CreateProjectTravelLogisticsFlight(ProjectTravelLogisticsFlight projectTravelLogisticsFlight);
        void UpdateProjectTravelLogisticsFlight(ProjectTravelLogisticsFlight projectTravelLogisticsFlight);
        void DeleteProjectTravelLogisticsFlight(ProjectTravelLogisticsFlight projectTravelLogisticsFlight);
        IEnumerable<ProjectTravelLogisticsFlight> GetAllByProjectId(int projectId);
        ProjectTravelLogisticsFlight GetByCost(int projectTravelLogisticsid, decimal cost);

    }
}
