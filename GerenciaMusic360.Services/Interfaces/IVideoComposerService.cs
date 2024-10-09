using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IVideoComposerService
    {
        VideoComposer GetVideoComposer(int id);
        IEnumerable<VideoComposer> GetVideoComposerByVideo(int videoId);
        void CreateVideoComposer(VideoComposer videoComposer);
        void CreateVideoComposer(List<VideoComposer> videoComposer);
        void UpdateVideoComposer(VideoComposer videoComposer);
        void DeleteVideoComposer(VideoComposer videoComposer);
        void DeleteVideoComposer(List<VideoComposer> videoComposer);
    }
}
