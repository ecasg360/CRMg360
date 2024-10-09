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
    public class SocialNetworkTypeController : ControllerBase
    {
        private readonly ISocialNetworkTypeService _socialNetworkTypeService;
        private readonly IHelperService _helperService;
        private readonly IHostingEnvironment _env;
        public SocialNetworkTypeController(
            ISocialNetworkTypeService socialNetworkTypeService,
             IHelperService helperService,
            IHostingEnvironment env)
        {
            _socialNetworkTypeService = socialNetworkTypeService;
            _helperService = helperService;
            _env = env;
        }

        [Route("api/SocialNetworkTypes")]
        [HttpGet]
        public MethodResponse<List<SocialNetworkType>> Get()
        {
            var result = new MethodResponse<List<SocialNetworkType>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _socialNetworkTypeService.GetAllSocialNetworkTypes()
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
        [Route("api/SocialNetworkType")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                SocialNetworkType socialNetworkType = _socialNetworkTypeService.Get(id);
                socialNetworkType.StatusRecordId = 3;
                socialNetworkType.Erased = DateTime.Now;
                socialNetworkType.Eraser = userId;
                _socialNetworkTypeService.Update(socialNetworkType);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }
        [Route("api/SocialNetworkTypeStatus")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody]StatusUpdateModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {

                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                SocialNetworkType socialNetworkType = _socialNetworkTypeService.Get(Convert.ToInt32(model.Id));
                socialNetworkType.StatusRecordId = model.Status;
                socialNetworkType.Modified = DateTime.Now;
                socialNetworkType.Modifier = userId;
                _socialNetworkTypeService.Update(socialNetworkType);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }
        [Route("api/SocialNetworkType")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] SocialNetworkType model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string pictureURL = string.Empty;
                if (!string.IsNullOrWhiteSpace(model.PictureUrl) && !model.PictureUrl.Contains("asset"))
                    pictureURL = _helperService.SaveImage(
                        model.PictureUrl.Split(",")[1],
                        "socialnetworktype", $"{Guid.NewGuid()}.jpg",
                        _env);

                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                model.PictureUrl = pictureURL;
                model.Created = DateTime.Now;
                model.Creator = userId;
                model.StatusRecordId = 1;
                _socialNetworkTypeService.Create(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }
        [Route("api/SocialNetworkType")]
        [HttpGet]
        public MethodResponse<SocialNetworkType> Get(int id)
        {
            var result = new MethodResponse<SocialNetworkType> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _socialNetworkTypeService.Get(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/SocialNetworkType")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] SocialNetworkType model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                var socialNetworkType = _socialNetworkTypeService.Get(model.Id);
                if (System.IO.File.Exists(Path.Combine(_env.WebRootPath, "clientapp", "dist", socialNetworkType.PictureUrl ?? "")))
                    System.IO.File.Delete(Path.Combine(_env.WebRootPath, "clientapp", "dist", socialNetworkType.PictureUrl ?? ""));
                string pictureURL = string.Empty;
                if (model.PictureUrl?.Length > 0)
                {
                    if (model.PictureUrl.Split(",").Count() > 1)
                    {
                        pictureURL = _helperService.SaveImage(model.PictureUrl.Split(",")[1], "socialnetworktype", $"{Guid.NewGuid()}.jpg", _env);
                    }
                    else
                    {
                        pictureURL = model.PictureUrl;
                    }
                }
                socialNetworkType.PictureUrl = pictureURL;
                socialNetworkType.Name = model.Name;
                socialNetworkType.Modified = DateTime.Now;
                socialNetworkType.Modifier = userId;
                _socialNetworkTypeService.Update(socialNetworkType);
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