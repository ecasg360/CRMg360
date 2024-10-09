using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class ProjectWorkService : Repository<ProjectWork>, IProjectWorkService
    {
        public ProjectWorkService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<ProjectWork> GetProjectWorksByProject(int projectId)
        {
            //return _context.ProjectWork.Where(x => x.ProjectId == projectId).ToList();
            DbCommand cmd = LoadCmd("GetProjectWorksByProject");
            cmd = AddParameter(cmd, "ProjectId", projectId);
            return ExecuteReader(cmd);
        }

        public ProjectWork GetProjectWorkByISRC(string ISRC)
        {
            return _context.ProjectWork.Where(x => x.ISRC == ISRC).Single();
        }

        public IEnumerable<ProjectWork> GetProjectWorksByProjectType()
        {
            var project = _context.Project.Where(x => x.StatusRecordId != 3 && (x.ProjectTypeId == 2)).ToList();

            List<ProjectWork> list = new List<ProjectWork>();

            foreach (var item in project)
            {
                var works = this.GetProjectWorksByProject(item.Id);
                list.AddRange(works);
            }

            return list;
        }

        public ProjectWork GetProjectWork(int id)
        {
            DbCommand cmd = LoadCmd("GetProjectWork");
            cmd = AddParameter(cmd, "Id", id);
            return ExecuteReader(cmd).First();
        }

        public ProjectWork GetByProjectAndWork(int projectId, int workId)
        {
            return _context.ProjectWork.Where(x => x.ProjectId == projectId && x.ItemId == workId).Single();
        }

        public ProjectWork Create(ProjectWork projectWork)
        {
            return Add(projectWork);
        }

        public void CreateProjectWork(ProjectWork projectWork) =>
        Add(projectWork);

        public void CreateProjectWorks(List<ProjectWork> projectWorks) =>
        AddRange(projectWorks);

        public void UpdateProjectWorks(ProjectWork projectWorks) =>
        Update(projectWorks, projectWorks.Id);

        public void DeleteProjectWork(ProjectWork projectWork) =>
        Delete(projectWork);

        public void DeleteProjectWorks(IEnumerable<ProjectWork> projectWorks) =>
        DeleteRange(projectWorks);
    }
}
