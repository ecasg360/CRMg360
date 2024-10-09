using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IModuleService
    {
        IEnumerable<Module> GetAllModules();
        Module GetModule(int id);
    }
}
