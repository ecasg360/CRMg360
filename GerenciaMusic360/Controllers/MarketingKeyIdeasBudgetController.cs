using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class MarketingKeyIdeasBudgetController : ControllerBase
    {
        private readonly IMarketingKeyIdeasBudgetService _budgetService;

        public MarketingKeyIdeasBudgetController(IMarketingKeyIdeasBudgetService budgetService)
        {
            _budgetService = budgetService;
        }


        [Route("api/MarketingKeyIdeasBudgets")]
        [HttpGet]
        public MethodResponse<List<MarketingKeyIdeasBudget>> Get(int marketingKeyIdeasId)
        {
            var result = new MethodResponse<List<MarketingKeyIdeasBudget>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _budgetService.GetAll(marketingKeyIdeasId)
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

        [Route("api/MarketingKeyIdeasBudget")]
        [HttpPost]
        public MethodResponse<MarketingKeyIdeasBudget> Post([FromBody] MarketingKeyIdeasBudget model)
        {
            var result = new MethodResponse<MarketingKeyIdeasBudget> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _budgetService.Create(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/MarketingKeyIdeasBudgets")]
        [HttpPost]
        public MethodResponse<List<MarketingKeyIdeasBudget>> PostBudgets([FromBody] List<MarketingKeyIdeasBudget> model)
        {
            var result = new MethodResponse<List<MarketingKeyIdeasBudget>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _budgetService.Create(model)
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

        [Route("api/MarketingKeyIdeasBudget")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] MarketingKeyIdeasBudget model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {

                MarketingKeyIdeasBudget budget = _budgetService.Get(model.Id);

                budget.Target = model.Target;
                budget.PercentageBudget = model.PercentageBudget;
                _budgetService.Update(budget);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/MarketingKeyIdeasBudget")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                MarketingKeyIdeasBudget budget = _budgetService.Get(id);
                _budgetService.Delete(budget);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/MarketingKeyIdeasBudgets")]
        [HttpDelete]
        public MethodResponse<bool> DeleteMarketingKeyIdeasBudgets(int marketingKeyIdeaId)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                IEnumerable<MarketingKeyIdeasBudget> budgets = _budgetService.GetAll(marketingKeyIdeaId);
                _budgetService.Delete(budgets);
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