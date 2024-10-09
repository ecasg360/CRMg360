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
    public class MainActivityController : ControllerBase
    {
        private readonly IMainActivityService _mainActivityService;
        private readonly IHelperService _helperService;
        private readonly IHostingEnvironment _env;

        public MainActivityController(
            IMainActivityService mainActivityService,
            IHelperService helperService,
            IHostingEnvironment env)
        {
            _mainActivityService = mainActivityService;
            _helperService = helperService;
            _env = env;
        }

        [Route("api/MainActivities")]
        [HttpGet]
        public MethodResponse<List<MainActivity>> Get()
        {
            var result = new MethodResponse<List<MainActivity>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _mainActivityService.GetAllMainActivities()
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

        [Route("api/MainActivity")]
        [HttpGet]
        public MethodResponse<MainActivity> Get(int id)
        {
            var result = new MethodResponse<MainActivity> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _mainActivityService.GetMainActivity(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/MainActivity")]
        [HttpPost]
        public MethodResponse<MainActivity> Post([FromBody] MainActivity model)
        {
            var result = new MethodResponse<MainActivity> { Code = 100, Message = "Success", Result = null };
            try
            {
                if (!string.IsNullOrEmpty(model.PictureUrl) && !model.PictureUrl.Contains("asset")) {
                    model.PictureUrl = _helperService.SaveImage(
                        model.PictureUrl.Split(",")[1],
                        "mainactivity", $"{Guid.NewGuid()}.jpg",
                        _env);
                }

                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                model.Created = DateTime.Now;
                model.Creator = userId;
                model.StatusRecordId = 1;
                result.Result = _mainActivityService.CreateMainActivity(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/MainActivity")]
        [HttpPut]
        public MethodResponse<MainActivity> Put([FromBody] MainActivity model)
        {
            var result = new MethodResponse<MainActivity> { Code = 100, Message = "Success", Result = null };
            try
            {
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                var mainActivity = _mainActivityService.GetMainActivity(model.Id);

                if (!string.IsNullOrEmpty(model.PictureUrl) && !model.PictureUrl.Contains("asset"))
                {
                    if (System.IO.File.Exists(Path.Combine(_env.WebRootPath, "clientapp", "dist", mainActivity.PictureUrl)))
                        System.IO.File.Delete(Path.Combine(_env.WebRootPath, "clientapp", "dist", mainActivity.PictureUrl));

                    model.PictureUrl = _helperService.SaveImage(
                        model.PictureUrl.Split(",")[1],
                        "mainactivity", $"{Guid.NewGuid()}.jpg",
                        _env);
                }

                mainActivity.PictureUrl = model.PictureUrl;
                mainActivity.Name = model.Name;
                mainActivity.Description = model.Description;
                mainActivity.Modified = DateTime.Now;
                mainActivity.Modifier = userId;

                result.Result = _mainActivityService.UpdateMainActivity(mainActivity);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/MainActivityStatus")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody]StatusUpdateModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                var mainActivity = _mainActivityService.GetMainActivity(Convert.ToInt32(model.Id));
                mainActivity.StatusRecordId = model.Status;
                mainActivity.Modified = DateTime.Now;
                mainActivity.Modifier = userId;

                _mainActivityService.UpdateMainActivity(mainActivity);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/MainActivity")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                var mainActivity = _mainActivityService.GetMainActivity(id);
                mainActivity.StatusRecordId = 3;
                mainActivity.Erased = DateTime.Now;
                mainActivity.Eraser = userId;

                _mainActivityService.UpdateMainActivity(mainActivity);
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