using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IMarketingOverviewService
    {
        MarketingOverview Create(MarketingOverview marketingOverview);

        IEnumerable<MarketingOverview> GetAll(int marketingId);

        IEnumerable<MarketingOverview> GetBySection(int sectionId);

        MarketingOverview Get(int id);
        void Delete(MarketingOverview marketingOverview);
    }
}
