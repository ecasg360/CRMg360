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
    public class PreferenceController : ControllerBase
    {
        private readonly IPreferenceService _preferenceService;
        private readonly IHelperService _helperService;
        private readonly IHostingEnvironment _env;

        public PreferenceController(
            IPreferenceService preferenceService,
            IHelperService helperService,
            IHostingEnvironment env)
        {
            _preferenceService = preferenceService;
            _helperService = helperService;
            _env = env;
        }

        [Route("api/Preferences")]
        [HttpGet]
        public MethodResponse<List<Preference>> Get()
        {
            var result = new MethodResponse<List<Preference>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _preferenceService.GetAllPreferences()
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

        [Route("api/PreferencesByType")]
        [HttpGet]
        public MethodResponse<List<Preference>> Get(int typeId)
        {
            var result = new MethodResponse<List<Preference>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _preferenceService.GetAllPreferencesByType(typeId)
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

        [Route("api/Preference")]
        [HttpGet]
        public MethodResponse<Preference> Get(int typeId, int id)
        {
            var result = new MethodResponse<Preference> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _preferenceService.GetPreference(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/Preference")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] Preference model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string pictureURL = string.Empty;
                if (model.PictureUrl?.Length > 0)
                    pictureURL = _helperService.SaveImage(
                        model.PictureUrl.Split(",")[1],
                        "preference", $"{Guid.NewGuid()}.jpg",
                        _env);

                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                model.PictureUrl = pictureURL;
                model.Created = DateTime.Now;
                model.Creator = userId;
                model.StatusRecordId = 1;
                _preferenceService.CreatePreference(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/Preference")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] Preference model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                var preference = _preferenceService.GetPreference(model.Id);

                if (System.IO.File.Exists(Path.Combine(_env.WebRootPath, "clientapp", "dist", preference.PictureUrl)))
                    System.IO.File.Delete(Path.Combine(_env.WebRootPath, "clientapp", "dist", preference.PictureUrl));

                string pictureURL = string.Empty;
                if (model.PictureUrl?.Length > 0)
                {
                    if (model.PictureUrl.Split(",").Count() > 1)
                    {
                        pictureURL = _helperService.SaveImage(model.PictureUrl.Split(",")[1], "preference", $"{Guid.NewGuid()}.jpg", _env);
                    }
                    else
                    {
                        pictureURL = model.PictureUrl;
                    }
                }

                preference.PictureUrl = pictureURL;
                preference.PreferenceTypeId = model.PreferenceTypeId;
                preference.Name = model.Name;
                preference.Description = model.Description;
                preference.Modified = DateTime.Now;
                preference.Modifier = userId;

                _preferenceService.UpdatePreference(preference);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/PreferenceStatus")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody]StatusUpdateModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                var preference = _preferenceService.GetPreference(Convert.ToInt32(model.Id));
                preference.StatusRecordId = model.Status;
                preference.Modified = DateTime.Now;
                preference.Modifier = userId;

                _preferenceService.UpdatePreference(preference);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/Preference")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                var preference = _preferenceService.GetPreference(id);
                preference.StatusRecordId = 3;
                preference.Erased = DateTime.Now;
                preference.Eraser = userId;

                _preferenceService.UpdatePreference(preference);
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