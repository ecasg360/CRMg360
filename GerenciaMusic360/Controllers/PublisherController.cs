using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class PublisherController : ControllerBase
    {
        private readonly IPublisherService _publisher;
        private readonly ILogger<PublisherController> _logger;

        public PublisherController(
            IPublisherService publisher,
            ILogger<PublisherController> logger
        ){
            _publisher = publisher;
            _logger = logger;
        }

        [Route("api/Publisher")]
        [HttpGet]
        public MethodResponse<List<Publisher>> Get()
        {
            var result = new MethodResponse<List<Publisher>> { Code = 100, Message = "Success", Result = null };
            try
            {
                //result.Result = _publisher.GetPublishers().ToList();
                result.Result = _publisher.getPublishersWithAssociation().ToList();
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
                _logger.LogCritical(ex, "GetPublisher");
            }
            return result;
        }

        [Route("api/Publisher"), HttpPost]
        public MethodResponse<Publisher> Post([FromBody] Publisher model)
        {
            var result = new MethodResponse<Publisher> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _publisher.SavePublisher(model);

            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                _logger.LogCritical(ex, "PostPublisher");
            }
            return result;
        }

        [Route("api/Publisher"), HttpPut]
        public MethodResponse<Publisher> Put([FromBody] Publisher model)
        {
            var result = new MethodResponse<Publisher> { Code = 100, Message = "Success", Result = null };
            try
            {
                Publisher publisher = _publisher.GetPublisher(model.Id);

                publisher.Name = model.Name;
                publisher.AssociationId = model.AssociationId;

                _publisher.UpdatePublisher(publisher);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
                _logger.LogError(ex, "PutPublisher");
            }
            return result;
        }

        [Route("api/Publisher")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int Id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                Publisher publisher = _publisher.GetPublisher(Id);

                _publisher.DeletePublisher(publisher);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
                _logger.LogError(ex, "DeletePublisher");
            }
            return result;
        }
    }
}
