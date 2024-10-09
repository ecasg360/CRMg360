using System;
using System.Collections.Generic;
using System.Linq;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class ChecklistController : ControllerBase
    {

        private readonly IChecklistService _checklistService;

        public ChecklistController(IChecklistService checklistService)
        {
            _checklistService = checklistService;
        }

        [Route("api/Checklist")]
        [HttpGet]
        public MethodResponse<List<Checklist>> Get()
        {
            var result = new MethodResponse<List<Checklist>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _checklistService.GetAllRecords().ToList();
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/Checklist")]
        [HttpPost]
        public MethodResponse<int> Post([FromBody] Checklist model)
        {
            var result = new MethodResponse<int> { Code = 100, Message = "Success", Result = 0 };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                model.Created = DateTime.Now;
                model.Creator = userId;
                model.StatusRecordId = 1;

                Checklist resultCreate = _checklistService.CreateRecord(model);
                result.Result = resultCreate.Id;
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = 0;
            }
            return result;
        }

        [Route("api/Checklist")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] Checklist model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {

                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Checklist person = _checklistService.GetRecord(model.Id);

                person.Name = model.Name;
                person.Lastname = model.Lastname;
                person.Phone = model.Phone;
                person.Email = model.Email;
                person.Terms = model.Terms;
                person.ContactType = model.ContactType;
                person.Deal = model.Deal;
                person.DateContact = model.DateContact;
                person.By = model.By;
                _checklistService.UpdateRecord(person);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/Checklist")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Checklist person = _checklistService.GetRecord(id);
                person.StatusRecordId = 3;
                _checklistService.DeleteRecord(person);
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
