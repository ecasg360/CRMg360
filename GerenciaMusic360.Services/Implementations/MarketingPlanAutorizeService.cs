using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Implementations
{
    public class MarketingPlanAutorizeService : Repository<MarketingPlanAutorize>, IMarketingPlanAutorizeService
    {
        public MarketingPlanAutorizeService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        MarketingPlanAutorize IMarketingPlanAutorizeService.Create(MarketingPlanAutorize autorize) =>
        Add(autorize);

        IEnumerable<MarketingPlanAutorize> IMarketingPlanAutorizeService.Create(List<MarketingPlanAutorize> autorizes) =>
        AddRange(autorizes);

        void IMarketingPlanAutorizeService.Delete(MarketingPlanAutorize autorize) =>
        Delete(autorize);

        void IMarketingPlanAutorizeService.Delete(IEnumerable<MarketingPlanAutorize> autorizes) =>
        DeleteRange(autorizes);

        MarketingPlanAutorize IMarketingPlanAutorizeService.Get(int id) =>
        Get(id);

        IEnumerable<MarketingPlanAutorize> IMarketingPlanAutorizeService.GetByPlan(int id) =>
        FindAll(w => w.MarketingPlanId == id);

        void IMarketingPlanAutorizeService.Update(MarketingPlanAutorize autorize) =>
        Update(autorize, autorize.Id);
    }
}
