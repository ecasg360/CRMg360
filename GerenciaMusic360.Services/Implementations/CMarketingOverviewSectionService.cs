using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Implementations
{
    public class CMarketingOverviewSectionService : Repository<ConfigurationMarketingOverviewSection>, ICMarketingOverviewSectionService
    {
        public CMarketingOverviewSectionService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        IEnumerable<ConfigurationMarketingOverviewSection> ICMarketingOverviewSectionService.Get() =>
        FindAll(w => w.Active & w.ConfigurationId == 1);

    }
}
