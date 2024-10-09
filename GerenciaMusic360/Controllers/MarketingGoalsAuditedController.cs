using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Globalization;
using System.IO;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class MarketingGoalsAuditedController : ControllerBase
    {
        private readonly IMarketingGoalsAuditedService _marketingGoalsAuditedService;
        private readonly IMarketingGoalService _marketingGoalService;
        private readonly IUserProfileService _userProfileService;
        private readonly IHostingEnvironment _env;
        private readonly IMarketingService _marketingService;


        public MarketingGoalsAuditedController(
            IMarketingGoalsAuditedService marketingGoalsAuditedService,
            IMarketingGoalService marketingGoalService,
            IUserProfileService userProfileService,
            IHostingEnvironment env,
            IMarketingService marketingService)
        {
            _marketingGoalsAuditedService = marketingGoalsAuditedService;
            _marketingGoalService = marketingGoalService;
            _userProfileService = userProfileService;
            _env = env;
            _marketingService = marketingService;
        }

        [Route("api/MarketingGoalsAuditeds")]
        [HttpPost]
        public MethodResponse<List<MarketingGoalsAudited>> Post([FromBody] List<MarketingGoalsAudited> model)
        {
            var result = new MethodResponse<List<MarketingGoalsAudited>> { Code = 100, Message = "Success", Result = null };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                UserProfile user = _userProfileService.GetUserByUserId(userId);

                DateTime date = DateTime.Parse(model.First().DateString);
                IEnumerable<MarketingGoalsAudited> marketingGoalsAuditeds =
                    _marketingGoalsAuditedService.Get(date, model.First().MarketingId);

                if (marketingGoalsAuditeds.Count() > 0)
                    _marketingGoalsAuditedService.Delete(marketingGoalsAuditeds);

                foreach (MarketingGoalsAudited audited in model)
                {
                    audited.UserVerificationId = user.Id;
                    audited.Date = date;
                }

                result.Result = _marketingGoalsAuditedService.Create(model)
                    .ToList();

                UpdateQuota(model.First().MarketingId);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/MarketingGoalsAuditeds")]
        [HttpGet]
        public MethodResponse<List<MarketingGoalsAudited>> Get(string dateString, int marketingId)
        {
            var result = new MethodResponse<List<MarketingGoalsAudited>> { Code = 100, Message = "Success", Result = null };
            try
            {
                DateTime date = DateTime.Parse(dateString);
                result.Result = _marketingGoalsAuditedService.Get(date, marketingId)
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

        [Route("api/MarketingGoalsAuditedsByMarketing")]
        [HttpGet]
        public MethodResponse<List<MarketingGoalsAudited>> GetByMarketing(int marketingId)
        {
            var result = new MethodResponse<List<MarketingGoalsAudited>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _marketingGoalsAuditedService.GetByMarketing(marketingId)
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

        private void UpdateQuota(int marketingId)
        {
            IEnumerable<MarketingGoals> marketingGoals = _marketingGoalService.GetByMarketing(marketingId);

            foreach (MarketingGoals marketingGoal in marketingGoals)
            {
                IEnumerable<MarketingGoalsAudited> audited =
                    _marketingGoalsAuditedService.GetByMarketing(marketingGoal.MarketingId);

                marketingGoal.CurrentQuantity = audited.Sum(s => s.Quantity);
                _marketingGoalService.Update(marketingGoal);
            }
        }

        [Route("api/GoalsAuditedDownload")]
        [AcceptVerbs("GET")]
        public ActionResult Download(int marketingId)
        {
            try
            {
                IEnumerable<MarketingGoalsAudited> goals = _marketingGoalsAuditedService.GetByMarketingReport(marketingId);
                Marketing marketing = _marketingService.Get(marketingId);
                Stream excel = CreateExcel(goals, marketing);


                excel.Position = 0;
                string excelName = $"Reporte_LabelCopy_.xlsx";

                return File(excel, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", excelName);
            }
            catch (Exception ex)
            {
                return Content(ex.Message, "application/json");
            }
        }


        private Stream CreateExcel(IEnumerable<MarketingGoalsAudited> goals, Marketing marketing)
        {
            IEnumerable<DateTime> dates = goals.Select(s => s.Date)
                                  .Distinct().OrderBy(o => o);

            IEnumerable<string> names = goals.Select(s => s.SocialNetworkName)
                      .Distinct().OrderBy(o => o);

            string path = System.IO.Path.Combine(_env.ContentRootPath, "Template", "TemplateConsultionReport.xlsx");

            System.Drawing.Color colorTitle = ColorTranslator.FromHtml("#d9e1f2");
            System.Drawing.Color colorHeader = ColorTranslator.FromHtml("#aeaaaa");
            MemoryStream ms = new MemoryStream();

            FileStream source = System.IO.File.OpenRead(path);
            using (ExcelPackage package = new ExcelPackage(source))
            {
                ExcelWorksheet sheet = package.Workbook.Worksheets[1];

                sheet.Cells["A3"].Value = marketing.ArtistName;
                sheet.Cells["B3"].Value = marketing.Name;
                ExcelStyle styleHeader = sheet.Cells["C3"].Style;

                using (ExcelRange rng = sheet.Cells[1, 1, 1, (names.Count() * 2) + 3])
                {
                    rng.Merge = true;
                    rng.Style.Fill.PatternType = ExcelFillStyle.Solid;
                    rng.Style.Fill.BackgroundColor.SetColor(colorTitle);
                }

                using (ExcelRange rng = sheet.Cells[2, 4, 2, (names.Count() * 2) + 3])
                {
                    rng.Style.Font.Size = 10;
                    rng.Style.Fill.PatternType = ExcelFillStyle.Solid;
                    rng.Style.Fill.BackgroundColor.SetColor(colorHeader);
                }

                int horizontalCounter = 4;
                foreach (string name in names)
                {
                    sheet.Cells[2, horizontalCounter].Append(StyleCreate(sheet.Cells[2, horizontalCounter], false, true, true));
                    sheet.Cells[2, horizontalCounter].Value = name;
                    horizontalCounter++;

                    sheet.Cells[2, horizontalCounter].Append(StyleCreate(sheet.Cells[2, horizontalCounter], false, false, true));
                    sheet.Cells[2, horizontalCounter].Value = "Variation";
                    horizontalCounter++;
                }

                int verticalCounter = 4;
                horizontalCounter = 4;
                foreach (DateTime date in dates)
                {
                    sheet.Cells[$"C{verticalCounter}"].Append(StyleCreate(sheet.Cells[$"C{verticalCounter}"], true));
                    sheet.Cells[$"C{verticalCounter}"].Value = date.ToString("MM/dd/yyyy", CultureInfo.InvariantCulture);
                    foreach (string name in names)
                    {
                        sheet.Cells[verticalCounter, horizontalCounter].Append(StyleCreate(sheet.Cells[verticalCounter, horizontalCounter], true));
                        sheet.Cells[verticalCounter, horizontalCounter].Value =
                            goals.FirstOrDefault(w => w.Date == date & w.SocialNetworkName == name).Quantity;
                        horizontalCounter++;

                        bool textAlert = false;
                        decimal? variation = goals.FirstOrDefault(w => w.Date == date & w.SocialNetworkName == name)?.Variation;
                        if (variation < 0)
                            textAlert = true;

                        sheet.Cells[verticalCounter, horizontalCounter].Append(StyleCreate(sheet.Cells[verticalCounter, horizontalCounter], true, false, false, textAlert));
                        sheet.Cells[verticalCounter, horizontalCounter].Value = variation;

                        horizontalCounter++;
                    }
                    horizontalCounter = 4;
                    verticalCounter++;
                }

                sheet.Cells[verticalCounter, 3].Append(StyleCreate(sheet.Cells[verticalCounter, 3], true, true));
                sheet.Cells[verticalCounter, 3].Value = "Total";
                foreach (string name in names)
                {
                    sheet.Cells[verticalCounter, horizontalCounter].Append(StyleCreate(sheet.Cells[verticalCounter, horizontalCounter], true, true));
                    sheet.Cells[verticalCounter, horizontalCounter].Value =
                        goals.Where(w => w.SocialNetworkName == name).Sum(s => s.Quantity);

                    horizontalCounter++;
                    sheet.Cells[verticalCounter, horizontalCounter].Append(StyleCreate(sheet.Cells[verticalCounter, horizontalCounter], true));
                    horizontalCounter++;
                }

                package.SaveAs(ms);
            }
            return ms;
        }

        private ExcelRange StyleCreate(ExcelRange range, bool color, bool bold = false, bool isHeader = false, bool textAlert = false)
        {
            System.Drawing.Color colorFill = ColorTranslator.FromHtml("#d9e1f2");
            if (isHeader)
                colorFill = ColorTranslator.FromHtml("#aeaaaa");
            range.Style.Border.Top.Style = ExcelBorderStyle.Thin;
            range.Style.Border.Right.Style = ExcelBorderStyle.Thin;
            range.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
            range.Style.Border.Left.Style = ExcelBorderStyle.Thin;

            if (color)
            {
                range.Style.Fill.PatternType = ExcelFillStyle.Solid;
                range.Style.Fill.BackgroundColor.SetColor(colorFill);
            }
            range.Style.Font.Size = 10;
            if (bold)
                range.Style.Font.Bold = true;

            if (textAlert)
                range.Style.Font.Color.SetColor(System.Drawing.Color.Red);

            return range;
        }


    }
}