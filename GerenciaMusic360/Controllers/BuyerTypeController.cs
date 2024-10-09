using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class BuyerTypeController : ControllerBase
    {
        private readonly IBuyerTypeService _buyerTypeService;

        public BuyerTypeController(IBuyerTypeService buyerTypeService)
        {
            _buyerTypeService = buyerTypeService;
        }

        [Route("api/BuyerTypes")]
        [HttpGet]
        public MethodResponse<List<BuyerType>> Get()
        {
            var result = new MethodResponse<List<BuyerType>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _buyerTypeService.GetList()
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
