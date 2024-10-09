using GerenciaMusic360.Common.Enum;
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
    public class ContractMembersController : ControllerBase
    {
        private readonly IContractService _contractService;
        private readonly IContractMembersService _contractMembersService;
        private readonly IPersonService _personService;
        private readonly IHelperService _helperService;
        private readonly IHostingEnvironment _env;

        public ContractMembersController(
            IContractMembersService contractMembersService,
            IContractService contractService,
            IPersonService personService,
            IHelperService helperService,
            IHostingEnvironment env)
        {
            _contractService = contractService;
            _contractMembersService = contractMembersService;
            _personService = personService;
            _helperService = helperService;
            _env = env;
        }

        [Route("api/ContractMembers")]
        [HttpGet]
        public MethodResponse<List<ContractMembers>> Get()
        {
            var result = new MethodResponse<List<ContractMembers>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _contractMembersService.GetAllContractMembers().ToList();
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/ContractMember")]
        [HttpGet]
        public MethodResponse<ContractMembers> Get(int id)
        {
            var result = new MethodResponse<ContractMembers> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _contractMembersService.GetContractMembers(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/ContractMemberPerson")]
        [HttpPost]
        public MethodResponse<int> Post([FromBody] Person model)
        {
            var result = new MethodResponse<int> { Code = 100, Message = "Success", Result = 0 };
            try
            {
                string pictureURL = string.Empty;
                if (model.PictureUrl?.Length > 0)
                    pictureURL = _helperService.SaveImage(
                        model.PictureUrl.Split(",")[1],
                        "contractmember", $"{Guid.NewGuid()}.jpg",
                        _env);

                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                model.PictureUrl = pictureURL;
                model.BirthDate = DateTime.Parse(model.BirthDateString);
                model.Created = DateTime.Now;
                model.Creator = userId;
                model.EntityId = (int)Entity.ContractMember;
                model.StatusRecordId = 1;

                result.Result = _personService.CreatePerson(model).Id;
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = 0;
            }
            return result;
        }

        [Route("api/ContractMember")]
        [HttpPost]
        public MethodResponse<ContractMembers> Post([FromBody] ContractMembers model)
        {
            var result = new MethodResponse<ContractMembers> { Code = 100, Message = "Success", Result = null };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                var contract = _contractService.GetContract(model.ContractId);

                model.CompanyId = contract.LocalCompanyId;
                model.ContractRoleId = 1;

                //model.Created = DateTime.Now;
                //model.Creator = userId;
                //model.StatusRecordId = 1;
                //model.ContractStatusId = 1;

                result.Result = _contractMembersService.CreateContractMembers(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }


        [Route("api/ContractMember")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] ContractMembers model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                ContractMembers contract = _contractMembersService.GetContractMembers(model.Id);

                //contract.BusinessName = model.BusinessName;
                //contract.LegalName = model.LegalName;
                //contract.BusinessShortName = model.BusinessShortName;
                //contract.TaxId = model.TaxId;
                //contract.Modified = DateTime.Now;
                //contract.Modifier = userId;

                _contractMembersService.UpdateContractMembers(contract);
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
