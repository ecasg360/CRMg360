using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface ITemplateContractDocumentService
    {
        IEnumerable<TemplateContractDocument> GetAllDocuments();
        TemplateContractDocument GetByDocument(string documentName);
        TemplateContractDocument GetByContractTypeId(int contractTypeId);
    }
}
