using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Implementations
{
    public class CTaskAutorizeService : Repository<ConfigurationTaskAutorize>, ICTaskAutorizeService
    {
        public CTaskAutorizeService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public void CreateCTasksAutorizes(List<ConfigurationTaskAutorize> model) =>
        AddRange(model);
    }
}
