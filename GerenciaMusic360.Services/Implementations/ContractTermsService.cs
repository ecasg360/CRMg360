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
    public class ContractTermsService : Repository<ContractTerms>, IContractTermsService
    {
        public ContractTermsService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }
        public IEnumerable<ContractTerms> GetAllContractTerms()
        {
            DbCommand cmd = LoadCmd("GetAllContractService");
            return ExecuteReader(cmd);
        }

        public IEnumerable<TermType> GetAllContractTermsByContractId(int contractId)
        {
            DbCommand cmd = LoadCmd("GetContractTermTypes");
            cmd = AddParameter(cmd, "ContractId", contractId);
            var termTypesIncluded = ExecuteReader(cmd);

            var termTypes = _context.TermType
                .Where(w=> termTypesIncluded.Select(s=> s.TermTypeId).Contains(w.Id))
                .ToList();

            var contractTerms = _context.ContractTerms.Include(r => r.Term).Where(x => x.ContractId == contractId).ToList();
            foreach (var item in termTypes)
            {
                item.ContractTerms = contractTerms.Where(x => x.Term.TermTypeId == item.Id).OrderBy(o => o.Position).ToList();
            }

            return termTypes;
        }

        public void Create(ContractTerms contractTerms) =>
            this.Add(contractTerms);


        public void Create(List<ContractTerms> contractTerms) =>
           this.AddRange(contractTerms);

        public ContractTerms Get(int id)
        {
            return this.Find(x => x.Id == id);
        }

        public void Update(ContractTerms contractTerms) =>
            this.Update(contractTerms, contractTerms.Id);

        public void UpdateList(List<ContractTerms> contractTerms)
        {
            foreach (var item in contractTerms)
            {
                this.Update(item, item.Id);
            }
        }

        public void DeleteContracTerms(ContractTerms contractTerms)
        {
            Delete(contractTerms);
        }

    }
}
