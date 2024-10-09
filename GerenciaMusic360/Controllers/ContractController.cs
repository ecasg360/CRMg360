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
    public class ContractController : ControllerBase
    {
        private readonly IContractService _contractService;
        private readonly IContractStatusService _contractStatusService;
        private readonly IStatusModuleService _statusModuleService;
        private readonly IUserProfileService _userProfileService;

        public ContractController(IContractService contractService,
            IContractStatusService contractStatusService,
            IStatusModuleService statusModuleService,
            IUserProfileService userProfileService)
        {
            _contractService = contractService;
            _contractStatusService = contractStatusService;
            _statusModuleService = statusModuleService;
            _userProfileService = userProfileService;
        }

        [Route("api/Contracts")]
        [HttpGet]
        public MethodResponse<List<Contract>> Get()
        {
            var result = new MethodResponse<List<Contract>> { Code = 100, Message = "Success", Result = null };
            try
            {
                var contracts = _contractService.GetAllContracts().ToList();


                foreach (var item in contracts)
                {
                    var status = _contractStatusService.GetContractStatusByContractId(item.Id);
                    if (status.Count() > 0)
                    {
                        var id = status.Max(x => x.Id);
                        item.ContractStatus = status.SingleOrDefault(x => x.Id == id);
                        var statusModule = _statusModuleService.GetStatusModule(item.ContractStatus.StatusId);
                        item.ContractStatus.StatusModule = statusModule;
                    }
                }
                result.Result = contracts;

            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/ContractsByLabel")]
        [HttpGet]
        public MethodResponse<List<Contract>> GetByLabel()
        {
            var result = new MethodResponse<List<Contract>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _contractService.GetByLabel()
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

        [Route("api/ContractsByAgency")]
        [HttpGet]
        public MethodResponse<List<Contract>> GetByAgency()
        {
            var result = new MethodResponse<List<Contract>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _contractService.GetByAgency()
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

        [Route("api/ContractsByEvent")]
        [HttpGet]
        public MethodResponse<List<Contract>> GetByEvent()
        {
            var result = new MethodResponse<List<Contract>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _contractService.GetByEvent()
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

        [Route("api/ContractsByProjectId")]
        [HttpGet]
        public MethodResponse<List<Contract>> GetByProjectId(int projectId)
        {
            var result = new MethodResponse<List<Contract>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _contractService.GetByProjectId(projectId)
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

        [Route("api/Contract")]
        [HttpGet]
        public MethodResponse<Contract> Get(int id)
        {
            var result = new MethodResponse<Contract> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _contractService.GetContract(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/Contract")]
        [HttpPost]
        public MethodResponse<Contract> Post([FromBody] Contract model)
        {
            var result = new MethodResponse<Contract> { Code = 100, Message = "Success", Result = null };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                UserProfile user = _userProfileService.GetUserByUserId(userId);

                model.Created = DateTime.Now;
                model.Creator = userId;
                model.StatusRecordId = 1;
                model.ContractStatusId = 1;
                result.Result = _contractService.CreateContract(model);

                _contractStatusService.CreateContractStatus(new ContractStatus
                {
                    ContractId = result.Result.Id,
                    UserVerificationId = user.Id,
                    Date = DateTime.Now,
                    Created = DateTime.Now,
                    Creator = userId,
                    StatusId = 1
                });
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }


        [Route("api/Contract")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] Contract model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Contract contract = _contractService.GetContract(model.Id);

                contract.StartDate = model.StartDate;
                contract.EndDate = model.EndDate;
                contract.Name = model.Name;
                contract.Description = model.Description;
                contract.TimeId = model.TimeId;
                contract.CurrencyId = model.CurrencyId;
                contract.HasAmount = model.HasAmount;
                contract.Amount = model.Amount;
                contract.LanguageId = model.LanguageId;
                contract.ProjectId = model.ProjectId;
                contract.ProjectTaskId = model.ProjectTaskId;
                contract.Modified = DateTime.Now;
                contract.Modifier = userId;

                _contractService.UpdateContract(contract);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/ContractStatuss")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody]StatusUpdateModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Contract contract = _contractService.GetContract(Convert.ToInt32(model.Id));
                contract.StatusRecordId = model.Status;
                contract.Modified = DateTime.Now;
                contract.Modifier = userId;

                _contractService.UpdateContract(contract);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/Contract")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Contract contract = _contractService.GetContract(id);
                contract.StatusRecordId = 3;
                contract.Erased = DateTime.Now;
                contract.Eraser = userId;

                _contractService.UpdateContract(contract);
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
