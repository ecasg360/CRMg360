using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class ArtistAgentService : Repository<ArtistAgent>, IArtistAgentService
    {
        public ArtistAgentService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public ArtistAgent GetArtistAgentByPerson(int personId)
        {
            DbCommand cmd = LoadCmd("GetArtistAgentByPerson");
            cmd = AddParameter(cmd, "PersonId", personId);
            return ExecuteReader(cmd).First();
        }

        public ArtistAgent GetArtistAgent(int agentId, int artistId)
        {
            DbCommand cmd = LoadCmd("GetArtistAgent");
            cmd = AddParameter(cmd, "AgentId", agentId);
            cmd = AddParameter(cmd, "ArtistId", artistId);
            return ExecuteReader(cmd).First();
        }

        public void CreateArtistAgent(ArtistAgent artistAgent) =>
        Add(artistAgent);

        public void UpdateArtistAgent(ArtistAgent artistAgent) =>
        Update(artistAgent, artistAgent.Id);

        public void DeleteArtistAgent(ArtistAgent artistAgent) =>
        Delete(artistAgent);
    }
}