using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Entities.Models;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class ActivitiesReportsController : ControllerBase
    {
        private readonly IActivitiesProjectReports _projectReportsService;
        private readonly IMarketingActivitiesReport _marketingReportsService;
        private readonly IHostingEnvironment _env;

        public ActivitiesReportsController(
            IMarketingActivitiesReport marketingReportsService,
            IActivitiesProjectReports projectReportsService,
            IHostingEnvironment env)
        {
            _marketingReportsService = marketingReportsService;
            _projectReportsService = projectReportsService;
            _env = env;
        }

        [Route("api/ActivityReportProject")]
        [AcceptVerbs("GET")]
        public ActionResult GetByProjectActivies(int activityType, string users)
        {
            List<ProjectReportActivityModel> tasksByUser = new List<ProjectReportActivityModel>();
            ActivitiesReport reportData = new ActivitiesReport
            {
                ActivityType = activityType,
                Users = users.Split(',')
            };

            try
            {
                foreach (string userId in reportData.Users)
                {
                    int id = 0;
                    Int32.TryParse(userId, out id);
                    IEnumerable<ProjectTask> tasks = (reportData.ActivityType == 3) 
                        ? _projectReportsService.GetActivesProjectTaskByUser(id)
                        : _projectReportsService.GetProjectTaskByUser(id);

                    if (tasks != null)
                    {
                        tasksByUser.Add(new ProjectReportActivityModel
                        {
                            ActivityType = reportData.ActivityType,
                            UserName = "",
                            Tasks = tasks.GroupBy(gb => gb.ProjectId)

                        });
                    }
                }

                Stream excel = CreateExcelProject(tasksByUser);

                excel.Position = 0;
                string excelName = $"activity_project_report.xlsx";
                return File(excel, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", excelName);
            }
            catch (Exception ex)
            {
                return Content(ex.Message, "application/json");
            }
        }

        [Route("api/ActivityReportMarketing")]
        [AcceptVerbs("GET")]
        public ActionResult GetByMarketingActivities(int activityType, string users)
        {
            List<MarketingReportActivityModel> tasksByUser = new List<MarketingReportActivityModel>();
            ActivitiesReport reportData = new ActivitiesReport
            {
                ActivityType = activityType,
                Users = users.Split(',')
            };

            try
            {
                foreach (string userId in reportData.Users)
                {
                    int id = 0;
                    Int32.TryParse(userId, out id);
                    IEnumerable<MarketingActivitiesReport> tasks = (reportData.ActivityType == 3) 
                        ? _marketingReportsService.GetActivesMarketingActivitiesByUser(id)
                        : _marketingReportsService.GetMarketingActivitiesByUser(id);

                    if (tasks != null)
                    {
                        tasksByUser.Add(new MarketingReportActivityModel
                        {
                            ActivityType = reportData.ActivityType,
                            UserName = "",
                            Tasks = tasks.GroupBy(gb => gb.MarketingId)

                        });
                    }
                }

                Stream excel = CreateExcelProject(tasksByUser);

                excel.Position = 0;
                string excelName = $"activity_project_report.xlsx";
                return File(excel, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", excelName);
            }
            catch (Exception ex)
            {
                return Content(ex.Message, "application/json");
            }
        }


        private Stream CreateExcelProject(List<ProjectReportActivityModel> tasks)
        {
            string path = Path.Combine(_env.ContentRootPath, "Template", "TemplateReportProjectActivity.xlsx");
            MemoryStream ms = new MemoryStream();

            FileStream source = System.IO.File.OpenRead(path);
            using (ExcelPackage package = new ExcelPackage(source))
            {
                ExcelWorksheet sheet = package.Workbook.Worksheets[1];


                sheet.Cells["C2"].Value = DateTime.Now.ToString("MM/dd/yyyy");

                if (tasks.Count() > 0)
                {
                    int counter = 4;
                    foreach (var task in tasks)
                    {
                        int indexProject = 1;
                        foreach (var nameGroup in task.Tasks) {
                            var dataTask = nameGroup.First();
                            sheet.Cells[$"B{counter}"].Value = dataTask.UserProfileName;
                            counter++;
                            sheet.Cells[$"B{counter}"].Value =$"{indexProject}. {dataTask.ProjectName}";
                            sheet.Cells[$"B{counter}"].AutoFitColumns();
                            counter++;
                            //verifico si son las ultimas tres
                            var nameGroupFiltered = task.ActivityType == 2
                                ? nameGroup.Take(3)
                                : nameGroup;

                            sheet.Cells[$"C{counter}"].Value = "Validation Date";
                            sheet.Cells[$"D{counter}"].Value = "Completed";
                            sheet.Cells[$"E{counter}"].Value = "Activity";
                            counter++;
                            foreach (var group in nameGroupFiltered) {
                                sheet.Cells[$"C{counter}"].Value = group.EstimatedDateVerfication.ToString("MM/dd/yyyy");
                                sheet.Cells[$"C{counter}"].AutoFitColumns();
                                sheet.Cells[$"D{counter}"].Value = group.Completed ? "Yes" : "No";
                                sheet.Cells[$"E{counter}"].Value = group.TemplateTaskDocumentDetailName;
                                sheet.Cells[$"E{counter}"].AutoFitColumns();
                                counter ++;
                            }
                            counter++;
                        }
                    }
                }

                sheet.Protection.IsProtected = false;
                sheet.Protection.AllowSelectLockedCells = false;

                package.SaveAs(ms);
            }
            return ms;
        }

        private Stream CreateExcelProject(List<MarketingReportActivityModel> tasks) {
            string path = Path.Combine(_env.ContentRootPath, "Template", "TemplateReportProjectActivity.xlsx");
            MemoryStream ms = new MemoryStream();

            FileStream source = System.IO.File.OpenRead(path);
            using (ExcelPackage package = new ExcelPackage(source))
            {
                ExcelWorksheet sheet = package.Workbook.Worksheets[1];


                sheet.Cells["C2"].Value = DateTime.Now.ToString("MM/dd/yyyy");

                if (tasks.Count() > 0)
                {
                    int counter = 4;
                    foreach (var task in tasks)
                    {
                        int indexProject = 1;
                        foreach (var nameGroup in task.Tasks)
                        {
                            var dataTask = nameGroup.First();
                            sheet.Cells[$"B{counter}"].Value = $"{dataTask.Name} {dataTask.LastName}";
                            counter++;
                            sheet.Cells[$"B{counter}"].Value = $"{indexProject}. {dataTask.MarketingName}";
                            sheet.Cells[$"B{counter}"].AutoFitColumns();
                            counter++;
                            //verifico si son las ultimas tres
                            var nameGroupFiltered = task.ActivityType == 2
                                ? nameGroup.Take(3)
                                : nameGroup;

                            sheet.Cells[$"C{counter}"].Value = "Validation Date";
                            sheet.Cells[$"D{counter}"].Value = "Completed";
                            sheet.Cells[$"E{counter}"].Value = "Activity";
                            counter++;
                            foreach (var group in nameGroupFiltered)
                            {
                                sheet.Cells[$"C{counter}"].Value = group.EstimatedDateVerification.ToString("MM/dd/yyyy");
                                sheet.Cells[$"C{counter}"].AutoFitColumns();
                                sheet.Cells[$"D{counter}"].Value = group.Complete ? "Yes" : "No";
                                sheet.Cells[$"E{counter}"].Value = group.TaskName;
                                sheet.Cells[$"E{counter}"].AutoFitColumns();
                                counter++;
                            }
                            counter++;
                        }
                    }
                }

                sheet.Protection.IsProtected = false;
                sheet.Protection.AllowSelectLockedCells = false;

                package.SaveAs(ms);
            }
            return ms;
        }
    }
}