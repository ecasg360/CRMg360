using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class StatusModuleController : ControllerBase
    {
        private readonly IStatusModuleService _statusModuleService;

        public StatusModuleController(IStatusModuleService statusModuleService)
        {
            _statusModuleService = statusModuleService;
        }

        [Route("api/StatusByModule")]
        [HttpGet]
        public MethodResponse<List<StatusModule>> GetStatusByModule(int moduleId)
        {
            var result = new MethodResponse<List<StatusModule>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _statusModuleService.GetAllStatusByModule(moduleId).ToList();
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/StatusModule")]
        [HttpGet]
        public MethodResponse<StatusModule> Get(int id)
        {
            var result = new MethodResponse<StatusModule> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _statusModuleService.GetStatusModule(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/StatusModule")]
        [HttpPost]
        public MethodResponse<Contract> Post([FromBody] StatusModule model)
        {
            var result = new MethodResponse<Contract> { Code = 100, Message = "Success", Result = null };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                model.Created = DateTime.Now;
                model.Creator = userId;
                //model.StatusRecordId = 1;                

                result.Result = null;//_statusModuleService.CreateStatusModule(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/StatusModule")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] Company model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                StatusModule status = _statusModuleService.GetStatusModule(model.Id);

                //contract.BusinessName = model.BusinessName;
                //contract.LegalName = model.LegalName;
                //contract.BusinessShortName = model.BusinessShortName;
                //contract.TaxId = model.TaxId;
                status.Modified = DateTime.Now;
                status.Modifier = userId;

                _statusModuleService.UpdateStatusModule(status);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        //[Route("api/ContractStatus")]
        //[HttpPost]
        //public MethodResponse<bool> Post([FromBody]StatusUpdateModel model)
        //{
        //    var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
        //    try
        //    {
        //        string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
        //        Contract contract = _contractService.GetContract(Convert.ToInt32(model.Id));
        //        contract.StatusRecordId = model.Status;
        //        contract.Modified = DateTime.Now;
        //        contract.Modifier = userId;

        //        _contractService.UpdateContract(contract);
        //    }
        //    catch (Exception ex)
        //    {
        //        result.Message = ex.Message;
        //        result.Code = -100;
        //        result.Result = false;
        //    }
        //    return result;
        //}

        [Route("api/StatusModule")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                StatusModule status = _statusModuleService.GetStatusModule(id);
                //status.StatusRecordId = 3;
                status.Erased = DateTime.Now;
                status.Eraser = userId;

                _statusModuleService.UpdateStatusModule(status);
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
