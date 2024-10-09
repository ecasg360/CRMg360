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
    public class ProjectTaskService : Repository<ProjectTask>, IProjectTaskService
    {
        public ProjectTaskService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<ProjectTask> CreateProjectTasks(List<ProjectTask> projectTasks) =>
        AddRange(projectTasks);

        public ProjectTask CreateProjectTask(ProjectTask projectTask) =>
        Add(projectTask);

        public void DeleteProjectTasks(List<ProjectTask> projectTasks)
        {
            throw new NotImplementedException();
        }

        public ProjectTask GetProjectTask(int id)
        {
            DbCommand cmd = LoadCmd("GetProjectTask");
            cmd = AddParameter(cmd, "Id", id);
            return ExecuteReader(cmd).First();
        }

        public IEnumerable<ProjectTask> GetProjectTasksByPosition(int projectId, short positionId) =>
        FindAll(w => w.Position >= positionId & w.ProjectId == projectId);

        public IEnumerable<ProjectTask> GetProjectTasks(int projectId, int typeId)
        {
            DbCommand cmd = LoadCmd("GetProjectTasks");
            cmd = AddParameter(cmd, "ProjectId", projectId);
            cmd = AddParameter(cmd, "TypeId", typeId);
            return ExecuteReader(cmd);
        }

        public IEnumerable<ProjectTask> GetProjectTaskByProject(int projectId)
        {
            DbCommand cmd = LoadCmd("GetProjectTaskByProject");
            cmd = AddParameter(cmd, "ProjectId", projectId);
            return ExecuteReader(cmd);
        }

        public IEnumerable<ProjectTask> GetByProjectActive(int projectId)
        {
            DbCommand cmd = LoadCmd("GetProjectTaskByProjectActive");
            cmd = AddParameter(cmd, "ProjectId", projectId);
            return ExecuteReader(cmd);
        }

        public void UpdateProjectTask(ProjectTask projectTasks) =>
        Update(projectTasks, projectTasks.Id);

        public void CancelProjectTaskByProject(int projectId, string user)
        {
            DbCommand cmd = LoadCmd("CancelProjectTaskByProject");
            cmd = AddParameter(cmd, "@ProjectId", projectId);
            cmd = AddParameter(cmd, "@User", user);
            ExecuteReader(cmd);
        }

        public ProjectTask GetByTemplateTaskDocumentDetailId(int templateTaskDocumentDetailId)
        {
            return this.Find(x => x.TemplateTaskDocumentDetailId == templateTaskDocumentDetailId);
        }
    }
}
