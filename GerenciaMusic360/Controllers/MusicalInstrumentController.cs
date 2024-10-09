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
    public class MusicalInstrumentController : ControllerBase
    {
        private readonly IMusicalInstrumentService _musicalInstrumentService;
        private readonly IHelperService _helperService;
        private readonly IHostingEnvironment _env;

        public MusicalInstrumentController(
            IMusicalInstrumentService musicalInstrumentService,
            IHelperService helperService,
            IHostingEnvironment env)
        {
            _musicalInstrumentService = musicalInstrumentService;
            _helperService = helperService;
            _env = env;
        }

        [Route("api/MusicalInstruments")]
        [HttpGet]
        public MethodResponse<List<MusicalInstrument>> Get()
        {
            var result = new MethodResponse<List<MusicalInstrument>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _musicalInstrumentService.GetAllMusicalInstruments()
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

        [Route("api/MusicalInstrument")]
        [HttpGet]
        public MethodResponse<MusicalInstrument> Get(int id)
        {
            var result = new MethodResponse<MusicalInstrument> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _musicalInstrumentService.GetMusicalInstrument(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/MusicalInstrument")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] MusicalInstrument model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string pictureURL = string.Empty;
                if (model.PictureUrl?.Length > 0)
                    pictureURL = _helperService.SaveImage(
                        model.PictureUrl.Split(",")[1],
                        "musicalinstrument", $"{Guid.NewGuid()}.jpg",
                        _env);

                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                model.PictureUrl = pictureURL;
                model.Created = DateTime.Now;
                model.Creater = userId;
                model.StatusRecordId = 1;
                _musicalInstrumentService.CreateMusicalInstrument(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/MusicalInstrument")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] MusicalInstrument model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                var musicalInstrument = _musicalInstrumentService.GetMusicalInstrument(model.Id);


                if (System.IO.File.Exists(Path.Combine(_env.WebRootPath, "clientapp", "dist", musicalInstrument.PictureUrl)))
                    System.IO.File.Delete(Path.Combine(_env.WebRootPath, "clientapp", "dist", musicalInstrument.PictureUrl));

                string pictureURL = string.Empty;
                if (model.PictureUrl?.Length > 0)
                {
                    if (model.PictureUrl.Split(",").Count() > 1)
                    {
                        pictureURL = _helperService.SaveImage(model.PictureUrl.Split(",")[1], "musicalinstrument", $"{Guid.NewGuid()}.jpg", _env);
                    }
                    else
                    {
                        pictureURL = model.PictureUrl;
                    }
                }
                musicalInstrument.PictureUrl = pictureURL;
                musicalInstrument.Name = model.Name;
                musicalInstrument.Modified = DateTime.Now;
                musicalInstrument.Modifier = userId;

                _musicalInstrumentService.UpdateMusicalInstrument(musicalInstrument);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/MusicalInstrumentStatus")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody]StatusUpdateModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                var musicalInstrument = _musicalInstrumentService.GetMusicalInstrument(Convert.ToInt32(model.Id));
                musicalInstrument.StatusRecordId = model.Status;
                musicalInstrument.Modified = DateTime.Now;
                musicalInstrument.Modifier = userId;

                _musicalInstrumentService.UpdateMusicalInstrument(musicalInstrument);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/MusicalInstrument")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                var musicalInstrument = _musicalInstrumentService.GetMusicalInstrument(id);
                musicalInstrument.StatusRecordId = 3;
                musicalInstrument.Erased = DateTime.Now;
                musicalInstrument.Eraser = userId;

                _musicalInstrumentService.UpdateMusicalInstrument(musicalInstrument);
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