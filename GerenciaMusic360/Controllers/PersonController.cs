using GerenciaMusic360.Common.Enum;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class PersonController : ControllerBase
    {
        private readonly IPersonService _personService;
        public PersonController(
            IPersonService personService)
        {
            _personService = personService;
        }

        [Route("api/PersonByPersonType")]
        [HttpGet]
        public MethodResponse<List<Person>> Get(int personTypeId)
        {
            var result = new MethodResponse<List<Person>> { Code = 100, Message = "Success", Result = null };
            try
            {
                var personList = _personService.GetAllPersons((int)Entity.ProjectContact).ToList();
                result.Result = personList.Where(x => x.PersonTypeId == personTypeId).ToList();
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
