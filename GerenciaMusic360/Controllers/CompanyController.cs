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
    public class CompanyController : ControllerBase
    {
        private readonly ICompanyService _companyService;

        public CompanyController(ICompanyService companyService)
        {
            _companyService = companyService;
        }

        [Route("api/Companies")]
        [HttpGet]
        public MethodResponse<List<Company>> Get()
        {
            var result = new MethodResponse<List<Company>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _companyService.GetAllCompanies()
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

        [Route("api/Company")]
        [HttpGet]
        public MethodResponse<Company> Get(int id)
        {
            var result = new MethodResponse<Company> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _companyService.GetCompany(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/Company")]
        [HttpPost]
        public MethodResponse<int> Post([FromBody] Company model)
        {
            var result = new MethodResponse<int> { Code = 100, Message = "Success", Result = 0 };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                model.Created = DateTime.Now;
                model.Creator = userId;
                model.StatusRecordId = 1;

                result.Result = _companyService.CreateCompany(model).Id;
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = 0;
            }
            return result;
        }


        [Route("api/Company")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] Company model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {

                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Company company = _companyService.GetCompany(model.Id);

                company.BusinessName = model.BusinessName;
                company.LegalName = model.LegalName;
                company.BusinessShortName = model.BusinessShortName;
                company.TaxId = model.TaxId;
                company.Modified = DateTime.Now;
                company.Modifier = userId;

                _companyService.UpdateCompany(company);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/CompanyStatus")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody]StatusUpdateModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Company company = _companyService.GetCompany(Convert.ToInt32(model.Id));
                company.StatusRecordId = model.Status;
                company.Modified = DateTime.Now;
                company.Modifier = userId;

                _companyService.UpdateCompany(company);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/Company")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Company company = _companyService.GetCompany(id);
                company.StatusRecordId = 3;
                company.Erased = DateTime.Now;
                company.Eraser = userId;

                _companyService.UpdateCompany(company);
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