using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class ProjectTaskAutorizeService : Repository<ProjectTaskAutorize>, IProjectTaskAutorizeService
    {
        public ProjectTaskAutorizeService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public void CreateProjectTaskAutorizes(List<ProjectTaskAutorize> ProjectTaskAutorizes) =>
        AddRange(ProjectTaskAutorizes);

        public void DeleteAll(IEnumerable<ProjectTaskAutorize> ProjectTaskAutorizes) => DeleteRange(ProjectTaskAutorizes);

        public void DeleteAutorize(ProjectTaskAutorize ProjectTaskAutorize) => Delete(ProjectTaskAutorize);

        public IEnumerable<ProjectTaskAutorize> GetProjectTaskAutorizeByProject(int projectId)
        {
            DbCommand cmd = LoadCmd("GetProjectTaskAutorizeByProject");
            cmd = AddParameter(cmd, "ProjectId", projectId);
            return ExecuteReader(cmd);
        }

        public IEnumerable<ProjectTaskAutorize> GetProjectTaskAutorizeByProjectTaskId(int projectTaskId)
        {
            DbCommand cmd = LoadCmd("GetProjectTaskAutorizeByProjectTask");
            cmd = AddParameter(cmd, "ProjectTaskId", projectTaskId);
            return ExecuteReader(cmd);
        }
        //_context.ProjectTaskAutorize.FromSql("EXECUTE GetProjectTaskAutorizeByProjectTask {0}", projectTaskId).ToList();

        ProjectTaskAutorize IProjectTaskAutorizeService.GetByUserTask(long userId, int taskId) =>
        Find(w => w.UserId == userId & w.ProjectTaskId == taskId);

        void IProjectTaskAutorizeService.UpdateTaskAutorize(ProjectTaskAutorize projectTaskAutorizes) =>
        Update(projectTaskAutorizes, projectTaskAutorizes.Id);
    }
}
