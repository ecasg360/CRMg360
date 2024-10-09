using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IAlbumService
    {
        IEnumerable<Album> GetAllAlbums();
        IEnumerable<Album> GetAllAlbums(int personId);
        Album GetAlbum(int id);
        Album CreateAlbum(Album album);
        void UpdateAlbum(Album album);

    }
}
