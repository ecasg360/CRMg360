using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Implementations
{
    public class MarketingKeyIdeasService : Repository<MarketingKeyIdeas>, IMarketingKeyIdeasService
    {
        public MarketingKeyIdeasService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        MarketingKeyIdeas IMarketingKeyIdeasService.Create(MarketingKeyIdeas marketingKeyIdeas) =>
        Add(marketingKeyIdeas);

        void IMarketingKeyIdeasService.Delete(MarketingKeyIdeas marketingKeyIdeas) =>
        Delete(marketingKeyIdeas);

        MarketingKeyIdeas IMarketingKeyIdeasService.Get(int id) =>
        Get(id);

        IEnumerable<MarketingKeyIdeas> IMarketingKeyIdeasService.GetAll(int marketingId) =>
        FindAll(w => w.MarketingId == marketingId);

        void IMarketingKeyIdeasService.Update(MarketingKeyIdeas marketingKeyIdeas) =>
        Update(marketingKeyIdeas, marketingKeyIdeas.Id);
    }
}
