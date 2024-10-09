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
    public class PersonMusicalInstrumentController : ControllerBase
    {
        private readonly IPersonMusicalInstrumentService _personMusicalInstrumentService;

        public PersonMusicalInstrumentController(
           IPersonMusicalInstrumentService personMusicalInstrumentService)
        {
            _personMusicalInstrumentService = personMusicalInstrumentService;
        }

        [Route("api/PersonMusicalInstruments")]
        [HttpGet]
        public MethodResponse<List<PersonMusicalInstrument>> Get(int personId)
        {
            var result = new MethodResponse<List<PersonMusicalInstrument>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _personMusicalInstrumentService
                    .GetPersonMusicalInstrumentByPerson(personId)
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

        [Route("api/PersonMusicalInstrument")]
        [HttpGet]
        public MethodResponse<PersonMusicalInstrument> Get(int personId, int typeId)
        {
            var result = new MethodResponse<PersonMusicalInstrument> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _personMusicalInstrumentService
                    .GetPersonMusicalInstrumentByType(personId, typeId);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/PersonMusicalInstrument")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] PersonMusicalInstrument model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                model.StatusRecordId = 1;
                model.Created = DateTime.Now;
                model.Creator = userId;

                _personMusicalInstrumentService.CreatePersonMusicalInstrument(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/PersonMusicalInstruments")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] List<PersonMusicalInstrument> model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                foreach (PersonMusicalInstrument personMusicalInstrument in model)
                {
                    personMusicalInstrument.StatusRecordId = 1;
                    personMusicalInstrument.Created = DateTime.Now;
                    personMusicalInstrument.Creator = userId;
                }
                _personMusicalInstrumentService.CreatePersonMusicalInstruments(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/PersonMusicalInstrument")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] PersonMusicalInstrument model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                PersonMusicalInstrument personMusicalInstrument =
                    _personMusicalInstrumentService.GetPersonMusicalInstrument(model.Id);

                personMusicalInstrument.MusicalInstrumentId = model.MusicalInstrumentId;
                personMusicalInstrument.Modified = DateTime.Now;
                personMusicalInstrument.Modifier = userId;

                _personMusicalInstrumentService
                    .UpdatePersonMusicalInstrument(personMusicalInstrument);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/PersonMusicalInstruments")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] List<PersonMusicalInstrument> model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                foreach (PersonMusicalInstrument personMusicalInstrumentModel in model)
                {
                    PersonMusicalInstrument personMusicalInstrument = _personMusicalInstrumentService
                    .GetPersonMusicalInstrument(personMusicalInstrumentModel.Id);

                    personMusicalInstrument.MusicalInstrumentId =
                        personMusicalInstrumentModel.MusicalInstrumentId;
                    personMusicalInstrument.Modified = DateTime.Now;
                    personMusicalInstrument.Modifier = userId;

                    _personMusicalInstrumentService
                        .UpdatePersonMusicalInstrument(personMusicalInstrument);
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

        [Route("api/PersonMusicalInstrumentStatus")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] StatusUpdateModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                PersonMusicalInstrument personMusicalInstruments =
                    _personMusicalInstrumentService.GetPersonMusicalInstrument(Convert.ToInt32(model.Id));

                personMusicalInstruments.StatusRecordId = model.Status;
                personMusicalInstruments.Modified = DateTime.Now;
                personMusicalInstruments.Modifier = userId;

                _personMusicalInstrumentService
                    .UpdatePersonMusicalInstrument(personMusicalInstruments);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/PersonMusicalInstrumentsStatus")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] List<StatusUpdateModel> model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                foreach (StatusUpdateModel statusModel in model)
                {
                    PersonMusicalInstrument personMusicalInstruments =
                    _personMusicalInstrumentService
                    .GetPersonMusicalInstrument(Convert.ToInt32(statusModel.Id));

                    personMusicalInstruments.StatusRecordId = statusModel.Status;
                    personMusicalInstruments.Modified = DateTime.Now;
                    personMusicalInstruments.Modifier = userId;

                    _personMusicalInstrumentService
                        .UpdatePersonMusicalInstrument(personMusicalInstruments);
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

        [Route("api/PersonMusicalInstrument")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int personId, int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                PersonMusicalInstrument personMusicalInstrument =
                    _personMusicalInstrumentService.GetPersonMusicalInstrument(Convert.ToInt32(id));

                //personMusicalInstrument.StatusRecordId = 3;
                //personMusicalInstrument.Modified = DateTime.Now;
                //personMusicalInstrument.Modifier = userId;

                _personMusicalInstrumentService
                    .DeletePersonMusicalInstrument(personMusicalInstrument);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/PersonMusicalInstruments")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int personId)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                List<PersonMusicalInstrument> personMusicalInstruments = _personMusicalInstrumentService
                    .GetPersonMusicalInstrumentByPerson(Convert.ToInt32(personId))
                    .ToList();

                //foreach (PersonMusicalInstrument personMusicalInstrument in personMusicalInstruments)
                //{
                //    personMusicalInstrument.StatusRecordId = 3;
                //    personMusicalInstrument.Modified = DateTime.Now;
                //    personMusicalInstrument.Modifier = userId;

                //    _personMusicalInstrumentService
                //        .UpdatePersonMusicalInstrument(personMusicalInstrument);
                //}
                _personMusicalInstrumentService
                    .DeletePersonMusicalInstruments(personMusicalInstruments);
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