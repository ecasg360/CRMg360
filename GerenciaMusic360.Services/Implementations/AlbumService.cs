using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class AlbumService : Repository<Album>, IAlbumService
    {
        public AlbumService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<Album> GetAllAlbums()
        {
            DbCommand cmd = LoadCmd("GetAllAlbums");
            return ExecuteReader(cmd);
        }

        public IEnumerable<Album> GetAllAlbums(int personId)
        {
            DbCommand cmd = LoadCmd("GetAlbumsByPerson");
            cmd = AddParameter(cmd, "PersonId", personId);
            return ExecuteReader(cmd);
        }

        public Album GetAlbum(int id)
        {
            DbCommand cmd = LoadCmd("GetAlbum");
            cmd = AddParameter(cmd, "Id", id);
            return ExecuteReader(cmd).First();
        }

        public Album CreateAlbum(Album album) =>
        Add(album);

        public void UpdateAlbum(Album album) =>
        Update(album, album.Id);
    }
}
