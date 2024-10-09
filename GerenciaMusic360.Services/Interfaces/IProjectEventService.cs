using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IProjectEventService
    {
        IEnumerable<ProjectEvent> GetList();
        ProjectEvent Get(int id);
        IEnumerable<ProjectEvent> GetByProjectId(int id);
        IEnumerable<ProjectEvent> GetProjectEvents(int id);
        IEnumerable<ProjectEvent> GetEventsByProjectId(int id);
        void Create(ProjectEvent projectEvent);
        void Update(ProjectEvent projectEvent);
        void Delete(ProjectEvent projectEvent);
    }
}
