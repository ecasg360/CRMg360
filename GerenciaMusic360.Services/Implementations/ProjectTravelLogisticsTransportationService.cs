using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class ProjectTravelLogisticsTransportationService : Repository<ProjectTravelLogisticsTransportation>, IProjectTravelLogisticsTransportationService
    {
        public ProjectTravelLogisticsTransportationService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public void CreateProjectTravelLogisticsTransportation(ProjectTravelLogisticsTransportation projectTravelLogisticsTransportation) =>
            Add(projectTravelLogisticsTransportation);

        public void UpdateProjectTravelLogisticsTransportation(ProjectTravelLogisticsTransportation projectTravelLogisticsTransportation) =>
            Update(projectTravelLogisticsTransportation, projectTravelLogisticsTransportation.Id);

        public void DeleteProjectTravelLogisticsTransportation(ProjectTravelLogisticsTransportation projectTravelLogisticsTransportation) =>
            Delete(projectTravelLogisticsTransportation);

        public ProjectTravelLogisticsTransportation Get(int id) =>
            Find(w => w.Id == id);

        public IEnumerable<ProjectTravelLogisticsTransportation> GetAllByProjectId(int projectId)
        {
            DbCommand cmd = LoadCmd("GetAllProjectTravelLogisticsTransportationByProjectId");
            cmd = AddParameter(cmd, "ProjectId", projectId);
            return ExecuteReader(cmd);
        }

        public ProjectTravelLogisticsTransportation GetByCost(int projectTravelLogisticsid, decimal cost)
        {
            return _context.ProjectTravelLogisticsTransportation.Where(x => x.ProjectTravelLogisticsId == projectTravelLogisticsid && x.TotalCost == cost).FirstOrDefault();
        }
    }
}
