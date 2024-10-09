using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IContractTypeService
    {
        IEnumerable<ContractType> GetAllContractTypes();
        ContractType GetContractType(int id);
        ContractType CreateContractType(ContractType contractType);
        void UpdateContractType(ContractType contractType);
    }
}
