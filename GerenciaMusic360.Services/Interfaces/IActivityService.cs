using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IActivityService
    {
        IEnumerable<Activity> GetByProject(int projectId);
    }
}
