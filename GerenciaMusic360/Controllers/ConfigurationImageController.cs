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
    public class ConfigurationImageController : ControllerBase
    {
        private readonly IConfigurationImageService _configurationImageService;
        private readonly IHelperService _helperService;
        private readonly IHostingEnvironment _env;

        public ConfigurationImageController(
            IConfigurationImageService configurationImageService,
            IHelperService helperService,
            IHostingEnvironment env)
        {
            _configurationImageService = configurationImageService;
            _helperService = helperService;
            _env = env;
        }

        [Route("api/ConfigurationImages")]
        [HttpGet]
        public MethodResponse<List<ConfigurationImage>> Get()
        {
            var result = new MethodResponse<List<ConfigurationImage>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _configurationImageService.GetAllConfigurationImages()
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

        [Route("api/ConfigurationImage")]
        [HttpGet]
        public MethodResponse<ConfigurationImage> Get(short id)
        {
            var result = new MethodResponse<ConfigurationImage> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _configurationImageService.GetConfigurationImage(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }


        [Route("api/ConfigurationImagesByUser")]
        [HttpGet]
        public MethodResponse<ConfigurationImage> GetByUser(long userId)
        {
            var result = new MethodResponse<ConfigurationImage> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _configurationImageService.GetConfigurationImageByUser(userId);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/ConfigurationImage")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] ConfigurationImage model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                if (!string.IsNullOrWhiteSpace(model.PictureUrl) && !model.PictureUrl.Contains("asset"))
                    model.PictureUrl = _helperService.SaveImage(
                        model.PictureUrl.Split(",")[1],
                        "configurationImage", $"{Guid.NewGuid()}.jpg",
                        _env);

                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                model.Created = DateTime.Now;
                model.Creator = userId;
                model.StatusRecordId = 1;
                _configurationImageService.CreateConfigurationImage(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/ConfigurationImage")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] ConfigurationImage model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                ConfigurationImage configurationImage =
                    _configurationImageService.GetConfigurationImage(model.Id);

                if (!string.IsNullOrWhiteSpace(model.PictureUrl) && !model.PictureUrl.Contains("asset")) { 
                    if (System.IO.File.Exists(Path.Combine(_env.WebRootPath, "clientapp", "dist", configurationImage.PictureUrl)))
                    System.IO.File.Delete(Path.Combine(_env.WebRootPath, "clientapp", "dist", configurationImage.PictureUrl));

                    model.PictureUrl = _helperService.SaveImage(
                        model.PictureUrl.Split(",")[1],
                        "configurationImage", $"{Guid.NewGuid()}.jpg",
                        _env);
                }
                configurationImage.Name = model.Name;
                configurationImage.IsDefault = model.IsDefault;
                configurationImage.ConfigurationId = model.ConfigurationId;
                configurationImage.Modified = DateTime.Now;
                configurationImage.Modifier = userId;

                _configurationImageService.UpdateConfigurationImage(configurationImage);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/ConfigurationImageStatus")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody]StatusUpdateModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                ConfigurationImage configurationImage =
                    _configurationImageService.GetConfigurationImage(Convert.ToInt16(model.Id));

                configurationImage.StatusRecordId = model.Status;
                configurationImage.Modified = DateTime.Now;
                configurationImage.Modifier = userId;

                _configurationImageService.UpdateConfigurationImage(configurationImage);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/ConfigurationImage")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                ConfigurationImage configurationImage =
                   _configurationImageService.GetConfigurationImage(Convert.ToInt16(id));

                configurationImage.StatusRecordId = 3;
                configurationImage.Erased = DateTime.Now;
                configurationImage.Eraser = userId;

                _configurationImageService.UpdateConfigurationImage(configurationImage);
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
