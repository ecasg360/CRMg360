using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class ProjectBudgetController : ControllerBase
    {
        private readonly IProjectService _projectService;
        private readonly IProjectBudgetService _projectBudgetService;
        private readonly IHostingEnvironment _env;

        public ProjectBudgetController(
            IProjectService projectService,
            IProjectBudgetService projectBudgetService,
            IHostingEnvironment env)
        {
            _projectService = projectService;
            _projectBudgetService = projectBudgetService;
            _env = env;
        }

        [Route("api/ProjectBudgets")]
        [HttpGet]
        public MethodResponse<List<ProjectBudget>> GetByProject(int projectId)
        {
            var result = new MethodResponse<List<ProjectBudget>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _projectBudgetService.GetAllProjectBudgets(projectId)
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

        [Route("api/ProjectBudget")]
        [HttpGet]
        public MethodResponse<ProjectBudget> Get(int id)
        {
            var result = new MethodResponse<ProjectBudget> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _projectBudgetService.GetProjectBudget(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/ProjectBudget")]
        [HttpPost]
        public MethodResponse<ProjectBudget> Post([FromBody] ProjectBudget model)
        {
            var result = new MethodResponse<ProjectBudget> { Code = 100, Message = "Success", Result = null };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                model.Created = DateTime.Now;
                model.Spent = 0;
                model.Creator = userId;
                model.StatusRecordId = 1;

                result.Result = _projectBudgetService.CreateProjectBudget(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/ProjectBudgets")]
        [HttpPost]
        public MethodResponse<List<ProjectBudget>> Post([FromBody] List<ProjectBudget> model)
        {
            var result = new MethodResponse<List<ProjectBudget>> { Code = 100, Message = "Success", Result = null };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                foreach (ProjectBudget projectBudget in model)
                {
                    projectBudget.Created = DateTime.Now;
                    projectBudget.Spent = 0;
                    projectBudget.Creator = userId;
                    projectBudget.StatusRecordId = 1;
                }

                result.Result = _projectBudgetService.CreateProjectBudgets(model).ToList();
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/ProjectBudget")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] ProjectBudget model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {

                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                ProjectBudget projectBudget = _projectBudgetService.GetProjectBudget(model.Id);

                projectBudget.ProjectId = model.ProjectId;
                projectBudget.CategoryId = model.CategoryId;
                projectBudget.Budget = model.Budget;
                projectBudget.Spent = model.Spent;
                projectBudget.Notes = model.Notes;
                projectBudget.Modified = DateTime.Now;
                projectBudget.Modifier = userId;

                _projectBudgetService.UpdateProjectBudget(projectBudget);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/ProjectBudgets")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] List<ProjectBudget> model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {

                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                foreach (ProjectBudget projectBudgetModel in model)
                {
                    ProjectBudget projectBudget = _projectBudgetService.GetProjectBudget(projectBudgetModel.Id);

                    projectBudget.ProjectId = projectBudgetModel.ProjectId;
                    projectBudget.CategoryId = projectBudgetModel.CategoryId;
                    projectBudget.Budget = projectBudgetModel.Budget;
                    projectBudget.Spent = projectBudgetModel.Spent;
                    projectBudget.Notes = projectBudgetModel.Notes;
                    projectBudget.Modified = DateTime.Now;
                    projectBudget.Modifier = userId;

                    _projectBudgetService.UpdateProjectBudget(projectBudget);
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

        [Route("api/ProjectBudget")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                ProjectBudget projectBudget = _projectBudgetService.GetProjectBudget(id);
                projectBudget.StatusRecordId = 3;
                projectBudget.Erased = DateTime.Now;
                projectBudget.Eraser = userId;

                _projectBudgetService.UpdateProjectBudget(projectBudget);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/ProjectBudgetByProject")]
        [HttpDelete]
        public MethodResponse<bool> DeleteByProject(int projectId)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                IEnumerable<ProjectBudget> projectBudgets = _projectBudgetService.GetAllProjectBudgets(projectId);

                foreach (ProjectBudget projectBudget in projectBudgets)
                {
                    projectBudget.StatusRecordId = 3;
                    projectBudget.Erased = DateTime.Now;
                    projectBudget.Eraser = userId;
                    _projectBudgetService.UpdateProjectBudget(projectBudget);
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

        [Route("api/ProjectBudgetDownload")]
        [AcceptVerbs("GET")]
        public ActionResult Download(int projectId)
        {
            try
            {
                IEnumerable<ProjectBudget> projectBudgets = _projectBudgetService.GetAllProjectBudgets(projectId);
                Stream excel = CreateExcel(projectBudgets);

                excel.Position = 0;
                string excelName = $"Reporte_ProjectBudget_.xlsx";

                return File(excel, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", excelName);
            }
            catch (Exception ex)
            {
                return Content(ex.Message, "application/json");
            }
        }

        private Stream CreateExcel(IEnumerable<ProjectBudget> projectBudgets)
        {
            string path = Path.Combine(_env.ContentRootPath, "Template", "TemplateProjectBudget.xlsx");
            MemoryStream ms = new MemoryStream();
            // Temporal para validar que tenga información
            IEnumerable<ProjectBudget> projectBudgetsTmp = projectBudgets;
            if (projectBudgetsTmp.Cast<object>().Any())
            {
                Project project = _projectService.GetProject(projectBudgets.First().ProjectId);

                FileStream source = System.IO.File.OpenRead(path);
                using (ExcelPackage package = new ExcelPackage(source))
                {
                    ExcelWorksheet sheet = package.Workbook.Worksheets[1];
                    sheet.Cells["A1"].Value = $"RELEASE BUDGET  -  {project.ProjectTypeName.ToUpper()}";

                    Color colorDetail = ColorTranslator.FromHtml("#e7eeee");
                    Color colorTitle = ColorTranslator.FromHtml("#61888a");
                    Color colorFooter = ColorTranslator.FromHtml("#d0dede");

                    int rowCounter = 4;
                    decimal spendTotal = 0;

                    foreach (ProjectBudget projectBudget in projectBudgets)
                    {
                        using (ExcelRange rng = sheet.Cells[rowCounter, 1, rowCounter, 3])
                        {
                            rng.Style.Font.Bold = true;
                            rng.Style.Font.Size = 12;
                            rng.Style.Fill.PatternType = ExcelFillStyle.Solid;
                            rng.Style.Fill.BackgroundColor.SetColor(colorTitle);
                            rng.Merge = true;
                        }

                        sheet.Cells[rowCounter, 1].Style.Font.Color.SetColor(Color.White);
                        sheet.Cells[rowCounter, 1].Value = projectBudget.Category.Name;

                        foreach (ProjectBudgetDetail detail in projectBudget.ProjectBudgetDetail)
                        {
                            rowCounter += 1;


                            sheet.Cells[rowCounter, 1].Value = detail.Category.Name;

                            sheet.Cells[rowCounter, 2].Style.Fill.PatternType = ExcelFillStyle.Solid;
                            sheet.Cells[rowCounter, 2].Style.Fill.BackgroundColor.SetColor(colorDetail);

                            sheet.Cells[rowCounter, 3].Style.Fill.PatternType = ExcelFillStyle.Solid;
                            sheet.Cells[rowCounter, 3].Style.Fill.BackgroundColor.SetColor(colorDetail);

                            sheet.Cells[rowCounter, 3].Value = detail.Spent;

                            sheet.Cells[rowCounter, 4].Value = detail.Notes;
                        }
                        rowCounter += 1;

                        using (ExcelRange rng = sheet.Cells[rowCounter, 1, rowCounter, 3])
                        {
                            rng.Style.Font.Bold = true;
                            rng.Style.Fill.BackgroundColor.SetColor(colorFooter);

                            sheet.Cells[rowCounter, 1].Value = "Total";
                            sheet.Cells[rowCounter, 2].Value = projectBudget.Budget;
                            sheet.Cells[rowCounter, 3].Value = projectBudget.ProjectBudgetDetail.Sum(s => s.Spent);

                            spendTotal += projectBudget.ProjectBudgetDetail.Sum(s => s.Spent);
                        }

                        rowCounter += 1;
                    }

                    rowCounter += 1;
                    using (ExcelRange rng = sheet.Cells[rowCounter, 1, rowCounter, 3])
                    {
                        rng.Style.Font.Bold = true;
                        rng.Style.Fill.BackgroundColor.SetColor(colorTitle);
                        rng.Style.Font.Size = 14;
                        rng.Style.Font.Color.SetColor(Color.White);
                    }
                    sheet.Cells[rowCounter, 1].Value = "BUDGET VS. SPENT TOTAL";
                    sheet.Cells[rowCounter, 2].Value = projectBudgets.Sum(s => s.Budget);
                    sheet.Cells[rowCounter, 3].Value = spendTotal;

                    sheet.Protection.IsProtected = false;
                    sheet.Protection.AllowSelectLockedCells = false;

                    package.SaveAs(ms);
                }
            }
            else
            {
                FileStream source = System.IO.File.OpenRead(path);
                using (ExcelPackage package = new ExcelPackage(source))
                {
                    ExcelWorksheet sheet = package.Workbook.Worksheets[1];
                    sheet.Cells["A1"].Value = $"RELEASE BUDGET  Is Empty";
                    package.SaveAs(ms);
                }
            }
            
            return ms;
        }
    }
}
