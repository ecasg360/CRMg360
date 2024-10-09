using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class AddressLocationController : ControllerBase
    {
        private readonly IAddressService _addressService;

        public AddressLocationController(
           IAddressService addressService)
        {
            _addressService = addressService;
        }

        [Route("api/AddressLocation")]
        [HttpPost]
        public MethodResponse<int> Post([FromBody] Address model)
        {
            var result = new MethodResponse<int> { Code = 100, Message = "Success", Result = 0 };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                model.StatusRecordId = 1;
                model.Created = DateTime.Now;
                model.Creator = userId;

                result.Result = _addressService.CreateAddress(model).Id;
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = 0;
            }
            return result;
        }
    }
}