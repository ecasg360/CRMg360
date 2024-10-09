using GerenciaMusic360.Entities;
using GerenciaMusic360.Entities.Models;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class AlbumWorkController : ControllerBase
    {
        private readonly IAlbumWorkService _albumWorkService;
        private readonly IAlbumService _albumService;
        private readonly IWorkService _workService;
        public AlbumWorkController(
            IAlbumWorkService albumWorkService, IAlbumService albumService, IWorkService workService)
        {
            _albumWorkService = albumWorkService;
            _albumService = albumService;
            _workService = workService;
        }

        [Route("api/AlbumWork")]
        [HttpGet]
        public MethodResponse<AlbumWork> Get(int id)
        {
            var result = new MethodResponse<AlbumWork> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _albumWorkService
                    .GetAlbumWork(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        //[Route("api/AlbumWorks")]
        //[HttpGet]
        //public MethodResponse<List<AlbumWork>> Get(int albumId, int typeId)
        //{
        //    var result = new MethodResponse<List<AlbumWork>> { Code = 100, Message = "Success", Result = null };
        //    try
        //    {
        //        result.Result = _albumWorkService
        //            .GetWorksByAlbum(albumId)
        //            .ToList();
        //    }
        //    catch (Exception ex)
        //    {
        //        result.Message = ex.Message;
        //        result.Code = -100;
        //        result.Result = null;
        //    }
        //    return result;
        //}

        [Route("api/AlbumWork")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] AlbumWork model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                model.Created = DateTime.Now;
                model.Creator = userId;

                _albumWorkService.CreateAlbumWork(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/AlbumWorks")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] List<AlbumWork> model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                foreach (AlbumWork albumWork in model)
                {
                    albumWork.Created = DateTime.Now;
                    albumWork.Creator = userId;
                }
                _albumWorkService.CreateAlbumWorks(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/AlbumWork")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int albumId, int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                AlbumWork albumWork = _albumWorkService.GetAlbumWork(id);

                _albumWorkService.DeleteAlbumWork(albumWork);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/AlbumWorks")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int albumId)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                List<AlbumWork> albumWorks = _albumWorkService
                    .GetWorksByAlbum(albumId)
                    .ToList();

                _albumWorkService.DeleteAlbumWorks(albumWorks);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }
        [Route("api/AlbumWorks")]
        [HttpGet]
        public MethodResponse<AlbumWorkModel> AlbumWorkModel(int albumId)
        {
            var result = new MethodResponse<AlbumWorkModel> { Code = 100, Message = "Success" };
            try
            {
                var album = _albumService.GetAlbum(albumId);
                var works = _workService.GetAllWorksbyAlbum(albumId);

                result.Result = new AlbumWorkModel()
                {
                    id = album.Id,
                    numRecord = works.Count(),
                    name = album.Name,
                    pictureUrl = album.PictureUrl,
                    releaseDate = album.ReleaseDate,
                    releaseDateString = album.ReleaseDateString,
                    works = works
                };
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }
    }
}