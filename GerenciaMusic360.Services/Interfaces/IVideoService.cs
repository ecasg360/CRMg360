using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IVideoService
    {
        IEnumerable<Video> GetAllVideos();
        IEnumerable<Video> GetAllVideosByType(int videoType);
        Video GetVideo(int id);
        Video CreateVideo(Video video);
        Video UpdateVideo(Video video);
        void DeleteVideo(Video video);
    }
}
