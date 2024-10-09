using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class KeyIdeasTypeController : ControllerBase
    {
        private readonly IKeyIdeasTypeService _keyIdeasTypeService;

        public KeyIdeasTypeController(IKeyIdeasTypeService keyIdeasTypeService)
        {
            _keyIdeasTypeService = keyIdeasTypeService;
        }


        [Route("api/KeyIdeasType")]
        [HttpGet]
        public MethodResponse<List<KeyIdeasType>> Get()
        {
            var result = new MethodResponse<List<KeyIdeasType>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _keyIdeasTypeService.GetAll()
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