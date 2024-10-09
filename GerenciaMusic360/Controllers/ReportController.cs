using GerenciaMusic360.Entities;
using GerenciaMusic360.Entities.Report;
using GerenciaMusic360.Services.Interfaces;
using GerenciaMusic360.Services.Interfaces.Report;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly IConfigurationLabelCopyService _configuration;
        private readonly IHostingEnvironment _env;
        private readonly ITemplateBudgetService _templateBudgetService;
        private readonly IProjectService _projectService;
        private readonly IPersonService _personService;
        private readonly ITemplateBudgetEventService _templateBudgetEventService;
        private readonly IPersonProjectContactService _personProjectContactService;
        private readonly IWorkService _workService;
        private readonly IMusicalGenreService _musicalGenreService;
        private readonly IComposerDetailService _composerDetailService;
        private readonly IMarketingService _marketingService;
        private readonly IReportMarketingService _reportMarketingService;
        private readonly ISocialNetworkTypeService _socialNetworkTypeService;


        public ReportController(
            IConfigurationLabelCopyService configuration,
            IHostingEnvironment env,
            ITemplateBudgetService templateBudgetService,
            ITemplateBudgetEventService templateBudgetEventService,
            IProjectService projectService,
            IPersonProjectContactService personProjectContactService,
            IWorkService workService,
            IMusicalGenreService musicalGenreService,
            IComposerDetailService composerDetailService,
            IMarketingService marketingService,
            IReportMarketingService reportMarketingService,
            ISocialNetworkTypeService socialNetworkTypeService
        )
        {
            _configuration = configuration;
            _env = env;
            _templateBudgetService = templateBudgetService;
            _templateBudgetEventService = templateBudgetEventService;
            _projectService = projectService;
            _personProjectContactService = personProjectContactService;
            _workService = workService;
            _musicalGenreService = musicalGenreService;
            _composerDetailService = composerDetailService;
            _marketingService = marketingService;
            _reportMarketingService = reportMarketingService;
            _socialNetworkTypeService = socialNetworkTypeService;
        }


        [Route("api/ReportBudgetTemplate")]
        [AcceptVerbs("GET")]
        public ActionResult ReportBudgetTemplate(string projectId)
        {
            try
            {
                //Consulta Datos Budget
                var templateBudget = _templateBudgetService.Get(projectId);
                //Consulta Eventos Budget
                templateBudget = _templateBudgetEventService.GetEvents(templateBudget);
                Stream excel = CreateExcel(templateBudget);

                excel.Position = 0;
                string excelName = $"Reporte_Budget_.xlsx";

                return File(excel, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", excelName);
            }
            catch (Exception ex)
            {
                return Content(ex.Message, "application/json");
            }
        }

        [Route("api/ReportEventsArtist")]
        [AcceptVerbs("GET")]
        public ActionResult ReportEventsArtist(string eventsJSON)
        {
            try
            {
                string projectsIds = "";
                var eventList = JsonConvert.DeserializeObject<List<BudgetEvent>>(eventsJSON);

                foreach (var item in eventList)
                {
                    projectsIds = projectsIds + item.Id + ",";
                }

                //Consulta Datos Budget
                var templateBudget = _templateBudgetService.Get(projectsIds);
                //Consulta Eventos Budget
                templateBudget.Events = eventList.ToList();
                Stream excel = CreateExcel(templateBudget);

                excel.Position = 0;
                string excelName = $"Reporte_Budget_.xlsx";

                return File(excel, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", excelName);
            }
            catch (Exception ex)
            {
                return Content(ex.Message, "application/json");
            }
        }

        private Stream CreateExcel(TemplateBudget templateBudget)
        {

            string path = Path.Combine(_env.ContentRootPath, "Template", "TemplateBudget.xlsx");
            MemoryStream ms = new MemoryStream();

            FileStream source = System.IO.File.OpenRead(path);
            using (ExcelPackage package = new ExcelPackage(source))
            {
                ExcelWorksheet sheet = package.Workbook.Worksheets[3];

                //ARTIST
                sheet.Cells["B7"].Value = templateBudget.ArtistName;

                //EXPENSES TAKEN FROM ARTIST SPLIT
                sheet.Cells["C15"].Value = templateBudget.Musicians;
                sheet.Cells["C16"].Value = templateBudget.Engineer;
                sheet.Cells["C17"].Value = templateBudget.Flights;
                sheet.Cells["C18"].Value = templateBudget.Transportation;
                sheet.Cells["C19"].Value = templateBudget.Gas;
                sheet.Cells["C20"].Value = templateBudget.Hotels;
                sheet.Cells["C21"].Value = templateBudget.Meals;
                sheet.Cells["C22"].Value = templateBudget.Sobrepeso;
                sheet.Cells["C23"].Value = templateBudget.SpecialEffects;
                sheet.Cells["C24"].Value = templateBudget.MiscExpense;

                sheet.Cells["G17"].Value = templateBudget.PercentageArtist;


                //SE CALCULA EL TOTAL DEL PRESUPUESTO
                decimal? totalIncome = 0;
                foreach (BudgetEvent budgetEvent in templateBudget.Events)
                {
                    if (budgetEvent.LastPayment > 0)
                    {
                        totalIncome = totalIncome + (budgetEvent.Deposit + budgetEvent.LastPayment);
                    }
                    else
                    {
                        totalIncome = totalIncome + budgetEvent.TotalBudget;
                    }
                }
                //SE SETEA EL VALOR DEL TOTAL DEL PRESUPUESTO
                sheet.Cells["G13"].Value = totalIncome;

                //EVENTS
                int rowInitEvent = 9;
                int indexRow = 9;
                foreach (BudgetEvent budgetEvent in templateBudget.Events)
                {
                    sheet.Cells["A" + indexRow.ToString()].Value = budgetEvent.EventDate;
                    sheet.Cells["B" + indexRow.ToString()].Value = budgetEvent.Venue;
                    sheet.Cells["D" + indexRow.ToString()].Value = budgetEvent.Location;
                    sheet.Cells["G" + indexRow.ToString()].Value = budgetEvent.Deposit;
                    sheet.Cells["I" + indexRow.ToString()].Value = budgetEvent.LastPayment;
                    //sheet.Cells["J" + indexRow.ToString()].Value = budgetEvent.TotalBudget;

                    if (budgetEvent != templateBudget.Events.Last())
                    {
                        indexRow = indexRow + 2;
                        sheet.InsertRow(rowInitEvent, 2);
                        sheet.Cells[indexRow, 1, indexRow, 11].Copy(sheet.Cells[rowInitEvent, 1, rowInitEvent, 11]);
                    }
                }

                sheet.Protection.IsProtected = false;
                sheet.Protection.AllowSelectLockedCells = false;

                package.SaveAs(ms);
            }
            return ms;
        }


        [Route("api/ReportProjects")]
        [AcceptVerbs("GET")]
        public ActionResult ReportProjects(string idProjectsJSON)
        {
            try
            {
                var idProjectList = JsonConvert.DeserializeObject<List<int>>(idProjectsJSON);
                List<Project> projectList = new List<Project>();

                foreach (var id in idProjectList)
                {
                    var project = _projectService.GetProject(id);
                    if (project != null)
                    {
                        projectList.Add(project);
                    }
                }


                Stream excel = CreateExcelProjects(projectList);

                excel.Position = 0;
                string excelName = $"Report_Project_.xlsx";

                return File(excel, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", excelName);
            }
            catch (Exception ex)
            {
                return Content(ex.Message, "application/json");
            }
        }

        private Stream CreateExcelProjects(List<Project> listProject)
        {
            string path = Path.Combine(_env.ContentRootPath, "Template", "ReportProjects.xlsx");
            MemoryStream ms = new MemoryStream();

            FileStream source = System.IO.File.OpenRead(path);
            using (ExcelPackage package = new ExcelPackage(source))
            {
                var date = DateTime.Now.Date;
                ExcelWorksheet sheet = package.Workbook.Worksheets["Projects"];

                //PROJECTS
                int indexProject = 5;
                int indexRow = 1;

                sheet.Cells["C3"].Value = date;

                foreach (Project project in listProject)
                {
                    sheet.Cells["A" + indexProject.ToString()].Value = indexRow;
                    sheet.Cells["B" + indexProject.ToString()].Value = project.Name;
                    sheet.Cells["C" + indexProject.ToString()].Value = project.Description;
                    sheet.Cells["D" + indexProject.ToString()].Value = project.ArtistName;
                    sheet.Cells["E" + indexProject.ToString()].Value = project.StatusProjectName;
                    sheet.Cells["F" + indexProject.ToString()].Value = project.LocationName;
                    sheet.Cells["G" + indexProject.ToString()].Value = project.CurrencyCode + ' ' + project.CurrencyDescription;
                    sheet.Cells["H" + indexProject.ToString()].Value = project.TotalBudget;
                    sheet.Cells["I" + indexProject.ToString()].Value = project.InitialDate;
                    sheet.Cells["J" + indexProject.ToString()].Value = project.EndDate;

                    indexRow = indexRow + 1;
                    indexProject = indexProject + 1;
                }

                sheet.Protection.IsProtected = false;
                sheet.Protection.AllowSelectLockedCells = false;

                package.SaveAs(ms);
            }
            return ms;
        }



        [Route("api/ReportContacts")]
        [AcceptVerbs("GET")]
        public ActionResult ReportContacts(string idContactsJSON)
        {
            try
            {
                var idProjectList = JsonConvert.DeserializeObject<List<int>>(idContactsJSON);
                var listContact = _personProjectContactService.GetAllPersonsProjectContacts().Where(b => idProjectList.Any(a => a == b.Id)).ToList();


                Stream excel = CreateExcelContacts(listContact);

                excel.Position = 0;
                string excelName = $"Report_Contact_.xlsx";

                return File(excel, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", excelName);
            }
            catch (Exception ex)
            {
                return Content(ex.Message, "application/json");
            }
        }

        private Stream CreateExcelContacts(List<PersonProjectContact> listContact)
        {
            string path = Path.Combine(_env.ContentRootPath, "Template", "ReportContacts.xlsx");
            MemoryStream ms = new MemoryStream();

            FileStream source = System.IO.File.OpenRead(path);
            using (ExcelPackage package = new ExcelPackage(source))
            {
                var date = DateTime.Now.Date;
                ExcelWorksheet sheet = package.Workbook.Worksheets["Contacts"];

                //CONTACTS
                int indexContact = 5;
                int indexRow = 1;

                sheet.Cells["C3"].Value = date;

                foreach (PersonProjectContact person in listContact)
                {
                    sheet.Cells["A" + indexContact.ToString()].Value = indexRow;
                    sheet.Cells["B" + indexContact.ToString()].Value = person.Name + " " + person.LastName + " " + person.SecondLastName;
                    sheet.Cells["C" + indexContact.ToString()].Value = person.PersonTypeDescription;
                    sheet.Cells["D" + indexContact.ToString()].Value = person.OfficePhone;
                    sheet.Cells["E" + indexContact.ToString()].Value = person.CellPhone;
                    sheet.Cells["F" + indexContact.ToString()].Value = person.Email;
                    sheet.Cells["G" + indexContact.ToString()].Value = person.BirthDate;
                    sheet.Cells["H" + indexContact.ToString()].Value = person.Gender;

                    indexRow = indexRow + 1;
                    indexContact = indexContact + 1;
                }

                sheet.Protection.IsProtected = false;
                sheet.Protection.AllowSelectLockedCells = false;

                package.SaveAs(ms);
            }
            return ms;
        }


        [Route("api/ReportWorks")]
        [AcceptVerbs("GET")]
        public ActionResult ReportWorks(string idWorksJSON)
        {
            try
            {
                var idWorkList = JsonConvert.DeserializeObject<List<int>>(idWorksJSON);
                var listWork = _workService.GetAllWorksRelation().Where(b => idWorkList.Any(a => a == b.Id)).ToList();

                Stream excel = CreateExcelWorks(listWork);

                excel.Position = 0;
                string excelName = $"Report_Works_.xlsx";

                return File(excel, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", excelName);
            }
            catch (Exception ex)
            {
                return Content(ex.Message, "application/json");
            }
        }

        private Stream CreateExcelWorks(List<Work> listWork)
        {
            try
            {
                string path = Path.Combine(_env.ContentRootPath, "Template", "ReportWorks.xlsx");
                MemoryStream ms2 = new MemoryStream();

                FileStream source = System.IO.File.OpenRead(path);
                using (ExcelPackage package = new ExcelPackage(source))
                {
                    var musicalGenres = _musicalGenreService.GetAll();
                    var date = DateTime.Now.Date;
                    ExcelWorksheet sheet = package.Workbook.Worksheets["Works"];

                    //CONTACTS
                    int indexWork = 5;
                    int indexRow = 1;

                    sheet.Cells["C3"].Value = date;


                    foreach (Work work in listWork)
                    {
                        var musicalGenre = musicalGenres.Where(x => x.Id == work.MusicalGenreId);

                        sheet.Cells["A" + indexWork.ToString()].Value = indexRow;
                        sheet.Cells["B" + indexWork.ToString()].Value = work.Name.Trim();
                        sheet.Cells["C" + indexWork.ToString()].Value = work.Description;
                        sheet.Cells["D" + indexWork.ToString()].Value = work.AmountRevenue;
                        sheet.Cells["E" + indexWork.ToString()].Value = work.Rating;
                        sheet.Cells["F" + indexWork.ToString()].Value = work.RegisterNum;
                        sheet.Cells["G" + indexWork.ToString()].Value = work.RegisterDate;
                        if(musicalGenre != null && musicalGenre.Count() > 0)
                        {
                            sheet.Cells["H" + indexWork.ToString()].Value =  musicalGenre.First().Name;
                        }
                        sheet.Cells["I" + indexWork.ToString()].Value = work.LicenseNum;

                        indexRow = indexRow + 1;
                        indexWork = indexWork + 1;
                    }

                    sheet.Protection.IsProtected = false;
                    sheet.Protection.AllowSelectLockedCells = false;

                    package.SaveAs(ms2);
                }
                return ms2;
            }
            catch(Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        //[Route("api/ReportWork")]
        //[AcceptVerbs("GET")]
        //public ActionResult ReportWork(Work work)
        //{
        //    try
        //    {
        //        Stream excel = CreateExcelWork(work);

        //        excel.Position = 0;
        //        string excelName = $"Report_Work_.xlsx";

        //        return File(excel, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", excelName);
        //    }
        //    catch (Exception ex)
        //    {
        //        return Content(ex.Message, "application/json");
        //    }
        //}

        [Route("api/ReportWork")]
        [AcceptVerbs("GET")]
        public ActionResult ReportWork(int workId)
        {
            try
            {
                var work = _workService.GetAllWorksRelation().Where(b => b.Id == workId).SingleOrDefault();
                Stream excel = CreateExcelWork(work);

                excel.Position = 0;
                string excelName = $"Report_Work_.xlsx";

                return File(excel, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", excelName);
            }
            catch (Exception ex)
            {
                return Content(ex.Message, "application/json");
            }
        }

        private Stream CreateExcelWork(Work work)
        {
            try
            {
                string path = Path.Combine(_env.ContentRootPath, "Template", "ReportWork.xlsx");
                MemoryStream ms = new MemoryStream();

                FileStream source = System.IO.File.OpenRead(path);
                using (ExcelPackage package = new ExcelPackage(source))
                {
                    var musicalGenres = _musicalGenreService.GetAll();
                    var date = DateTime.Now.Date;
                    ExcelWorksheet sheet = package.Workbook.Worksheets["Work"];

                    //CONTACTS
                    sheet.Cells["C3"].Value = date;

                    var musicalGenre = musicalGenres.Where(x => x.Id == work.MusicalGenreId);

                    sheet.Cells["C5"].Value = work.Name;
                    sheet.Cells["E5"].Value = work.Description;
                    sheet.Cells["G5"].Value = work.AmountRevenue;
                    sheet.Cells["I5"].Value = work.Rating;
                    sheet.Cells["C6"].Value = work.RegisterNum;
                    sheet.Cells["E6"].Value = work.RegisterDate;
                    sheet.Cells["G6"].Value = (musicalGenre != null ? musicalGenre.First().Name : "");
                    sheet.Cells["I6"].Value = work.LicenseNum;
                    sheet.Cells["C7"].Value = work.CertifiedWork.ToString();
                    sheet.Cells["E7"].Value = work.RegisteredWork.ToString();

                    //COLLABORATORS
                    int indexCollaborator = 12;
                    int indexRowCollaborator = 1;

                    foreach (WorkCollaborator collaborator in work.WorkCollaborator)
                    {
                        collaborator.ComposerDetail = _composerDetailService.GetComposerDetailsByComposerId(collaborator.Composer.Id);
                        sheet.Cells["A" + indexCollaborator.ToString()].Value = indexRowCollaborator;
                        sheet.Cells["B" + indexCollaborator.ToString()].Value = collaborator.Composer.Name + " " + collaborator.Composer.LastName;
                        sheet.Cells["C" + indexCollaborator.ToString()].Value = collaborator.ComposerDetail.Association.Abbreviation;
                        sheet.Cells["D" + indexCollaborator.ToString()].Value = collaborator.ComposerDetail.IPI;
                        sheet.Cells["E" + indexCollaborator.ToString()].Value = collaborator.AmountRevenue;
                        sheet.Cells["F" + indexCollaborator.ToString()].Value = collaborator.PercentageRevenue;

                        indexRowCollaborator = indexRowCollaborator + 1;
                        indexCollaborator = indexCollaborator + 1;
                    }

                    sheet.Protection.IsProtected = false;
                    sheet.Protection.AllowSelectLockedCells = false;

                    package.SaveAs(ms);
                }
                return ms;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        [Route("api/ReportMarketing")]
        [AcceptVerbs("GET")]
        public ActionResult ReportMarketing(int marketingId, int artistId)
        {
            try
            {
                List<Marketing> list = new List<Marketing>(0);
                if (marketingId == 0)
                {
                    List<Project> listProjects = new List<Project>(0);
                    IEnumerable<Project> projects = _projectService.GetProjectByArtist(artistId);
                    if (projects != null)
                    {
                        foreach (Project project in projects)
                        {
                            listProjects.Add(project);
                        }
                        foreach (Project project in listProjects)
                        {
                            IEnumerable<Marketing> campaigns = _marketingService.GetByProject(project.Id);
                            if (campaigns.Count() > 0)
                            {
                                foreach (Marketing campaign in campaigns)
                                {
                                    list.Add(campaign);
                                }
                            }
                        }
                    }
                } else
                {
                    var marketing = _marketingService.Get(marketingId);
                    list.Add(marketing);
                }
                List<ReportMarketing> report = null;
                List<ReportMarketing> reportItems = new List<ReportMarketing>(0);
                foreach (Marketing mkt in list)
                {
                    report = _reportMarketingService.GetReport(mkt.Id);
                    foreach (ReportMarketing item in report)
                    {
                        reportItems.Add(item);
                    }
                }
                Stream excel = CreateExcelReportMarketing(reportItems);

                excel.Position = 0;
                string excelName = $"Report_Marketing_.xlsx";

                return File(excel, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", excelName);
            }
            catch (Exception ex)
            {
                return Content(ex.Message, "application/json");
            }
        }

        private Stream CreateExcelReportMarketing(List<ReportMarketing> report)
        {
            try
            {
                string path = Path.Combine(_env.ContentRootPath, "Template", "TemplateReportMarketing.xlsx");
                MemoryStream ms = new MemoryStream();

                FileStream source = System.IO.File.OpenRead(path);
                using (ExcelPackage package = new ExcelPackage(source))
                {
                    var socialNetworkTypes = _socialNetworkTypeService.GetAllSocialNetworkTypes();
                    var date = DateTime.Now.Date;
                    ExcelWorksheet sheet = package.Workbook.Worksheets["Marketing"];
                    int headerRow = 2;
                    int headerColumn = 4;
                    foreach (SocialNetworkType network in socialNetworkTypes)
                    {
                        sheet.Cells[headerRow, headerColumn].Value = network.Name;
                        headerColumn++;
                        sheet.Cells[headerRow, headerColumn].Value = "Variation (%)";
                        headerColumn++;
                    }
                    headerColumn = 3;
                    DateTime currentDate = new DateTime();
                    string campaignName = "";
                    foreach (ReportMarketing item in report)
                    {
                        if (campaignName != item.Project)
                        {
                            headerRow++;
                            sheet.Cells[headerRow, 1].Value = item.Artist;
                            sheet.Cells[headerRow, 2].Value = item.Project;
                            campaignName = item.Project;
                        }
                        if (currentDate != item.TheDate)
                        {
                            headerRow++;
                            headerColumn = 3;
                            currentDate = item.TheDate;
                            sheet.Cells[headerRow, headerColumn].Value = item.TheDate;
                        }
                        
                        if (item.TheDate == currentDate)
                        {
                            headerColumn = 4;
                            foreach (SocialNetworkType network in socialNetworkTypes)
                            {
                                if (item.SocialNetworkType == network.Name)
                                {
                                    sheet.Cells[headerRow, headerColumn].Value = item.GoalQuantity;
                                    headerColumn++;
                                    var lastVal = sheet.Cells[headerRow - 1, headerColumn - 1].Value;
                                    if (lastVal != null)
                                    {
                                        sheet.Cells[headerRow, headerColumn].FormulaR1C1 = "= ROUND(((RC[-1] - R[-1]C[-1]) / R[-1]C[-1]) * 100, 2)";
                                    }
                                    else
                                    {
                                        sheet.Cells[headerRow, headerColumn].Value = 0;
                                    }
                                    headerColumn++;
                                } else
                                {
                                    headerColumn = headerColumn + 2;
                                }
                            }
                        }
                    }
                    sheet.Protection.IsProtected = false;
                    sheet.Protection.AllowSelectLockedCells = false;

                    package.SaveAs(ms);
                    
                }
                return ms;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }
    }
}