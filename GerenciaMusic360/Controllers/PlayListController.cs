using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class PlayListController : ControllerBase
    {
        private readonly IPlayListService _playListService;

        public PlayListController(
            IPlayListService playListService)
        {
            _playListService = playListService;
        }

        [Route("api/PlayLists")]
        [HttpGet]
        public MethodResponse<List<PlayList>> Get()
        {
            var result = new MethodResponse<List<PlayList>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _playListService.GetAll()
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

        [Route("api/PlayList")]
        [HttpPost]
        public MethodResponse<PlayList> Post([FromBody] PlayList model)
        {
            var result = new MethodResponse<PlayList> { Code = 100, Message = "Success", Result = null };
            try
            {
                model.Active = true;
                result.Result = _playListService.Create(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/PlayList")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] PlayList model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                PlayList playList = _playListService.Get(model.Id);
                playList.Name = model.Name;

                _playListService.Update(playList);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/PlayList")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                PlayList playList = _playListService.Get(id);
                playList.Active = false;
                _playListService.Update(playList);
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