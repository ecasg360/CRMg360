using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class ContractMembersService : Repository<ContractMembers>, IContractMembersService
    {
        public ContractMembersService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }


        public ContractMembers CreateContractMembers(ContractMembers contract) =>
        Add(contract);

        public void DeleteContractMembers(ContractMembers contract) =>
        Delete(contract);

        public IEnumerable<ContractMembers> GetAllContractMembers()
        {
            return _context.ContractMembers.Include(r => r.Person).ToList();
        }

        public ContractMembers GetContractMembers(int id)
        {
            return _context.ContractMembers.Include(r => r.Person).Single(x => x.Id == id);
        }

        public void UpdateContractMembers(ContractMembers contract) =>
        Update(contract, contract.Id);
    }
}
