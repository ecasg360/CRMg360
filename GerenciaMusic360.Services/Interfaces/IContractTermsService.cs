using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IContractTermsService
    {
        IEnumerable<ContractTerms> GetAllContractTerms();
        IEnumerable<TermType> GetAllContractTermsByContractId(int contractId);
        ContractTerms Get(int id);
        void Create(ContractTerms terms);
        void Create(List<ContractTerms> contractTerms);
        void Update(ContractTerms terms);
        void UpdateList(List<ContractTerms> contractTerms);
        void DeleteContracTerms(ContractTerms contractTerms);
    }
}
