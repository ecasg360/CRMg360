using GerenciaMusic360.Entities;
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
    public class MediaController : ControllerBase
    {
        private readonly IMediaService _mediaService;
        private readonly IHelperService _helperService;
        private readonly IHostingEnvironment _env;

        public MediaController(
            IMediaService mediaService,
            IHelperService helperService,
            IHostingEnvironment env)
        {
            _mediaService = mediaService;
            _helperService = helperService;
            _env = env;
        }

        [Route("api/Media")]
        [HttpGet]
        public MethodResponse<List<Media>> Get()
        {
            var result = new MethodResponse<List<Media>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _mediaService.GetAll()
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

        [Route("api/Media")]
        [HttpPost]
        public MethodResponse<Media> Post([FromBody] Media model)
        {
            var result = new MethodResponse<Media> { Code = 100, Message = "Success", Result = null };
            try
            {
                string pictureURL = string.Empty;
                if (model.PictureUrl?.Length > 0)
                    pictureURL = _helperService.SaveImage(
                        model.PictureUrl.Split(",")[1],
                        "media", $"{Guid.NewGuid()}.jpg",
                        _env);

                model.PictureUrl = pictureURL;
                result.Result = _mediaService.Create(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/Media")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] Media model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                if (System.IO.File.Exists(Path.Combine(_env.WebRootPath, "clientapp", "dist", model.PictureUrl)))
                    System.IO.File.Delete(Path.Combine(_env.WebRootPath, "clientapp", "dist", model.PictureUrl));

                string pictureURL = string.Empty;
                if (model.PictureUrl?.Length > 0)
                    pictureURL = _helperService.SaveImage(
                        model.PictureUrl.Split(",")[1],
                        "media", $"{Guid.NewGuid()}.jpg",
                        _env);

                Media media = _mediaService.Get(model.Id);
                media.Name = model.Name;
                media.PictureUrl = model.PictureUrl;

                _mediaService.Update(media);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/Media")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                Media media = _mediaService.Get(id);
                _mediaService.Delete(media);
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