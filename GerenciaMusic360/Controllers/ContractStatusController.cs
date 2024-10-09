using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class ContractStatusController : ControllerBase
    {
        private readonly IContractStatusService _contractStatusService;
        private readonly IHelperService _helperService;
        private readonly IHostingEnvironment _env;

        public ContractStatusController(
            IContractStatusService contractStatusService,
            IHelperService helperService,
            IHostingEnvironment env)
        {
            _contractStatusService = contractStatusService;
            _helperService = helperService;
            _env = env;
        }

        [Route("api/ContractsStatus")]
        [HttpGet]
        public MethodResponse<List<ContractStatus>> Get()
        {
            var result = new MethodResponse<List<ContractStatus>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _contractStatusService.GetAllContractStatus().ToList();
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/ContractStatusByContractId")]
        [HttpGet]
        public MethodResponse<List<ContractStatus>> GetByContractId(int contractId)
        {
            var result = new MethodResponse<List<ContractStatus>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _contractStatusService.GetContractStatusByContractId(contractId).ToList();
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/ContractStatus")]
        [HttpGet]
        public MethodResponse<ContractStatus> Get(int id)
        {
            var result = new MethodResponse<ContractStatus> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _contractStatusService.GetContractStatus(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/ContractStatus")]
        [HttpPost]
        public MethodResponse<ContractStatus> Post([FromBody] ContractStatus model)
        {
            var result = new MethodResponse<ContractStatus> { Code = 100, Message = "Success", Result = null };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                var contractStatus = _contractStatusService.GetContractStatusByContractId(model.ContractId);
                if (contractStatus.Count() > 0)
                {
                    var find = contractStatus.SingleOrDefault(x => x.StatusId == model.StatusId);
                    if (find != null)
                    {
                        throw new Exception("The status is already registered in database");
                    }
                }


                model.UserVerificationId = 3;
                //model.RoleContractId = 1;
                model.Date = DateTime.Now;
                model.Created = DateTime.Now;
                model.Creator = userId;
                //model.StatusRecordId = 1;
                //model.ContractStatusId = 1;

                result.Result = _contractStatusService.CreateContractStatus(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }


        [Route("api/ContractStatus")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] ContractStatus model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                ContractStatus contract = _contractStatusService.GetContractStatus(model.Id);

                //contract.BusinessName = model.BusinessName;
                //contract.LegalName = model.LegalName;
                //contract.BusinessShortName = model.BusinessShortName;
                //contract.TaxId = model.TaxId;
                //contract.Modified = DateTime.Now;
                //contract.Modifier = userId;

                _contractStatusService.UpdateContractStatus(contract);
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
