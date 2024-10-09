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
    public class SocialNetworkController : ControllerBase
    {
        private readonly IPersonSocialNetworkService _socialNetworkService;
        private readonly IHelperService _helperService;
        private readonly IHostingEnvironment _env;

        public SocialNetworkController(
           IPersonSocialNetworkService socialNetworkService,
           IHelperService helperService,
           IHostingEnvironment env)
        {
            _socialNetworkService = socialNetworkService;
            _helperService = helperService;
            _env = env;
        }

        [Route("api/SocialNetworks")]
        [HttpGet]
        public MethodResponse<List<PersonSocialNetwork>> Get(int personId)
        {
            var result = new MethodResponse<List<PersonSocialNetwork>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _socialNetworkService.GetPersonSocialNetworksByPerson(personId)
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

        [Route("api/SocialNetwork")]
        [HttpGet]
        public MethodResponse<PersonSocialNetwork> Get(int personId, int typeId)
        {
            var result = new MethodResponse<PersonSocialNetwork> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _socialNetworkService.GetPersonSocialNetworkByType(personId, typeId);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/SocialNetwork")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] PersonSocialNetwork model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string pictureURL = string.Empty;
                if (model.PictureUrl?.Length > 0)
                    pictureURL = _helperService.SaveImage(
                        model.PictureUrl.Split(",")[1],
                        "personSocialNetwork", $"{Guid.NewGuid()}.jpg",
                        _env);

                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                model.PictureUrl = pictureURL;
                model.StatusRecordId = 1;
                model.Created = DateTime.Now;
                model.Creator = userId;

                _socialNetworkService.CreatePersonSocialNetwork(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/SocialNetworks")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] List<PersonSocialNetwork> model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                foreach (PersonSocialNetwork socialNetwork in model)
                {
                    socialNetwork.StatusRecordId = 1;
                    socialNetwork.Created = DateTime.Now;
                    socialNetwork.Creator = userId;
                }
                _socialNetworkService.CreatePersonSocialNetworks(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/SocialNetwork")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] PersonSocialNetwork model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                PersonSocialNetwork socialNetwork =
                    _socialNetworkService.GetPersonSocialNetwork(model.Id);

                if (!string.IsNullOrWhiteSpace(model.PictureUrl) && !model.PictureUrl.Contains("asset"))
                {
                    socialNetwork.PictureUrl = _helperService.SaveImage(
                        model.PictureUrl.Split(",")[1],
                        "personSocialNetwork", $"{Guid.NewGuid()}.jpg",
                        _env);
                }

                socialNetwork.Link = model.Link;
                socialNetwork.SocialNetworkTypeId = model.SocialNetworkTypeId;
                socialNetwork.Modified = DateTime.Now;
                socialNetwork.Modifier = userId;

                _socialNetworkService.UpdatePersonSocialNetwork(socialNetwork);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/SocialNetworks")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] List<PersonSocialNetwork> model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                foreach (PersonSocialNetwork socialNetworkModel in model)
                {
                    PersonSocialNetwork socialNetwork =
                    _socialNetworkService.GetPersonSocialNetwork(socialNetworkModel.Id);

                    socialNetwork.Link = socialNetworkModel.Link;
                    socialNetwork.SocialNetworkTypeId = socialNetworkModel.SocialNetworkTypeId;
                    socialNetwork.Modified = DateTime.Now;
                    socialNetwork.Modifier = userId;

                    _socialNetworkService.UpdatePersonSocialNetwork(socialNetwork);
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

        [Route("api/SocialNetworkStatus")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] StatusUpdateModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                PersonSocialNetwork socialNetwork =
                    _socialNetworkService.GetPersonSocialNetwork(Convert.ToInt32(model.Id));

                socialNetwork.StatusRecordId = model.Status;
                socialNetwork.Modified = DateTime.Now;
                socialNetwork.Modifier = userId;

                _socialNetworkService.UpdatePersonSocialNetwork(socialNetwork);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/SocialNetworksStatus")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] List<StatusUpdateModel> model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                foreach (StatusUpdateModel statusModel in model)
                {
                    PersonSocialNetwork socialNetwork =
                    _socialNetworkService.GetPersonSocialNetwork(Convert.ToInt32(statusModel.Id));

                    socialNetwork.StatusRecordId = statusModel.Status;
                    socialNetwork.Modified = DateTime.Now;
                    socialNetwork.Modifier = userId;

                    _socialNetworkService.UpdatePersonSocialNetwork(socialNetwork);
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

        [Route("api/SocialNetwork")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int personId, int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                PersonSocialNetwork socialNetwork = _socialNetworkService.GetPersonSocialNetwork(Convert.ToInt32(id));

                socialNetwork.StatusRecordId = 3;
                socialNetwork.Modified = DateTime.Now;
                socialNetwork.Modifier = userId;

                _socialNetworkService.UpdatePersonSocialNetwork(socialNetwork);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/SocialNetworks")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int personId)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                List<PersonSocialNetwork> socialNetworks = _socialNetworkService
                    .GetPersonSocialNetworksByPerson(Convert.ToInt32(personId))
                    .ToList();

                foreach (PersonSocialNetwork socialNetwork in socialNetworks)
                {
                    socialNetwork.StatusRecordId = 3;
                    socialNetwork.Modified = DateTime.Now;
                    socialNetwork.Modifier = userId;

                    _socialNetworkService.UpdatePersonSocialNetwork(socialNetwork);
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
