using GerenciaMusic360.Entities;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IArtistAgentService
    {
        ArtistAgent GetArtistAgentByPerson(int personId);
        ArtistAgent GetArtistAgent(int agentId, int artistId);
        void CreateArtistAgent(ArtistAgent artistAgent);
        void UpdateArtistAgent(ArtistAgent artistAgent);
        void DeleteArtistAgent(ArtistAgent personSocialNetwork);
    }
}
