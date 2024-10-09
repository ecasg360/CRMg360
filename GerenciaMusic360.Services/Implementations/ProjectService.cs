using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System;

namespace GerenciaMusic360.Services.Implementations
{
    public class ProjectService : Repository<Project>, IProjectService
    {
        public ProjectService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public Project Create(Project project)
        {
            return this.Add(project);
        }

        public void DeleteProject(Project project)
        {
            this.Delete(project);
        }

        public IEnumerable<Project> GetAllProjects()
        {
            DbCommand cmd = LoadCmd("GetAllProjects");
            return ExecuteReader(cmd);
        }

        public Project GetProject(int id)
        {
            DbCommand cmd = LoadCmd("GetProject");
            cmd = AddParameter(cmd, "Id", id);
            return ExecuteReader(cmd).First();
        }

        public IEnumerable<Project> GetProjectsForAssign()
        {
            DbCommand cmd = LoadCmd("GetProjectsForAssign");
            return ExecuteReader(cmd);
        }

        public Project Update(Project project)
        {
            return this.Update(project, project.Id);
        }

        public IEnumerable<Project> GetProjectsTasks()
        {
            return _context.Project
                .Where(w => w.StatusProjectId != 5
                & w.StatusProjectId != 4
                & w.StatusRecordId == 1);
        }

        public IEnumerable<Project> GetProjectEventsByArtist(int artistId, DateTime initDate, DateTime endDate)
        {
            return _context.Project.Where(w => w.ProjectTypeId == 5
            & w.ArtistId == artistId
            & w.InitialDate >= initDate
            & w.EndDate <= endDate
            & w.StatusRecordId == 1)
            .OrderBy(w => w.InitialDate);
        }

        public IEnumerable<Project> GetProjectByArtist(int artistId)
        {
            return _context.Project.Where(w => w.ArtistId == artistId
            & w.StatusRecordId == 1)
            .OrderBy(w => w.Id);
        }

    }
}
