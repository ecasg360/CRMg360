using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class MarketingGoalController : ControllerBase
    {
        private readonly IMarketingGoalService _marketingGoalService;
        private readonly IUserProfileService _userProfileService;
        private readonly IMarketingGoalsAuditedService _marketingGoalAuditedService;

        public MarketingGoalController(
            IMarketingGoalService marketingGoalService,
            IUserProfileService userProfileService,
            IMarketingGoalsAuditedService marketingGoalAuditedService)
        {
            _marketingGoalService = marketingGoalService;
            _userProfileService = userProfileService;
            _marketingGoalAuditedService = marketingGoalAuditedService;
        }

        [Route("api/MarketingGoals")]
        [HttpGet]
        public MethodResponse<List<MarketingGoals>> Get(int marketingId)
        {
            var result = new MethodResponse<List<MarketingGoals>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _marketingGoalService.GetByMarketing(marketingId)
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

        [Route("api/MarketingGoal")]
        [HttpPost]
        public MethodResponse<MarketingGoals> Post([FromBody] MarketingGoals model)
        {
            var result = new MethodResponse<MarketingGoals> { Code = 100, Message = "Success", Result = null };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                UserProfile user = _userProfileService.GetUserByUserId(userId);
                model.UserVerificationId = user.Id;

                result.Result = _marketingGoalService.Create(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/MarketingGoal")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] MarketingGoals model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                MarketingGoals marketingGoals = _marketingGoalService.Get(model.Id);
                marketingGoals.Audited = model.Audited;
                marketingGoals.CurrentQuantity = model.CurrentQuantity;
                marketingGoals.GoalQuantity = model.GoalQuantity;
                marketingGoals.Overcome = model.Overcome;
                marketingGoals.SocialNetworkTypeId = model.SocialNetworkTypeId;

                _marketingGoalService.Update(marketingGoals);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/MarketingGoal")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                MarketingGoals marketingGoals = _marketingGoalService.Get(id);
                IEnumerable<MarketingGoalsAudited> audited = _marketingGoalAuditedService.GetBySocialNetwork((int)marketingGoals.SocialNetworkTypeId);
                if (audited != null)
                    _marketingGoalAuditedService.Delete(audited);
                _marketingGoalService.Delete(marketingGoals);
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