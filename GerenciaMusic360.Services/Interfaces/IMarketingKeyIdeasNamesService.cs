using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IMarketingKeyIdeasNamesService
    {
        IEnumerable<MarketingKeyIdeasNames> GetAll(int marketingKeyIdeasId);
        MarketingKeyIdeasNames Get(int id);
        MarketingKeyIdeasNames Create(MarketingKeyIdeasNames marketingKeyIdeasNames);
        IEnumerable<MarketingKeyIdeasNames> Create(List<MarketingKeyIdeasNames> marketingKeyIdeasNames);
        void Delete(MarketingKeyIdeasNames marketingKeyIdeasNames);
        void Delete(List<MarketingKeyIdeasNames> marketingKeyIdeasNames);
    }
}
