using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IStatusProjectService
    {
        IEnumerable<StatusProject> GetList();
        IEnumerable<StatusProject> GetLeftStates(int projectId);
        StatusProject Get(int id);
        void Create(StatusProject statusProject);
        void Update(StatusProject statusProject);
        void Delete(StatusProject statusProject);
    }
}
