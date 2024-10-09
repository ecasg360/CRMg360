using GerenciaMusic360.Entities;
using GerenciaMusic360.Entities.Models;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;
using System;
using System.IO;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class LabelCopyController : ControllerBase
    {
        private readonly IConfigurationLabelCopyService _configuration;
        private readonly IProjectLabelCopyService _labelCopy;
        private readonly IHostingEnvironment _env;
        private readonly ILabelCopyHeaderService _labelCopyHeader;
        private readonly ILabelCopyDetailService _labelCopyDetail;

        public LabelCopyController(
            IConfigurationLabelCopyService configuration,
            IProjectLabelCopyService labelCopy,
            IHostingEnvironment env,
            ILabelCopyHeaderService labelCopyHeader,
            ILabelCopyDetailService labelCopyDetail)
        {
            _configuration = configuration;
            _labelCopy = labelCopy;
            _env = env;
            _labelCopyHeader = labelCopyHeader;
            _labelCopyDetail = labelCopyDetail;
        }

        [Route("api/LabelCopyConfiguration")]
        [HttpGet]
        public MethodResponse<ConfigurationLabelCopy> Get()
        {
            var result = new MethodResponse<ConfigurationLabelCopy> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _configuration.GetAll().FirstOrDefault();
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/LabelCopy")]
        [HttpGet]
        public MethodResponse<ProjectLabelCopy> Get(int id)
        {
            var result = new MethodResponse<ProjectLabelCopy> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _labelCopy.Get(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/LabelCopyByProject")]
        [HttpGet]
        public MethodResponse<ProjectLabelCopy> GetByProject(int projectId)
        {
            var result = new MethodResponse<ProjectLabelCopy> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _labelCopy.GetByProject(projectId);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/LabelCopy")]
        [HttpPost]
        public MethodResponse<ProjectLabelCopy> Post([FromBody] ProjectLabelCopy model)
        {
            var result = new MethodResponse<ProjectLabelCopy> { Code = 100, Message = "Success", Result = null };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                model.DateLastUpdate = DateTime.Now;
                model.Created = DateTime.Now;
                model.Creator = userId;

                result.Result = _labelCopy.Create(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }


        [Route("api/LabelCopy")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] ProjectLabelCopy model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                ProjectLabelCopy labelCopy = _labelCopy.Get(model.Id);

                labelCopy.PersonProducerExecutiveId = model.PersonProducerExecutiveId;
                labelCopy.PersonRecordingEngineerId = model.PersonRecordingEngineerId;
                labelCopy.StudioId = model.StudioId;
                labelCopy.DistributorId = model.DistributorId;
                labelCopy.DistributorId = model.DistributorId;
                labelCopy.PersonMixMasterId = model.PersonMixMasterId;
                labelCopy.Location = model.Location;
                labelCopy.RecordLabel = model.RecordLabel;

                labelCopy.DateLastUpdate = DateTime.Now;
                labelCopy.Modified = DateTime.Now;
                labelCopy.Modifier = userId;
                labelCopy.Producers = model.Producers;
                _labelCopy.Update(labelCopy);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/LabelCopy")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                ProjectLabelCopy labelCopy = _labelCopy.Get(id);

                _labelCopy.Delete(labelCopy);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/LabelCopyDownload")]
        [AcceptVerbs("GET")]
        public ActionResult Download(int projectId)
        {
            try
            {
                LabelCopyModel labelCopy = new LabelCopyModel()
                {
                    LabelCopyDetail = _labelCopyDetail.Get(projectId),
                    LabelCopyHeader = _labelCopyHeader.Get(projectId)
                };

                Stream excel = CreateExcel(labelCopy);

                excel.Position = 0;
                string excelName = $"Reporte_LabelCopy_.xlsx";

                return File(excel, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", excelName);
            }
            catch (Exception ex)
            {
                return Content(ex.Message, "application/json");
            }
        }

        private Stream CreateExcel(LabelCopyModel labelCopy)
        {
            string path = Path.Combine(_env.ContentRootPath, "Template", "TemplateLabelCopy.xlsx");
            MemoryStream ms = new MemoryStream();

            FileStream source = System.IO.File.OpenRead(path);
            using (ExcelPackage package = new ExcelPackage(source))
            {
                ExcelWorksheet sheet = package.Workbook.Worksheets[1];

                if (labelCopy.LabelCopyDetail.Count() > 0)
                {
                    int counter = 2;
                    foreach (LabelCopyDetail detail in labelCopy.LabelCopyDetail)
                    {
                        sheet.Cells[$"A{counter}"].Value = labelCopy.LabelCopyHeader.EndDate;
                        sheet.Cells[$"B{counter}"].Value = labelCopy.LabelCopyHeader.Artist;
                        sheet.Cells[$"C{counter}"].Value = labelCopy.LabelCopyHeader.Title;
                        sheet.Cells[$"D{counter}"].Value = labelCopy.LabelCopyHeader.ProjectType;
                        sheet.Cells[$"E{counter}"].Value = detail.NumberTrack;
                        sheet.Cells[$"F{counter}"].Value = detail.Artist;
                        sheet.Cells[$"G{counter}"].Value = detail.Title;
                        sheet.Cells[$"H{counter}"].Value = detail.Composer + "/" + detail.Publisher;
                        sheet.Cells[$"I{counter}"].Value = detail.Time;
                        sheet.Cells[$"J{counter}"].Value = detail.ISRC;
                        sheet.Cells[$"K{counter}"].Value = labelCopy.LabelCopyHeader.UPCCode;
                        sheet.Cells[$"L{counter}"].Value = detail.Producer + "/" + detail.Remixer;
                        sheet.Cells[$"M{counter}"].Value = labelCopy.LabelCopyHeader.ExecutiveProducer;
                        sheet.Cells[$"N{counter}"].Value = labelCopy.LabelCopyHeader.Distributor;
                        sheet.Cells[$"O{counter}"].Value = labelCopy.LabelCopyHeader.RecordLabel == "LDV"
                            ? "LDV Media Group, INC"
                            : "Gerencia 360 Music, INC";
                        sheet.Cells[$"P{counter}"].Value = labelCopy.LabelCopyHeader.Studio;
                        sheet.Cells[$"Q{counter}"].Value = labelCopy.LabelCopyHeader.Producers != ""
                            ? labelCopy.LabelCopyHeader.Producers
                            : labelCopy.LabelCopyHeader.RecordingEnginner;
                        sheet.Cells[$"R{counter}"].Value = labelCopy.LabelCopyHeader.MixMaster;
                        sheet.Cells[$"S{counter}"].Value = labelCopy.LabelCopyHeader.Location;
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