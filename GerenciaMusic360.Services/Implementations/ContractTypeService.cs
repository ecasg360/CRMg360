using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;

namespace GerenciaMusic360.Services.Implementations
{
    public class ContractTypeService : Repository<ContractType>, IContractTypeService
    {
        public ContractTypeService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<ContractType> GetAllContractTypes()
        {
            DbCommand cmd = LoadCmd("GetContractTypes");
            return ExecuteReader(cmd);
        }

        public ContractType GetContractType(int id) =>
        Find(w => w.Id == id);

        public ContractType CreateContractType(ContractType contractType) =>
        Add(contractType);

        public void UpdateContractType(ContractType contractType) =>
        Update(contractType, contractType.Id);

    }
}
