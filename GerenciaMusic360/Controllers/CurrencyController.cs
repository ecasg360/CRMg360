using GerenciaMusic360.Entities;
using GerenciaMusic360.Entities.Models;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class CurrencyController : ControllerBase
    {
        private readonly ICurrencyService _currencyService;
        public CurrencyController(
            ICurrencyService currencyService)
        {
            _currencyService = currencyService;
        }

        [Route("api/Currencies")]
        [HttpGet]
        public MethodResponse<List<Currency>> Get()
        {
            var result = new MethodResponse<List<Currency>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _currencyService.GetList()
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

        [Route("api/Currency")]
        [HttpGet]
        public MethodResponse<Currency> Get(int id)
        {
            var result = new MethodResponse<Currency> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _currencyService.Get(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/Currency")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] Currency model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                model.Created = DateTime.Now;
                model.Creator = userId;
                model.StatusRecordId = 1;
                _currencyService.Create(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/Currency")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] Currency model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Currency currency = _currencyService.Get(model.Id);
                currency.Code = model.Code;
                currency.Description = model.Description;
                currency.CountryId = model.CountryId;
                currency.Modified = DateTime.Now;
                currency.Modifier = userId;

                _currencyService.Update(currency);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/CurrencyStatus")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody]StatusUpdateModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Currency currency = _currencyService.Get(Convert.ToInt32(model.Id));
                currency.StatusRecordId = model.Status;
                currency.Modified = DateTime.Now;
                currency.Modifier = userId;
                _currencyService.Update(currency);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/Currency")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Currency currency = _currencyService.Get(id);
                currency.StatusRecordId = 3;
                currency.Erased = DateTime.Now;
                currency.Eraser = userId;

                _currencyService.Update(currency);
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
