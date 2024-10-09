using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class ProjectTravelLogisticsFlightService : Repository<ProjectTravelLogisticsFlight>, IProjectTravelLogisticsFlightService
    {
        public ProjectTravelLogisticsFlightService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public void CreateProjectTravelLogisticsFlight(ProjectTravelLogisticsFlight projectTravelLogisticsFlight) =>
            Add(projectTravelLogisticsFlight);

        public void UpdateProjectTravelLogisticsFlight(ProjectTravelLogisticsFlight projectTravelLogisticsFlight) =>
            Update(projectTravelLogisticsFlight, projectTravelLogisticsFlight.Id);

        public void DeleteProjectTravelLogisticsFlight(ProjectTravelLogisticsFlight projectTravelLogisticsFlight) =>
            Delete(projectTravelLogisticsFlight);

        public ProjectTravelLogisticsFlight Get(int id) =>
            Find(w => w.Id == id);

        public IEnumerable<ProjectTravelLogisticsFlight> GetAllByProjectTravelLogistics(int projectTravelLogisticsId)
        {
            DbCommand cmd = LoadCmd("GetAllProjectTravelLogisticsFlightByProjectTravelLogisticsId");
            cmd = AddParameter(cmd, "@ProjectTravelLogisticsId", projectTravelLogisticsId);
            return ExecuteReader(cmd);
        }

        public ProjectTravelLogisticsFlight GetProjectTravelLogisticsFlight(int id)
        {
            DbCommand cmd = LoadCmd("GetAllProjectTravelLogisticsFlightById");
            cmd = AddParameter(cmd, "@Id", id);
            return ExecuteReader(cmd).First();
        }

        public IEnumerable<ProjectTravelLogisticsFlight> GetAllByProjectId(int projectId)
        {
            DbCommand cmd = LoadCmd("GetAllProjectTravelLogisticsFlightByProjectId");
            cmd = AddParameter(cmd, "ProjectId", projectId);
            return ExecuteReader(cmd);
        }

        public ProjectTravelLogisticsFlight GetByCost(int projectTravelLogisticsid, decimal cost)
        {
            return _context.ProjectTravelLogisticsFlight.Where(x => x.ProjectTravelLogisticsId == projectTravelLogisticsid && x.TotalCost == cost).FirstOrDefault();
        }
    }
}
