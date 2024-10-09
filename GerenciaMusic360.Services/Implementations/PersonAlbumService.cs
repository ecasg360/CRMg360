using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class PersonAlbumService : Repository<PersonAlbum>, IPersonAlbumService
    {
        public PersonAlbumService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public void CreatePersonAlbum(PersonAlbum personAlbum) =>
        Add(personAlbum);

        public PersonAlbum GetPersonAlbum(int id)
        {
            DbCommand cmd = LoadCmd("GetPersonAlbum");
            cmd = AddParameter(cmd, "Id", id);
            return ExecuteReader(cmd).First();
        }

        public PersonAlbum GetPersonAlbumByType(int personId, int typeId)
        {
            DbCommand cmd = LoadCmd("GetPersonAlbumByType");
            cmd = AddParameter(cmd, "PersonId", personId);
            cmd = AddParameter(cmd, "Id", typeId);
            return ExecuteReader(cmd).First();
        }

        public void UpdatePersonAlbum(PersonAlbum personAlbum) =>
        Update(personAlbum, personAlbum.Id);

        public void DeletePersonAlbum(PersonAlbum personAlbum) =>
        Delete(personAlbum);
    }
}
