using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class KeyIdeaController : ControllerBase
    {
        private readonly IKeyIdeaService _keyIdeaService;

        public KeyIdeaController(IKeyIdeaService keyIdeaService)
        {
            _keyIdeaService = keyIdeaService;
        }

        [Route("api/KeyIdeas")]
        [HttpGet]
        public MethodResponse<List<KeyIdeas>> Get()
        {
            var result = new MethodResponse<List<KeyIdeas>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _keyIdeaService.GetAll()
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

        [Route("api/KeyIdeasByType")]
        [HttpGet]
        public MethodResponse<List<KeyIdeas>> GetByType(int keyIdeasTypeId)
        {
            var result = new MethodResponse<List<KeyIdeas>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _keyIdeaService.GetByType(keyIdeasTypeId)
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

        [Route("api/KeyIdeasByMarketingKeyIdeas")]
        [HttpGet]
        public MethodResponse<List<KeyIdeas>> MarketingKeyIdeas(int marketingKeyIdeasId)
        {
            var result = new MethodResponse<List<KeyIdeas>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _keyIdeaService.GetByMarketingKeyIdeasId(marketingKeyIdeasId)
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

        [Route("api/KeyIdea")]
        [HttpGet]
        public MethodResponse<KeyIdeas> Get(int id)
        {
            var result = new MethodResponse<KeyIdeas> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _keyIdeaService.Get(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/KeyIdea")]
        [HttpPost]
        public MethodResponse<KeyIdeas> Post([FromBody] KeyIdeas model)
        {
            var result = new MethodResponse<KeyIdeas> { Code = 100, Message = "Success", Result = null };
            try
            {
                KeyIdeas keyIdea = new KeyIdeas
                {
                    Name = model.Name,
                    KeyIdeasTypeId = model.KeyIdeasTypeId,
                    SocialNetworkTypeId = model.SocialNetworkTypeId,
                    CategoryId = model.CategoryId,
                    Position = model.Position
                };
                result.Result = _keyIdeaService.Create(keyIdea);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/KeyIdeas")]
        [HttpPost]
        public MethodResponse<List<KeyIdeas>> PostMultiple([FromBody] List<KeyIdeas> model)
        {
            var result = new MethodResponse<List<KeyIdeas>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _keyIdeaService.Create(model)
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


        [Route("api/KeyIdea")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] KeyIdeas model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {

                KeyIdeas keyIdea = _keyIdeaService.Get(model.Id);
                keyIdea.Name = model.Name;
                keyIdea.KeyIdeasTypeId = model.KeyIdeasTypeId;
                keyIdea.SocialNetworkTypeId = model.SocialNetworkTypeId;
                keyIdea.CategoryId = model.CategoryId;
                keyIdea.Position = model.Position;

                _keyIdeaService.Update(keyIdea);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/KeyIdea")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                KeyIdeas keyIdea = _keyIdeaService.Get(id);
                _keyIdeaService.Delete(keyIdea);
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