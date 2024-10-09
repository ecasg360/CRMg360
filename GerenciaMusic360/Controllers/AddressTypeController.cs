using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class AddressTypeController : ControllerBase
    {
        private readonly IAddressTypeService _addressTypeService;
        public AddressTypeController(
            IAddressTypeService addressTypeService)
        {
            _addressTypeService = addressTypeService;
        }

        [Route("api/AddressTypes")]
        [HttpGet]
        public MethodResponse<List<AddressType>> Get()
        {
            var result = new MethodResponse<List<AddressType>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _addressTypeService.GetAllAddressTypes()
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
