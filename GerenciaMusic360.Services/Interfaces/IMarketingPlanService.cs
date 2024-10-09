using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IMarketingPlanService
    {
        IEnumerable<MarketingPlan> GetAll(int marketingId);
        MarketingPlan Get(int id);
        MarketingPlan Create(MarketingPlan marketingPlan);
        IEnumerable<MarketingPlan> Create(List<MarketingPlan> marketingPlan);
        void Update(MarketingPlan marketingPlan);
        void Delete(MarketingPlan marketingPlan);
    }
}
