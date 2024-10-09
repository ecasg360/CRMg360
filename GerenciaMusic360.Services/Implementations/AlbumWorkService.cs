using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class AlbumWorkService : Repository<AlbumWork>, IAlbumWorkService
    {
        public AlbumWorkService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public void CreateAlbumWork(AlbumWork albumWork) =>
        Add(albumWork);

        public void CreateAlbumWorks(List<AlbumWork> albumWorks) =>
        AddRange(albumWorks);

        public AlbumWork GetAlbumWork(int id)
        {
            DbCommand cmd = LoadCmd("GetAlbumWork");
            cmd = AddParameter(cmd, "Id", id);
            return ExecuteReader(cmd).First();
        }

        public IEnumerable<AlbumWork> GetWorksByAlbum(int albumId)
        {
            DbCommand cmd = LoadCmd("GetWorksByAlbum");
            cmd = AddParameter(cmd, "AlbumId", albumId);
            return ExecuteReader(cmd);
        }

        public void UpdateAlbumWork(AlbumWork albumWork) =>
        Update(albumWork, albumWork.Id);

        public void DeleteAlbumWork(AlbumWork albumWork) =>
        Delete(albumWork);

        public void DeleteAlbumWorks(List<AlbumWork> albumWorks) =>
        DeleteRange(albumWorks);
    }
}
