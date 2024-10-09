using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IContractService
    {
        IEnumerable<Contract> GetAllContracts();
        IEnumerable<Contract> GetByLabel();
        IEnumerable<Contract> GetByAgency();
        IEnumerable<Contract> GetByEvent();
        IEnumerable<Contract> GetByProjectId(int projectId);
        Contract GetContract(int id);
        Contract CreateContract(Contract contract);
        void UpdateContract(Contract contract);
        void DeleteContract(Contract contract);
    }
}
