using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;

namespace GerenciaMusic360.Services.Implementations
{
    public class KeyIdeaService : Repository<KeyIdeas>, IKeyIdeaService
    {
        public KeyIdeaService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        KeyIdeas IKeyIdeaService.Create(KeyIdeas keyIdea) =>
        Add(keyIdea);

        IEnumerable<KeyIdeas> IKeyIdeaService.Create(List<KeyIdeas> keyIdeas) =>
        AddRange(keyIdeas);


        void IKeyIdeaService.Delete(KeyIdeas keyIdea) =>
        Delete(keyIdea);

        KeyIdeas IKeyIdeaService.Get(int id) =>
        Get(id);

        IEnumerable<KeyIdeas> IKeyIdeaService.GetAll()
        {
            DbCommand cmd = LoadCmd("GetKeyIdeas");
            return ExecuteReader(cmd);
        }

        IEnumerable<KeyIdeas> IKeyIdeaService.GetByType(int keyIdeasTypeId)
        {
            DbCommand cmd = LoadCmd("GetKeyIdeasByType");
            cmd = AddParameter(cmd, "KeyIdeasTypeId", keyIdeasTypeId);
            return ExecuteReader(cmd);
        }

        IEnumerable<KeyIdeas> IKeyIdeaService.GetByMarketing(int marketingId)
        {
            DbCommand cmd = LoadCmd("GetMarketingKeyIdeasByMarketing");
            cmd = AddParameter(cmd, "MarketingId", marketingId);
            return ExecuteReader(cmd);
        }

        IEnumerable<KeyIdeas> IKeyIdeaService.GetByMarketingKeyIdeasId(int marketingKeyIdeasId)
        {
            DbCommand cmd = LoadCmd("GetByMarketingKeyIdeas");
            cmd = AddParameter(cmd, "MarketingKeyIdeasId", marketingKeyIdeasId);
            return ExecuteReader(cmd);
        }

        void IKeyIdeaService.Update(KeyIdeas keyIdea) =>
        Update(keyIdea, keyIdea.Id);
    }
}
