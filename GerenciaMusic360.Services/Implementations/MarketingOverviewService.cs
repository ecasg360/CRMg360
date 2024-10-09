using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Implementations
{
    public class MarketingOverviewService : Repository<MarketingOverview>, IMarketingOverviewService
    {
        public MarketingOverviewService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        MarketingOverview IMarketingOverviewService.Create(MarketingOverview marketingOverview) =>
        Add(marketingOverview);

        void IMarketingOverviewService.Delete(MarketingOverview marketingOverview) =>
        Delete(marketingOverview);

        MarketingOverview IMarketingOverviewService.Get(int id) =>
        Get(id);

        IEnumerable<MarketingOverview> IMarketingOverviewService.GetAll(int marketingId) =>
        FindAll(w => w.MarketingId == marketingId);

        IEnumerable<MarketingOverview> IMarketingOverviewService.GetBySection(int sectionId) =>
        FindAll(w => w.SectionId == sectionId);
    }
}
