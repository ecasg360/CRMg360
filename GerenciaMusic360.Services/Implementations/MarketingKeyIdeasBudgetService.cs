using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;

namespace GerenciaMusic360.Services.Implementations
{
    public class MarketingKeyIdeasBudgetService : Repository<MarketingKeyIdeasBudget>, IMarketingKeyIdeasBudgetService
    {
        public MarketingKeyIdeasBudgetService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        MarketingKeyIdeasBudget IMarketingKeyIdeasBudgetService.Create(MarketingKeyIdeasBudget budget) =>
        Add(budget);

        IEnumerable<MarketingKeyIdeasBudget> IMarketingKeyIdeasBudgetService.Create(List<MarketingKeyIdeasBudget> budgets) =>
        AddRange(budgets);

        void IMarketingKeyIdeasBudgetService.Delete(MarketingKeyIdeasBudget budget) =>
        Delete(budget);

        void IMarketingKeyIdeasBudgetService.Delete(IEnumerable<MarketingKeyIdeasBudget> budgets) =>
        DeleteRange(budgets);

        MarketingKeyIdeasBudget IMarketingKeyIdeasBudgetService.Get(int id) =>
        Get(id);

        IEnumerable<MarketingKeyIdeasBudget> IMarketingKeyIdeasBudgetService.GetAll(int marketingKeyIdeasId) =>
        FindAll(w => w.MarketingKeyIdeasId == marketingKeyIdeasId);


        IEnumerable<MarketingKeyIdeasBudget> IMarketingKeyIdeasBudgetService.GetByMarketing(int marketingId)
        {
            DbCommand cmd = LoadCmd("GetMarketingKeyIdeasBudgetByMarketing");
            cmd = AddParameter(cmd, "MarketingId", marketingId);
            return ExecuteReader(cmd);
        }

        void IMarketingKeyIdeasBudgetService.Update(MarketingKeyIdeasBudget budget) =>
        Update(budget, budget.Id);
    }
}
