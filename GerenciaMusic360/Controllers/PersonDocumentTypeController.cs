using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class PersonDocumentTypeController : ControllerBase
    {
        private readonly IPersonDocumentTypeService _personDocumentTypeService;
        public PersonDocumentTypeController(
            IPersonDocumentTypeService personDocumentTypeService)
        {
            _personDocumentTypeService = personDocumentTypeService;
        }

        [Route("api/PersonDocumentTypes")]
        [HttpGet]
        public MethodResponse<List<PersonDocumentType>> Get()
        {
            var result = new MethodResponse<List<PersonDocumentType>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _personDocumentTypeService.GetAllPersonDocumentTypes()
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
    }
}