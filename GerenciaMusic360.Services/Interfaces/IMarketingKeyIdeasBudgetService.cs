using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IMarketingKeyIdeasBudgetService
    {
        IEnumerable<MarketingKeyIdeasBudget> GetAll(int marketingKeyIdeasId);
        MarketingKeyIdeasBudget Get(int id);
        IEnumerable<MarketingKeyIdeasBudget> GetByMarketing(int marketingId);
        MarketingKeyIdeasBudget Create(MarketingKeyIdeasBudget budget);
        IEnumerable<MarketingKeyIdeasBudget> Create(List<MarketingKeyIdeasBudget> budgets);
        void Update(MarketingKeyIdeasBudget budget);
        void Delete(MarketingKeyIdeasBudget budget);
        void Delete(IEnumerable<MarketingKeyIdeasBudget> budgets);
    }
}
