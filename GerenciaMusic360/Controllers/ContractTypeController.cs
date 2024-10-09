using GerenciaMusic360.Entities;
using GerenciaMusic360.Entities.Models;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class ContractTypeController : ControllerBase
    {
        private readonly IContractTypeService _contractTypeService;
        private readonly IHelperService _helperService;
        private readonly IHostingEnvironment _env;

        public ContractTypeController(
            IContractTypeService contractTypeService,
            IHelperService helperService,
            IHostingEnvironment env)
        {
            _contractTypeService = contractTypeService;
            _helperService = helperService;
            _env = env;
        }

        [Route("api/ContractTypes")]
        [HttpGet]
        public MethodResponse<List<ContractType>> Get()
        {
            var result = new MethodResponse<List<ContractType>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _contractTypeService.GetAllContractTypes()
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

        [Route("api/ContractType")]
        [HttpGet]
        public MethodResponse<ContractType> Get(int id)
        {
            var result = new MethodResponse<ContractType> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _contractTypeService.GetContractType(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/ContractType")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] ContractType model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string pictureURL = string.Empty;
                if (!string.IsNullOrWhiteSpace(model.PictureUrl) && !model.PictureUrl.Contains("asset"))
                    pictureURL = _helperService.SaveImage(
                        model.PictureUrl.Split(",")[1],
                        "contractType", $"{Guid.NewGuid()}.jpg",
                        _env);

                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                model.PictureUrl = pictureURL;
                model.Created = DateTime.Now;
                model.Creator = userId;
                model.StatusRecordId = 1;

                _contractTypeService.CreateContractType(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }


        [Route("api/ContractType")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] ContractType model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                ContractType contractType = _contractTypeService.GetContractType(model.Id);

                if (!string.IsNullOrWhiteSpace(model.PictureUrl) && !model.PictureUrl.Contains("asset")) {
                    if (System.IO.File.Exists(Path.Combine(_env.WebRootPath, "clientapp", "dist", contractType.PictureUrl)))
                        System.IO.File.Delete(Path.Combine(_env.WebRootPath, "clientapp", "dist", contractType.PictureUrl));

                    if (model.PictureUrl?.Length > 0)
                        model.PictureUrl = _helperService.SaveImage(model.PictureUrl.Split(",")[1],
                            "contractType", $"{Guid.NewGuid()}.jpg", _env);
                }                    

                contractType.Name = model.Name;
                contractType.LocalCompanyId = model.LocalCompanyId;
                contractType.Modified = DateTime.Now;
                contractType.Modifier = userId;

                _contractTypeService.UpdateContractType(contractType);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/ContractTypeStatus")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody]StatusUpdateModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                ContractType contractType = _contractTypeService.GetContractType(Convert.ToInt32(model.Id));
                contractType.StatusRecordId = model.Status;
                contractType.Modified = DateTime.Now;
                contractType.Modifier = userId;

                _contractTypeService.UpdateContractType(contractType);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/ContractType")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                ContractType contractType = _contractTypeService.GetContractType(id);
                contractType.StatusRecordId = 3;
                contractType.Erased = DateTime.Now;
                contractType.Eraser = userId;

                _contractTypeService.UpdateContractType(contractType);
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