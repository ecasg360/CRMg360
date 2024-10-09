using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class ForeignWorkController : ControllerBase
    {
        private readonly IForeignWorkService _foreignWorkService;
        private readonly IForeignWorkPersonService _foreignWorkPersonService;
        private readonly IPersonService _personService;
        public ForeignWorkController(
           IForeignWorkService foreignWorkService,
           IForeignWorkPersonService foreignWorkPersonService,
           IPersonService personService
        )
        {
            _foreignWorkService = foreignWorkService;
            _foreignWorkPersonService = foreignWorkPersonService;
            _personService = personService;
        }

        [Route("api/ForeignWork")]
        [HttpPost]
        public MethodResponse<ForeignWork> Post([FromBody] ForeignWork model)
        {
            var result = new MethodResponse<ForeignWork> { Code = 100, Message = "Success", Result = null };
            try
            {
                model.CreationDate = DateTime.Now;
                result.Result = _foreignWorkService.CreateForeignWork(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/ForeignWorkPerson")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] List<ForeignWorkPerson> model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                _foreignWorkPersonService.CreateForeignWorkPersons(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/ForeignWorks")]
        [HttpGet]
        public MethodResponse<List<ForeignWork>> Get()
        {
            var result = new MethodResponse<List<ForeignWork>> { Code = 100, Message = "Success", Result = null };
            try
            {
                var foreignsWorks = _foreignWorkService.GetAllForeignWorks();
                foreignsWorks.ToList().ForEach(i =>
                {
                    i.ForeignWorkPerson.ToList().ForEach(n =>
                    {
                        n.Person = _personService.GetPerson(n.PersonId);
                        n.Person.AliasName = string.Format("{0} {1}", n.Person.Name, n.Person.LastName);
                    });
                });
                result.Result = foreignsWorks.ToList();
                return result;
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/ForeignWorkPerson")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                ForeignWorkPerson foreignWorkPerson = _foreignWorkPersonService.GetForeignWorkPerson(id);
                _foreignWorkPersonService.DeleteForeignWorkPerson(foreignWorkPerson);
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