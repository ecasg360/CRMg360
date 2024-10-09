using GerenciaMusic360.Entities;
using System.Collections.Generic;
using System;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IProjectService
    {
        IEnumerable<Project> GetAllProjects();
        Project GetProject(int id);
        IEnumerable<Project> GetProjectsForAssign();
        Project Create(Project project);
        Project Update(Project project);
        void DeleteProject(Project project);
        IEnumerable<Project> GetProjectsTasks();
        IEnumerable<Project> GetProjectEventsByArtist(int artistId, DateTime initDate, DateTime endDate);
        IEnumerable<Project> GetProjectByArtist(int artistId);
    }
}
