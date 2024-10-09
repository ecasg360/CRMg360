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
    public class PersonPreferenceController : ControllerBase
    {
        private readonly IPersonPreferenceService _personPreferenceService;
        private readonly IPreferenceTypeService _preferenceTypeService;

        public PersonPreferenceController(
           IPersonPreferenceService personPreferenceService, IPreferenceTypeService preferenceTypeService)
        {
            _personPreferenceService = personPreferenceService;
            _preferenceTypeService = preferenceTypeService;
        }

        [Route("api/PersonPreferences")]
        [HttpGet]
        public MethodResponse<List<PersonPreferenceModel>> Get(int personId)
        {
            var result = new MethodResponse<List<PersonPreferenceModel>> { Code = 100, Message = "Success", Result = null };
            try
            {
                List<PersonPreferenceModel> model = new List<PersonPreferenceModel>();
                if (personId == 0)
                {
                    var preferenceTypes = this._preferenceTypeService.GetAllPreferenceTypes();
                    foreach (var item in preferenceTypes)
                    {
                        model.Add(new PersonPreferenceModel
                        {
                            PreferenceTypeId = item.Id,
                            PreferenceTypeName = item.Name,
                            Preferences = new List<PreferenceModel>()
                        });
                    }
                }
                else
                {
                    List<PersonPreference> data = _personPreferenceService
                    .GetPersonPreferencesByPerson(personId)
                    .ToList();

                    //List<int> types = data.Select(s => (int)s.PreferenceTypeId)
                    //                  .Distinct()
                    //                  .ToList();

                    var preferenceTypes = this._preferenceTypeService.GetAllPreferenceTypes();
                    foreach (var item in preferenceTypes)
                    {
                        List<PreferenceModel> preferences = data
                            .Where(w => w.PreferenceTypeId == item.Id)
                            .Select(s => new PreferenceModel
                            {
                                Id = s.Id,
                                Name = s.Name,
                                Description = s.Description,
                                PictureURL = s.PictureURL,
                                StatusRecordId = s.StatusRecordId,
                                PersonId = s.PersonId,
                                PreferenceId = s.PreferenceId,
                                Created = s.Created,
                                Creator = s.Creator,
                                Erased = s.Erased,
                                Eraser = s.Eraser,
                                Modified = s.Modified,
                                Modifier = s.Modifier
                            }).ToList();

                        model.Add(new PersonPreferenceModel
                        {
                            PreferenceTypeId = item.Id,
                            PreferenceTypeName = item.Name,
                            Preferences = preferences
                        });
                    }

                    //foreach (int type in types)
                    //{
                    //    List<PreferenceModel> preferences = data
                    //        .Where(w => w.PreferenceTypeId == type)
                    //        .Select(s => new PreferenceModel
                    //        {
                    //            Id = s.Id,
                    //            Name = s.Name,
                    //            Description = s.Description,
                    //            PictureURL = s.PictureURL,
                    //            StatusRecordId = s.StatusRecordId,
                    //            PersonId = s.PersonId,
                    //            PreferenceId = s.PreferenceId,
                    //            Created = s.Created,
                    //            Creator = s.Creator,
                    //            Erased = s.Erased,
                    //            Eraser = s.Eraser,
                    //            Modified = s.Modified,
                    //            Modifier = s.Modifier
                    //        }).ToList();

                    //    PersonPreference personPreference = data
                    //        .Where(w => w.PreferenceTypeId == type)?.First();

                    //    model.Add(new PersonPreferenceModel
                    //    {
                    //        PreferenceTypeId = type,
                    //        PreferenceTypeName = personPreference.PreferenceTypeName,
                    //        Preferences = preferences
                    //    });
                    //}
                }

                result.Result = model;
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/PersonPreference")]
        [HttpGet]
        public MethodResponse<PersonPreference> Get(int personId, int typeId)
        {
            var result = new MethodResponse<PersonPreference> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _personPreferenceService
                    .GetPersonPreferenceByType(personId, typeId);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/PersonPreference")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] PersonPreference model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                model.StatusRecordId = 1;
                model.Created = DateTime.Now;
                model.Creator = userId;

                _personPreferenceService.CreatePersonPreference(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/PersonPreferences")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] List<PersonPreference> model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                foreach (PersonPreference personPreference in model)
                {
                    personPreference.StatusRecordId = 1;
                    personPreference.Created = DateTime.Now;
                    personPreference.Creator = userId;
                }
                _personPreferenceService.CreatePersonPreferences(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/PersonPreference")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] PersonPreference model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                PersonPreference personPreference =
                    _personPreferenceService.GetPersonPreference(model.Id);

                personPreference.PreferenceId = model.PreferenceId;
                personPreference.Modified = DateTime.Now;
                personPreference.Modifier = userId;

                _personPreferenceService.UpdatePersonPreference(personPreference);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/PersonPreferences")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] List<PersonPreference> model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                foreach (PersonPreference personPreferenceModel in model)
                {
                    PersonPreference personPreference = _personPreferenceService
                    .GetPersonPreference(personPreferenceModel.Id);

                    personPreference.PreferenceId = personPreferenceModel.PreferenceId;
                    personPreference.Modified = DateTime.Now;
                    personPreference.Modifier = userId;

                    _personPreferenceService.UpdatePersonPreference(personPreference);
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

        [Route("api/PersonPreferenceStatus")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] StatusUpdateModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                PersonPreference personPreference =
                    _personPreferenceService.GetPersonPreference(Convert.ToInt32(model.Id));

                personPreference.StatusRecordId = model.Status;
                personPreference.Modified = DateTime.Now;
                personPreference.Modifier = userId;

                _personPreferenceService
                    .UpdatePersonPreference(personPreference);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/PersonPreferencesStatus")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] List<StatusUpdateModel> model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                foreach (StatusUpdateModel statusModel in model)
                {
                    PersonPreference personPreference =
                    _personPreferenceService
                    .GetPersonPreference(Convert.ToInt32(statusModel.Id));

                    personPreference.StatusRecordId = statusModel.Status;
                    personPreference.Modified = DateTime.Now;
                    personPreference.Modifier = userId;

                    _personPreferenceService.UpdatePersonPreference(personPreference);
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

        [Route("api/PersonPreference")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int personId, int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                PersonPreference personPreference =
                    _personPreferenceService.GetPersonPreference(Convert.ToInt32(id));

                //personPreference.StatusRecordId = 3;
                //personPreference.Modified = DateTime.Now;
                //personPreference.Modifier = userId;

                _personPreferenceService.DeletePersonPreference(personPreference);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/PersonPreferences")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int personId)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                List<PersonPreference> personPreferences = _personPreferenceService
                    .GetPersonPreferencesByPerson(Convert.ToInt32(personId))
                    .ToList();

                //foreach (PersonPreference personPreference in personPreferences)
                //{
                //    personPreference.StatusRecordId = 3;
                //    personPreference.Modified = DateTime.Now;
                //    personPreference.Modifier = userId;

                //    _personPreferenceService.UpdatePersonPreference(personPreference);
                //}

                _personPreferenceService.DeletePersonPreferences(personPreferences);
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