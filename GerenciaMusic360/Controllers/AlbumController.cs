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
    public class AlbumController : ControllerBase
    {
        private readonly IPersonAlbumService _personAlbumService;
        private readonly IAlbumService _albumService;
        private readonly IHelperService _helperService;
        private readonly IHostingEnvironment _env;

        public AlbumController(
            IPersonAlbumService personAlbumService,
            IAlbumService albumService,
            IHelperService helperService,
            IHostingEnvironment env)
        {
            _personAlbumService = personAlbumService;
            _albumService = albumService;
            _helperService = helperService;
            _env = env;
        }

        [Route("api/Albums")]
        [HttpGet]
        public MethodResponse<List<Album>> Get()
        {
            var result = new MethodResponse<List<Album>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _albumService.GetAllAlbums()
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

        [Route("api/AlbumsByPerson")]
        [HttpGet]
        public MethodResponse<List<Album>> Get(int personId)
        {
            var result = new MethodResponse<List<Album>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _albumService.GetAllAlbums(personId)
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

        [Route("api/Album")]
        [HttpGet]
        public MethodResponse<Album> Get(int personId, int id)
        {
            var result = new MethodResponse<Album> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _albumService.GetAlbum(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/Album")]
        [HttpPost]
        public MethodResponse<Album> Post([FromBody] Album model)
        {
            var result = new MethodResponse<Album> { Code = 100, Message = "Success", Result = null };
            try
            {

                if (!string.IsNullOrWhiteSpace(model.PictureUrl) && !model.PictureUrl.Contains("asset")) {
                    model.PictureUrl = _helperService.SaveImage(
                        model.PictureUrl.Split(",")[1],
                        "album", $"{Guid.NewGuid()}.jpg",
                        _env);
                }
                    

                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                if (!string.IsNullOrEmpty(model.ReleaseDateString))
                    model.ReleaseDate = DateTime.Parse(model.ReleaseDateString);

                model.Created = DateTime.Now;
                model.Creator = userId;
                model.StatusRecordId = 1;
                result.Result = _albumService.CreateAlbum(model);

                _personAlbumService.CreatePersonAlbum(new PersonAlbum
                {
                    AlbumId = result.Result.Id,
                    PersonId = model.PersonRelationId,
                    Created = DateTime.Now,
                    Creator = userId
                });
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/Album")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] Album model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Album album = _albumService.GetAlbum(model.Id);

                if (!string.IsNullOrWhiteSpace(model.PictureUrl) && !model.PictureUrl.Contains("asset"))
                {
                    if (System.IO.File.Exists(Path.Combine(_env.WebRootPath, "clientapp", "dist", album.PictureUrl)))
                        System.IO.File.Delete(Path.Combine(_env.WebRootPath, "clientapp", "dist", album.PictureUrl));

                    model.PictureUrl = _helperService.SaveImage(
                        model.PictureUrl.Split(",")[1],
                        "album", $"{Guid.NewGuid()}.jpg",
                        _env);
                }


                if (!string.IsNullOrEmpty(model.ReleaseDateString))
                    model.ReleaseDate = DateTime.Parse(model.ReleaseDateString);

                album.Name = model.Name;
                album.NumRecord = model.NumRecord;
                album.Modified = DateTime.Now;
                album.Modifier = userId;

                _albumService.UpdateAlbum(album);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/AlbumStatus")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody]StatusUpdateModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Album album = _albumService.GetAlbum(Convert.ToInt32(model.Id));
                album.StatusRecordId = model.Status;
                album.Modified = DateTime.Now;
                album.Modifier = userId;

                _albumService.UpdateAlbum(album);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/Album")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id, int personId)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Album album = _albumService.GetAlbum(id);
                album.StatusRecordId = 3;
                album.Erased = DateTime.Now;
                album.Eraser = userId;

                _albumService.UpdateAlbum(album);

                PersonAlbum personAlbum = _personAlbumService
                    .GetPersonAlbumByType(personId, id);

                //personWork.StatusRecordId = 3;
                //personWork.Modified = DateTime.Now;
                //personWork.Modifier = userId;

                _personAlbumService.DeletePersonAlbum(personAlbum);
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