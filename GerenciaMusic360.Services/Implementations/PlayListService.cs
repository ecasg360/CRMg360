using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;

namespace GerenciaMusic360.Services.Implementations
{
    public class PlayListService : Repository<PlayList>, IPlayListService
    {
        public PlayListService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        PlayList IPlayListService.Create(PlayList playList) =>
        Add(playList);

        void IPlayListService.Delete(PlayList playList) =>
        Delete(playList);

        PlayList IPlayListService.Get(int id) =>
        Get(id);

        IEnumerable<PlayList> IPlayListService.GetAll()
        {
            DbCommand cmd = LoadCmd("GetPlayList");
            return ExecuteReader(cmd);
        }

        PlayList IPlayListService.Update(PlayList playList) =>
        Update(playList, playList.Id);
    }
}
