using GerenciaMusic360.Entities;
using System;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IMarketingGoalsAuditedService
    {
        MarketingGoalsAudited Create(MarketingGoalsAudited marketingGoalsAudited);
        IEnumerable<MarketingGoalsAudited> Create(List<MarketingGoalsAudited> marketingGoalsAuditeds);
        IEnumerable<MarketingGoalsAudited> Get(DateTime date, int marketingId);
        IEnumerable<MarketingGoalsAudited> GetByMarketing(int marketingId);
        IEnumerable<MarketingGoalsAudited> GetByMarketingReport(int marketingId);
        IEnumerable<MarketingGoalsAudited> GetBySocialNetwork(int marketingGoalId);
        void Delete(IEnumerable<MarketingGoalsAudited> marketingGoalsAuditeds);
    }
}
