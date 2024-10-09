using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IMarketingDemographicService
    {
        IEnumerable<MarketingDemographic> GetAll(int marketingId);
        void Create(List<MarketingDemographic> marketingDemographics);
        void Delete(IEnumerable<MarketingDemographic> marketingDemographics);
        void Delete(MarketingDemographic marketingDemographics);
        MarketingDemographic Get(int id);
    }
}
