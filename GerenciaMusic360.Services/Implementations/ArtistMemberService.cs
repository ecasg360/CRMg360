using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class ArtistMemberService : Repository<ArtistMember>, IArtistMemberService
    {
        public ArtistMemberService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public ArtistMember GetArtistMember(int personId, int personRelationId)
        {
            DbCommand cmd = LoadCmd("GetArtistMember");
            cmd = AddParameter(cmd, "PersonId", personId);
            cmd = AddParameter(cmd, "PersonRelationId", personRelationId);
            return ExecuteReader(cmd).First();
        }

        public ArtistMember GetArtistMemberByMember(int personId)
        {
            DbCommand cmd = LoadCmd("GetArtistMemberByMember");
            cmd = AddParameter(cmd, "PersonId", personId);
            return ExecuteReader(cmd).FirstOrDefault();
        }

        public ArtistMember CreateArtistMember(ArtistMember artistMember) =>
        Add(artistMember);

        public void UpdateArtistMember(ArtistMember artistMember) =>
        Update(artistMember, artistMember.Id);

    }
}
