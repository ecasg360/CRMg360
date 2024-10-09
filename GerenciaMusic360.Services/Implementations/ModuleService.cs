using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Implementations
{
    public class ModuleService : Repository<Module>, IModuleService
    {
        public ModuleService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<Module> GetAllModules() =>
        GetAll();

        public Module GetModule(int id) =>
        Find(w => w.Id == id);
    }
}
