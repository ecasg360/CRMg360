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
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;
        private readonly IHelperService _helperService;
        private readonly IHostingEnvironment _env;
        private readonly IConfigurationPBCategoryService _configuration;

        public CategoryController(
            ICategoryService categoryService,
            IHelperService helperService,
            IHostingEnvironment env,
            IConfigurationPBCategoryService configuration)
        {
            _categoryService = categoryService;
            _helperService = helperService;
            _env = env;
            _configuration = configuration;
        }

        [Route("api/Categories")]
        [HttpGet]
        public MethodResponse<List<Category>> Get()
        {
            var result = new MethodResponse<List<Category>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _categoryService.GetAllCategoriesWithModule()
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

        [Route("api/CategoriesByModule")]
        [HttpGet]
        public MethodResponse<List<Category>> Get(int moduleId, int projectTypeId)
        {
            var result = new MethodResponse<List<Category>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _categoryService.GetCategoriesByModule(moduleId, projectTypeId)
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

        [Route("api/Category")]
        [HttpGet]
        public MethodResponse<Category> Get(int id)
        {
            var result = new MethodResponse<Category> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _categoryService.GetCategory(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/Category")]
        [HttpPost]
        public MethodResponse<Category> Post([FromBody] Category model)
        {
            var result = new MethodResponse<Category> { Code = 100, Message = "Success", Result = null };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                string pictureURL = string.Empty;
                if (!string.IsNullOrWhiteSpace(model.PictureUrl) && !model.PictureUrl.Contains("asset"))
                    pictureURL = _helperService.SaveImage(
                        model.PictureUrl.Split(",")[1],
                        "category", $"{Guid.NewGuid()}.jpg",
                        _env);

                model.PictureUrl = pictureURL;
                model.Created = DateTime.Now;
                model.Creator = userId;
                model.StatusRecordId = 1;

                result.Result = _categoryService.CreateCategory(model);

                if (model.ProjectTypeId > 0) {
                    _configuration.CreateConfigurationProjectBudgetCategory(new ConfigurationProjectBudgetCategory
                    {
                        CategoryId = result.Result.Id,
                        ProjectTypeId = model.ProjectTypeId,
                        ConfigurationId = 1
                    });
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


        [Route("api/Category")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] Category model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {

                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Category category = _categoryService.GetCategory(model.Id);

                if (System.IO.File.Exists(Path.Combine(_env.WebRootPath, "clientapp", "dist", category.PictureUrl)))
                    System.IO.File.Delete(Path.Combine(_env.WebRootPath, "clientapp", "dist", category.PictureUrl));

                string pictureURL = string.Empty;
                if (!string.IsNullOrWhiteSpace(model.PictureUrl) && !model.PictureUrl.Contains("asset"))
                    pictureURL = _helperService.SaveImage(
                        model.PictureUrl.Split(",")[1],
                        "category", $"{Guid.NewGuid()}.jpg",
                        _env);

                category.Name = model.Name;
                category.Description = model.Description;
                category.Key = model.Key;
                category.ModuleId = model.ModuleId;
                category.Modified = DateTime.Now;
                category.Modifier = userId;

                _categoryService.UpdateCategory(category);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/CategoryStatus")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody]StatusUpdateModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Category category = _categoryService.GetCategory(Convert.ToInt32(model.Id));
                category.StatusRecordId = model.Status;
                category.Modified = DateTime.Now;
                category.Modifier = userId;

                _categoryService.UpdateCategory(category);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/Category")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id, int projectTypeId)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Category category = _categoryService.GetCategory(id);
                category.StatusRecordId = 3;
                category.Erased = DateTime.Now;
                category.Eraser = userId;

                _categoryService.UpdateCategory(category);

                if (projectTypeId > 0) {
                    ConfigurationProjectBudgetCategory cconfig = _configuration.GetConfigurationProjectBudgetCategory(projectTypeId, id);
                    _configuration.DeleteConfigurationProjectBudgetCategory(cconfig);
                }
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/CategoryFather")]
        [HttpGet]
        public MethodResponse<Category> GetFather(int projectBudgetDetailId)
        {
            var result = new MethodResponse<Category> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _categoryService.GetFather(projectBudgetDetailId);
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