using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class ContractStatusService : Repository<ContractStatus>, IContractStatusService
    {
        public ContractStatusService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public ContractStatus CreateContractStatus(ContractStatus contractStatus) =>
        Add(contractStatus);

        public void DeleteContractStatus(ContractStatus contractStatus) =>
        Delete(contractStatus);

        public IEnumerable<ContractStatus> GetAllContractStatus()
        {
            return _context.ContractStatus.ToList();
        }

        public ContractStatus GetContractStatus(int id)
        {
            return _context.ContractStatus.SingleOrDefault(x => x.Id == id);
        }

        public IEnumerable<ContractStatus> GetContractStatusByContractId(int contractId)
        {
            return _context.ContractStatus.Where(x => x.ContractId == contractId).ToList();
        }

        public void UpdateContractStatus(ContractStatus contractStatus) =>
        Update(contractStatus, contractStatus.Id);
    }
}
