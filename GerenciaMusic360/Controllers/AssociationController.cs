using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class AssociationController : ControllerBase
    {
        private readonly IAssociationService _asssociationService;
        private readonly ILogger<AssociationController> _logger;

        public AssociationController(IAssociationService asssociationService, ILogger<AssociationController> logger)
        {
            _asssociationService = asssociationService;
            _logger = logger;
        }

        [Route("api/Associations")]
        [HttpGet]
        public MethodResponse<List<Association>> Get()
        {
            var result = new MethodResponse<List<Association>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _asssociationService.GetAllAssociations()
                    .ToList();
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
                _logger.LogCritical(ex, "ErrorGetAssociation");
            }
            return result;
        }


        [Route("api/Associations")]
        [HttpPost]
        public MethodResponse<Association> Post([FromBody] Association model)
        {
            var result = new MethodResponse<Association> { Code = 100, Message = "Success", Result = null };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                model.Created = DateTime.Now;
                model.Creator = userId;
                result.Result = _asssociationService.SaveAssociation(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
                _logger.LogCritical(ex, "ErrorPostAssociation");
            }
            return result;
        }


        [Route("api/Associations")]
        [HttpPut]
        public MethodResponse<Association> Put([FromBody] Association model)
        {
            var result = new MethodResponse<Association> { Code = 100, Message = "Success", Result = null };
            try
            {
                Association association = _asssociationService.GetAssociation(model.Id);
                if (association !=null)
                {
                    string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                    association.Modified = DateTime.Now;
                    association.Modifier = userId;
                    association.Name = model.Name;
                    association.Abbreviation = model.Abbreviation;
                    association.CountryId = model.CountryId;
                    association.Iswc = model.Iswc;
                    result.Result = _asssociationService.UpdateAssociation(model);
                }                
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
                _logger.LogCritical(ex, "ErrorPutAssociation");
            }
            return result;
        }
    }
}