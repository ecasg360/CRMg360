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
    public class PersonDocumentController : ControllerBase
    {
        private readonly IPersonDocumentService _personDocumentService;

        public PersonDocumentController(
           IPersonDocumentService personDocumentService)
        {
            _personDocumentService = personDocumentService;
        }

        [Route("api/PersonDocuments")]
        [HttpGet]
        public MethodResponse<List<PersonDocument>> Get(int personId)
        {
            var result = new MethodResponse<List<PersonDocument>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _personDocumentService.GetPersonDocumentByPerson(personId)
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

        [Route("api/PersonDocument")]
        [HttpGet]
        public MethodResponse<PersonDocument> Get(int personId, short typeId)
        {
            var result = new MethodResponse<PersonDocument> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _personDocumentService.GetPersonDocumentByType(personId, typeId);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/PersonDocument")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] PersonDocument model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                model.StatusRecordId = 1;
                model.Created = DateTime.Now;
                model.Creator = userId;

                if (!string.IsNullOrEmpty(model.ExpiredDateString))
                    model.ExpiredDate = DateTime.Parse(model.ExpiredDateString);

                _personDocumentService.CreatePersonDocument(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/PersonDocuments")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] List<PersonDocument> model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                foreach (PersonDocument personDocument in model)
                {
                    if (!string.IsNullOrEmpty(personDocument.ExpiredDateString))
                        personDocument.ExpiredDate = DateTime.Parse(personDocument.ExpiredDateString);

                    personDocument.StatusRecordId = 1;
                    personDocument.Created = DateTime.Now;
                    personDocument.Creator = userId;
                }
                _personDocumentService.CreatePersonDocuments(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/PersonDocument")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] PersonDocument model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                PersonDocument personDocument =
                    _personDocumentService.GetPersonDocument(model.Id);

                if (!string.IsNullOrEmpty(model.ExpiredDateString))
                    personDocument.ExpiredDate = DateTime.Parse(model.ExpiredDateString);
                if (!string.IsNullOrEmpty(model.EmisionDateString))
                    personDocument.EmisionDate = DateTime.Parse(model.EmisionDateString);

                personDocument.Number = model.Number;
                personDocument.CountryId = model.CountryId;
                personDocument.PersonDocumentTypeId = model.PersonDocumentTypeId;
                personDocument.Modified = DateTime.Now;
                personDocument.Modifier = userId;
                personDocument.LegalName = model.LegalName;

                _personDocumentService.UpdatePersonDocument(personDocument);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/PersonDocuments")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] List<PersonDocument> model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                foreach (PersonDocument personDocumentModel in model)
                {
                    PersonDocument personDocument = _personDocumentService
                    .GetPersonDocument(personDocumentModel.Id);

                    if (!string.IsNullOrEmpty(personDocument.ExpiredDateString))
                        personDocument.ExpiredDate = DateTime.Parse(personDocumentModel.ExpiredDateString);

                    personDocument.Number = personDocumentModel.Number;
                    personDocument.CountryId = personDocumentModel.CountryId;
                    personDocument.PersonDocumentTypeId = personDocumentModel.PersonDocumentTypeId;
                    personDocument.Modified = DateTime.Now;
                    personDocument.Modifier = userId;
                    personDocument.LegalName = personDocumentModel.LegalName;

                    _personDocumentService.UpdatePersonDocument(personDocument);
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

        [Route("api/PersonDocumentStatus")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] StatusUpdateModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                PersonDocument personDocument =
                    _personDocumentService.GetPersonDocument(Convert.ToInt32(model.Id));

                personDocument.StatusRecordId = model.Status;
                personDocument.Modified = DateTime.Now;
                personDocument.Modifier = userId;

                _personDocumentService.UpdatePersonDocument(personDocument);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/PersonDocumentsStatus")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] List<StatusUpdateModel> model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                foreach (StatusUpdateModel statusModel in model)
                {
                    PersonDocument personDocument =
                    _personDocumentService.GetPersonDocument(Convert.ToInt32(statusModel.Id));

                    personDocument.StatusRecordId = statusModel.Status;
                    personDocument.Modified = DateTime.Now;
                    personDocument.Modifier = userId;

                    _personDocumentService.UpdatePersonDocument(personDocument);
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

        [Route("api/PersonDocument")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int personId, int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                PersonDocument personDocument =
                    _personDocumentService.GetPersonDocument(Convert.ToInt32(id));

                personDocument.StatusRecordId = 3;
                personDocument.Modified = DateTime.Now;
                personDocument.Modifier = userId;

                _personDocumentService.UpdatePersonDocument(personDocument);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/PersonDocuments")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int personId)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                List<PersonDocument> personDocuments = _personDocumentService
                    .GetPersonDocumentByPerson(Convert.ToInt32(personId))
                    .ToList();

                foreach (PersonDocument personDocument in personDocuments)
                {
                    personDocument.StatusRecordId = 3;
                    personDocument.Modified = DateTime.Now;
                    personDocument.Modifier = userId;

                    _personDocumentService
                        .UpdatePersonDocument(personDocument);
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
    }
}
