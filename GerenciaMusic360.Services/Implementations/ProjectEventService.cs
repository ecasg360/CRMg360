using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class ProjectEventService : Repository<ProjectEvent>, IProjectEventService
    {
        public ProjectEventService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<ProjectEvent> GetList()
        {
            return this.GetAll();
        }

        public ProjectEvent Get(int id)
        {
            return this.Find(x => x.Id == id);
        }

        public IEnumerable<ProjectEvent> GetByProjectId(int id)
        {
            return this._context.ProjectEvent.Where(x => x.ProjectId == id).ToList();
        }

        public IEnumerable<ProjectEvent> GetProjectEvents(int projectId)
        {
            DbCommand cmd = LoadCmd("GetProjectEvents");
            cmd = AddParameter(cmd, "ProjectId", projectId);
            return (List<ProjectEvent>)ExecuteReader(cmd);
        }

        public IEnumerable<ProjectEvent> GetEventsByProjectId(int projectId)
        {
            DbCommand cmd = LoadCmd("GetEventsBudgetTemplate");
            cmd = AddParameter(cmd, "ProjectId", projectId);
            return (List<ProjectEvent>)ExecuteReader(cmd);
        }

        public void Create(ProjectEvent projectEvent)
        {
            this.Add(projectEvent);
        }

        public void Update(ProjectEvent projectEvent)
        {
            this.Update(projectEvent, projectEvent.Id);
        }

        public void Delete(ProjectEvent projectEvent)
        {
            this.Delete(projectEvent);
        }
    }
}
