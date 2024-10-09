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
    public class PersonMusicalGenreController : ControllerBase
    {
        private readonly IPersonMusicalGenreService _personMusicalGenreService;

        public PersonMusicalGenreController(
           IPersonMusicalGenreService personMusicalGenreService)
        {
            _personMusicalGenreService = personMusicalGenreService;
        }

        [Route("api/PersonMusicalGenres")]
        [HttpGet]
        public MethodResponse<List<PersonMusicalGenre>> Get(int personId)
        {
            var result = new MethodResponse<List<PersonMusicalGenre>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _personMusicalGenreService
                    .GetPersonMusicalGenreByPerson(personId)
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

        [Route("api/PersonMusicalGenre")]
        [HttpGet]
        public MethodResponse<PersonMusicalGenre> Get(int personId, int typeId)
        {
            var result = new MethodResponse<PersonMusicalGenre> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _personMusicalGenreService
                    .GetPersonMusicalGenreByType(personId, typeId);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/PersonMusicalGenre")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] PersonMusicalGenre model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                model.StatusRecordId = 1;
                model.Created = DateTime.Now;
                model.Creator = userId;

                _personMusicalGenreService.CreatePersonMusicalGenre(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/PersonMusicalGenres")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] List<PersonMusicalGenre> model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                var personMusicalGenreExist = _personMusicalGenreService.GetPersonMusicalGenreByPerson(model.FirstOrDefault().PersonId).ToList();
                _personMusicalGenreService.DeletePersonMusicalGenres(personMusicalGenreExist);
                foreach (PersonMusicalGenre personMusicalGenre in model)
                {
                    personMusicalGenre.StatusRecordId = 1;
                    personMusicalGenre.Created = DateTime.Now;
                    personMusicalGenre.Creator = userId;
                }
                _personMusicalGenreService.CreatePersonMusicalGenres(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/PersonMusicalGenre")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] PersonMusicalGenre model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                PersonMusicalGenre personMusicalGenre =
                    _personMusicalGenreService.GetPersonMusicalGenre(model.Id);

                personMusicalGenre.MusicalGenreId = model.MusicalGenreId;
                personMusicalGenre.Modified = DateTime.Now;
                personMusicalGenre.Modifier = userId;

                _personMusicalGenreService.UpdatePersonMusicalGenre(personMusicalGenre);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/PersonMusicalGenres")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] List<PersonMusicalGenre> model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                foreach (PersonMusicalGenre personMusicalGenreModel in model)
                {
                    PersonMusicalGenre personMusicalGenre =
                    _personMusicalGenreService.GetPersonMusicalGenre(personMusicalGenreModel.Id);

                    personMusicalGenre.MusicalGenreId = personMusicalGenreModel.MusicalGenreId;
                    personMusicalGenre.Modified = DateTime.Now;
                    personMusicalGenre.Modifier = userId;

                    _personMusicalGenreService.UpdatePersonMusicalGenre(personMusicalGenre);
                }
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/PersonMusicalGenreStatus")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] StatusUpdateModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                PersonMusicalGenre personMusicalGenre =
                    _personMusicalGenreService.GetPersonMusicalGenre(Convert.ToInt32(model.Id));

                personMusicalGenre.StatusRecordId = model.Status;
                personMusicalGenre.Modified = DateTime.Now;
                personMusicalGenre.Modifier = userId;

                _personMusicalGenreService.UpdatePersonMusicalGenre(personMusicalGenre);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/PersonMusicalGenresStatus")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] List<StatusUpdateModel> model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                foreach (StatusUpdateModel statusModel in model)
                {
                    PersonMusicalGenre personMusicalGenre =
                    _personMusicalGenreService.GetPersonMusicalGenre(Convert.ToInt32(statusModel.Id));

                    personMusicalGenre.StatusRecordId = statusModel.Status;
                    personMusicalGenre.Modified = DateTime.Now;
                    personMusicalGenre.Modifier = userId;

                    _personMusicalGenreService.UpdatePersonMusicalGenre(personMusicalGenre);
                }
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/PersonMusicalGenre")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int personId, int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                PersonMusicalGenre personMusicalGenre =
                    _personMusicalGenreService.GetPersonMusicalGenre(Convert.ToInt32(id));

                //personMusicalGenre.StatusRecordId = 3;
                //personMusicalGenre.Modified = DateTime.Now;
                //personMusicalGenre.Modifier = userId;

                _personMusicalGenreService.DeletePersonMusicalGenre(personMusicalGenre);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/PersonMusicalGenres")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int personId)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                List<PersonMusicalGenre> personMusicalGenres = _personMusicalGenreService
                    .GetPersonMusicalGenreByPerson(Convert.ToInt32(personId))
                    .ToList();

                //foreach (PersonMusicalGenre personMusicalGenre in personMusicalGenres)
                //{
                //    personMusicalGenre.StatusRecordId = 3;
                //    personMusicalGenre.Modified = DateTime.Now;
                //    personMusicalGenre.Modifier = userId;
                //}

                _personMusicalGenreService.DeletePersonMusicalGenres(personMusicalGenres);
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