using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IMarketingKeyIdeasService
    {
        IEnumerable<MarketingKeyIdeas> GetAll(int marketingId);
        MarketingKeyIdeas Get(int id);
        MarketingKeyIdeas Create(MarketingKeyIdeas marketingKeyIdeas);
        void Update(MarketingKeyIdeas marketingKeyIdeas);
        void Delete(MarketingKeyIdeas marketingKeyIdeas);
    }
}
