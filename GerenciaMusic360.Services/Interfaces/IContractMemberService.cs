using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IContractMembersService
    {
        IEnumerable<ContractMembers> GetAllContractMembers();
        ContractMembers GetContractMembers(int id);
        ContractMembers CreateContractMembers(ContractMembers contract);
        void UpdateContractMembers(ContractMembers contract);
        void DeleteContractMembers(ContractMembers contract);
    }
}
