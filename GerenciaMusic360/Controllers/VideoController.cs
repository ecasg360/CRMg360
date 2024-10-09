using GerenciaMusic360.Entities;
using GerenciaMusic360.Entities.Models;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class VideoController : ControllerBase
    {
        private readonly IVideoService _videoService;
        private readonly IHelperService _helperService;
        private readonly IHostingEnvironment _env;

        public VideoController(
            IVideoService videoService,
            IHelperService helperService,
            IHostingEnvironment env)
        {
            _videoService = videoService;
            _helperService = helperService;
            _env = env;
        }

        [Route("api/Videos")]
        [HttpGet]
        public MethodResponse<List<Video>> Get()
        {
            var result = new MethodResponse<List<Video>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _videoService.GetAllVideos()
               .ToList();
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/VideosByVideoTypeId")]
        [HttpGet]
        public MethodResponse<List<Video>> GetByVideoTypeId(int videoTypeId)
        {
            var result = new MethodResponse<List<Video>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _videoService.GetAllVideosByType(videoTypeId)
               .ToList();
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/Video")]
        [HttpGet]
        public MethodResponse<Video> Get(int id)
        {
            var result = new MethodResponse<Video> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _videoService.GetVideo(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/Video")]
        [HttpPost]
        public MethodResponse<Video> Post([FromBody] Video model)
        {
            var result = new MethodResponse<Video> { Code = 100, Message = "Success", Result = null };
            try
            {
                string pictureURL = string.Empty;

                if (model.PictureUrl?.Length > 0)
                    pictureURL = _helperService.SaveImage(model.PictureUrl.Split(",")[1],
                        "video", $"{Guid.NewGuid()}.jpg", _env);

                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                model.PictureUrl = pictureURL;
                model.Created = DateTime.Now;
                model.Creator = userId;
                model.StatusRecordId = 1;
                result.Result = _videoService.CreateVideo(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/Video")]
        [HttpPut]
        public MethodResponse<Video> Put([FromBody] Video model)
        {
            var result = new MethodResponse<Video> { Code = 100, Message = "Success", Result = null };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Video video = _videoService.GetVideo(model.Id);

                if (System.IO.File.Exists(Path.Combine(_env.WebRootPath, "clientapp", "dist", video.PictureUrl)))
                    System.IO.File.Delete(Path.Combine(_env.WebRootPath, "clientapp", "dist", video.PictureUrl));

                string pictureURL = string.Empty;

                if (model.PictureUrl?.Length > 0)
                    pictureURL = _helperService.SaveImage(model.PictureUrl.Split(",")[1],
                        "video", $"{Guid.NewGuid()}.jpg", _env);

                video.Name = model.Name;
                video.PictureUrl = pictureURL;
                video.Cover = model.Cover;
                video.VideoTypeId = model.VideoTypeId;
                video.VideoUrl = model.VideoUrl;
                video.Modified = DateTime.Now;
                video.Modifier = userId;

                result.Result = _videoService.UpdateVideo(video);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/VideoStatus")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody]StatusUpdateModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Video video = _videoService.GetVideo(Convert.ToInt32(model.Id));

                video.StatusRecordId = model.Status;
                video.Modified = DateTime.Now;
                video.Modifier = userId;

                _videoService.UpdateVideo(video);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/Video")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                Video video = _videoService.GetVideo(id);
                video.StatusRecordId = 3;
                video.Erased = DateTime.Now;
                video.Eraser = userId;

                _videoService.UpdateVideo(video);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }
    }
}