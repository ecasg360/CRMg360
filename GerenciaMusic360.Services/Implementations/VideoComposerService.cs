using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class VideoComposerService : Repository<VideoComposer>, IVideoComposerService
    {
        public VideoComposerService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public void CreateVideoComposer(VideoComposer videoComposer) =>
        Add(videoComposer);

        public void CreateVideoComposer(List<VideoComposer> videoComposer) =>
        AddRange(videoComposer);

        public VideoComposer GetVideoComposer(int id)
        {
            DbCommand cmd = LoadCmd("GetVideoComposer");
            cmd = AddParameter(cmd, "Id", id);
            return ExecuteReader(cmd).First();
        }

        public IEnumerable<VideoComposer> GetVideoComposerByVideo(int videoId)
        {
            DbCommand cmd = LoadCmd("GetVideoComposerByVideo");
            cmd = AddParameter(cmd, "VideoId", videoId);
            return ExecuteReader(cmd);
        }

        public void UpdateVideoComposer(VideoComposer videoComposer) =>
        Update(videoComposer, videoComposer.Id);

        public void DeleteVideoComposer(VideoComposer videoComposer) =>
        Delete(videoComposer);

        public void DeleteVideoComposer(List<VideoComposer> videoComposers) =>
        DeleteRange(videoComposers);
    }
}
