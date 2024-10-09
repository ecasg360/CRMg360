using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class ProjectTravelLogisticsOtherService : Repository<ProjectTravelLogisticsOther>, IProjectTravelLogisticsOtherService
    {
        public ProjectTravelLogisticsOtherService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public void CreateProjectTravelLogisticsOther(ProjectTravelLogisticsOther projectTravelLogisticsOther) =>
            Add(projectTravelLogisticsOther);

        public void UpdateProjectTravelLogisticsOther(ProjectTravelLogisticsOther projectTravelLogisticsOther) =>
            Update(projectTravelLogisticsOther, projectTravelLogisticsOther.Id);

        public void DeleteProjectTravelLogisticsOther(ProjectTravelLogisticsOther projectTravelLogisticsOther) =>
            Delete(projectTravelLogisticsOther);

        public ProjectTravelLogisticsOther Get(int id) =>
            Find(w => w.Id == id);

        public IEnumerable<ProjectTravelLogisticsOther> GetAllByProjectId(int projectId)
        {
            DbCommand cmd = LoadCmd("GetAllProjectTravelLogisticsOtherByProjectId");
            cmd = AddParameter(cmd, "ProjectId", projectId);
            return ExecuteReader(cmd);
        }

        public ProjectTravelLogisticsOther GetByCost(int projectTravelLogisticsid, decimal cost)
        {
            return _context.ProjectTravelLogisticsOther.Where(x => x.ProjectTravelLogisticsId == projectTravelLogisticsid && x.TotalCost == cost).FirstOrDefault();
        }
    }
}
