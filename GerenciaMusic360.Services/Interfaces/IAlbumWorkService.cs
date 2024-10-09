using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IAlbumWorkService
    {
        AlbumWork GetAlbumWork(int id);
        IEnumerable<AlbumWork> GetWorksByAlbum(int albumId);
        void CreateAlbumWork(AlbumWork albumWork);
        void CreateAlbumWorks(List<AlbumWork> albumWork);
        void UpdateAlbumWork(AlbumWork albumWork);
        void DeleteAlbumWork(AlbumWork albumWork);
        void DeleteAlbumWorks(List<AlbumWork> albumWorks);
    }
}
