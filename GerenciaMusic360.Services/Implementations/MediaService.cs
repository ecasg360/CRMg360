using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Implementations
{
    public class MediaService : Repository<Media>, IMediaService
    {
        public MediaService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        Media IMediaService.Create(Media media) =>
        Add(media);

        void IMediaService.Delete(Media media) =>
        Delete(media);

        Media IMediaService.Get(int id) =>
        Get(id);

        IEnumerable<Media> IMediaService.GetAll() =>
        GetAll();

        Media IMediaService.Update(Media media) =>
        Update(media, media.Id);
    }
}
