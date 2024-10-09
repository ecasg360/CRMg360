using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IProjectTravelLogisticsOtherService
    {
        void CreateProjectTravelLogisticsOther(ProjectTravelLogisticsOther projectTravelLogisticsOther);
        void UpdateProjectTravelLogisticsOther(ProjectTravelLogisticsOther projectTravelLogisticsOther);
        void DeleteProjectTravelLogisticsOther(ProjectTravelLogisticsOther projectTravelLogisticsOther);
        ProjectTravelLogisticsOther Get(int id);
        IEnumerable<ProjectTravelLogisticsOther> GetAllByProjectId(int projectId);
        ProjectTravelLogisticsOther GetByCost(int projectTravelLogisticsid, decimal cost);
    }
}
