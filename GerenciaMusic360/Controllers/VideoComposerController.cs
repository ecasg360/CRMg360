using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class VideoComposerController : ControllerBase
    {
        private readonly IVideoComposerService _videoComposerService;
        public VideoComposerController(
            IVideoComposerService videoComposerService)
        {
            _videoComposerService = videoComposerService;
        }

        [Route("api/VideoComposer")]
        [HttpGet]
        public MethodResponse<VideoComposer> Get(int id)
        {
            var result = new MethodResponse<VideoComposer> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _videoComposerService
                    .GetVideoComposer(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/VideoComposers")]
        [HttpGet]
        public MethodResponse<List<VideoComposer>> Get(int videoId, int typeId)
        {
            var result = new MethodResponse<List<VideoComposer>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _videoComposerService
                    .GetVideoComposerByVideo(videoId)
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

        [Route("api/VideoComposer")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] VideoComposer model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                _videoComposerService.CreateVideoComposer(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/VideoComposers")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] List<VideoComposer> model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                _videoComposerService.CreateVideoComposer(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/VideoComposer")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int videoId, int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                VideoComposer videoComposer = _videoComposerService.GetVideoComposer(id);
                _videoComposerService.DeleteVideoComposer(videoComposer);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/VideoComposers")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int videoId)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                List<VideoComposer> videoComposer = _videoComposerService
                    .GetVideoComposerByVideo(videoId)
                    .ToList();

                _videoComposerService.DeleteVideoComposer(videoComposer);
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