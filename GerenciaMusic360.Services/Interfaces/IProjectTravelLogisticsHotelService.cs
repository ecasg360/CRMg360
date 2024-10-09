using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IProjectTravelLogisticsHotelService
    {
        IEnumerable<ProjectTravelLogisticsHotel> GetAllByProjectTravelLogistics(int projectTravelLogisticsId);
        IEnumerable<ProjectTravelLogisticsHotel> GetAll();
        ProjectTravelLogisticsHotel Get(int id);
        ProjectTravelLogisticsHotel GetProjectTravelLogisticsHotel(int id);
        void CreateProjectTravelLogisticsHotel(ProjectTravelLogisticsHotel projectTravelLogisticsHotel);
        void UpdateProjectTravelLogisticsHotel(ProjectTravelLogisticsHotel projectTravelLogisticsHotel);
        void DeleteProjectTravelLogisticsHotel(ProjectTravelLogisticsHotel projectTravelLogisticsHotel);
        IEnumerable<ProjectTravelLogisticsHotel> GetAllByProjectId(int projectId);
        ProjectTravelLogisticsHotel GetByCost(int projectTravelLogisticsid, decimal cost);
    }
}
