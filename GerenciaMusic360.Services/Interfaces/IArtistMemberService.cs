using GerenciaMusic360.Entities;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IArtistMemberService
    {
        ArtistMember GetArtistMember(int personId, int personRelationId);
        ArtistMember CreateArtistMember(ArtistMember artistMember);
        ArtistMember GetArtistMemberByMember(int personId);
        void UpdateArtistMember(ArtistMember artistMember);
    }
}
