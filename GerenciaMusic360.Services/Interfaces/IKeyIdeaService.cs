using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IKeyIdeaService
    {
        IEnumerable<KeyIdeas> GetAll();
        IEnumerable<KeyIdeas> GetByType(int keyIdeasTypeId);
        IEnumerable<KeyIdeas> GetByMarketing(int marketingId);
        IEnumerable<KeyIdeas> GetByMarketingKeyIdeasId(int marketingKeyIdeasId);
        KeyIdeas Get(int id);
        KeyIdeas Create(KeyIdeas keyIdea);
        IEnumerable<KeyIdeas> Create(List<KeyIdeas> keyIdeas);
        void Update(KeyIdeas keyIdea);
        void Delete(KeyIdeas keyIdea);
    }
}
