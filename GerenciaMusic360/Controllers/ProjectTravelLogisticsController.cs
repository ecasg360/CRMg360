using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System.IO;
using System.Drawing;
using Microsoft.AspNetCore.Hosting;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class ProjectTravelLogisticsController : ControllerBase
    {
        private readonly IProjectTravelLogisticsService _projectTravelLogisticsService;
        private readonly IHostingEnvironment _env;
        private readonly IProjectService _projectService;
        private readonly IAirlineService _airlineService;
        private readonly IProjectTravelLogisticsHotelService _projectTravelLogisticsHotelService;
        private readonly IProjectTravelLogisticsFlightService _projectTravelLogisticsFlightService;
        private readonly IProjectTravelLogisticsTransportationService _projectTravelLogisticsTransportationService;
        private readonly IProjectTravelLogisticsOtherService _projectTravelLogisticsOtherService;

        public ProjectTravelLogisticsController(
           IProjectTravelLogisticsService projectTravelLogisticsService,
           IHostingEnvironment env,
           IProjectService projectService,
           IAirlineService airlineService,
           IProjectTravelLogisticsHotelService projectTravelLogisticsHotelService,
           IProjectTravelLogisticsFlightService projectTravelLogisticsFlightService,
           IProjectTravelLogisticsTransportationService projectTravelLogisticsTransportationService,
           IProjectTravelLogisticsOtherService projectTravelLogisticsOtherService
           )
        {
            _projectTravelLogisticsService = projectTravelLogisticsService;
            _env = env;
            _projectService = projectService;
            _airlineService = airlineService;
            _projectTravelLogisticsHotelService = projectTravelLogisticsHotelService;
            _projectTravelLogisticsFlightService = projectTravelLogisticsFlightService;
            _projectTravelLogisticsTransportationService = projectTravelLogisticsTransportationService;
            _projectTravelLogisticsOtherService = projectTravelLogisticsOtherService;
        }

        [Route("api/ProjectTravelLogistics")]
        [HttpGet]
        public MethodResponse<List<ProjectTravelLogistics>> Get(int projectId = 0)
        {
            var result = new MethodResponse<List<ProjectTravelLogistics>> { Code = 100, Message = "Success", Result = null };
            try
            {
                if (projectId > 0)
                {
                    result.Result = _projectTravelLogisticsService.GetAllByProjectId(projectId).ToList();
                }
                else
                {
                    result.Result = _projectTravelLogisticsService.GetAllProjectTravelLogistics().ToList();

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

        [Route("api/ProjectTravelLogistics")]
        [HttpPost]
        public MethodResponse<int> Post([FromBody] ProjectTravelLogistics model)
        {
            var result = new MethodResponse<int> { Code = 100, Message = "Success", Result = 0 };
            try
            {
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                model.StatusRecordId = 1;
                model.Created = DateTime.Now;
                model.Creator = userId;
                _projectTravelLogisticsService.CreateProjectTravelLogistics(model);
                result.Result = model.Id;
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = 0;
            }
            return result;
        }

        [Route("api/ProjectTravelLogistics")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] ProjectTravelLogistics model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                var menu = _projectTravelLogisticsService.GetProjectTravelLogistics(model.Id);
                model.Modifier = userId;
                model.Modified = DateTime.Now;
                model.Creator = menu.Creator;
                model.Created = menu.Created;
                _projectTravelLogisticsService.UpdateProjectTravelLogistics(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }


        [Route("api/ProjectTravelLogistics")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                ProjectTravelLogistics projectTravelLogistics = _projectTravelLogisticsService.GetProjectTravelLogistics(id);
                projectTravelLogistics.StatusRecordId = 3;
                projectTravelLogistics.Erased = DateTime.Now;
                projectTravelLogistics.Eraser = userId;
                _projectTravelLogisticsService.UpdateProjectTravelLogistics(projectTravelLogistics);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/ProjectTravelLogisticsDownload")]
        [AcceptVerbs("GET")]
        public ActionResult Download(int projectId)
        {
            try
            {
                IEnumerable<ProjectTravelLogistics> projectLogistics = _projectTravelLogisticsService.GetAllByProjectId(projectId);
                Stream excel = CreateExcel(projectLogistics);

                excel.Position = 0;
                string excelName = $"Reporte_ProjectTravelLogistics.xlsx";

                return File(excel, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", excelName);
            }
            catch (Exception ex)
            {
                return Content(ex.Message, "application/json");
            }
        }

        private Stream CreateExcel(IEnumerable<ProjectTravelLogistics> projectLogistics)
        {
            string path = Path.Combine(_env.ContentRootPath, "Template", "TemplateProjectLogistics.xlsx");
            MemoryStream ms = new MemoryStream();
            // Temporal para validar que tenga información
            IEnumerable<ProjectTravelLogistics> projectLogisticsTmp = projectLogistics;
            if (projectLogisticsTmp.Cast<object>().Any())
            {
                Project project = _projectService.GetProject(projectLogistics.First().ProjectId);

                IEnumerable<AirLine> airlines = _airlineService.GetAllAirlines();

                FileStream source = System.IO.File.OpenRead(path);
                using (ExcelPackage package = new ExcelPackage(source))
                {
                    ExcelWorksheet sheet = package.Workbook.Worksheets[1];
                    sheet.Cells["A1"].Value = $"Logistics Travel -  {project.ProjectTypeName.ToUpper()}: {project.Name.ToUpper()}";

                    Color colorDetail = ColorTranslator.FromHtml("#e7eeee");
                    Color colorTitle = ColorTranslator.FromHtml("#61888a");
                    Color colorFooter = ColorTranslator.FromHtml("#d0dede");

                    int rowCounter = 4;
                    decimal spendTotal = 0;

                    foreach (ProjectTravelLogistics projectLogistic in projectLogistics)
                    {
                        using (ExcelRange rng = sheet.Cells[rowCounter, 1, rowCounter, 4])
                        {
                            rng.Style.Font.Bold = true;
                            rng.Style.Font.Size = 12;
                            rng.Style.Fill.PatternType = ExcelFillStyle.Solid;
                            rng.Style.Fill.BackgroundColor.SetColor(colorDetail);
                            //rng.Merge = true;
                        }

                        sheet.Cells[rowCounter, 1].Style.Font.Color.SetColor(Color.Black);
                        sheet.Cells[rowCounter, 1].Value = projectLogistic.TravelLogisticsTypeName;

                        if (projectLogistic.TravelLogisticsTypeId == 1)
                        {
                            ProjectTravelLogisticsFlight logisticFlight = _projectTravelLogisticsFlightService.GetByCost(
                                projectLogistic.Id, projectLogistic.TotalCost    
                            );
                            foreach (AirLine airline in airlines)
                            {
                                if (logisticFlight.AirLineId == airline.Id)
                                {
                                    sheet.Cells[rowCounter, 2].Style.Font.Color.SetColor(Color.Black);
                                    sheet.Cells[rowCounter, 2].Value = airline.Name;
                                }
                            }
                        }

                        if (projectLogistic.TravelLogisticsTypeId == 2)
                        {
                            ProjectTravelLogisticsHotel logisticHotel = _projectTravelLogisticsHotelService.GetByCost(
                                projectLogistic.Id, projectLogistic.TotalCost
                            );
                            sheet.Cells[rowCounter, 2].Style.Font.Color.SetColor(Color.Black);
                            sheet.Cells[rowCounter, 2].Value = logisticHotel.Name + " ROOM: " + logisticHotel.RoomNumber;
                        }

                        if (projectLogistic.TravelLogisticsTypeId == 3)
                        {
                            ProjectTravelLogisticsTransportation logisticTransportation = _projectTravelLogisticsTransportationService.GetByCost(
                                projectLogistic.Id, projectLogistic.TotalCost
                            );
                            sheet.Cells[rowCounter, 2].Style.Font.Color.SetColor(Color.Black);
                            sheet.Cells[rowCounter, 2].Value = logisticTransportation.Agency + " VEHICLE: " + logisticTransportation.VehicleName;
                        }

                        if (
                            projectLogistic.TravelLogisticsTypeId != 1
                            && projectLogistic.TravelLogisticsTypeId != 2
                            && projectLogistic.TravelLogisticsTypeId != 3
                        )
                        {
                            ProjectTravelLogisticsOther logisticOther = _projectTravelLogisticsOtherService.GetByCost(
                                projectLogistic.Id, projectLogistic.TotalCost
                            );
                            sheet.Cells[rowCounter, 2].Style.Font.Color.SetColor(Color.Black);
                            sheet.Cells[rowCounter, 2].Value = logisticOther.Name;
                        }

                        sheet.Cells[rowCounter, 3].Style.Font.Color.SetColor(Color.Black);
                        sheet.Cells[rowCounter, 3].Value = projectLogistic.TotalCost;

                        sheet.Cells[rowCounter, 4].Style.Font.Color.SetColor(Color.Black);
                        sheet.Cells[rowCounter, 4].Value = projectLogistic.IsInternal == 0 
                            ? "Artist" : projectLogistic.IsInternal == 1 
                            ? "GM360" : "MOE";

                        /*
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
                        */
                        rowCounter += 1;
                    }

                    rowCounter += 1;
                    using (ExcelRange rng = sheet.Cells[rowCounter, 1, rowCounter, 4])
                    {
                        rng.Style.Font.Bold = true;
                        rng.Style.Fill.BackgroundColor.SetColor(colorTitle);
                        rng.Style.Font.Size = 14;
                        rng.Style.Font.Color.SetColor(Color.White);
                    }
                    sheet.Cells[rowCounter, 1].Value = "TOTAL AMOUNT";
                    sheet.Cells[rowCounter, 3].Value = projectLogistics.Sum(s => s.TotalCost);
                    //sheet.Cells[rowCounter, 3].Value = spendTotal;

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
                    sheet.Cells["A1"].Value = $"Logistics  Is Empty";
                    package.SaveAs(ms);
                }
            }
            return ms;
        }
    }
}
