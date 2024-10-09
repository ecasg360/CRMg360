using GerenciaMusic360.Entities;
using GerenciaMusic360.Entities.Models;
using GerenciaMusic360.Entities.ModelView;
using GerenciaMusic360.HubConfig;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class MarketingPlanAutorizeController : ControllerBase
    {
        private readonly IMarketingPlanAutorizeService _authorizeService;
        private readonly IMarketingPlanService _marketingPlanService;
        private readonly IUserProfileService _userProfileService;
        private readonly ILogger<MarketingPlanAutorizeController> _logger;
        private readonly IHubContext<NotificationHub> _contextNotificationHub;
        private readonly INotificationWebService _notificationService;
        private readonly IMarketingService _marketingService;

        public MarketingPlanAutorizeController(
            IMarketingPlanAutorizeService authorizeService,
            IUserProfileService userProfileService,
            ILogger<MarketingPlanAutorizeController> logger,
            IHubContext<NotificationHub> contextNotificationHub,
            INotificationWebService notificationService,
            IMarketingPlanService marketingPlanService,
            IMarketingService marketingService
            )
        {
            _authorizeService = authorizeService;
            _userProfileService = userProfileService;
            _logger = logger;
            _contextNotificationHub = contextNotificationHub;
            _notificationService = notificationService;
            _marketingPlanService = marketingPlanService;
            _marketingService = marketingService;
        }

        [Route("api/MarketingPlanAutorizes")]
        [HttpGet]
        public MethodResponse<List<MarketingPlanAutorize>> Get(int marketingPlanId)
        {
            var result = new MethodResponse<List<MarketingPlanAutorize>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _authorizeService.GetByPlan(marketingPlanId)
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

        [Route("api/MarketingPlanAutorizes")]
        [HttpPost]
        public MethodResponse<List<MarketingPlanAutorize>> Post([FromBody] List<MarketingPlanAutorize> model)
        {
            var result = new MethodResponse<List<MarketingPlanAutorize>> { Code = 100, Message = "Success", Result = null };
            try
            {
                foreach (MarketingPlanAutorize autorize in model)
                    autorize.Checked = false;

                result.Result = _authorizeService.Create(model)
                    .ToList();
                if (result.Result.Count > 0)
                {
                    CreateNotificationWeb(result.Result);
                }
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/MarketingPlanAutorize")]
        [HttpPost]
        public MethodResponse<MarketingPlanAutorize> MarketingPlanAutorize([FromBody] MarketingPlanAutorize model)
        {
            var result = new MethodResponse<MarketingPlanAutorize> { Code = 100, Message = "Success", Result = null };
            try
            {
                model.Checked = false;
                result.Result = _authorizeService.Create(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/MarketingPlanAutorize")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                MarketingPlanAutorize autorize = _authorizeService.Get(id);
                _authorizeService.Delete(autorize);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/MarketingPlanAutorizes")]
        [HttpDelete]
        public MethodResponse<bool> DeleteByPlan(int marketingPlanId)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                IEnumerable<MarketingPlanAutorize> authorizes = _authorizeService.GetByPlan(marketingPlanId);
                _authorizeService.Delete(authorizes);
                result.Result = true;
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        private void CreateNotificationWeb(List<MarketingPlanAutorize> autorizers)
        {
            string message = string.Empty;
            MarketingPlan marketingPlan = null;
            Marketing marketing = null;

            MarketingPlanAutorize auth = autorizers.FirstOrDefault();
            marketingPlan = _marketingPlanService.Get(auth.MarketingPlanId);
            marketing = _marketingService.Get(marketingPlan.MarketingId);
            message = $"Has sido asignado(a) a la tarea {marketingPlan.Name} del proyecto de marketing {marketing.Name}";

            string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

            _notificationService.Create(autorizers.Select(s => new NotificationWeb
            {
                Message = message,
                Active = true,
                Created = DateTime.Now,
                Creator = userId,
                UserId = s.UserVerificationId
            }).ToList());
            SendAlertNotificationWeb(autorizers.Select(s => s.UserVerificationId).ToList());
        }

        private async void SendAlertNotificationWeb(List<long> ids)
        {
            await _contextNotificationHub.Clients.All.SendAsync("SignalMessageReceived", new SignalResponse
            {
                Message = "you have a task assign",
                UsersIds = ids
            });
        }
    }
}