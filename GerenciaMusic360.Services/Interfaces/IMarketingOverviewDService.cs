using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IMarketingOverviewDService
    {
        MarketingOverViewDetail Create(MarketingOverViewDetail marketingOverviewDetail);

        IEnumerable<MarketingOverViewDetail> GetAll(int marketingOverviewId);

        MarketingOverViewDetail Get(int id);

        IEnumerable<MarketingOverViewDetail> GetByOverView(int overviewId);

        IEnumerable<MarketingOverViewDetail> GetByOverView(int overviewId, int marketingId);
        void Delete(MarketingOverViewDetail marketingOverViewDetail);

        void DeleteAll(IEnumerable<MarketingOverViewDetail> details);
        IEnumerable<MarketingOverViewDetail> GetByMarketing(int marketingId);
    }
}
