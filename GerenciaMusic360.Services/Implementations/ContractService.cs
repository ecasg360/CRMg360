using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class ContractService : Repository<Contract>, IContractService
    {
        public ContractService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<Contract> GetAllContracts()
        {
            return _context.Contract.Include(r => r.LocalCompany).Include(r => r.ContractType).Where(x => x.StatusRecordId != 3);
        }

        public IEnumerable<Contract> GetByLabel()
        {
            DbCommand cmd = LoadCmd("GetContractsByLabel");
            return ExecuteReader(cmd);
        }

        public IEnumerable<Contract> GetByAgency()
        {
            DbCommand cmd = LoadCmd("GetContractsByAgency");
            return ExecuteReader(cmd);
        }

        public IEnumerable<Contract> GetByEvent()
        {
            DbCommand cmd = LoadCmd("GetContractsByEvent");
            return ExecuteReader(cmd);
        }

        public IEnumerable<Contract> GetByProjectId(int projectId)
        {
            return _context.Contract.Where(x => x.ProjectId == projectId).ToList();
        }

        public Contract GetContract(int id)
        {
            return _context.Contract.Include(r => r.LocalCompany).Include(r => r.ContractType).SingleOrDefault(x => x.Id == id);
        }


        public Contract CreateContract(Contract contract) =>
        Add(contract);

        public void UpdateContract(Contract contract) =>
        Update(contract, contract.Id);

        public void DeleteContract(Contract contract) =>
        Delete(contract);
    }
}
