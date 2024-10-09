using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class ProjectTravelLogisticsService : Repository<ProjectTravelLogistics>, IProjectTravelLogisticsService
    {
        public ProjectTravelLogisticsService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public void CreateProjectTravelLogistics(ProjectTravelLogistics projectTravelLogistics) =>
            Add(projectTravelLogistics);

        public void DeleteProjectTravelLogistics(ProjectTravelLogistics projectTravelLogistics)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<ProjectTravelLogistics> GetAllByProjectId(int projectId)
        {
            DbCommand cmd = LoadCmd("GetAllProjectTravelLogisticsByProjectId");
            cmd = AddParameter(cmd, "ProjectId", projectId);
            return ExecuteReader(cmd);
        }

        //public IEnumerable<ProjectTravelLogistics> GetAllByProjectId(int projectId)
        //{
        //    return _context.ProjectTravelLogistics.Where(x => x.ProjectId == projectId).ToList();
        //}

        public ProjectTravelLogistics GetProjectTravelLogistics(int id)
        {
            return _context.ProjectTravelLogistics.SingleOrDefault(x => x.Id == id);
        }

        public void UpdateProjectTravelLogistics(ProjectTravelLogistics projectTravelLogistics) =>
            Update(projectTravelLogistics, projectTravelLogistics.Id);

        public IEnumerable<ProjectTravelLogistics> GetAllProjectTravelLogistics()
        {
            return _context.ProjectTravelLogistics.ToList();
        }

        public IEnumerable<ProjectTravelLogistics> GetAllProjectLogisticsReport(int projectId)
        {
            DbCommand cmd = LoadCmd("GetAllProjectLogisticsReport");
            cmd = AddParameter(cmd, "ProjectId", projectId);
            return ExecuteReader(cmd);
        }
    }
}
