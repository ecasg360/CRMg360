using GerenciaMusic360.Entities;
using GerenciaMusic360.Entities.Models;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using OfficeOpenXml;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class WorkController : ControllerBase
    {
        private readonly IWorkService _workService;
        private readonly IHelperService _helperService;
        private readonly IHostingEnvironment _env;
        private readonly IWorkCollaboratorService _workCollaboratorService;
        private readonly IWorkPublisherService _workPublisherService;
        private readonly IControlledListService _controlledListService;

        public WorkController(
            IWorkService workService,
            IHelperService helperService,
            IWorkCollaboratorService workCollaboratorService,
            IWorkPublisherService workPublisherService,
            IControlledListService controlledListService,
            IHostingEnvironment env
        )
        {
            _workService = workService;
            _helperService = helperService;
            _env = env;
            _workCollaboratorService = workCollaboratorService;
            _workPublisherService = workPublisherService;
            _controlledListService = controlledListService;
        }

        [Route("api/Works")]
        [HttpGet]
        public MethodResponse<List<Work>> Get()
        {
            var result = new MethodResponse<List<Work>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _workService.GetAllWorksRelation().ToList();
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/WorksByPerson")]
        [HttpGet]
        public MethodResponse<List<Work>> GetByPerson(int personId)
        {
            var result = new MethodResponse<List<Work>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _workService.GetAllWorksbyPerson(personId)
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

        [Route("api/Work")]
        [HttpGet]
        public MethodResponse<Work> Get(int id)
        {
            var result = new MethodResponse<Work> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _workService.GetWork(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/Work")]
        [HttpPost]
        public MethodResponse<Work> Post([FromBody] Work model)
        {
            var result = new MethodResponse<Work> { Code = 100, Message = "Success", Result = null };
            try
            {
                string pictureURL = string.Empty;
                if (model.PictureUrl?.Length > 0)
                    pictureURL = _helperService.SaveImage(
                        model.PictureUrl.Split(",")[1],
                        "work", $"{Guid.NewGuid()}.jpg",
                        _env);

                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                if (!string.IsNullOrEmpty(model.RegisterDateString))
                    model.RegisterDate = DateTime.Parse(model.RegisterDateString);

                if (!string.IsNullOrEmpty(model.CreatedDateString))
                    model.CreatedDate = DateTime.Parse(model.CreatedDateString);
                else
                    model.CreatedDate = DateTime.Now;

                model.PictureUrl = pictureURL;
                model.Created = DateTime.Now;
                model.Creator = userId;
                model.StatusRecordId = 1;

                result.Result = _workService.CreateWork(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/Work")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] Work model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Work work = _workService.GetWork(model.Id);

                if (!string.IsNullOrWhiteSpace(model.PictureUrl) && !model.PictureUrl.Contains("asset"))
                {
                    if (System.IO.File.Exists(Path.Combine(_env.WebRootPath, "clientapp", "dist", work.PictureUrl)))
                        System.IO.File.Delete(Path.Combine(_env.WebRootPath, "clientapp", "dist", work.PictureUrl));

                    if (model.PictureUrl?.Length > 0)
                        work.PictureUrl = _helperService.SaveImage(
                            model.PictureUrl.Split(",")[1],
                            "work", $"{Guid.NewGuid()}.jpg",
                            _env);
                }

                if (!string.IsNullOrEmpty(model.RegisterDateString))
                    work.RegisterDate = DateTime.Parse(model.RegisterDateString);

                work.Name = model.Name;
                work.Description = model.Description;
                work.AlbumId = model.AlbumId;
                work.MusicalGenreId = model.MusicalGenreId;
                work.Rating = model.Rating;
                work.RegisteredWork = model.RegisteredWork;
                work.RegisterNum = model.RegisterNum;
                work.CertifiedWork = model.CertifiedWork;
                work.LicenseNum = model.LicenseNum;
                work.CertificationAuthorityId = model.CertificationAuthorityId;
                work.Modified = DateTime.Now;
                work.Modifier = userId;
                work.isExternal = model.isExternal;
                work.ComposerId = model.ComposerId;
                work.SongId = model.SongId;
                work.Aka = model.Aka;
                work.AdminPercentage = model.AdminPercentage;
                work.MusicCopyrightDate = model.MusicCopyrightDate;
                work.CopyrightNum = model.CopyrightNum;
                work.Coedition = model.Coedition;
                work.AgreementDate = model.AgreementDate;
                work.TerritoryControlled = model.TerritoryControlled;
                work.LdvRelease = model.LdvRelease;
                
                if (model.WorkCollaborator.Count > 0)
                {
                    var collaborators = _workCollaboratorService.GetWorkCollaboratorsByWork(model.Id);
                    _workCollaboratorService.DeleteWorkCollaborators(collaborators);
                    work.WorkCollaborator = model.WorkCollaborator;
                }

                if (model.WorkPublisher.Count > 0)
                {
                    var publishers = _workPublisherService.GetWorkPublisherByWork(model.Id);
                    _workPublisherService.DeleteWorkPublishers(publishers);
                    work.WorkPublisher = model.WorkPublisher;

                }
                 _workService.UpdateWork(work);
                _workCollaboratorService.CreateWorkCollaborators(model.WorkCollaborator.ToList());
                _workPublisherService.CreateWorkPublishers(model.WorkPublisher.ToList());
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/WorkUpdateAlbumRelease")]
        [HttpPut]
        public MethodResponse<bool> PutWork([FromBody] Work model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Work work = _workService.GetWork(model.Id);

                if (!string.IsNullOrEmpty(model.RegisterDateString))
                    work.RegisterDate = DateTime.Parse(model.RegisterDateString);

                work.Name = model.Name;
                work.isExternal = model.isExternal;
                work.Modified = DateTime.Now;
                work.Modifier = userId;
                if (model.WorkCollaborator.Count > 0)
                {
                    var collaborators = _workCollaboratorService.GetWorkCollaboratorsByWork(model.Id);
                    _workCollaboratorService.DeleteWorkCollaborators(collaborators);
                }

                if (work.WorkPublisher.Count > 0)
                {
                    var publishers = _workPublisherService.GetWorkPublisherByWork(model.Id);
                    _workPublisherService.DeleteWorkPublishers(publishers);
                }
                _workService.UpdateWork(work);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/WorkStatus")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody]StatusUpdateModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Work work = _workService.GetWork(Convert.ToInt32(model.Id));
                work.StatusRecordId = model.Status;
                work.Modified = DateTime.Now;
                work.Modifier = userId;

                _workService.UpdateWork(work);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/Work")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                var work = _workService.GetWork(id);
                work.StatusRecordId = 3;
                work.Erased = DateTime.Now;
                work.Eraser = userId;

                _workService.UpdateWork(work);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/ControlledListDownload")]
        [HttpGet]
        public ActionResult Download()
        {
            try
            {
                IEnumerable<ControlledList> controlledList = _controlledListService.GetControlledList();
                Stream excel = CreateExcel(controlledList.ToList());

                excel.Position = 0;
                string excelName = $"Reporte_ControlledList_.xlsx";

                return File(excel, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", excelName);
            }
            catch (Exception ex)
            {
                return Content(ex.Message, "application/json");
            }
        }

        private Stream CreateExcel(List<ControlledList> controlledList)
        {
            string path = Path.Combine(_env.ContentRootPath, "Template", "TemplateControlledList.xlsx");
            MemoryStream ms = new MemoryStream();

            FileStream source = System.IO.File.OpenRead(path);
            using (ExcelPackage package = new ExcelPackage(source))
            {
                var date = DateTime.Now.Date;
                ExcelWorksheet sheet = package.Workbook.Worksheets["GER 360 PUB"];

                int indexRow = 2;

                foreach (ControlledList work in controlledList)
                {
                    sheet.Cells["A" + indexRow.ToString()].Value = work.IsExternal == 1 ? "G360P" : "LDV";
                    sheet.Cells["B" + indexRow.ToString()].Value = work.WorkName;
                    sheet.Cells["C" + indexRow.ToString()].Value = work.WorkAka;
                    sheet.Cells["D" + indexRow.ToString()].Value = work.Artist.Length > 0 ? work.Artist.Substring(1) : work.Artist;
                    sheet.Cells["E" + indexRow.ToString()].Value = work.Album.Length > 0 ? work.Album.Substring(1) : work.Album;
                    sheet.Cells["F" + indexRow.ToString()].Value = !(work.Upc is null) ? work.Upc.Length > 0 ? work.Upc.Substring(1) : "" : "";
                    sheet.Cells["G" + indexRow.ToString()].Value = work.Publisher;
                    sheet.Cells["H" + indexRow.ToString()].Value = work.AdminPercentage;
                    sheet.Cells["I" + indexRow.ToString()].Value = work.CoEdition;
                    sheet.Cells["J" + indexRow.ToString()].Value = work.TerritoryControlled;
                    sheet.Cells["K" + indexRow.ToString()].Value = !(work.Isrc is null) ? work.Isrc.Length > 0 ? work.Isrc.Substring(1) : "" : "";
                    sheet.Cells["L" + indexRow.ToString()].Value = work.Time;
                    sheet.Cells["M" + indexRow.ToString()].Value = work.ReleaseDate;
                    sheet.Cells["N" + indexRow.ToString()].Value = work.ComposersName.Length > 0 ? work.ComposersName.Substring(1) : work.ComposersName;
                    sheet.Cells["O" + indexRow.ToString()].Value = work.ComposersAka;
                    sheet.Cells["P" + indexRow.ToString()].Value = work.ComposerPro;
                    sheet.Cells["Q" + indexRow.ToString()].Value = work.ComposerIpi;
                    sheet.Cells["R" + indexRow.ToString()].Value = work.RegisteredWithPro;
                    sheet.Cells["S" + indexRow.ToString()].Value = work.AgreementDate;
                    sheet.Cells["T" + indexRow.ToString()].Value = work.ComposerContactDetails;
                    sheet.Cells["U" + indexRow.ToString()].Value = work.CopyrightRegistration;
                    sheet.Cells["V" + indexRow.ToString()].Value = work.WorkDescription;

                    indexRow = indexRow + 1;
                }

                sheet.Protection.IsProtected = false;
                sheet.Protection.AllowSelectLockedCells = false;

                package.SaveAs(ms);
            }
            return ms;
        }
    }
}
