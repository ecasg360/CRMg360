using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Entities.Models;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using A = DocumentFormat.OpenXml.Drawing;
using DW = DocumentFormat.OpenXml.Drawing.Wordprocessing;
using PIC = DocumentFormat.OpenXml.Drawing.Pictures;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class MarketingPlanController : ControllerBase
    {
        private readonly IMarketingPlanService _marketingPlanService;
        private readonly ITemplateTaskDocumentDetailService _templateService;
        private readonly IHostingEnvironment _env;
        private readonly IMarketingPlanHeaderService _headerService;
        private readonly IMarketingGoalService _goalsService;
        private readonly IMarketingDemographicService _demographicService;
        private readonly IKeyIdeaService _keyIdeasService;
        private readonly IMarketingKeyIdeasBudgetService _budgetService;
        private readonly IMarketingOverviewDService _overviewService;
        private readonly IMarketingCalendarService _marketingCalendarService;
        private readonly IMarketingAssetService _assetService;
        private readonly ICalendarService _calendarService;
        private readonly IMarketingService _marketingService;
        private readonly ILogger<MarketingPlanController> _logger;
        private readonly IMarketingPlanAutorizeService _marketingPlanAutorizeService;
        private readonly IUserProfileService _userProfileService;
        private readonly IProjectService _projectService;

        public MarketingPlanController(
            IMarketingPlanService marketingPlanService,
            ITemplateTaskDocumentDetailService templateService,
            IHostingEnvironment env,
            IMarketingPlanHeaderService headerService,
            IMarketingGoalService goalsService,
            IMarketingDemographicService demographicService,
            IKeyIdeaService keyIdeasService,
            IMarketingKeyIdeasBudgetService budgetService,
            IMarketingOverviewDService overviewService,
            IMarketingCalendarService marketingCalendarService,
            IMarketingAssetService assetService,
            ICalendarService calendarService,
            ILogger<MarketingPlanController> logger,
            IMarketingPlanAutorizeService marketingPlanAutorizeService,
            IUserProfileService userProfileService,
            IMarketingService marketingService,
            IProjectService projectService)
        {
            _marketingPlanService = marketingPlanService;
            _templateService = templateService;
            _env = env;
            _headerService = headerService;
            _goalsService = goalsService;
            _demographicService = demographicService;
            _keyIdeasService = keyIdeasService;
            _budgetService = budgetService;
            _overviewService = overviewService;
            _marketingCalendarService = marketingCalendarService;
            _assetService = assetService;
            _calendarService = calendarService;
            _marketingService = marketingService;
            _logger = logger;
            _marketingPlanAutorizeService = marketingPlanAutorizeService;
            _userProfileService = userProfileService;
            _projectService = projectService;
        }

        [Route("api/MarketingPlans")]
        [HttpPost]
        public MethodResponse<List<MarketingPlan>> Post([FromBody] List<MarketingPlan> model)
        {
            var result = new MethodResponse<List<MarketingPlan>> { Code = 100, Message = "Success", Result = null };
            try
            {
                List<TemplateTaskDocumentDetail> templates = model.Select(s => new TemplateTaskDocumentDetail
                {
                    TemplateTaskDocumentId = 8,
                    Name = s.Name,
                    Position = s.Position
                }).ToList();

                templates = _templateService.CreateTemplates(templates).ToList();

                foreach (MarketingPlan plan in model)
                {
                    plan.TaskDocumentDetailId = templates
                        .FirstOrDefault(w => w.Position == plan.Position).Id;

                    plan.EstimatedDateVerification = DateTime.Parse(plan.EstimatedDateVerificationString);
                    plan.Status = true;
                    plan.Complete = false;
                }

                _marketingPlanService.Create(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
                _logger.LogError(ex, "MarketingPlans POST");
            }
            return result;
        }

        [Route("api/MarketingPlan")]
        [HttpPost]
        public MethodResponse<MarketingPlan> Post([FromBody] MarketingPlan model)
        {
            var result = new MethodResponse<MarketingPlan> { Code = 100, Message = "Success", Result = null };
            try
            {
                TemplateTaskDocumentDetail template = new TemplateTaskDocumentDetail
                {
                    TemplateTaskDocumentId = 8,
                    Name = model.Name,
                    Position = model.Position
                };

                template = _templateService.CreateTemplate(template);

                model.TaskDocumentDetailId = template.Id;
                model.EstimatedDateVerification = DateTime.Parse(model.EstimatedDateVerificationString);
                model.Status = true;
                model.Complete = false;

                result.Result = _marketingPlanService.Create(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
                _logger.LogError(ex, "MarketingPlan Delete");
            }
            return result;
        }

        [Route("api/MarketingPlan")]
        [HttpPut]
        public MethodResponse<MarketingPlan> Put([FromBody] MarketingPlan model)
        {
            var result = new MethodResponse<MarketingPlan> { Code = 100, Message = "Success", Result = null };
            try
            {
                TemplateTaskDocumentDetail taskDocumentDetail =
                    _templateService.GetTemplate(model.TaskDocumentDetailId);

                taskDocumentDetail.Name = model.Name;
                _templateService.UpdateTemplate(taskDocumentDetail);

                MarketingPlan plan = _marketingPlanService.Get(model.Id);
                plan.Notes = model.Notes;
                plan.EstimatedDateVerification = DateTime.Parse(model.EstimatedDateVerificationString);
                plan.Required = model.Required;
                _marketingPlanService.Update(plan);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
                _logger.LogError(ex, "MarketingPlan");
            }
            return result;
        }

        [Route("api/MarketingPlans")]
        [HttpGet]
        public MethodResponse<List<MarketingPlan>> Get(int marketingId)
        {
            var result = new MethodResponse<List<MarketingPlan>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _marketingPlanService.GetAll(marketingId)
                    .ToList();
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
                _logger.LogError(ex, "MarketingPlans");
            }
            return result;
        }

        [Route("api/MarketingPlanPosition")]
        [HttpPost]
        public MethodResponse<int> PostPosition([FromBody] List<MarketingPlan> model)
        {
            var result = new MethodResponse<int> { Code = 100, Message = "Success", Result = 0 };
            try
            {
                foreach (MarketingPlan plan in model)
                {
                    TemplateTaskDocumentDetail currentTemplate = _templateService.GetTemplate(plan.TaskDocumentDetailId);
                    currentTemplate.Position = plan.Position;
                    _templateService.UpdateTemplate(currentTemplate);
                }

                foreach (MarketingPlan plan in model)
                {
                    MarketingPlan currentPlan = _marketingPlanService.Get(plan.Id);
                    currentPlan.Position = plan.Position;
                    _marketingPlanService.Update(currentPlan);
                }
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = 0;
                _logger.LogError(ex, "MarketingPlan position");
            }
            return result;
        }

        [Route("api/MarketingPlan")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                MarketingPlan plan = _marketingPlanService.Get(id);
                plan.Status = false;
                _marketingPlanService.Update(plan);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "MarketingPlan Delete");
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/MarketingPlanDownload")]
        [AcceptVerbs("GET")]
        public ActionResult Download(int marketingId)
        {
            try
            {
                Stream word = CreateMarketingPlanWord(marketingId);

                word.Position = 0;
                string wordName = $"x .docx";

                return File(word, "application/vnd.openxmlformats-officedocument.wordprocessingml.document", wordName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "MarketingPlanDownload");
                return Content(ex.Message, "application/json");
            }
        }

        [Route("api/MarketingPlanComplete")]
        [HttpPost]
        public MethodResponse<bool> PostCheck(CheckTaskModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                MarketingPlan marketingPlan = _marketingPlanService.Get(model.Id);

                marketingPlan.Complete = true;
                marketingPlan.Notes = model.Notes;

                IEnumerable<MarketingPlanAutorize> authorizes = _marketingPlanAutorizeService.GetByPlan(model.Id);
                UserProfile user = _userProfileService.GetUserByUserId(userId);

                _marketingPlanService.Update(marketingPlan);

                if (authorizes != null)
                {
                    foreach(var authorize in authorizes)
                    {
                        authorize.VerificationDate = DateTime.Now;
                        authorize.Notes = model.Notes;
                        authorize.UserVerificationId = user.Id;
                        _marketingPlanAutorizeService.Update(authorize);
                    }                    
                }
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
                _logger.LogError(ex, "ProjectTaskComplete");
            }
            return result;
        }

        [Route("api/MarketingPlanUndoComplete")]
        [HttpPost]
        public MethodResponse<bool> UndoPostCheck(CheckTaskModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                MarketingPlan marketingPlan = _marketingPlanService.Get(model.Id);

                marketingPlan.Complete = false;
                marketingPlan.Notes += model.Notes;

                _marketingPlanService.Update(marketingPlan);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
                _logger.LogError(ex, "ProjectTaskUndoComplete");
            }
            return result;
        }

        [Route("api/MarketingPlanCommentary")]
        [HttpPost]
        public MethodResponse<bool> CommentaryCheck(CheckTaskModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                MarketingPlan marketingPlan = _marketingPlanService.Get(model.Id);
                marketingPlan.Notes = model.Notes;

                _marketingPlanService.Update(marketingPlan);

                UserProfile user = _userProfileService.GetUserByUserId(userId);
                IEnumerable<MarketingPlanAutorize> authorize = _marketingPlanAutorizeService.GetByPlan(marketingPlan.Id);
                if (authorize != null)
                {
                    foreach (MarketingPlanAutorize auth in authorize)
                    {
                        auth.VerificationDate = DateTime.Now;
                        auth.Notes = model.Notes;
                        _marketingPlanAutorizeService.Update(auth);
                    }
                }
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
                _logger.LogError(ex, "ProjectTaskCommentary");
            }
            return result;
        }

        private Stream CreateMarketingPlanWord(int marketingId)
        {
            string path = System.IO.Path.Combine(_env.ContentRootPath, "Template", "TemplateMarketingPlan.docx");
            byte[] byteArray = System.IO.File.ReadAllBytes(path);
            MemoryStream ms = new MemoryStream();
            ms.Write(byteArray, 0, byteArray.Length);
            using (WordprocessingDocument doc = WordprocessingDocument.Open(ms, true))
            {
                MarketingPlanHeader header = _headerService.Get(marketingId);
                IEnumerable<MarketingGoals> goals = _goalsService.GetByMarketing(marketingId);
                IEnumerable<MarketingDemographic> demographics = _demographicService.GetAll(marketingId);
                IEnumerable<KeyIdeas> keyIdeas = _keyIdeasService.GetByMarketing(marketingId);

                IEnumerable<MarketingKeyIdeasBudget> budgets = _budgetService.GetByMarketing(marketingId);
                IEnumerable<MarketingOverViewDetail> overviews = _overviewService.GetByMarketing(marketingId);
                IEnumerable<MarketingPlan> plans = _marketingPlanService.GetAll(marketingId);
                IEnumerable<MarketingCalendar> calendars = _marketingCalendarService.GetAll(marketingId);
                IEnumerable<MarketingAsset> assets = _assetService.GetAll(marketingId);
                Marketing marketing = _marketingService.Get(marketingId);
                Project project = _projectService.GetProject((int)marketing.ProjectId);
                IEnumerable<Project> events = _projectService.GetProjectEventsByArtist(
                    header.ArtistId,
                    (DateTime)marketing.StartDate,
                    (DateTime)marketing.EndDate
                );

                IDictionary<String, BookmarkStart> bookmarkMap =
                new Dictionary<String, BookmarkStart>();

                foreach (BookmarkStart bookmarkStart in doc.MainDocumentPart.RootElement.Descendants<BookmarkStart>())
                {
                    bookmarkMap[bookmarkStart.Name] = bookmarkStart;
                }

                foreach (BookmarkStart bookmarkStart in bookmarkMap.Values)
                {
                    Run bookmarkText = bookmarkStart.NextSibling<Run>();
                    if (bookmarkText != null)
                    {
                        if (bookmarkStart.Name == "artist")
                            bookmarkText.GetFirstChild<Text>().Text = header.Artist;

                        if (bookmarkStart.Name == "project")
                            bookmarkText.GetFirstChild<Text>().Text = header.Name;
                        /*
                        if (bookmarkStart.Name == "picture")
                            bookmarkText.GetFirstChild<Text>().Text = header.PictureUrl;
                        */
                        if (bookmarkStart.Name == "generalInformation")
                            bookmarkText.GetFirstChild<Text>().Text = header.GeneralInformation;

                        if (bookmarkStart.Name == "descriptionHeaderPlan")
                            bookmarkText.GetFirstChild<Text>().Text = header.DescriptionHeaderPlan;

                        if (bookmarkStart.Name == "generalGoals")
                        {
                            DeleteMarker(bookmarkStart);
                            foreach (MarketingGoals goal in goals)
                                bookmarkStart.Parent.InsertAfterSelf(
                                    GenerateParagraph($"{goal.SocialNetworkName}: {goal.GoalName} ({goal.CurrentQuantity} / {goal.GoalQuantity})"));
                        }

                        if (bookmarkStart.Name == "targetDemographic")
                        {
                            DeleteMarker(bookmarkStart);
                            foreach (MarketingDemographic demographic in demographics)
                                bookmarkStart.Parent.InsertAfterSelf(
                                    GenerateParagraph($"{demographic.Name} {demographic.Percentage}%"));
                        }

                        if (bookmarkStart.Name == "keyIdeas")
                            bookmarkText.GetFirstChild<Text>().Text = header.DescriptionKeyIdeas;


                        if (bookmarkStart.Name == "mediaPlanning")
                        {
                            DeleteMarker(bookmarkStart);
                            foreach (KeyIdeas keyIdea in keyIdeas.Where(w => w.CategoryId == 24))
                                bookmarkStart.Parent.InsertAfterSelf(
                                    GenerateParagraph(keyIdea.SocialNetwork));
                        }

                        if (bookmarkStart.Name == "digitalPlatforms")
                        {
                            DeleteMarker(bookmarkStart);

                            string platforms = string.Join(", ", keyIdeas.Where(w => w.CategoryId == 25)
                                  .Select(s => s.SocialNetwork));

                            if (!string.IsNullOrEmpty(platforms))
                                bookmarkStart.Parent.InsertAfterSelf(
                                    GenerateParagraph(platforms));

                            foreach (MarketingKeyIdeasBudget budget in budgets.Where(w => w.CategoryId == 25))
                                bookmarkStart.Parent.InsertAfterSelf(
                                    GenerateParagraph($"Target {budget.Target} Budget {budget.PercentageBudget}%"));
                        }

                        if (bookmarkStart.Name == "socialMedia")
                        {
                            DeleteMarker(bookmarkStart);

                            string platforms = string.Join(", ", keyIdeas.Where(w => w.CategoryId == 26)
                                  .Select(s => s.SocialNetwork));

                            if (!string.IsNullOrEmpty(platforms))
                                bookmarkStart.Parent.InsertAfterSelf(
                                        GenerateParagraph(platforms));

                            foreach (MarketingKeyIdeasBudget budget in budgets.Where(w => w.CategoryId == 26))
                                bookmarkStart.Parent.InsertAfterSelf(
                                    GenerateParagraph($"Target {budget.Target} Budget {budget.PercentageBudget}%"));
                        }

                        if (bookmarkStart.Name == "touring")
                        {
                            DeleteMarker(bookmarkStart);
                            foreach (KeyIdeas keyIdea in keyIdeas.Where(w => w.CategoryId == 27))
                                bookmarkStart.Parent.InsertAfterSelf(
                                    GenerateParagraph(keyIdea.Name));
                        }

                        if (bookmarkStart.Name == "streaming")
                        {
                            DeleteMarker(bookmarkStart);
                            IEnumerable<MarketingOverViewDetail> overviewStreaming = overviews.Where(w => w.SectionId == 1);
                            IEnumerable<string> socialmedias = overviewStreaming.Select(s => s.SocialNetwork)
                                    .Distinct();

                            foreach (string socialmedia in socialmedias)
                            {
                                bookmarkStart.Parent.InsertAfterSelf(new Paragraph(new Run(new Text(socialmedia))));
                                foreach (MarketingOverViewDetail overview in overviewStreaming)
                                {
                                    bookmarkStart.Parent.InsertAfterSelf(
                                        GenerateParagraph(overview.Name));
                                }
                            }
                        }

                        if (bookmarkStart.Name == "media")
                        {
                            DeleteMarker(bookmarkStart);
                            foreach (MarketingOverViewDetail overview in overviews.Where(w => w.SectionId == 2))
                                bookmarkStart.Parent.InsertAfterSelf(
                                    GenerateParagraph(overview.Name));
                        }

                        if (bookmarkStart.Name == "overviewMarketing")
                        {
                            DeleteMarker(bookmarkStart);
                            foreach (MarketingOverViewDetail overview in overviews.Where(w => w.SectionId == 3))
                                bookmarkStart.Parent.InsertAfterSelf(
                                    GenerateParagraph(overview.SocialNetwork));
                        }

                        if (bookmarkStart.Name == "material")
                        {
                            DeleteMarker(bookmarkStart);
                            foreach (MarketingOverViewDetail overview in overviews.Where(w => w.SectionId == 4))
                                bookmarkStart.Parent.InsertAfterSelf(
                                    GenerateParagraph(overview.Name));
                        }

                        if (bookmarkStart.Name == "releasePlan")
                        {
                            DeleteMarker(bookmarkStart);
                            foreach (MarketingPlan plan in plans)
                                bookmarkStart.Parent.InsertAfterSelf(
                                    GenerateParagraph($"{((DateTime)plan.EstimatedDateVerification).ToString("MMM/dd/yyyy")}: {plan.Name}"));
                        }

                        if (bookmarkStart.Name == "templateCalendar")
                        {
                            DeleteMarker(bookmarkStart);
                            /*
                            foreach (MarketingCalendar calendar in calendars)
                                bookmarkStart.Parent.InsertAfterSelf(
                                    GenerateParagraph($"{calendar.FromDate.ToString("MMMM dd")} - {((DateTime)calendar.ToDate).ToString("MMMM dd")} {calendar.Description}"));
                            */
                            foreach (Project ev in events)
                                bookmarkStart.Parent.InsertAfterSelf(
                                    GenerateParagraph($"{ev.InitialDate.ToString("MMMM dd")} - {ev.Name} ({ev.Venue})"));
                        }

                        if (bookmarkStart.Name == "templateAssets")
                        {
                            DeleteMarker(bookmarkStart);
                            foreach (MarketingAsset asset in assets)
                            {
                                bookmarkStart.Parent.InsertAfterSelf(new Paragraph(new Run(new Text(asset.Url))));
                                bookmarkStart.Parent.InsertAfterSelf(new Paragraph(new Run(new Text(asset.Description))));
                                bookmarkStart.Parent.InsertAfterSelf(new Paragraph(new Run(new Text(""))));
                            }
                        }

                        if (bookmarkStart.Name == "picture")
                        {
                            string pathDefault = System.IO.Path.Combine(_env.ContentRootPath, "wwwroot/clientapp/dist/assets/images/default/projects.png");
                            string pictureUrl = string.IsNullOrEmpty(header.PictureUrl)
                                ? pathDefault
                                : _env.WebRootPath + "/clientapp/dist/" + header.PictureUrl;
                            ImagePart imagePart = doc.MainDocumentPart.AddImagePart(ImagePartType.Jpeg);
                            using (FileStream stream = new FileStream(pictureUrl, FileMode.Open))
                                imagePart.FeedData(stream);

                            AddImageToBody(bookmarkStart, doc.MainDocumentPart.GetIdOfPart(imagePart));
                            bookmarkText.GetFirstChild<Text>().Text = "";
                        }
                    }
                }

                doc.Close();
                return ms;
            }
        }

        private Paragraph GenerateParagraph(string text)
        {
            RunProperties runProp = new RunProperties();
            RunFonts runFont = new RunFonts { Ascii = "Calibri" };
            Run run = new Run();
            runProp.Append(runFont);
            run.Append(runProp);
            run.Append(new Text(text));

            Paragraph element =
            new Paragraph(
            new ParagraphProperties(
            new Indentation() { Left = "1120", Hanging = "360" },
            new ParagraphStyleId() { Val = "ListParagraph" },
            new NumberingProperties(
            new NumberingLevelReference() { Val = 0 },
            new NumberingId() { Val = 2 })),
            run
            )
            { RsidParagraphAddition = "00031711", RsidParagraphProperties = "00031711", RsidRunAdditionDefault = "00031711" };
            return element;
        }

        private Paragraph GenerateParagraphNumber(string text)
        {
            var runProp = new RunProperties();
            var runFont = new RunFonts { Ascii = "Calibri" };
            var size = new FontSize { Val = new StringValue("11") };
            var run = new Run(text);

            runProp.Append(runFont);
            runProp.Append(size);
            run.PrependChild<RunProperties>(runProp);

            Paragraph element =
            new Paragraph(
            new ParagraphProperties(
            new Indentation() { Left = "1120", Hanging = "360" },
            new ParagraphStyleId() { Val = "ListParagraph" },
            new NumberingProperties(
            new NumberingLevelReference() { Val = 0 },
            new NumberingId() { Val = 1 })),
            new Run(run)
            )
            { RsidParagraphAddition = "005F3962", RsidParagraphProperties = "005F3962", RsidRunAdditionDefault = "005F3962" };
            return element;
        }

        private void DeleteMarker(BookmarkStart bookmarkStart)
        {
            OpenXmlElement elem = bookmarkStart.NextSibling();

            while (elem != null && !(elem is BookmarkEnd))
            {
                OpenXmlElement nextElem = elem.NextSibling();
                elem.Remove();
                elem = nextElem;
            }
        }

        private void AddImageToBody(BookmarkStart bookmarkStart, string relationshipId)
        {
            var element =
                 new Drawing(
                     new DW.Inline(
                         new DW.Extent() { Cx = 2500000L, Cy = 2500000L },
                         new DW.EffectExtent()
                         {
                             LeftEdge = 0L,
                             TopEdge = 0L,
                             RightEdge = 0L,
                             BottomEdge = 0L
                         },
                         new DW.DocProperties()
                         {
                             Id = (UInt32Value)1U,
                             Name = "Picture 1"
                         },
                         new DW.NonVisualGraphicFrameDrawingProperties(
                             new A.GraphicFrameLocks() { NoChangeAspect = true }),
                         new A.Graphic(
                             new A.GraphicData(
                                 new PIC.Picture(
                                     new PIC.NonVisualPictureProperties(
                                         new PIC.NonVisualDrawingProperties()
                                         {
                                             Id = (UInt32Value)0U,
                                             Name = "image.jpg"
                                         },
                                         new PIC.NonVisualPictureDrawingProperties()),
                                     new PIC.BlipFill(
                                         new A.Blip(
                                             new A.BlipExtensionList(
                                                 new A.BlipExtension()
                                                 {
                                                     Uri =
                                                        "{28A0092B-C50C-407E-A947-70E740481C1C}"
                                                 })
                                         )
                                         {
                                             Embed = relationshipId,
                                             CompressionState =
                                             A.BlipCompressionValues.Print
                                         },
                                         new A.Stretch(
                                             new A.FillRectangle())),
                                     new PIC.ShapeProperties(
                                         new A.Transform2D(
                                             new A.Offset() { X = 0L, Y = 0L },
                                             new A.Extents() { Cx = 2500000L, Cy = 2500000L }),
                                         new A.PresetGeometry(
                                             new A.AdjustValueList()
                                         )
                                         { Preset = A.ShapeTypeValues.Rectangle }))
                             )
                             { Uri = "http://schemas.openxmlformats.org/drawingml/2006/picture" })
                     )
                     {
                         DistanceFromTop = (UInt32Value)0U,
                         DistanceFromBottom = (UInt32Value)0U,
                         DistanceFromLeft = (UInt32Value)0U,
                         DistanceFromRight = (UInt32Value)0U,
                         EditId = "50D07946"
                     });

            bookmarkStart.Parent.InsertAfter<Drawing>(element, bookmarkStart);
        }

        private void SaveEvents(List<MarketingPlan> marketingPlans)
        {
            Marketing marketing = _marketingService.Get(marketingPlans.First().MarketingId);
            List<GerenciaMusic360.Entities.Calendar> events = new List<GerenciaMusic360.Entities.Calendar>();
            string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

            foreach (MarketingPlan marketingPlan in marketingPlans)
            {
                events.AddRange(
                                marketingPlan.Users
                               .Select(s => new GerenciaMusic360.Entities.Calendar
                               {
                                   AllDay = 1,
                                   Checked = 0,
                                   StatusRecordId = 1,
                                   Created = DateTime.Now,
                                   Creator = userId,
                                   PersonId = s,
                                   StartDate = (DateTime)marketingPlan.EstimatedDateVerification,
                                   EndDate = (DateTime)marketingPlan.EstimatedDateVerification,
                                   Title = $"Campaña ({marketing.Name}), tarea ({marketingPlan.Name})",
                                   ProjectTaskId = null,
                                   ProjectTaskIsMember = false,
                                   ModuleId = 3
                               }).ToList());

            }
            _calendarService.CreateCalendarEvents(events);
        }

    }
}