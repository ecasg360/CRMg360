using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Implementations
{
    public class MarketingDemographicService : Repository<MarketingDemographic>, IMarketingDemographicService
    {
        public MarketingDemographicService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        void IMarketingDemographicService.Create(List<MarketingDemographic> marketingDemographics) =>
        AddRange(marketingDemographics);

        void IMarketingDemographicService.Delete(IEnumerable<MarketingDemographic> marketingDemographics) =>
        DeleteRange(marketingDemographics);

        void IMarketingDemographicService.Delete(MarketingDemographic marketingDemographics) =>
        Delete(marketingDemographics);

        MarketingDemographic IMarketingDemographicService.Get(int id) =>
        Get(id);

        IEnumerable<MarketingDemographic> IMarketingDemographicService.GetAll(int marketingId) =>
        FindAll(w => w.MarketingId == marketingId);
    }
}
