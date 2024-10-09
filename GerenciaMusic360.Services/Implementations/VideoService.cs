using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class VideoService : Repository<Video>, IVideoService
    {
        public VideoService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<Video> GetAllVideos()
        {
            DbCommand cmd = LoadCmd("GetAllVideos");
            return ExecuteReader(cmd);
        }

        public IEnumerable<Video> GetAllVideosByType(int videoType)
        {
            DbCommand cmd = LoadCmd("GetAllVideos");
            var videoList = ExecuteReader(cmd);
            return videoList.Where(x => x.VideoTypeId == videoType);
        }

        public Video GetVideo(int id)
        {
            DbCommand cmd = LoadCmd("GetVideo");
            cmd = AddParameter(cmd, "Id", id);
            return ExecuteReader(cmd).First();
        }

        public Video CreateVideo(Video video) =>
        Add(video);

        public Video UpdateVideo(Video video) =>
        Update(video, video.Id);

        public void DeleteVideo(Video video) =>
        Delete(video);
    }
}
