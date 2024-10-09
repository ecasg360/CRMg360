using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IContractStatusService
    {
        IEnumerable<ContractStatus> GetAllContractStatus();
        ContractStatus GetContractStatus(int id);

        IEnumerable<ContractStatus> GetContractStatusByContractId(int contractId);
        ContractStatus CreateContractStatus(ContractStatus contractStatus);
        void UpdateContractStatus(ContractStatus contractStatus);
        void DeleteContractStatus(ContractStatus contractStatus);
    }
}
