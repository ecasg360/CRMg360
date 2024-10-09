using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class ContractTermsController : ControllerBase
    {
        private readonly IContractTermsService _contractTermsService;
        private readonly ITermTypeService _termTypeService;
        private readonly ITermsService _termsService;

        public ContractTermsController(IContractTermsService contractTermsService, ITermTypeService termTypeService, ITermsService termsService)
        {
            _contractTermsService = contractTermsService;
            _termTypeService = termTypeService;
            _termsService = termsService;
        }

        [Route("api/ContractTerms")]
        [HttpGet]
        public MethodResponse<List<ContractTerms>> Get()
        {
            var result = new MethodResponse<List<ContractTerms>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _contractTermsService.GetAllContractTerms()
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

        [Route("api/ContractTermsByContractId")]
        [HttpGet]
        public MethodResponse<List<TermType>> GetByContractId(int contractId)
        {
            var result = new MethodResponse<List<TermType>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _contractTermsService.GetAllContractTermsByContractId(contractId)
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

        [Route("api/ContractTerm")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                ContractTerms contractTerm = _contractTermsService.Get(id);
                _contractTermsService.DeleteContracTerms(contractTerm);

                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                var contractTerms = _contractTermsService.GetAllContractTermsByContractId(contractTerm.ContractId);
                var term = _termsService.Get(contractTerm.TermId);

                var terms = contractTerms.Single(x => x.Id == term.TermTypeId);

                short i = 1;
                foreach (var item in terms.ContractTerms)
                {
                    item.Position = i++;
                }

                _contractTermsService.UpdateList(terms.ContractTerms);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/ContractTerm")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] ContractTerms model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                var contractTerms = _contractTermsService.GetAllContractTermsByContractId(model.ContractId);
                var term = _termsService.Get(model.TermId);

                var terms = contractTerms.Single(x => x.Id == term.TermTypeId);

                short max = terms.ContractTerms.Count > 0 ? terms.ContractTerms.Max(x => x.Position) : (short)0;

                model.Position = ++max;

                _contractTermsService.Create(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/ContractTerms")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] List<ContractTerms> model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                var contractTerms = _contractTermsService.GetAllContractTermsByContractId(model[0].ContractId);
                var term = _termsService.Get(model[0].TermId);

                var terms = contractTerms.Single(x => x.Id == term.TermTypeId);

                short max = 0;
                if (terms.ContractTerms.Count > 0)
                {
                    terms.ContractTerms.Max(x => x.Position);
                }

                foreach (var item in model)
                {
                    item.Position = ++max;
                }

                _contractTermsService.Create(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/ContractTerm")]
        [HttpGet]
        public MethodResponse<ContractTerms> Get(int id)
        {
            var result = new MethodResponse<ContractTerms> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _contractTermsService.Get(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/ContractTerm")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] ContractTerms model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                _contractTermsService.Update(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/ContractTerms")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] List<ContractTerms> model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                _contractTermsService.UpdateList(model);
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
