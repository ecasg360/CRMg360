using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class ContractTermTypeController : ControllerBase
    {
        private readonly IContractTermTypeService _contractTerm;

        public ContractTermTypeController(IContractTermTypeService contractTerm)
        {
            _contractTerm = contractTerm;
        }

        [Route("api/ContractTermTypes")]
        [HttpGet]
        public MethodResponse<List<ContractTermType>> Get(int contractId)
        {
            var result = new MethodResponse<List<ContractTermType>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _contractTerm.GetAll(contractId)
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

        [Route("api/ContractTermType")]
        [HttpPost]
        public MethodResponse<ContractTermType> Post([FromBody] ContractTermType model)
        {
            var result = new MethodResponse<ContractTermType> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _contractTerm.Create(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/ContractTermTypes")]
        [HttpPost]
        public MethodResponse<List<ContractTermType>> Post([FromBody] List<ContractTermType> model)
        {
            var result = new MethodResponse<List<ContractTermType>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _contractTerm.Create(model)
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

        [Route("api/ContractTermType")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                ContractTermType contractTerm = _contractTerm.Get(id);
                _contractTerm.Delete(contractTerm);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/ContractTermTypes")]
        [HttpDelete]
        public MethodResponse<bool> DeleteByContractTerms(int contractId, int termTypeId)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                _contractTerm.DeleteByContractTerm(contractId, termTypeId);
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