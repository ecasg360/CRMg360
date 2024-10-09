using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IMediaService
    {
        IEnumerable<Media> GetAll();
        Media Get(int id);
        Media Create(Media media);
        Media Update(Media media);
        void Delete(Media media);
    }
}
