using GerenciaMusic360.Entities;
using GerenciaMusic360.Entities.Models;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class ArtistAgentController : ControllerBase
    {
        private readonly IArtistAgentService _artistAgentService;

        public ArtistAgentController(
           IArtistAgentService artistAgentService)
        {
            _artistAgentService = artistAgentService;
        }

        [Route("api/ArtistAgent")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] ArtistAgent model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                model.StatusRecordId = 1;
                model.Created = DateTime.Now;
                model.Creator = userId;
                _artistAgentService.CreateArtistAgent(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/ArtistAgent")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] ArtistAgent model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                ArtistAgent artistAgent = _artistAgentService.GetArtistAgentByPerson(model.PersonArtistId);

                artistAgent.PersonAgentId = model.PersonAgentId;
                artistAgent.Modified = DateTime.Now;
                artistAgent.Modifier = userId;
                _artistAgentService.UpdateArtistAgent(artistAgent);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/ArtistAgentStatus")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody]StatusUpdateModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                ArtistAgent artistAgent =
                    _artistAgentService.GetArtistAgentByPerson(Convert.ToInt32(model.Id));

                artistAgent.StatusRecordId = model.Status;
                artistAgent.Modified = DateTime.Now;
                artistAgent.Modifier = userId;

                _artistAgentService.UpdateArtistAgent(artistAgent);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/ArtistAgent")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int agentId, int artistId)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                ArtistAgent artistAgent = _artistAgentService.GetArtistAgent(agentId, artistId);

                //artistAgent.StatusRecordId = 3;
                //artistAgent.Modified = DateTime.Now;
                //artistAgent.Modifier = userId;

                _artistAgentService.DeleteArtistAgent(artistAgent);
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