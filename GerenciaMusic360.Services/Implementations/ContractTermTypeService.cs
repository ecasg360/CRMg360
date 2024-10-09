using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;

namespace GerenciaMusic360.Services.Implementations
{
    public class ContractTermTypeService : Repository<ContractTermType>, IContractTermTypeService
    {
        public ContractTermTypeService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        ContractTermType IContractTermTypeService.Create(ContractTermType contractTermType) =>
        Add(contractTermType);

        IEnumerable<ContractTermType> IContractTermTypeService.Create(List<ContractTermType> contractTermTypes) =>
        AddRange(contractTermTypes);

        void IContractTermTypeService.Delete(ContractTermType contractTermType) =>
        Delete(contractTermType);

        void IContractTermTypeService.DeleteByContractTerm(int contractId, int termTypeId)
        {
            DbCommand cmd = LoadCmd("DeleteTermTypes");
            cmd = AddParameter(cmd, "ContractId", contractId);
            cmd = AddParameter(cmd, "TermTypeId", termTypeId);
            ExecuteReader(cmd);
        }

        ContractTermType IContractTermTypeService.Get(int id) =>
        Get(id);

        IEnumerable<ContractTermType> IContractTermTypeService.GetAll(int contractId)
        {
            DbCommand cmd = LoadCmd("GetContractTermTypes");
            cmd = AddParameter(cmd, "ContractId", contractId);
            return ExecuteReader(cmd);
        }

        void IContractTermTypeService.Update(ContractTermType contractTermType) =>
        Update(contractTermType, contractTermType.Id);
    }
}
