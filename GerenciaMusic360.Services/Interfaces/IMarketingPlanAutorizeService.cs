using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IMarketingPlanAutorizeService
    {
        IEnumerable<MarketingPlanAutorize> GetByPlan(int id);
        MarketingPlanAutorize Get(int id);
        MarketingPlanAutorize Create(MarketingPlanAutorize autorize);
        IEnumerable<MarketingPlanAutorize> Create(List<MarketingPlanAutorize> autorize);
        void Update(MarketingPlanAutorize autorize);
        void Delete(MarketingPlanAutorize autorize);
        void Delete(IEnumerable<MarketingPlanAutorize> autorizes);
    }
}
