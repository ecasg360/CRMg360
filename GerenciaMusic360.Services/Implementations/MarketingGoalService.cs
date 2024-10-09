using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;

namespace GerenciaMusic360.Services.Implementations
{
    public class MarketingGoalService : Repository<MarketingGoals>, IMarketingGoalService
    {
        public MarketingGoalService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        MarketingGoals IMarketingGoalService.Create(MarketingGoals marketingGoals) =>
        Add(marketingGoals);

        MarketingGoals IMarketingGoalService.Get(int id) =>
        Get(id);

        IEnumerable<MarketingGoals> IMarketingGoalService.GetByMarketing(int marketingId)
        {
            DbCommand cmd = LoadCmd("GetMarketingGoalsByMarketing");
            cmd = AddParameter(cmd, "MarketingId", marketingId);
            return ExecuteReader(cmd);
        }

        MarketingGoals IMarketingGoalService.Update(MarketingGoals marketingGoals) =>
        Update(marketingGoals, marketingGoals.Id);

        void IMarketingGoalService.Delete(MarketingGoals marketingGoals) =>
        Delete(marketingGoals);
    }
}
