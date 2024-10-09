using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class TypeNameController : ControllerBase
    {
        private readonly ITypeNameService _typeNameService;
        public TypeNameController(
            ITypeNameService typeNameService)
        {
            _typeNameService = typeNameService;
        }

        [Route("api/TypeNames")]
        [HttpGet]
        public MethodResponse<List<TypeName>> Get()
        {
            var result = new MethodResponse<List<TypeName>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _typeNameService.GetAllTypeNames()
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