using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;

namespace GerenciaMusic360.Services.Implementations
{
    public class MarketingPlanService : Repository<MarketingPlan>, IMarketingPlanService
    {
        public MarketingPlanService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        MarketingPlan IMarketingPlanService.Create(MarketingPlan marketingPlan) =>
        Add(marketingPlan);

        IEnumerable<MarketingPlan> IMarketingPlanService.Create(List<MarketingPlan> marketingPlan) =>
        AddRange(marketingPlan);

        void IMarketingPlanService.Delete(MarketingPlan marketingPlan) =>
        Delete(marketingPlan);

        MarketingPlan IMarketingPlanService.Get(int id) =>
        Find(w => w.Id == id);

        IEnumerable<MarketingPlan> IMarketingPlanService.GetAll(int marketingId)
        {
            return FindAll(f => f.MarketingId == marketingId);
            //DbCommand cmd = LoadCmd("GetMarketingPlans");
            //cmd = AddParameter(cmd, "MarketingId", marketingId);
            //return ExecuteReader(cmd);
        }

        void IMarketingPlanService.Update(MarketingPlan marketingPlan) =>
        Update(marketingPlan, marketingPlan.Id);
    }
}
