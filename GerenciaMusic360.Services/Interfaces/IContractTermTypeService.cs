using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IContractTermTypeService
    {
        IEnumerable<ContractTermType> GetAll(int contractId);
        ContractTermType Get(int id);
        ContractTermType Create(ContractTermType contractTermType);
        IEnumerable<ContractTermType> Create(List<ContractTermType> contractTermTypes);
        void Update(ContractTermType contractTermType);
        void Delete(ContractTermType contractTermType);
        void DeleteByContractTerm(int contractId, int termTypeId);
    }
}
