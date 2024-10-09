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
    public class MarketingController : ControllerBase
    {
        private readonly IMarketingService _marketingService;
        private readonly IHelperService _helperService;
        private readonly IHostingEnvironment _env;
        private readonly IMarketingGoalService _marketingGoalService;
        private readonly IMarketingKeyIdeasService _marketingKeyIdeasService;
        private readonly IMarketingOverviewService _marketingOverviewService;
        private readonly IMarketingOverviewDService _marketingOverviewDService;
        private readonly IMarketingPlanAutorizeService _marketingPlanAutorizeService;
        private readonly IMarketingPlanService _marketingPlanService;
        private readonly IMarketingGoalsAuditedService _marketingGoalsAuditedService;
        private readonly IMarketingAssetService _marketingAssetService;


        public MarketingController(
            IMarketingService marketingService,
            IHelperService helperService,
            IHostingEnvironment env,
            IMarketingGoalService marketingGoalService,
            IMarketingKeyIdeasService marketingKeyIdeasService,
            IMarketingOverviewService marketingOverviewService,
            IMarketingOverviewDService marketingOverviewDService,
            IMarketingPlanAutorizeService marketingPlanAutorizeService,
            IMarketingPlanService marketingPlanService,
            IMarketingGoalsAuditedService marketingGoalsAuditedService,
            IMarketingAssetService marketingAssetService)
        {
            _marketingService = marketingService;
            _helperService = helperService;
            _env = env;
            _marketingGoalService = marketingGoalService;
            _marketingKeyIdeasService = marketingKeyIdeasService;
            _marketingOverviewService = marketingOverviewService;
            _marketingOverviewDService = marketingOverviewDService;
            _marketingPlanAutorizeService = marketingPlanAutorizeService;
            _marketingPlanService = marketingPlanService;
            _marketingGoalsAuditedService = marketingGoalsAuditedService;
            _marketingAssetService = marketingAssetService;
        }

        [Route("api/Marketings")]
        [HttpGet]
        public MethodResponse<List<Marketing>> Get()
        {
            var result = new MethodResponse<List<Marketing>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _marketingService.GetAll()
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

        [Route("api/MarketingsByLabel")]
        [HttpGet]
        public MethodResponse<List<Marketing>> GetByLabel()
        {
            var result = new MethodResponse<List<Marketing>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _marketingService.GetByLabel()
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

        [Route("api/MarketingsByAgency")]
        [HttpGet]
        public MethodResponse<List<Marketing>> GetByAgency()
        {
            var result = new MethodResponse<List<Marketing>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _marketingService.GetByAgency()
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

        [Route("api/MarketingsByEvent")]
        [HttpGet]
        public MethodResponse<List<Marketing>> GetByEvent()
        {
            var result = new MethodResponse<List<Marketing>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _marketingService.GetByEvent()
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

        [Route("api/Marketing")]
        [HttpGet]
        public MethodResponse<Marketing> Get(int id)
        {
            var result = new MethodResponse<Marketing> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _marketingService.Get(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/Marketing")]
        [HttpPost]
        public MethodResponse<Marketing> Post([FromBody] Marketing model)
        {
            var result = new MethodResponse<Marketing> { Code = 100, Message = "Success", Result = null };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                if (!string.IsNullOrEmpty(model.StartDateString))
                    model.StartDate = DateTime.Parse(model.StartDateString);

                if (!string.IsNullOrEmpty(model.EndDateString))
                    model.EndDate = DateTime.Parse(model.EndDateString);

                model.StatusId = 5;
                model.Created = DateTime.Now;
                model.Creator = userId;

                result.Result = _marketingService.Create(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }


        [Route("api/Marketing")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] Marketing model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {

                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Marketing marketing = _marketingService.Get(model.Id);

                if (!string.IsNullOrEmpty(model.StartDateString))
                    model.StartDate = DateTime.Parse(model.StartDateString);

                if (!string.IsNullOrEmpty(model.EndDateString))
                    model.EndDate = DateTime.Parse(model.EndDateString);

                marketing.Name = model.Name;
                marketing.GeneralInformation = model.GeneralInformation;
                marketing.DescriptionKeyIdeas = model.DescriptionKeyIdeas;
                marketing.DescriptionHeaderPlan = model.DescriptionHeaderPlan;
                marketing.DescriptionHeaderOverviewMaterial = model.DescriptionHeaderOverviewMaterial;
                marketing.Modified = DateTime.Now;
                marketing.Modifier = userId;

                _marketingService.Update(marketing);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/MarketingDelete")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Marketing marketing = _marketingService.Get(id);
                // Eliminar los goals
                var goals = _marketingGoalService.GetByMarketing(marketing.Id);
                foreach (MarketingGoals goal in goals)
                {
                    _marketingGoalService.Delete(goal);
                }
                // Eliminar los key Ideas
                var keys = _marketingKeyIdeasService.GetAll(marketing.Id);
                foreach (MarketingKeyIdeas key in keys)
                {
                    _marketingKeyIdeasService.Delete(key);
                }

                // Eliminar los overview
                var overviews = _marketingOverviewService.GetAll(marketing.Id);
                foreach (MarketingOverview overview in overviews)
                {
                    var overviewDetails = _marketingOverviewDService.GetAll(overview.Id);
                    foreach (MarketingOverViewDetail overviewDetail in overviewDetails)
                    {
                        _marketingOverviewDService.Delete(overviewDetail);
                    }
                    _marketingOverviewService.Delete(overview);
                }

                // Eliminar los marketing Plan
                var marketingPlans = _marketingPlanService.GetAll(marketing.Id);
                foreach (MarketingPlan marketingPlan in marketingPlans)
                {
                    var planAutorizes = _marketingPlanAutorizeService.GetByPlan(marketingPlan.Id);
                    foreach (MarketingPlanAutorize planAutorize in planAutorizes)
                    {
                        _marketingPlanAutorizeService.Delete(planAutorize);
                    }
                    _marketingPlanService.Delete(marketingPlan);
                }

                // Eliminar los marketing goals audited
                var marketingGoalsAudited = _marketingGoalsAuditedService.GetByMarketing(marketing.Id);
                _marketingGoalsAuditedService.Delete(marketingGoalsAudited);

                // Eliminar los marketing assets
                var assets = _marketingAssetService.GetAll(marketing.Id);
                foreach (MarketingAsset asset in assets)
                {
                    _marketingAssetService.Delete(asset);
                }

                _marketingService.Delete(marketing);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }


        [Route("api/MarketingImage")]
        [HttpPost]
        public MethodResponse<string> PostImage([FromBody] Marketing model)
        {
            var result = new MethodResponse<string> { Code = 100, Message = "Success", Result = null };
            try
            {
                Marketing marketing = _marketingService.Get(model.Id);

                string pictureURL = string.Empty;
                if (model.PictureUrl?.Length > 0)
                    pictureURL = _helperService.SaveImage(
                        model.PictureUrl.Split(",")[1],
                        "marketingCover", $"{Guid.NewGuid()}.jpg",
                        _env);

                marketing.PictureUrl = pictureURL;
                _marketingService.Update(marketing);
                result.Result = pictureURL;
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/MarketingImage")]
        [HttpGet]
        public MethodResponse<string> GetImage(int id)
        {
            var result = new MethodResponse<string> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _marketingService.Get(id).PictureUrl;
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }
    }
}
