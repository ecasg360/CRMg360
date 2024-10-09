using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class ProjectTravelLogisticsHotelService : Repository<ProjectTravelLogisticsHotel>, IProjectTravelLogisticsHotelService
    {
        public ProjectTravelLogisticsHotelService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public void CreateProjectTravelLogisticsHotel(ProjectTravelLogisticsHotel projectTravelLogisticsHotel) =>
            Add(projectTravelLogisticsHotel);

        public void UpdateProjectTravelLogisticsHotel(ProjectTravelLogisticsHotel projectTravelLogisticsHotel) =>
            Update(projectTravelLogisticsHotel, projectTravelLogisticsHotel.Id);

        public void DeleteProjectTravelLogisticsHotel(ProjectTravelLogisticsHotel projectTravelLogisticsHotel) =>
            Delete(projectTravelLogisticsHotel);

        public ProjectTravelLogisticsHotel Get(int id) =>
            Find(w => w.Id == id);

        public IEnumerable<ProjectTravelLogisticsHotel> GetAllByProjectTravelLogistics(int projectTravelLogisticsId)
        {
            DbCommand cmd = LoadCmd("GetAllProjectTravelLogisticsHotelByProjectTravelLogisticsId");
            cmd = AddParameter(cmd, "@ProjectTravelLogisticsId", projectTravelLogisticsId);
            return ExecuteReader(cmd);
        }

        public ProjectTravelLogisticsHotel GetProjectTravelLogisticsHotel(int id)
        {
            DbCommand cmd = LoadCmd("GetProjectTravelLogisticsHotel");
            cmd = AddParameter(cmd, "@Id", id);
            return ExecuteReader(cmd).First();
        }

        public IEnumerable<ProjectTravelLogisticsHotel> GetAllByProjectId(int projectId)
        {
            DbCommand cmd = LoadCmd("GetAllProjectTravelLogisticsHotelByProjectId");
            cmd = AddParameter(cmd, "ProjectId", projectId);
            return ExecuteReader(cmd);
        }

        public ProjectTravelLogisticsHotel GetByCost(int projectTravelLogisticsid, decimal cost)
        {
            return _context.ProjectTravelLogisticsHotel.Where(x => x.ProjectTravelLogisticsId == projectTravelLogisticsid && x.TotalCost == cost).FirstOrDefault();
        }
    }
}
