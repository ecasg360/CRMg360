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
    public class CertificationAuthorityController : ControllerBase
    {
        private readonly ICertificationAuthorityService _certificationAuthorityService;

        public CertificationAuthorityController(ICertificationAuthorityService
            certificationAuthorityService)
        {
            _certificationAuthorityService = certificationAuthorityService;
        }

        [Route("api/CertificationAuthorities")]
        [HttpGet]
        public MethodResponse<List<CertificationAuthority>> Get()
        {
            var result = new MethodResponse<List<CertificationAuthority>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _certificationAuthorityService.GetAllCertificationAuthorities()
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

        [Route("api/CertificationAuthority")]
        [HttpGet]
        public MethodResponse<CertificationAuthority> Get(int id)
        {
            var result = new MethodResponse<CertificationAuthority> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _certificationAuthorityService.GetCertificationAuthority(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/CertificationAuthority")]
        [HttpPost]
        public MethodResponse<int> Post([FromBody] CertificationAuthority model)
        {
            var result = new MethodResponse<int> { Code = 100, Message = "Success", Result = 0 };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                model.Created = DateTime.Now;
                model.Creator = userId;
                model.StatusRecordId = 1;

                result.Result = _certificationAuthorityService.CreateCertificationAuthority(model).Id;
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = 0;
            }
            return result;
        }


        [Route("api/CertificationAuthority")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] CertificationAuthority model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {

                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                CertificationAuthority certificationAuthority =
                    _certificationAuthorityService.GetCertificationAuthority(model.Id);

                certificationAuthority.Name = model.Name;
                certificationAuthority.BusinessName = model.BusinessName;
                certificationAuthority.Phone = model.Phone;
                certificationAuthority.Contact = model.Contact;
                certificationAuthority.Modified = DateTime.Now;
                certificationAuthority.Modifier = userId;

                _certificationAuthorityService.UpdateCertificationAuthority(certificationAuthority);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/CertificationAuthorityStatus")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody]StatusUpdateModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                CertificationAuthority certificationAuthority =
                    _certificationAuthorityService.GetCertificationAuthority(Convert.ToInt32(model.Id));

                certificationAuthority.StatusRecordId = model.Status;
                certificationAuthority.Modified = DateTime.Now;
                certificationAuthority.Modifier = userId;

                _certificationAuthorityService.UpdateCertificationAuthority(certificationAuthority);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/CertificationAuthority")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                CertificationAuthority certificationAuthority =
                     _certificationAuthorityService.GetCertificationAuthority(id);

                certificationAuthority.StatusRecordId = 3;
                certificationAuthority.Erased = DateTime.Now;
                certificationAuthority.Eraser = userId;

                _certificationAuthorityService.UpdateCertificationAuthority(certificationAuthority);
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