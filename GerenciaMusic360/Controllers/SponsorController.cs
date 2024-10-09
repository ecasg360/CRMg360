using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [Authorize]
    [ApiController]
    public class SponsorController : ControllerBase
    {
        private readonly ISponsorService _service;
        private readonly IHelperService _helperService;
        private readonly IHostingEnvironment _env;

        public SponsorController(ISponsorService service, IHelperService helperService,
            IHostingEnvironment env)
        {
            _service = service;
            _helperService = helperService;
            _env = env;
        }
        [Route("api/sponsors")]
        [HttpGet]
        public MethodResponse<List<Sponsor>> Get()
        {
            var result = new MethodResponse<List<Sponsor>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _service.GetAll()
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
        [Route("api/sponsor")]
        [HttpGet]
        public MethodResponse<Sponsor> Get(int id)
        {
            var result = new MethodResponse<Sponsor> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _service.Get(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }
        [Route("api/sponsor")]
        [HttpPost]
        public MethodResponse<UserProfile> Post([FromBody] Sponsor model)
        {
            var result = new MethodResponse<UserProfile> { Code = 100, Message = "Success", Result = null };
            try
            {
                string pictureURL = string.Empty;
                if (model.PictureUrl?.Length > 0)
                    pictureURL = _helperService.SaveImage(
                        model.PictureUrl.Split(",")[1],
                        "artist", $"{model.Id}.jpg",
                        _env);

                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                model.StatusRecordId = 1;
                model.Created = DateTime.Now;
                model.Creator = userId;
                model.PictureUrl = pictureURL;
                _service.Create(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }
        [Route("api/sponsor")]
        [HttpPut]
        public MethodResponse<UserProfile> Put([FromBody] Sponsor model)
        {
            var result = new MethodResponse<UserProfile> { Code = 100, Message = "Success", Result = null };
            try
            {
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                var obj = _service.Get(model.Id);
                if (System.IO.File.Exists(Path.Combine(_env.WebRootPath, "clientapp", "dist", obj.PictureUrl)))
                    System.IO.File.Delete(Path.Combine(_env.WebRootPath, "clientapp", "dist", obj.PictureUrl));

                string pictureURL = string.Empty;
                if (model.PictureUrl?.Length > 0)
                    pictureURL = _helperService.SaveImage(
                        model.PictureUrl.Split(",")[1],
                        "artist", $"{model.Id}.jpg",
                        _env);
                obj.IdContactsSponsor = model.IdContactsSponsor;
                obj.Modified = DateTime.Now;
                obj.Modifier = userId;
                obj.Name = model.Name;
                obj.Description = model.Description;
                obj.WebSite = model.WebSite;
                obj.OfficePhone = model.OfficePhone;
                obj.PictureUrl = pictureURL;
                _service.Update(obj);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }
        [Route("api/sponsor")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                var obj = _service.Get(id);
                obj.StatusRecordId = 3;
                _service.Update(obj);
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