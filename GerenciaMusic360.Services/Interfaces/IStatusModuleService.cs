using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IStatusModuleService
    {
        IEnumerable<StatusModule> GetAllStatusByModule(int moduleId);
        StatusModule GetStatusModule(int id);
        void CreateStatusModule(StatusModule status);
        void UpdateStatusModule(StatusModule status);
        void DeleteStatusModule(StatusModule status);
    }
}
