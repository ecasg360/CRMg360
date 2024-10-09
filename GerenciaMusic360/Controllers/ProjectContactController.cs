using GerenciaMusic360.Common.Enum;
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
    public class ProjectContactController : ControllerBase
    {
        private readonly IPersonService _personService;
        private readonly IPersonProjectContactService _personProjectContactService;
        private readonly IProjectContactService _projectContactService;
        private readonly IHelperService _helperService;
        private readonly IHostingEnvironment _env;

        public ProjectContactController(
            IPersonService personService,
            IPersonProjectContactService personProjectContactService,
            IProjectContactService projectContactService,
            IHelperService helperService,
            IHostingEnvironment env)
        {
            _personService = personService;
            _personProjectContactService = personProjectContactService;
            _projectContactService = projectContactService;
            _helperService = helperService;
            _env = env;
        }

        [Route("api/ProjectContacts")]
        [HttpGet]
        public MethodResponse<List<PersonProjectContact>> Get()
        {
            var result = new MethodResponse<List<PersonProjectContact>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _personProjectContactService.GetAllPersonsProjectContacts()
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

        [Route("api/ProjectContactsByType")]
        [HttpGet]
        public MethodResponse<List<PersonProjectContact>> GetByType(int personTypeId)
        {
            var result = new MethodResponse<List<PersonProjectContact>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _personProjectContactService.GetPersonsContactsByType(personTypeId)
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

        [Route("api/ProjectContactsByLabel")]
        [HttpGet]
        public MethodResponse<List<Person>> GetByLabel()
        {
            var result = new MethodResponse<List<Person>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _personProjectContactService.GetByLabel()
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

        [Route("api/ProjectContactsByAgency")]
        [HttpGet]
        public MethodResponse<List<Person>> GetByAgency()
        {
            var result = new MethodResponse<List<Person>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _personProjectContactService.GetByAgency()
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

        [Route("api/ProjectContactsByEvent")]
        [HttpGet]
        public MethodResponse<List<Person>> GetByEvent()
        {
            var result = new MethodResponse<List<Person>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _personProjectContactService.GetByEvent()
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

        [Route("api/ProjectContactsByProject")]
        [HttpGet]
        public MethodResponse<List<PersonProjectContact>> GetByProject(int projectId)
        {
            var result = new MethodResponse<List<PersonProjectContact>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _personProjectContactService.GetProjectContactsByProject(projectId)
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

        [Route("api/ProjectContact")]
        [HttpGet]
        public MethodResponse<Person> Get(int id)
        {
            var result = new MethodResponse<Person> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _personService.GetPerson(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/ProjectContact")]
        [HttpPost]
        public MethodResponse<int> Post([FromBody] Person model)
        {
            var result = new MethodResponse<int> { Code = 100, Message = "Success", Result = 0 };
            try
            {
                string pictureURL = string.Empty;
                if (model.PictureUrl?.Length > 0)
                    pictureURL = _helperService.SaveImage(
                        model.PictureUrl.Split(",")[1],
                        "projectContact", $"{Guid.NewGuid()}.jpg",
                        _env);

                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                model.PictureUrl = pictureURL;

                if (!string.IsNullOrEmpty(model.BirthDateString))
                    model.BirthDate = DateTime.Parse(model.BirthDateString);

                model.Created = DateTime.Now;
                model.Creator = userId;
                model.EntityId = (int)Entity.ProjectContact;
                model.StatusRecordId = 1;

                result.Result = _personService.CreatePerson(model).Id;

                if (model.ProjectId > 0 && model.ProjectId != null)
                {
                    _projectContactService.CreateProjectContact(new ProjectContact
                    {
                        TypeId = model.TypeId,
                        ProjectId = model.ProjectId,
                        PersonId = result.Result
                    });
                }
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = 0;
            }
            return result;
        }

        [Route("api/ProjectContacts")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] List<Person> model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                foreach (Person contact in model)
                {
                    string pictureURL = string.Empty;
                    if (contact.PictureUrl?.Length > 0)
                        pictureURL = _helperService.SaveImage(
                            contact.PictureUrl.Split(",")[1],
                            "projectContact", $"{Guid.NewGuid()}.jpg",
                            _env);

                    string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                    contact.PictureUrl = pictureURL;

                    if (!string.IsNullOrEmpty(contact.BirthDateString))
                        contact.BirthDate = DateTime.Parse(contact.BirthDateString);

                    contact.Created = DateTime.Now;
                    contact.Creator = userId;
                    contact.EntityId = (int)Entity.ProjectContact;
                    contact.StatusRecordId = 1;
                }

                List<Person> contacts = _personService.CreatePersons(model).ToList();
                CreateProjectContact(contacts);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/ProjectContact")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] Person model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {

                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Person person = _personService.GetPerson(model.Id);

                if (System.IO.File.Exists(Path.Combine(_env.WebRootPath, "clientapp", "dist", person.PictureUrl)))
                    System.IO.File.Delete(Path.Combine(_env.WebRootPath, "clientapp", "dist", person.PictureUrl));

                string pictureURL = string.Empty;
                if (model.PictureUrl?.Length > 0)
                    pictureURL = _helperService.SaveImage(
                        model.PictureUrl.Split(",")[1],
                        "projectContact", $"{Guid.NewGuid()}.jpg",
                        _env);

                person.Name = model.Name;
                person.LastName = model.LastName;
                person.SecondLastName = model.SecondLastName;

                if (!string.IsNullOrEmpty(model.BirthDateString))
                    person.BirthDate = DateTime.Parse(model.BirthDateString);

                if (!string.IsNullOrEmpty(model.Gender))
                    person.Gender = model.Gender;

                person.PictureUrl = pictureURL;
                person.Email = model.Email;
                person.OfficePhone = model.OfficePhone;
                person.CellPhone = model.CellPhone;
                person.PictureUrl = pictureURL;
                person.PersonTypeId = (int)Entity.ProjectContact;
                person.Modified = DateTime.Now;
                person.Modifier = userId;

                _personService.UpdatePerson(person);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/ProjectContactStatus")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody]StatusUpdateModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Person person = _personService.GetPerson(Convert.ToInt32(model.Id));
                person.StatusRecordId = model.Status;
                person.Modified = DateTime.Now;
                person.Modifier = userId;
                _personService.UpdatePerson(person);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/ProjectContact")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Person person = _personService.GetPerson(id);
                person.StatusRecordId = 3;
                person.Erased = DateTime.Now;
                person.Eraser = userId;
                _personService.UpdatePerson(person);

            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/ProjectContactRelation")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] ProjectContact model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                _projectContactService.CreateProjectContact(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/ProjectContactRelations")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] List<ProjectContact> model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                _projectContactService.CreateProjectContacts(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        //[Route("api/ProjectContactRelation")]
        //[HttpDelete]
        //public MethodResponse<bool> DeleteRelation(int id)
        //{
        //    var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
        //    try
        //    {
        //        string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
        //        ProjectContact projectContact = _projectContactService.GetProjectContact(id);
        //        _projectContactService.DeleteProjectContact(projectContact);
        //    }
        //    catch (Exception ex)
        //    {
        //        result.Message = ex.Message;
        //        result.Code = -100;
        //        result.Result = false;
        //    }
        //    return result;
        //}

        [Route("api/ProjectContactRelation")]
        [HttpDelete]
        public MethodResponse<bool> DeleteRelation(int projectId, int personId)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                ProjectContact projectContact =
                    _projectContactService.GetProjectContactByDetail(projectId, personId);
                _projectContactService.DeleteProjectContact(projectContact);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }



        private void CreateProjectContact(List<Person> contacts)
        {
            List<ProjectContact> projectContacts = new List<ProjectContact>();
            string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

            foreach (Person contact in contacts)
            {
                projectContacts.Add(new ProjectContact
                {
                    TypeId = contact.TypeId,
                    ProjectId = contact.ProjectId,
                    PersonId = contact.Id
                });
            }
            _projectContactService.CreateProjectContacts(projectContacts);
        }


        [Route("api/PersonsContacts")]
        [HttpGet]
        public MethodResponse<List<Person>> GetPersonsContacs()
        {
            var result = new MethodResponse<List<Person>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _personProjectContactService.GetAllPersonsContacts()
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


        [Route("api/PersonContact")]
        [HttpPost]
        public MethodResponse<int> PostPersonContact([FromBody] Person model)
        {
            var result = new MethodResponse<int> { Code = 100, Message = "Success", Result = 0 };
            try
            {
                string pictureURL = string.Empty;
                if (model.PictureUrl?.Length > 0)
                    pictureURL = _helperService.SaveImage(
                        model.PictureUrl.Split(",")[1],
                        "projectContact", $"{Guid.NewGuid()}.jpg",
                        _env);

                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                model.PictureUrl = pictureURL;
                model.BirthDate = DateTime.Parse(model.BirthDateString);
                model.Created = DateTime.Now;
                model.Creator = userId;
                model.EntityId = (int)Entity.ProjectContact;
                model.StatusRecordId = 1;

                result.Result = _personService.CreatePerson(model).Id;
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = 0;
            }
            return result;
        }

    }
}
