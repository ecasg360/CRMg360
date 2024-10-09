using GerenciaMusic360.Entities;
using GerenciaMusic360.Entities.Models;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
namespace GerenciaMusic360.Controllers
{
    [Authorize]
    [ApiController]
    public class MusicalGenreController : ControllerBase
    {
        private readonly IMusicalGenreService _musicalGenreService;
        public MusicalGenreController(
            IMusicalGenreService musicalGenreService)
        {
            _musicalGenreService = musicalGenreService;
        }

        [Route("api/MusicalGenres")]
        [HttpGet]
        public MethodResponse<List<MusicalGenre>> Get()
        {
            var result = new MethodResponse<List<MusicalGenre>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _musicalGenreService.GetAll()
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
        [Route("api/MusicalGenre")]
        [HttpGet]
        public MethodResponse<MusicalGenre> Get(int id)
        {
            var result = new MethodResponse<MusicalGenre> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _musicalGenreService.Get(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }
        [Route("api/MusicalGenre")]
        [HttpPost]
        public MethodResponse<UserProfile> Post([FromBody] MusicalGenre model)
        {
            var result = new MethodResponse<UserProfile> { Code = 100, Message = "Success", Result = null };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                model.StatusRecordId = 1;
                _musicalGenreService.Create(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/MusicalGenre")]
        [HttpPut]
        public MethodResponse<UserProfile> Put([FromBody] MusicalGenre model)
        {
            var result = new MethodResponse<UserProfile> { Code = 100, Message = "Success", Result = null };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                MusicalGenre musicalGenre = _musicalGenreService.Get(model.Id);
                model.StatusRecordId = musicalGenre.StatusRecordId;
                _musicalGenreService.Update(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/MusicalGenreStatus")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody]StatusUpdateModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                MusicalGenre musicalGenre = _musicalGenreService.Get(Convert.ToInt32(model.Id));
                musicalGenre.StatusRecordId = model.Status;
                _musicalGenreService.Update(musicalGenre);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/MusicalGenre")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                MusicalGenre musicalGenre = _musicalGenreService.Get(id);
                musicalGenre.StatusRecordId = 3;
                _musicalGenreService.Update(musicalGenre);
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