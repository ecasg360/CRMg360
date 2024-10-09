using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IPlayListService
    {
        IEnumerable<PlayList> GetAll();
        PlayList Get(int id);
        PlayList Create(PlayList playList);
        PlayList Update(PlayList playList);
        void Delete(PlayList playList);
    }
}
