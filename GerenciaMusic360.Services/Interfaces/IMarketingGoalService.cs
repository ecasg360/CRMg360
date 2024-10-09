using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IMarketingGoalService
    {
        IEnumerable<MarketingGoals> GetByMarketing(int markentingId);
        MarketingGoals Get(int id);
        MarketingGoals Create(MarketingGoals marketingGoals);
        MarketingGoals Update(MarketingGoals marketingGoals);
        void Delete(MarketingGoals marketingGoals);
    }
}
