using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Implementations
{
    public class MarketingKeyIdeasNamesService : Repository<MarketingKeyIdeasNames>, IMarketingKeyIdeasNamesService
    {
        public MarketingKeyIdeasNamesService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        MarketingKeyIdeasNames IMarketingKeyIdeasNamesService.Create(MarketingKeyIdeasNames marketingKeyIdeasNames) =>
        Add(marketingKeyIdeasNames);

        IEnumerable<MarketingKeyIdeasNames> IMarketingKeyIdeasNamesService.Create(List<MarketingKeyIdeasNames> marketingKeyIdeasNames) =>
        AddRange(marketingKeyIdeasNames);

        void IMarketingKeyIdeasNamesService.Delete(MarketingKeyIdeasNames marketingKeyIdeasNames) =>
        Delete(marketingKeyIdeasNames);

        void IMarketingKeyIdeasNamesService.Delete(List<MarketingKeyIdeasNames> marketingKeyIdeasNames) => DeleteRange(marketingKeyIdeasNames);

        MarketingKeyIdeasNames IMarketingKeyIdeasNamesService.Get(int id) =>
        Get(id);

        IEnumerable<MarketingKeyIdeasNames> IMarketingKeyIdeasNamesService.GetAll(int marketingKeyIdeasId) =>
        FindAll(w => w.MarketingKeyIdeasId == marketingKeyIdeasId);
    }
}
