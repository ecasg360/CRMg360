using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Humanizer;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class TemplateContractDocumentController : ControllerBase
    {
        private readonly ITemplateContractDocumentService _templateContractDocumentService;
        private readonly IContractService _contractService;
        private readonly IFieldService _fieldService;
        private readonly IContractTermsService _contractTermsService;
        private readonly IProjectService _projectService;
        private readonly IProjectWorkService _projectWorkService;
        private readonly IFieldValueService _fieldValueService;
        private readonly IAddressService _addressService;
        private readonly IPersonService _personService;

        private readonly IHelperService _helperService;
        private readonly IHostingEnvironment _env;
        private readonly IProjectLabelCopyService _labelCopyService;

        public TemplateContractDocumentController(
            ITemplateContractDocumentService templateContractDocumentService,
            IContractService contractService,
            IFieldService fieldService,
            IFieldValueService fieldValueService,
            IContractTermsService contractTermsService,
            IProjectWorkService projectWorkService,
            IProjectService projectService,
            IAddressService addressService,
            IPersonService personService,
            IHelperService helperService,
            IHostingEnvironment env,
            IProjectLabelCopyService labelCopyService)
        {
            _templateContractDocumentService = templateContractDocumentService;
            _contractService = contractService;
            _fieldService = fieldService;
            _fieldValueService = fieldValueService;
            _contractTermsService = contractTermsService;
            _projectWorkService = projectWorkService;
            _projectService = projectService;
            _addressService = addressService;
            _personService = personService;
            _helperService = helperService;
            _env = env;
            _labelCopyService = labelCopyService;
        }

        [Route("api/TemplateContractDocumentCreate")]
        [HttpGet]
        public ActionResult Create(int contractId)
        {
            var result = new MethodResponse<List<ContractStatus>> { Code = 100, Message = "Success", Result = null };
            try
            {

                IEnumerable<ProjectWork> works = null;
                Project project = null;
                Person artist = null;
                ProjectLabelCopy labelCopy = null;
                Person producer = null;
                var contract = _contractService.GetContract(contractId);
                var template = _templateContractDocumentService.GetByContractTypeId(contract.ContractTypeId);
                var terms = _contractTermsService.GetAllContractTermsByContractId(contract.Id);

                if (contract.ProjectId != null)
                {
                    works = _projectWorkService.GetProjectWorksByProject(contract.ProjectId.Value);
                    project = _projectService.GetProject(contract.ProjectId.Value);
                    labelCopy = _labelCopyService.GetByProject(contract.ProjectId.Value);
                    if (works.Any())
                        producer = _personService.GetPerson(works.FirstOrDefault(w => w.PersonProducerId != null).PersonProducerId.Value);
                }
                if(project != null && project.ArtistId != null)
                    artist = _personService.GetPerson(project.ArtistId.Value);

                var person = _personService.GetPerson(contract.LocalCompany.PersonId.Value);
                var address = _addressService.GetAddress(contract.LocalCompany.AddressId.Value);

                var additionalFields = _fieldService.GetAllFieldsByModule(2, contract.ContractTypeId, contract.Id);

                List<FieldValue> listFieldValues = new List<FieldValue>();
                foreach (var item in additionalFields)
                {
                    var fieldValue = _fieldValueService.GetFieldValue(item.Id, contract.Id);
                    if (fieldValue != null)
                    {
                        listFieldValues.Add(fieldValue);
                    }
                }

                string path = Path.Combine(_env.ContentRootPath, "Template", template.DocumentName);

                if (System.IO.File.Exists(path))
                {
                    var markers = _templateContractDocumentService.GetByDocument(template.DocumentName);

                    byte[] byteArray = System.IO.File.ReadAllBytes(path);
                    using (MemoryStream ms = new MemoryStream())
                    {
                        ms.Write(byteArray, 0, byteArray.Length);

                        using (WordprocessingDocument wordDocument = WordprocessingDocument.Open(ms, true))
                        {
                            IDictionary<string, BookmarkStart> bookmarkMap = new Dictionary<string, BookmarkStart>();

                            foreach (BookmarkStart bookmarkStart in wordDocument.MainDocumentPart.RootElement.Descendants<BookmarkStart>())
                            {
                                bookmarkMap[bookmarkStart.Name] = bookmarkStart;
                            }

                            foreach (BookmarkStart bookmarkStart in bookmarkMap.Values)
                            {
                                Run bookmarkText = bookmarkStart.NextSibling<Run>();
                                if (bookmarkText != null)
                                {
                                    if (bookmarkStart.Name == "ProjectTitle" && project !=null)
                                    {
                                        bookmarkText.GetFirstChild<Text>().Text = project.Name;
                                    }
                                    if (bookmarkStart.Name == "AliasName" && artist != null)
                                    {
                                        bookmarkText.GetFirstChild<Text>().Text = string.IsNullOrEmpty(artist.AliasName) ? $"{artist.Name} {artist.LastName}" : artist.AliasName;
                                    }

                                    if ((bookmarkStart.Name == "NombreProductor"|| bookmarkStart.Name == "NombreProductorA" || 
                                        bookmarkStart.Name == "NombreProductorB") && producer != null)
                                    {
                                        bookmarkText.GetFirstChild<Text>().Text = $"{producer.Name} {producer.LastName}";
                                    }

                                    if (bookmarkStart.Name == "InicialesProductor" && producer != null) {
                                        string initials = producer.Name.ToUpper().Substring(0, 1) + producer.LastName.ToUpper().Substring(0, 1); ;
                                        bookmarkText.GetFirstChild<Text>().Text = $"{initials}";
                                    }

                                    if ((bookmarkStart.Name == "NombreArtista" || bookmarkStart.Name == "NombreArtistaA" ||
                                        bookmarkStart.Name == "NombreArtistaB" || bookmarkStart.Name == "NombreArtistaC") && artist != null) {
                                        bookmarkText.GetFirstChild<Text>().Text = $"{artist.Name} {artist.LastName}";
                                    }

                                    if (bookmarkStart.Name == "NombreEmpresaProductorA" || bookmarkStart.Name == "NombreEmpresaProductorB")
                                    {
                                        bookmarkText.GetFirstChild<Text>().Text = contract.LocalCompany.Name;
                                    }

                                    if (!string.IsNullOrEmpty(template.MarkerStartDate) && bookmarkStart.Name == template.MarkerStartDate)
                                    {
                                        bookmarkText.GetFirstChild<Text>().Text = contract.StartDate.ToString("MM/dd/yyyy");
                                    }

                                    if (bookmarkStart.Name.Value.Contains("FormatDate"))
                                    {
                                        DateTime startDate = contract.StartDate;
                                        bookmarkText.GetFirstChild<Text>().Text = $"{startDate.DayOfWeek.ToString()}, {startDate.ToString("MMMM dd, yyyy")}";
                                    }

                                    if (bookmarkStart.Name.Value.Contains("FinalFormatDate"))
                                    {

                                        DateTime endDate = contract.EndDate.GetValueOrDefault();
                                        bookmarkText.GetFirstChild<Text>().Text = $"{endDate.DayOfWeek.ToString()}, {endDate.ToString("MMMM dd, yyyy")}";
                                    }

                                    if (bookmarkStart.Name.Value.Contains("CurrentYear")) {
                                        bookmarkText.GetFirstChild<Text>().Text = DateTime.Now.ToString("yyyy");
                                    }

                                    if (bookmarkStart.Name.Value.Contains("CurrentMonth"))
                                    {
                                        bookmarkText.GetFirstChild<Text>().Text = DateTime.Now.ToString("MMMM");
                                    }

                                    if (!string.IsNullOrEmpty(template.MarkerEndDate) && bookmarkStart.Name == template.MarkerEndDate)
                                    {
                                        bookmarkText.GetFirstChild<Text>().Text = contract.EndDate.Value.ToString("MM/dd/yyyy");
                                    }

                                    if (!string.IsNullOrEmpty(template.MarkerAmount) && bookmarkStart.Name == template.MarkerAmount)
                                    {
                                        bookmarkText.GetFirstChild<Text>().Text = contract.Amount.ToString();
                                    }

                                    if (!string.IsNullOrEmpty(template.MarkerAmountLetter) && bookmarkStart.Name == template.MarkerAmountLetter)
                                    {
                                        bookmarkText.GetFirstChild<Text>().Text = Convert.ToInt64(contract.Amount).ToWords(new CultureInfo("en-US"));
                                    }

                                    if (!string.IsNullOrEmpty(template.MarkerCurrency) && bookmarkStart.Name == template.MarkerCurrency)
                                    {
                                        bookmarkText.GetFirstChild<Text>().Text = contract.Currency.Code;
                                    }

                                    if (!string.IsNullOrEmpty(template.MarkerTime) && bookmarkStart.Name == template.MarkerTime && contract.Time != null)
                                    {
                                        bookmarkText.GetFirstChild<Text>().Text = contract.Time.InitialValue.ToString();
                                    }

                                    if (!string.IsNullOrEmpty(template.MarkerLocalCompany) && bookmarkStart.Name == template.MarkerLocalCompany)
                                    {
                                        bookmarkText.GetFirstChild<Text>().Text = contract.LocalCompany.Name;
                                    }

                                    if (!string.IsNullOrEmpty(template.MarkerInitialsG360) && bookmarkStart.Name == template.MarkerInitialsG360)
                                    {
                                        var initials = contract.LocalCompany.Name.Split(" ");
                                        if (initials.Length > 0)
                                        {
                                            bookmarkText.GetFirstChild<Text>().Text = string.Format("{0}{1}", initials[0], initials[1]);
                                        }
                                        else
                                        {
                                            bookmarkText.GetFirstChild<Text>().Text = string.Empty;
                                        }
                                    }

                                    //if (!string.IsNullOrEmpty(template.MarkerPersonGM360) && bookmarkStart.Name == template.MarkerPersonGM360)
                                    //{
                                    //    bookmarkText.GetFirstChild<Text>().Text = string.Format("{0} {1}", person.Name, person.LastName);
                                    //}

                                    if (!string.IsNullOrEmpty(template.MarkerPersonContract) && bookmarkStart.Name == template.MarkerPersonContract & project != null)
                                    {
                                        bookmarkText.GetFirstChild<Text>().Text = project.ArtistName;
                                    }

                                    if (!string.IsNullOrEmpty(template.MarkerAddressGM360) && bookmarkStart.Name == template.MarkerAddressGM360 && address != null)
                                    {
                                        bookmarkText.GetFirstChild<Text>().Text = string.Format("{0} {1} {2} {3} {4}", address.CountryName, address.CityName, address.Neighborhood, address.Reference, address.PostalCode);
                                    }

                                    if (bookmarkStart.Name == "ListaObras" & works != null)
                                    {
                                        StringBuilder sb = new StringBuilder();
                                        int i = 1;
                                        foreach (var item in works)
                                        {
                                            sb.Append(string.Format("{0}.-  {1}{2}", i++, item.ItemName, Environment.NewLine));
                                        }
                                        bookmarkText.GetFirstChild<Text>().Text = sb.ToString();
                                    }

                                    if (!string.IsNullOrEmpty(template.MarkerTerms) && bookmarkStart.Name == template.MarkerTerms)
                                    {
                                        StringBuilder sb = new StringBuilder();
                                        foreach (var item in terms)
                                        {
                                            sb.Append(string.Format("{0}: \n", item.Name));
                                            foreach (var term in item.ContractTerms)
                                            {
                                                sb.Append(string.Format("{0}.- {1} \n", term.Position, term.Term.Name));
                                            }
                                        }
                                        bookmarkText.GetFirstChild<Text>().Text = sb.ToString();
                                    }

                                    if (listFieldValues.Count > 0) {
                                        foreach (Field item in additionalFields)
                                        {
                                            if (bookmarkStart.Name == item.Marker)
                                            {
                                                var value = listFieldValues.SingleOrDefault(x => x.FieldId == item.Id);
                                                if (value != null)
                                                    bookmarkText.GetFirstChild<Text>().Text = formatValue(item.FieldTypeId, value.Value);
                                            }
                                            //TODO: Mejorar, la idea es que si un marcador se repite varias veces y esta asociado
                                            // a un campo adicional, no se tenga que repetir tantas veces el campo en el formulario
                                            //quizas haya una mejor forma de hacerlo.. suerte con eso.. no quiese modificar mucho este codigo

                                            for (int i = 1; i <= 5; i++) {
                                                if (bookmarkStart.Name == item.Marker+i)
                                                {
                                                    var value = listFieldValues.Single(x => x.FieldId == item.Id);
                                                    if (value != null)
                                                        bookmarkText.GetFirstChild<Text>().Text = formatValue(item.FieldTypeId, value.Value);
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            wordDocument.Close();
                            return File(ms.ToArray(), "application/vnd.openxmlformats-officedocument.wordprocessingml.document", template.DocumentName);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return Content(ex.Message, "application/json");
            }
            return Content("file not found", "application/json");
            //return result;
        }

        [Route("api/TemplateContractDocument")]
        [HttpGet]
        public MethodResponse<List<TemplateContractDocument>> Get()
        {
            var result = new MethodResponse<List<TemplateContractDocument>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _templateContractDocumentService.GetAllDocuments().ToList();
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        //[Route("api/TemplateContractDocumentMarkers")]
        //[HttpGet]
        //public MethodResponse<List<TemplateContractDocumentMarker>> GetMarkers()
        //{
        //    var result = new MethodResponse<List<TemplateContractDocumentMarker>> { Code = 100, Message = "Success", Result = null };
        //    try
        //    {
        //        result.Result = _templateDocumentMarkerService.GetMarker(1).ToList();
        //    }
        //    catch (System.Exception ex)
        //    {
        //        result.Message = ex.Message;
        //        result.Code = -100;
        //        result.Result = null;
        //    }
        //    return result;
        //}

        //[Route("api/TemplateContractDocumentMarker")]
        //[HttpGet]
        //public MethodResponse<List<TemplateContractDocumentMarker>> GetMarkerByDocumentId(short templateContractDocumentId)
        //{
        //    var result = new MethodResponse<List<TemplateContractDocumentMarker>> { Code = 100, Message = "Success", Result = null };
        //    try
        //    {
        //        result.Result = _templateDocumentMarkerService.GetMarker(templateContractDocumentId).ToList();
        //    }
        //    catch (System.Exception ex)
        //    {
        //        result.Message = ex.Message;
        //        result.Code = -100;
        //        result.Result = null;
        //    }
        //    return result;
        //}

        //[Route("api/TemplateContractDocumentMarker")]
        //[HttpPost]
        //public MethodResponse<TemplateContractDocumentMarker> Post([FromBody] TemplateContractDocumentMarker model)
        //{
        //    var result = new MethodResponse<TemplateContractDocumentMarker> { Code = 100, Message = "Success", Result = null };
        //    try
        //    {
        //        string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
        //        result.Result = _templateDocumentMarkerService.CreateMarker(model);
        //    }
        //    catch (System.Exception ex)
        //    {
        //        result.Message = ex.Message;
        //        result.Code = -100;
        //        result.Result = null;
        //    }
        //    return result;
        //}

        //[Route("api/TemplateContractDocumentMarker")]
        //[HttpPut]
        //public MethodResponse<bool> Put([FromBody] TemplateContractDocumentMarker model)
        //{
        //    var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
        //    try
        //    {
        //        string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
        //        _templateDocumentMarkerService.UpdateMarker(model);
        //    }
        //    catch (System.Exception ex)
        //    {
        //        result.Message = ex.Message;
        //        result.Code = -100;
        //        result.Result = false;
        //    }
        //    return result;
        //}

        [Route("api/TemplateContractDocumentMarker")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

            }
            catch (System.Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
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

        private string formatValue(int typeId, string value) {
            string formatValue;
            switch (typeId) {
                case 4: 
                    DateTime oDate = Convert.ToDateTime(value);
                    formatValue = oDate.ToString("MM/dd/yyyy HH:mm:ss");
                    break;
                case 5:
                    DateTime oDate2 = Convert.ToDateTime(value);
                    formatValue = oDate2.ToString("MM/dd/yyyy");
                    break;
                default: formatValue = value.Trim(); break;
            }

            return formatValue;
        }
    }
}
