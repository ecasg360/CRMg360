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
    public class LocationController : ControllerBase
    {
        private readonly ILocationService _locationService;
        private readonly IHelperService _helperService;
        private readonly IHostingEnvironment _env;

        public LocationController(
            ILocationService locationService,
            IHelperService helperService,
            IHostingEnvironment env)
        {
            _locationService = locationService;
            _helperService = helperService;
            _env = env;
        }

        [Route("api/Locations")]
        [HttpGet]
        public MethodResponse<IEnumerable<Location>> Get()
        {
            var result = new MethodResponse<IEnumerable<Location>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _locationService.GetList().ToList();
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/Location")]
        [HttpGet]
        public MethodResponse<Location> Get(int id)
        {
            var result = new MethodResponse<Location> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _locationService.Get(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/Location")]
        [HttpPost]
        public MethodResponse<int> Post([FromBody] Location model)
        {
            var result = new MethodResponse<int> { Code = 100, Message = "Success", Result = 0 };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                //PersonType personType = _projectTypeService.GetPersonTypeNewId(model.EntityId);

                string pictureURL = string.Empty;
                if (!string.IsNullOrWhiteSpace(model.PictureUrl) && !model.PictureUrl.Contains("asset"))
                    pictureURL = _helperService.SaveImage(
                        model.PictureUrl.Split(",")[1],
                        "location", $"{Guid.NewGuid()}.jpg",
                        _env);

                //odel.Id = personType.Id;
                model.PictureUrl = pictureURL;
                model.Created = DateTime.Now;
                model.Creator = userId;
                model.StatusRecordId = 1;
                result.Result = _locationService.CreateLocation(model).Id;
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = 0;
            }
            return result;
        }

        [Route("api/Location")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] Location model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Location location = _locationService.Get(model.Id);

                if (!string.IsNullOrWhiteSpace(model.PictureUrl) && !model.PictureUrl.Contains("asset"))
                {
                    if (System.IO.File.Exists(Path.Combine(_env.WebRootPath, "clientapp", "dist", location.PictureUrl)))
                        System.IO.File.Delete(Path.Combine(_env.WebRootPath, "clientapp", "dist", location.PictureUrl));
                    location.PictureUrl = _helperService.SaveImage(
                        model.PictureUrl.Split(",")[1],
                        "location", $"{Guid.NewGuid()}.jpg",
                        _env);
                }
                    

                location.AddressId = model.AddressId;
                location.Capacity = model.Capacity;
                location.WebSite = model.WebSite;
                location.Modified = DateTime.Now;
                location.Modifier = userId;

                _locationService.Update(location);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/LocationStatus")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody]StatusUpdateModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Location location = _locationService.Get(Convert.ToInt32(model.Id));
                location.StatusRecordId = model.Status;
                location.Modified = DateTime.Now;
                location.Modifier = userId;
                _locationService.Update(location);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/Location")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Location location = _locationService.Get(id);
                location.StatusRecordId = 3;
                location.Erased = DateTime.Now;
                location.Eraser = userId;

                _locationService.Update(location);
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
