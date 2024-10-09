using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [Authorize]
    [ApiController]
    public class ContactsSponsorController : ControllerBase
    {
        private readonly IContactsSponsorService _service;
        private readonly IHelperService _helperService;
        private readonly IHostingEnvironment _env;
        public ContactsSponsorController(IContactsSponsorService service, IHelperService helperService,
            IHostingEnvironment env)
        {
            _service = service;
            _helperService = helperService;
            _env = env;
        }
        [Route("api/contactssponsors")]
        [HttpGet]
        public MethodResponse<List<ContactsSponsor>> Get()
        {
            var result = new MethodResponse<List<ContactsSponsor>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _service.GetAll()
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
        [Route("api/contactssponsor")]
        [HttpGet]
        public MethodResponse<ContactsSponsor> Get(int id)
        {
            var result = new MethodResponse<ContactsSponsor> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _service.Get(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }
        [Route("api/contactssponsor")]
        [HttpPost]
        public MethodResponse<UserProfile> Post([FromBody] ContactsSponsor model)
        {
            var result = new MethodResponse<UserProfile> { Code = 100, Message = "Success", Result = null };
            try
            {
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                string pictureURL = string.Empty;
                if (model.PictureUrl?.Length > 0)
                    pictureURL = _helperService.SaveImage(
                        model.PictureUrl.Split(",")[1],
                        "contact", $"{Guid.NewGuid().ToString()}.jpg",
                        _env);
                model.StatusRecordId = 1;
                model.PictureUrl = pictureURL;
                model.Creator = userId;
                model.Created = DateTime.Now;
                model.BirthDate = DateTime.Parse(model.BirthDateString);
                _service.Create(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }
        [Route("api/contactssponsor")]
        [HttpPut]
        public MethodResponse<UserProfile> Put([FromBody] ContactsSponsor model)
        {
            var result = new MethodResponse<UserProfile> { Code = 100, Message = "Success", Result = null };
            try
            {
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                var obj = _service.Get(model.Id);

                if (System.IO.File.Exists(Path.Combine(_env.WebRootPath, "clientapp", "dist", obj.PictureUrl)))
                    System.IO.File.Delete(Path.Combine(_env.WebRootPath, "clientapp", "dist", obj.PictureUrl));

                string pictureURL = string.Empty;
                if (model.PictureUrl?.Length > 0)
                    pictureURL = _helperService.SaveImage(
                        model.PictureUrl.Split(",")[1],
                        "contact", $"{model.Id}.jpg",
                        _env);

                obj.Name = model.Name;
                obj.LastName = model.LastName;
                obj.SecondLastName = model.SecondLastName;
                obj.BirthDate = DateTime.Parse(model.BirthDateString);
                obj.Gender = model.Gender;
                obj.PictureUrl = pictureURL;
                obj.Email = model.Email;
                obj.PhoneOne = model.PhoneOne;
                obj.PhoneTwo = model.PhoneTwo;
                obj.CountryId = model.CountryId;
                obj.StateId = model.StateId;
                obj.CityId = model.CityId;
                obj.Municipality = model.Municipality;
                obj.Neighborhood = model.Neighborhood;
                obj.Street = model.Street;
                obj.ExteriorNumber = model.ExteriorNumber;
                obj.InteriorNumber = model.InteriorNumber;
                obj.PostalCode = model.PostalCode;
                obj.Reference = model.Reference;
                obj.Modified = DateTime.Now;
                obj.Modifier = userId;

                _service.Update(obj);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }
        [Route("api/contactssponsor")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                var obj = _service.Get(id);
                obj.StatusRecordId = 3;
                _service.Update(obj);
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