using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class TemplateContractDocumentService : Repository<TemplateContractDocument>, ITemplateContractDocumentService
    {
        public TemplateContractDocumentService(Context_DB context) : base(context)
        {
        }


        public IEnumerable<TemplateContractDocument> GetAllDocuments()
        {
            return _context.TemplateContractDocument.ToList();
        }

        public TemplateContractDocument GetByDocument(string documentName)
        {
            return _context.TemplateContractDocument.SingleOrDefault(x => x.DocumentName == documentName);
        }

        public TemplateContractDocument GetByContractTypeId(int contractTypeId)
        {
            return _context.TemplateContractDocument.SingleOrDefault(x => x.ContractTypeId == contractTypeId);
        }



    }
}
